// todo-frontend/src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../features/notifications/models/notification.model';
import { HttpService } from './http.service';
import { AuthService } from '../auth/services/auth.service';

declare const SockJS: any;
declare const Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {
    // Load notifications initially when service is created
    this.loadNotifications();
    
    // Connect to WebSocket when user is authenticated
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  connect(): void {
    try {
      if (typeof SockJS !== 'undefined') {
        const socket = new SockJS('https://todo-backend-cahd.onrender.com/ws');
        this.stompClient = Stomp.over(socket);
        
        // Set debug to false to reduce console noise
        this.stompClient.debug = null;
        
        const that = this;
        // Add authentication headers to the WebSocket connection
        const headers = this.getAuthHeaders();
        
        this.stompClient.connect(headers, function() {
          // Subscribe to personal notifications channel
          that.stompClient.subscribe('/user/queue/notifications', (notification: any) => {
            const newNotification = JSON.parse(notification.body);
            that.addNotification(newNotification);
          });
        }, this.onErrorCallback.bind(this)); // Fix: Bind 'this' to maintain context
      } else {
        console.warn('SockJS not loaded. WebSocket connection not established.');
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  // Helper method to get auth headers
  private getAuthHeaders(): any {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  
  disconnect(): void {
    if (this.stompClient !== null && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
  }

  // Fix: Create a separate method for error callback to preserve 'this' context
  private onErrorCallback(error: any): void {
    console.error('WebSocket Connection Error:', error);
    // Implement retry logic with proper 'this' binding
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  // Load all notifications from the API
  loadNotifications(): void {
    this.httpService.get<Notification[]>('notifications').subscribe(
      (notifications) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  // Load unread notifications from the API
  loadUnreadNotifications(): void {
    this.httpService.get<Notification[]>('notifications/unread').subscribe(
      (notifications) => {
        // We're just updating the unread count here, not replacing all notifications
        this.updateUnreadCount(notifications);
      },
      (error) => {
        console.error('Error loading unread notifications:', error);
      }
    );
  }

  // Add a new notification to the list
  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.getValue();
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
  }

  // Update the unread count
  private updateUnreadCount(notifications: Notification[]): void {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }

  // Mark a notification as read
  markAsRead(id: number): Observable<void> {
    return new Observable<void>(observer => {
      this.httpService.put<void>(`notifications/${id}/read`, {}).subscribe(
        () => {
          // Update the local notification
          const notifications = this.notificationsSubject.getValue();
          const updated = notifications.map(n => {
            if (n.id === id) {
              return { ...n, isRead: true, readAt: new Date().toISOString() };
            }
            return n;
          });
          this.notificationsSubject.next(updated);
          this.updateUnreadCount(updated);
          observer.next();
          observer.complete();
        },
        error => {
          console.error('Error marking notification as read:', error);
          observer.error(error);
        }
      );
    });
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<void> {
    return new Observable<void>(observer => {
      this.httpService.put<void>('notifications/read-all', {}).subscribe(
        () => {
          // Update all local notifications
          const notifications = this.notificationsSubject.getValue();
          const updated = notifications.map(n => {
            if (!n.isRead) {
              return { ...n, isRead: true, readAt: new Date().toISOString() };
            }
            return n;
          });
          this.notificationsSubject.next(updated);
          this.unreadCountSubject.next(0);
          observer.next();
          observer.complete();
        },
        error => {
          console.error('Error marking all notifications as read:', error);
          observer.error(error);
        }
      );
    });
  }

  // Delete a notification
  deleteNotification(id: number): Observable<void> {
    return new Observable<void>(observer => {
      this.httpService.delete<void>(`notifications/${id}`).subscribe(
        () => {
          // Remove the notification from local list
          const notifications = this.notificationsSubject.getValue();
          const updated = notifications.filter(n => n.id !== id);
          this.notificationsSubject.next(updated);
          this.updateUnreadCount(updated);
          observer.next();
          observer.complete();
        },
        error => {
          console.error('Error deleting notification:', error);
          observer.error(error);
        }
      );
    });
  }
}