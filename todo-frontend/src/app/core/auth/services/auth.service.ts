import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Token } from '../models/token.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/signin`, { username, password })
      .pipe(
        tap(response => {
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
        })
      );
  }

  register(username: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {
      username,
      email,
      password,
      confirmPassword,
      roles: ['user']
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      password,
      confirmPassword
    });
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
  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reset-password?token=${token}`);
  }
}