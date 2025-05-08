// todo-frontend/src/app/features/calendar/services/calendar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarEvent } from 'angular-calendar';
import { TaskStatus, TaskPriority } from '../../../core/models/task.model';
import { TaskService } from '../../tasks/services/task.service';
import { CategoryService } from '../../categories/services/category.service';
import { WebSocketService } from '../../../core/services/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // Observable for task updates via WebSocket
  private taskUpdatesSubject = new Subject<any>();
  public taskUpdates$ = this.taskUpdatesSubject.asObservable();

  // Filters state
  private filtersSubject = new BehaviorSubject<any>({
    categories: [],
    showCompleted: true,
    selectedCategories: []
  });
  public filters$ = this.filtersSubject.asObservable();

  // View state
  private viewSubject = new BehaviorSubject<string>('month');
  public view$ = this.viewSubject.asObservable();

  // Date range for current view
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  public currentDate$ = this.currentDateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private webSocketService: WebSocketService
  ) {
    // Subscribe to WebSocket updates
    this.setupWebSocketConnection();
    
    // Load categories for filters
    this.loadCategories();
  }

  private setupWebSocketConnection(): void {
    this.webSocketService.connect();
    
    // Subscribe to task updates from WebSocket
    this.webSocketService.subscribeToChannel('/topic/tasks', (message: any) => {
      this.taskUpdatesSubject.next(message);
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      const filters = this.filtersSubject.getValue();
      filters.categories = categories;
      this.filtersSubject.next(filters);
    });
  }

  // Get tasks for the calendar view
  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const filters = this.filtersSubject.getValue();
        
        // Apply filters
        return tasks
          .filter(task => {
            // Filter by completion status
            if (!filters.showCompleted && task.status === TaskStatus.COMPLETED) {
              return false;
            }
            
            // Filter by selected categories
            if (filters.selectedCategories.length > 0 && task.categoryId) {
              return filters.selectedCategories.includes(task.categoryId);
            }
            
            return true;
          })
          .map(task => {
            // Map task to calendar event
            return {
              id: task.id,
              title: task.title,
              start: new Date(task.dueDate || new Date()),
              end: new Date(task.dueDate || new Date()),
              allDay: true,
              color: this.getEventColor(task.status as TaskStatus, task.priority as TaskPriority),
              meta: {
                task: task
              }
            };
          });
      })
    );
  }

  // Get color based on task status and priority
  getEventColor(status: TaskStatus, priority: TaskPriority): any {
    // Define colors based on status
    const colors = {
      [TaskStatus.COMPLETED]: {
        primary: '#10B981',
        secondary: '#D1FAE5'
      },
      [TaskStatus.PENDING]: {
        primary: '#3B82F6',
        secondary: '#DBEAFE'
      },
      [TaskStatus.IN_PROGRESS]: {
        primary: '#6366F1',
        secondary: '#E0E7FF'
      },
      [TaskStatus.ON_HOLD]: {
        primary: '#F59E0B',
        secondary: '#FEF3C7'
      },
      'OVERDUE': {
        primary: '#EF4444',
        secondary: '#FEE2E2'
      }
    };
    
    // Check if task is overdue
    const now = new Date();
    const dueDate = new Date(status !== TaskStatus.COMPLETED ? new Date() : now);
    const isOverdue = dueDate < now && status !== TaskStatus.COMPLETED;
    
    if (isOverdue) {
      return colors['OVERDUE'];
    }
    
    return colors[status] || colors[TaskStatus.PENDING];
  }

  // Update filters
  updateFilters(filters: any): void {
    const currentFilters = this.filtersSubject.getValue();
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  // Update view
  changeView(view: string): void {
    this.viewSubject.next(view);
  }

  // Update current date
  changeDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  // Get tasks for a specific date
  getTasksForDate(date: Date): Observable<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.taskService.getTasks().pipe(
      map(tasks => tasks.filter(task => {
        if (!task.dueDate) return false;
        
        const taskDate = new Date(task.dueDate);
        return taskDate >= startOfDay && taskDate <= endOfDay;
      }))
    );
  }

  // Get tasks for a date range
  getTasksForDateRange(start: Date, end: Date): Observable<any[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => tasks.filter(task => {
        if (!task.dueDate) return false;
        
        const taskDate = new Date(task.dueDate);
        return taskDate >= start && taskDate <= end;
      }))
    );
  }
}