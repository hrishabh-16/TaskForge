// src/app/features/dashboard/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { forkJoin, catchError, of } from 'rxjs';
import { TaskService } from '../../../tasks/services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskResponse } from '../../../tasks/models/task.model';
import { CategoryResponse } from '../../../categories/models/category.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  taskStatistics = {
    total: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0
  };
  
  recentTasks: TaskResponse[] = [];
  upcomingDeadlines: TaskResponse[] = [];
  categories: CategoryResponse[] = [];
  isLoading = true;
  error = '';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }
  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.error = '';
    
    // Use forkJoin to make multiple API calls in parallel
    forkJoin({
      // Get all tasks for statistics (this will be derived from the tasks response)
      tasks: this.taskService.getTasks().pipe(
        catchError(err => {
          console.error('Error loading tasks:', err);
          return of([]);
        })
      ),
      categories: this.categoryService.getCategories().pipe(
        catchError(err => {
          console.error('Error loading categories:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (results) => {
        // Process tasks
        if (results.tasks) {
          // Calculate statistics
          this.calculateTaskStatistics(results.tasks);
          
          // Get recent tasks (sort by creation date)
          this.recentTasks = [...results.tasks]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
            
          // Get upcoming deadlines
          const now = new Date();
          this.upcomingDeadlines = [...results.tasks]
            .filter(task => task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) >= now)
            .sort((a, b) => {
              if (!a.dueDate) return 1;
              if (!b.dueDate) return -1;
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            })
            .slice(0, 3);
        }
        
        // Process categories
        if (results.categories) {
          this.categories = results.categories;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
        console.error('Dashboard data loading error:', err);
      }
    });
  }
  
  calculateTaskStatistics(tasks: TaskResponse[]): void {
    const now = new Date();
    
    this.taskStatistics.total = tasks.length;
    this.taskStatistics.completed = tasks.filter(task => task.status === 'COMPLETED').length;
    
    // Calculate overdue tasks (due date is in the past and task is not completed)
    this.taskStatistics.overdue = tasks.filter(task => {
      if (task.dueDate && task.status !== 'COMPLETED') {
        return new Date(task.dueDate) < now;
      }
      return false;
    }).length;
    
    // Calculate upcoming tasks (due date is within the next 7 days and task is not completed)
    this.taskStatistics.upcoming = tasks.filter(task => {
      if (task.dueDate && task.status !== 'COMPLETED') {
        const dueDate = new Date(task.dueDate);
        const diff = dueDate.getTime() - now.getTime();
        const days = diff / (1000 * 3600 * 24);
        return days >= 0 && days <= 7;
      }
      return false;
    }).length;
  }
  
  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'HIGH':
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getCategoryColorClass(category: CategoryResponse): any {
    if (category.color) {
      return { 'background-color': category.color };
    }
    
    // Default colors based on category name or id
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800'
    ];
    
    return colors[category.id % colors.length];
  }
  
  // Add this method to the dashboard component
  getContrastColor(hexColor?: string): string {
    if (!hexColor) return 'text-black';
    
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white text for dark backgrounds, black text for light backgrounds
    return brightness > 128 ? 'text-black' : 'text-white';
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  createNewTask(): void {
    // Will be implemented in the Task module
    console.log('Create new task clicked from dashboard');
  }
  
  
  retryLoading(): void {
    this.loadDashboardData();
  }
}