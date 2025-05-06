import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskListService } from '../../../task-lists/services/task-list.service';
import { TaskRequest } from '../../models/task.model';
import { Location } from '@angular/common';
import { Observable, catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';
  
  categories: any[] = [];
  taskLists: any[] = [];
  
  statuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];
  
  priorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ];
  
  dateTimeLocal = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private taskListService: TaskListService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFormDependencies();
    
    // Check if there's an ID parameter (edit mode)
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTaskData(+id);
    } else {
      // New task mode
      // Check for query parameters (task list or category selection)
      this.route.queryParams.subscribe(params => {
        if (params['listId'] && !isNaN(+params['listId'])) {
          this.taskForm.patchValue({ taskListId: +params['listId'] });
        }
        if (params['categoryId'] && !isNaN(+params['categoryId'])) {
          this.taskForm.patchValue({ categoryId: +params['categoryId'] });
        }
      });
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      status: ['PENDING'],
      priority: ['MEDIUM'],
      dueDate: [''],
      categoryId: [null],
      taskListId: [null]
    });
  }
  
loadFormDependencies(): void {
  this.isLoading = true;
  
  // Load categories and task lists in parallel
  forkJoin({
    categories: this.categoryService.getCategories().pipe(
      catchError(err => {
        console.error('Error loading categories:', err);
        return of([]);
      })
    ),
    taskLists: this.taskListService.getTaskLists().pipe(
      catchError(err => {
        console.error('Error loading task lists:', err);
        return of([]);
      })
    )
  }).subscribe({
    next: (results) => {
      this.categories = results.categories;
      this.taskLists = results.taskLists;
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to load form data. Please try again.';
      this.isLoading = false;
      console.error('Form data loading error:', err);
    }
  });
}
  
  loadTaskData(id: number): void {
    this.isLoading = true;
    
    this.taskService.getTask(id)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load task data';
          return of(null);
        })
      )
      .subscribe(task => {
        if (task) {
          // Format the date for the datetime-local input
          if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            this.dateTimeLocal = this.formatDateTimeLocal(dueDate);
          }
          
          // Patch form with task data
          this.taskForm.patchValue({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: this.dateTimeLocal,
            categoryId: task.categoryId || null,
            taskListId: task.taskListId || null
          });
        }
        
        this.isLoading = false;
      });
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Create request payload
    const taskRequest: TaskRequest = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      status: this.taskForm.value.status,
      priority: this.taskForm.value.priority,
      categoryId: this.taskForm.value.categoryId || undefined,
      taskListId: this.taskForm.value.taskListId || undefined
    };
    
    // Handle date formatting
    if (this.taskForm.value.dueDate) {
      const dueDate = new Date(this.taskForm.value.dueDate);
      taskRequest.dueDate = dueDate.toISOString();
    }
    
    let request: Observable<any>;
    
    if (this.isEditMode && this.taskId) {
      // Update existing task
      request = this.taskService.updateTask(this.taskId, taskRequest);
    } else {
      // Create new task
      request = this.taskService.createTask(taskRequest);
    }
    
    request
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to save task';
          this.isSubmitting = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          // Navigate to task detail page or list page
          if (this.isEditMode) {
            this.router.navigate(['/tasks', this.taskId]);
          } else {
            this.router.navigate(['/tasks']);
          }
        }
        
        this.isSubmitting = false;
      });
  }
  
  cancel(): void {
    this.location.back();
  }
  
  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  // Helper methods for form validation
  get titleInvalid(): boolean {
    const control = this.taskForm.get('title');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get titleErrorMessage(): string {
    const control = this.taskForm.get('title');
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'Title is required';
    }
    
    if (control.errors?.['maxlength']) {
      return 'Title cannot exceed 100 characters';
    }
    
    return '';
  }
  
  get descriptionInvalid(): boolean {
    const control = this.taskForm.get('description');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get descriptionErrorMessage(): string {
    const control = this.taskForm.get('description');
    if (!control || !control.errors) return '';
    
    if (control.errors['maxlength']) {
      return 'Description cannot exceed 500 characters';
    }
    
    return '';
  }
}