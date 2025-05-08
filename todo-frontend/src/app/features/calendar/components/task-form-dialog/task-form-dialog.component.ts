// todo-frontend/src/app/features/calendar/components/task-form-dialog/task-form-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../../tasks/services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskListService } from '../../../task-lists/services/task-list.service';
import { TaskStatus, TaskPriority } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  standalone: false,
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.css']
})
export class TaskFormDialogComponent implements OnInit {
  taskForm: FormGroup;
  categories: any[] = [];
  taskLists: any[] = [];
  loading = false;
  
  // Status and Priority options
  taskStatusOptions = Object.values(TaskStatus);
  taskPriorityOptions = Object.values(TaskPriority);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private taskListService: TaskListService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: [TaskStatus.PENDING],
      priority: [TaskPriority.MEDIUM],
      dueDate: [this.formatDate(data.date)],
      categoryId: [null],
      taskListId: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTaskLists();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadTaskLists(): void {
    this.taskListService.getTaskLists().subscribe(
      (taskLists) => {
        this.taskLists = taskLists;
      },
      (error) => {
        console.error('Error loading task lists:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      const taskData = this.taskForm.value;
      
      this.taskService.createTask(taskData).subscribe(
        (response) => {
          this.loading = false;
          this.dialogRef.close(response);
        },
        (error) => {
          this.loading = false;
          console.error('Error creating task:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}