import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskListService } from '../../services/task-list.service';
import { TaskListRequest } from '../../models/task-list.model';
import { Location } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-task-list-form',
  standalone: false,
  templateUrl: './task-list-form.component.html',
  styleUrls: ['./task-list-form.component.css']
})
export class TaskListFormComponent implements OnInit {
  taskListForm: FormGroup;
  isEditMode = false;
  taskListId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private taskListService: TaskListService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.taskListForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if there's an ID parameter (edit mode)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskListId = +id;
      this.loadTaskListData(+id);
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }
  
  loadTaskListData(id: number): void {
    this.isLoading = true;
    
    this.taskListService.getTaskList(id)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load task list data';
          return of(null);
        })
      )
      .subscribe(taskList => {
        if (taskList) {
          // Patch form with task list data
          this.taskListForm.patchValue({
            name: taskList.name,
            description: taskList.description || ''
          });
        }
        
        this.isLoading = false;
      });
  }
  
  onSubmit(): void {
    if (this.taskListForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      Object.keys(this.taskListForm.controls).forEach(key => {
        const control = this.taskListForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Create request payload
    const taskListRequest: TaskListRequest = {
      name: this.taskListForm.value.name,
      description: this.taskListForm.value.description
    };
    
    let request: Observable<any>;
    
    if (this.isEditMode && this.taskListId) {
      // Update existing task list
      request = this.taskListService.updateTaskList(this.taskListId, taskListRequest);
    } else {
      // Create new task list
      request = this.taskListService.createTaskList(taskListRequest);
    }
    
    request
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to save task list';
          this.isSubmitting = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          // Navigate to task lists page
          this.router.navigate(['/task-lists']);
        }
        
        this.isSubmitting = false;
      });
  }
  
  cancel(): void {
    this.location.back();
  }
  
  // Helper methods for form validation
  get nameInvalid(): boolean {
    const control = this.taskListForm.get('name');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get nameErrorMessage(): string {
    const control = this.taskListForm.get('name');
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'Name is required';
    }
    
    if (control.errors?.['maxlength']) {
      return 'Name cannot exceed 100 characters';
    }
    
    return '';
  }
  
  get descriptionInvalid(): boolean {
    const control = this.taskListForm.get('description');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get descriptionErrorMessage(): string {
    const control = this.taskListForm.get('description');
    if (!control || !control.errors) return '';
    
    if (control.errors['maxlength']) {
      return 'Description cannot exceed 500 characters';
    }
    
    return '';
  }
}