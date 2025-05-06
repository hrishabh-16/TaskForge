import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, UserResponse } from '../models/user.model';
import {  SignupRequest, LoginRequest,  } from '../models/auth.model';
import { environment } from '../../../../environments/environment';
import { ForgotPasswordRequest, PasswordResetRequest } from '../models/forgot-password.model'
import { JwtResponse } from '../models/token.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<JwtResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<JwtResponse>(`${this.apiUrl}/signin`, { username, password }, { headers })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          // Store JWT token and user details
          localStorage.setItem('token', response.token);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles,
            enabled: true,
            createdAt: '',
            updatedAt: ''
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  register(username: string, email: string, password: string, confirmPassword: string): Observable<any> {
    const signupRequest: SignupRequest = {
      username,
      email,
      password,
      confirmPassword,
      roles: ['ROLE_USER']
    };
    
    // Add responseType: 'text' to handle plain text responses
    return this.http.post(`${this.apiUrl}/signup`, signupRequest, { responseType: 'text' })
      .pipe(
        map(response => {
          // Convert text response to an object
          return { message: response };
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<any> {
    const request: ForgotPasswordRequest = { email };
    return this.http.post(`${this.apiUrl}/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    const request: PasswordResetRequest = {
      token,
      password,
      confirmPassword
    };
    
    return this.http.post(`${this.apiUrl}/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reset-password?token=${token}`)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user !== null && user.roles && user.roles.includes(role);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error: ${error.status}`;
        }
      }
    }
    
    console.error('Error occurred:', error);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}