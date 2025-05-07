import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserSettings, AccountDeactivationRequest, NotificationSettings, AppearanceSettings, PrivacySettings, DeleteAccountRequest } from '../models/settings.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/users/me/settings`;

  constructor(private http: HttpClient) {}

  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  updateUserSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}`, settings)
      .pipe(catchError(this.handleError));
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.apiUrl}/notifications`, settings)
      .pipe(catchError(this.handleError));
  }

  updateAppearanceSettings(settings: AppearanceSettings): Observable<AppearanceSettings> {
    return this.http.put<AppearanceSettings>(`${this.apiUrl}/appearance`, settings)
      .pipe(catchError(this.handleError));
  }

  updatePrivacySettings(settings: PrivacySettings): Observable<PrivacySettings> {
    return this.http.put<PrivacySettings>(`${this.apiUrl}/privacy`, settings)
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