// src/app/features/settings/services/settings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserSettings, AccountDeactivationRequest, NotificationSettings, AppearanceSettings, PrivacySettings, DeleteAccountRequest, UserSettingsRequest } from '../models/settings.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // Use the correct endpoint from your backend controller: /api/users/me/settings
  private apiUrl = `${environment.apiUrl}/users/me/settings`;

  constructor(private http: HttpClient) {}

  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  updateUserSettings(settings: UserSettingsRequest): Observable<UserSettings> {
    console.log('Updating user settings with:', settings);
    console.log('Update settings URL:', this.apiUrl);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<UserSettings>(`${this.apiUrl}`, settings, { headers })
      .pipe(
        tap(response => console.log('Settings update response:', response)),
        catchError(this.handleError)
      );
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/notifications`, settings)
      .pipe(catchError(this.handleError));
  }

  updateAppearanceSettings(settings: AppearanceSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/appearance`, settings)
      .pipe(catchError(this.handleError));
  }

  updatePrivacySettings(settings: PrivacySettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/privacy`, settings)
      .pipe(catchError(this.handleError));
  }

  deactivateAccount(request: AccountDeactivationRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deactivate`, request)
      .pipe(catchError(this.handleError));
  }

  activateAccount(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activate`, {})
      .pipe(catchError(this.handleError));
  }

  deleteAccount(request: DeleteAccountRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete`, request)
      .pipe(catchError(this.handleError));
  }

  exportUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/export-data`, { responseType: 'blob' })
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
    
    console.error('Error occurred:', error);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}