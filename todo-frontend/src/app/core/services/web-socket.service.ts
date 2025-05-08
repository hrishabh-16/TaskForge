// todo-frontend/src/app/core/services/web-socket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

declare const SockJS: any;
declare const Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor(private authService: AuthService) {
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
        const socket = new SockJS('http://localhost:4000/ws');
        this.stompClient = Stomp.over(socket);
        
        // Set debug to false to reduce console noise
        this.stompClient.debug = null;
        
        const that = this;
        // Add authentication headers to the WebSocket connection
        const headers = this.getAuthHeaders();
        
        this.stompClient.connect(headers, function() {
          that.connectedSubject.next(true);
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
      this.connectedSubject.next(false);
    }
  }

  // Fix: Create a separate method for error callback to preserve 'this' context
  private onErrorCallback(error: any): void {
    console.error('WebSocket Connection Error:', error);
    this.connectedSubject.next(false);
    // Implement retry logic with proper 'this' binding
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  subscribeToChannel(topic: string, callback: (message: any) => void): any {
    if (this.stompClient && this.stompClient.connected) {
      return this.stompClient.subscribe(topic, function(message: any) {
        const messageBody = JSON.parse(message.body);
        callback(messageBody);
      });
    } else {
      // Subscribe when connection becomes available
      const subscription = this.connected$.subscribe(connected => {
        if (connected) {
          this.stompClient.subscribe(topic, function(message: any) {
            const messageBody = JSON.parse(message.body);
            callback(messageBody);
          });
          subscription.unsubscribe();
        }
      });
      return null;
    }
  }

  // Send a message to a specific channel
  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(body));
    } else {
      console.error('STOMP client is not connected');
    }
  }
}