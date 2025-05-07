// todo-frontend/src/app/features/notifications/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { NotificationService as CoreNotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private coreNotificationService: CoreNotificationService) {}

  // Get all notifications as an observable
  getNotifications(): Observable<Notification[]> {
    return this.coreNotificationService.notifications$;
  }

  // Get unread count as an observable
  getUnreadCount(): Observable<number> {
    return this.coreNotificationService.unreadCount$;
  }

  // Load all notifications
  loadNotifications(): void {
    this.coreNotificationService.loadNotifications();
  }

  // Load only unread notifications
  loadUnreadNotifications(): void {
    this.coreNotificationService.loadUnreadNotifications();
  }

  // Mark a notification as read
  markAsRead(id: number): Observable<void> {
    return this.coreNotificationService.markAsRead(id);
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<void> {
    return this.coreNotificationService.markAllAsRead();
  }

  // Delete a notification
  deleteNotification(id: number): Observable<void> {
    return this.coreNotificationService.deleteNotification(id);
  }

  // Get icon for notification type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'TASK_DUE_SOON':
        return 'clock';
      case 'TASK_OVERDUE':
        return 'alert-triangle';
      case 'TASK_STATUS_UPDATED':
        return 'refresh-cw';
      case 'TASK_ASSIGNED':
        return 'user-plus';
      case 'TASK_COMPLETED':
        return 'check-circle';
      case 'PASSWORD_RESET':
        return 'key';
      case 'ACCOUNT_VERIFICATION':
        return 'user-check';
      default:
        return 'bell';
    }
  }

  // Get color for notification type
  getNotificationColor(type: string): string {
    switch (type) {
      case 'TASK_DUE_SOON':
        return 'text-blue-500';
      case 'TASK_OVERDUE':
        return 'text-red-500';
      case 'TASK_STATUS_UPDATED':
        return 'text-purple-500';
      case 'TASK_ASSIGNED':
        return 'text-green-500';
      case 'TASK_COMPLETED':
        return 'text-green-500';
      case 'PASSWORD_RESET':
        return 'text-yellow-500';
      case 'ACCOUNT_VERIFICATION':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }
}