
// src/app/features/profile/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Profile, ProfileUpdateRequest, PasswordChangeRequest } from '../models/profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // Use the correct endpoint according to your backend configuration
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getTaskStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/task-statistics`)
      .pipe(catchError(this.handleError));
  }

  updateProfile(profileData: ProfileUpdateRequest): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}`, profileData)
      .pipe(catchError(this.handleError));
  }

  changePassword(passwordData: PasswordChangeRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, passwordData)
      .pipe(catchError(this.handleError));
  }

  getUserLoginActivity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/login-activity`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // Handle different status codes
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
    
    console.error('Error occurred:', error);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}