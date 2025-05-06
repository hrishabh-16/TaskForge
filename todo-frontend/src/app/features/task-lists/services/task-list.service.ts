// src/app/features/task-lists/services/task-list.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TaskList, TaskListRequest, TaskListResponse } from '../models/task-list.model';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private apiUrl = `${environment.apiUrl}/task-lists`;

  constructor(private http: HttpClient) { }

  // Get all task lists
  getTaskLists(): Observable<TaskListResponse[]> {
    return this.http.get<TaskListResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get a specific task list by ID
  getTaskList(id: number): Observable<TaskListResponse> {
    return this.http.get<TaskListResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create a new task list
  createTaskList(taskList: TaskListRequest): Observable<TaskListResponse> {
    return this.http.post<TaskListResponse>(this.apiUrl, taskList)
      .pipe(catchError(this.handleError));
  }

  // Update an existing task list
  updateTaskList(id: number, taskList: TaskListRequest): Observable<TaskListResponse> {
    return this.http.put<TaskListResponse>(`${this.apiUrl}/${id}`, taskList)
      .pipe(catchError(this.handleError));
  }

  // Delete a task list
  deleteTaskList(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  // Search task lists
  searchTaskLists(keyword: string): Observable<TaskListResponse[]> {
    return this.http.get<TaskListResponse[]>(`${this.apiUrl}/search?keyword=${keyword}`)
      .pipe(catchError(this.handleError));
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