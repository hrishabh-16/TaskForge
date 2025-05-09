// src/app/features/profile/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Profile, ProfileUpdateRequest, PasswordChangeRequest } from '../models/profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<Profile> {
    // Add logging
    console.log('Getting current user profile from:', this.apiUrl);
    
    return this.http.get<Profile>(`${this.apiUrl}`)
      .pipe(
        tap(response => console.log('Profile response:', response)),
        catchError(this.handleError)
      );
  }

  updateProfile(profileData: ProfileUpdateRequest): Observable<Profile> {
    // Add logging and headers
    console.log('Updating profile with:', profileData);
    console.log('Update profile URL:', this.apiUrl);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<Profile>(`${this.apiUrl}`, profileData, { headers })
      .pipe(
        tap(response => console.log('Profile update response:', response)),
        catchError(this.handleError)
      );
  }

  changePassword(passwordData: PasswordChangeRequest): Observable<any> {
    console.log('Changing password at URL:', `${this.apiUrl}/change-password`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.apiUrl}/change-password`, passwordData, { headers })
      .pipe(
        // Even if the server returns null/undefined for successful password change,
        // we want to transform it to a valid response for our component
        map(response => {
          console.log('Raw password change response:', response);
          // If successful but no data returned, provide a basic success object
          if (response === null || response === undefined) {
            return { success: true, message: 'Password changed successfully' };
          }
          return response;
        }),
        tap(response => {
          console.log('Password change successful:', response);
        }),
        catchError(error => {
          console.error('Password change error:', error);
          return this.handleError(error);
        })
      );
  }

  getUserLoginActivity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/login-activity`)
      .pipe(catchError(this.handleError));
  }

  // Test the toastr service directly
  testToastr(): Observable<any> {
    console.log('Running toastr test');
    // Create a simple observable that emits a success value
    return of({ success: true, message: 'Toastr test successful' });
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    
    // Log the complete error for debugging
    console.error('Complete error object:', error);
    
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
          errorMessage = error.error && error.error.message ? error.error.message : 'Bad request. Please check your input.';
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
    
    console.error('Error message:', errorMessage);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}