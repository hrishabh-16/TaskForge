// src/app/core/auth/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Clone the request and add the authorization header
      request = this.addTokenHeader(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Handle 401 errors (unauthorized)
            return this.handle401Error(request, next);
          } else if (error.status === 403) {
            // Handle 403 errors (forbidden)
            this.router.navigate(['/login']);
            return throwError(() => new Error('You do not have permission to access this resource'));
          } else if (error.status === 404) {
            // Handle 404 errors (not found)
            return throwError(() => new Error('The requested resource was not found'));
          } else if (error.status === 500) {
            // Handle 500 errors (server error)
            return throwError(() => new Error('Server error occurred. Please try again later.'));
          }
        }
        
        // Forward the error
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    // Clone the request and add the authorization header
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // For a simple implementation, just redirect to login
    this.authService.logout();
    this.router.navigate(['/login']);
    return throwError(() => new Error('Session expired. Please login again.'));
  }
}