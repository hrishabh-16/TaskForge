// todo-frontend/src/app/features/calendar/components/task-item/task-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskStatus, TaskPriority } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: false,  
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task: any;
  @Output() taskClicked = new EventEmitter<any>();
  @Output() markComplete = new EventEmitter<any>();

  get statusColor(): string {
    switch (this.task.status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.PENDING:
      default:
        // Check if overdue
        const now = new Date();
        const dueDate = new Date(this.task.dueDate);
        return dueDate < now && this.task.status !== TaskStatus.COMPLETED
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800';
    }
  }

  get priorityBadge(): string {
    switch (this.task.priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.LOW:
      default:
        return 'bg-green-100 text-green-800';
    }
  }

  onTaskClick(): void {
    this.taskClicked.emit(this.task);
  }

  onCompleteClick(event: Event): void {
    event.stopPropagation();
    this.markComplete.emit(this.task);
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}