// src/app/features/categories/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Category, CategoryRequest, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get a specific category by ID
  getCategory(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create a new category
  createCategory(category: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, category)
      .pipe(catchError(this.handleError));
  }

  // Update an existing category
  updateCategory(id: number, category: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, category)
      .pipe(catchError(this.handleError));
  }

  // Delete a category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  // Search categories
  searchCategories(keyword: string): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/search?keyword=${keyword}`)
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