// src/app/features/tasks/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Task, TaskRequest, TaskResponse, TaskStatistics } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  // Get task statistics for dashboard
  getTaskStatistics(): Observable<TaskStatistics> {
    // Since there's no specific statistics endpoint in your API,
    // we'll create a composite statistic by combining several API calls in the dashboard component
    // For now, return a placeholder that will be populated with actual data
    return this.http.get<TaskResponse[]>(`${this.apiUrl}`).pipe(
      map(tasks => {
        const now = new Date();
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'COMPLETED').length;
        const overdue = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            return new Date(task.dueDate) < now;
          }
          return false;
        }).length;
        const upcoming = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            const dueDate = new Date(task.dueDate);
            const diff = dueDate.getTime() - now.getTime();
            const days = diff / (1000 * 3600 * 24);
            return days >= 0 && days <= 7; // Tasks due within a week
          }
          return false;
        }).length;
        
        return { total, completed, overdue, upcoming };
      }),
      catchError(this.handleError)
    );
  }

  // Get recent tasks for dashboard
  getRecentTasks(limit: number = 5): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(this.apiUrl).pipe(
      map(tasks => tasks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, limit)),
      catchError(this.handleError)
    );
  }

  // Get upcoming deadlines for dashboard
  getUpcomingDeadlines(limit: number = 3): Observable<TaskResponse[]> {
    const now = new Date();
    
    return this.http.get<TaskResponse[]>(this.apiUrl).pipe(
      map(tasks => tasks
        .filter(task => task.dueDate && task.status !== 'COMPLETED')
        .sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .filter(task => task.dueDate && new Date(task.dueDate) >= now)
        .slice(0, limit)
      ),
      catchError(this.handleError)
    );
  }

  // Get all tasks with optional filtering
  getTasks(filterParams?: any): Observable<TaskResponse[]> {
    let params = new HttpParams();
    
    if (filterParams) {
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] !== null && filterParams[key] !== undefined) {
          params = params.set(key, filterParams[key]);
        }
      });
    }
    
    return this.http.get<TaskResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // Get a specific task by ID
  getTask(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create a new task
  createTask(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  // Update an existing task
  updateTask(id: number, task: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  // Delete a task
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Mark a task as completed
  completeTask(id: number): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}/complete`, {})
      .pipe(catchError(this.handleError));
  }
  
  // Get overdue tasks
  getOverdueTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/overdue`)
      .pipe(catchError(this.handleError));
  }
  
  // Search tasks
  searchTasks(keyword: string): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/search?keyword=${keyword}`)
      .pipe(catchError(this.handleError));
  }
  
  // Get tasks by status
  getTasksByStatus(status: string): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/status/${status}`)
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