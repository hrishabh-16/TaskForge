// todo-frontend/src/app/shared/components/header/header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../features/notifications/services/notification.service';
import { Notification } from '../../../features/notifications/models/notification.model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  showNotifications = false;
  username: string = '';
  notifications: Notification[] = [];
  unreadCount: number = 0;
  loadingNotifications: boolean = false;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to user changes
    this.subscription.add(
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.username = user.username;
          // Load notifications when user is authenticated
          this.loadNotifications();
        }
      })
    );

    // Subscribe to notification changes
    this.subscription.add(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
        this.loadingNotifications = false;
      })
    );

    // Subscribe to unread count
    this.subscription.add(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );

    // Close dropdowns when clicking outside
    document.addEventListener('click', this.closeDropdownsOnClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
    
    // Remove event listener
    document.removeEventListener('click', this.closeDropdownsOnClickOutside.bind(this));
  }

  loadNotifications(): void {
    this.loadingNotifications = true;
    this.notificationService.loadNotifications();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.isDropdownOpen = false;
      this.loadNotifications();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  closeDropdownsOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = document.getElementById('user-menu-button');
    const notificationsMenu = document.getElementById('notifications-menu-button');
    
    if (userMenu && !userMenu.contains(target) && this.isDropdownOpen) {
      this.closeDropdown();
    }
    
    if (notificationsMenu && !notificationsMenu.contains(target) && this.showNotifications) {
      this.closeNotifications();
    }
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe();
  }

  navigateToNotification(notification: Notification): void {
    // Mark notification as read if it's not already
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
    
    // Navigate based on notification type
    if (notification.taskId) {
      this.router.navigate(['/tasks', notification.taskId]);
    } else {
      switch (notification.type) {
        case 'PASSWORD_RESET':
          this.router.navigate(['/settings']);
          break;
        case 'ACCOUNT_VERIFICATION':
          this.router.navigate(['/profile']);
          break;
        default:
          this.router.navigate(['/dashboard']);
          break;
      }
    }
    
    this.closeNotifications();
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
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}