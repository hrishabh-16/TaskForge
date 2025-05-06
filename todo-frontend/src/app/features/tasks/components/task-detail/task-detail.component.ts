import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskResponse } from '../../models/task.model';
import { Location } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: TaskResponse | null = null;
  isLoading = true;
  error = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.loadTask(+id);
    } else {
      this.error = 'Task ID is required or invalid';
      this.isLoading = false;
    }
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.error = '';
    
    this.taskService.getTask(id)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load task details';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(task => {
        this.task = task;
      });
  }
  
  goBack(): void {
    this.location.back();
  }
  
  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }
  
  deleteTask(): void {
    if (this.task && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete task';
            return of(null);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/tasks']);
        });
    }
  }
  
  toggleTaskStatus(): void {
    if (!this.task) return;
    
    const newStatus = this.task.status === 'COMPLETED' ? 'PENDING' as const : 'COMPLETED' as const;
    
    // Create a new object with only the properties needed for the update
    const taskUpdate = {
      title: this.task.title,
      description: this.task.description,
      status: newStatus,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
      categoryId: this.task.categoryId,
      taskListId: this.task.taskListId
    };
    
    if (newStatus === 'COMPLETED') {
      this.taskService.completeTask(this.task.id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to update task status';
            return of(null);
          })
        )
        .subscribe(updatedTask => {
          if (updatedTask) {
            this.task = updatedTask;
          }
        });
    } else {
      this.taskService.updateTask(this.task.id, taskUpdate)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to update task status';
            return of(null);
          })
        )
        .subscribe(updatedTask => {
          if (updatedTask) {
            this.task = updatedTask;
          }
        });
    }
  }
  
  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'HIGH':
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  isOverdue(dateString: string | undefined): boolean {
    if (!dateString) return false;
    
    const dueDate = new Date(dateString);
    const now = new Date();
    
    return dueDate < now && dueDate.toDateString() !== now.toDateString();
  }
}