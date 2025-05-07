// todo-frontend/src/app/features/notifications/components/notification-list/notification-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notification, NotificationType } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-list',
  standalone:false,
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    
    // Subscribe to notifications
    this.subscription.add(
      this.notificationService.getNotifications().subscribe(
        (notifications) => {
          this.notifications = notifications;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading notifications:', error);
          this.loading = false;
        }
      )
    );
    
    // Load notifications from the server
    this.notificationService.loadNotifications();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notification.id).subscribe();
  }

  navigateToNotificationSource(notification: Notification): void {
    this.markAsRead(notification, new Event('click'));
    
    // Navigate based on notification type and taskId
    if (notification.taskId) {
      this.router.navigate(['/tasks', notification.taskId]);
    } else {
      switch (notification.type) {
        case NotificationType.PASSWORD_RESET:
          this.router.navigate(['/settings']);
          break;
        case NotificationType.ACCOUNT_VERIFICATION:
          this.router.navigate(['/profile']);
          break;
        default:
          this.router.navigate(['/dashboard']);
          break;
      }
    }
  }

  getNotificationIcon(type: string): string {
    return this.notificationService.getNotificationIcon(type);
  }

  getNotificationColor(type: string): string {
    return this.notificationService.getNotificationColor(type);
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  }
}