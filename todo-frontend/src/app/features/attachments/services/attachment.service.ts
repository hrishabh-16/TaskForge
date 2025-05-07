// todo-frontend/src/app/features/attachments/services/attachment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AttachmentResponse } from '../models/attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private apiUrl = `${environment.apiUrl}/attachments`;

  constructor(private http: HttpClient) { }

  // Get attachments for a specific task
  getAttachmentsByTaskId(taskId: number): Observable<AttachmentResponse[]> {
    return this.http.get<AttachmentResponse[]>(`${this.apiUrl}/tasks/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  // Get a specific attachment by ID
  getAttachmentById(id: number): Observable<AttachmentResponse> {
    return this.http.get<AttachmentResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Upload a new attachment for a task
  uploadAttachment(taskId: number, file: File): Observable<HttpEvent<AttachmentResponse>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.apiUrl}/tasks/${taskId}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request<AttachmentResponse>(req)
      .pipe(catchError(this.handleError));
  }

  // Delete an attachment
  deleteAttachment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Download an attachment
  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // Get the download URL for an attachment
  getDownloadUrl(id: number): string {
    return `${this.apiUrl}/${id}/download`;
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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