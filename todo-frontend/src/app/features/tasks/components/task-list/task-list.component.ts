import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskListService } from '../../../task-lists/services/task-list.service';
import { Task } from '../../models/task.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = true;
  error = '';
  searchKeyword = '';
  
  // Filter parameters
  statusFilter: string | null = null;
  priorityFilter: string | null = null;
  categoryFilter: number | null = null;
  taskListFilter: number | null = null;
  
  // Task list ID if viewing tasks from a specific list
  taskListId: number | null = null;
  taskListName: string | null = null;
  
  // Category ID if viewing tasks from a specific category
  categoryId: number | null = null;
  categoryName: string | null = null;
  
  // View mode: 'all', 'today', 'upcoming', 'completed', 'overdue'
  viewMode = 'all';
  
  // Sort order
  sortBy = 'dueDate';
  sortDirection = 'asc';

  constructor(
    private taskService: TaskService,
    private taskListService: TaskListService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      // Reset viewMode to default
      this.viewMode = 'all';
      this.taskListId = null;
      this.categoryId = null;
      
      if (segments.length > 0) {
        // Check for special view modes
        if (['today', 'upcoming', 'completed', 'overdue'].includes(segments[0].path)) {
          this.viewMode = segments[0].path;
          this.loadTasksByMode(this.viewMode);
        } else if (segments[0].path === 'task-lists' && segments.length > 1) {
          // The route format is /task-lists/:id
          const id = segments[1].path;
          if (id && !isNaN(+id)) {
            this.taskListId = +id;
            this.loadTasksByList(this.taskListId);
          } else {
            this.error = 'Invalid task list ID';
            this.isLoading = false;
          }
        } else if (segments[0].path === 'categories' && segments.length > 1) {
          // The route format is /categories/:id
          const id = segments[1].path;
          if (id && !isNaN(+id)) {
            this.categoryId = +id;
            this.loadTasksByCategory(this.categoryId);
          } else {
            this.error = 'Invalid category ID';
            this.isLoading = false;
          }
        } else {
          // Default view for /tasks
          this.loadAllTasks();
        }
      } else {
        // Default view for /tasks
        this.loadAllTasks();
      }
    });
    
    // Also check for query params (in case navigation was done with query params)
    this.route.queryParams.subscribe(params => {
      if (params['listId'] && !isNaN(+params['listId'])) {
        this.taskListId = +params['listId'];
        this.loadTasksByList(this.taskListId);
      } else if (params['categoryId'] && !isNaN(+params['categoryId'])) {
        this.categoryId = +params['categoryId'];
        this.loadTasksByCategory(this.categoryId);
      }
    });
  }
  
  loadAllTasks(): void {
    this.isLoading = true;
    this.error = '';
    
    this.taskService.getTasks()
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load tasks';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilters();
      });
  }
  
  loadTasksByList(listId: number): void {
    this.isLoading = true;
    this.error = '';
    
    // First, get the task list details to show the name
    this.taskListService.getTaskList(listId)
      .pipe(
        catchError(err => {
          this.error = err.message || `Failed to load task list details`;
          return of(null);
        })
      )
      .subscribe(taskList => {
        if (taskList) {
          this.taskListName = taskList.name;
          
          // Then load the tasks for this list
          this.taskService.getTasks({ taskListId: listId })
            .pipe(
              catchError(err => {
                this.error = err.message || `Failed to load tasks for list ${listId}`;
                return of([]);
              }),
              finalize(() => {
                this.isLoading = false;
              })
            )
            .subscribe(tasks => {
              this.tasks = tasks;
              this.applyFilters();
            });
        } else {
          this.isLoading = false;
        }
      });
  }
  
  loadTasksByCategory(categoryId: number): void {
    this.isLoading = true;
    this.error = '';
    
    this.taskService.getTasks({ categoryId })
      .pipe(
        catchError(err => {
          this.error = err.message || `Failed to load tasks for category ${categoryId}`;
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(tasks => {
        this.tasks = tasks;
        if (tasks.length > 0 && tasks[0].categoryName) {
          this.categoryName = tasks[0].categoryName;
        }
        this.applyFilters();
      });
  }
  
  loadTasksByMode(mode: string): void {
    this.isLoading = true;
    this.error = '';
    
    let observable;
    
    switch (mode) {
      case 'today':
        // Fetch tasks due today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        observable = this.taskService.getTasks({
          dueDateFrom: today.toISOString(),
          dueDateTo: tomorrow.toISOString(),
          status: 'PENDING'
        });
        break;
        
      case 'upcoming':
        // Fetch tasks due in the next 7 days
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        
        observable = this.taskService.getTasks({
          dueDateFrom: startDate.toISOString(),
          dueDateTo: endDate.toISOString(),
          status: 'PENDING'
        });
        break;
        
      case 'completed':
        // Fetch completed tasks
        observable = this.taskService.getTasksByStatus('COMPLETED');
        break;
        
      case 'overdue':
        // Fetch overdue tasks
        observable = this.taskService.getOverdueTasks();
        break;
        
      default:
        observable = this.taskService.getTasks();
    }
    
    observable
      .pipe(
        catchError(err => {
          this.error = err.message || `Failed to load ${mode} tasks`;
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilters();
      });
  }
  
  applyFilters(): void {
    let filtered = [...this.tasks];
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(task => task.status === this.statusFilter);
    }
    
    // Apply priority filter
    if (this.priorityFilter) {
      filtered = filtered.filter(task => task.priority === this.priorityFilter);
    }
    
    // Apply category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(task => task.categoryId === this.categoryFilter);
    }
    
    // Apply task list filter
    if (this.taskListFilter) {
      filtered = filtered.filter(task => task.taskListId === this.taskListFilter);
    }
    
    // Apply search
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(keyword) || 
        (task.description && task.description.toLowerCase().includes(keyword))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;  // Null values at the end
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
          
        case 'priority':
          const priorityOrder: {[key: string]: number} = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
          
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
          
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
          
        case 'createdAt':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
          
        default:
          comparison = 0;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredTasks = filtered;
  }
  
  setStatusFilter(status: string | null): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  setPriorityFilter(priority: string | null): void {
    this.priorityFilter = priority;
    this.applyFilters();
  }
  
  setSorting(field: string): void {
    if (this.sortBy === field) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  search(): void {
    this.applyFilters();
  }
  
  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.statusFilter = null;
    this.priorityFilter = null;
    this.categoryFilter = null;
    this.taskListFilter = null;
    this.searchKeyword = '';
    this.applyFilters();
  }
  
  refreshTasks(): void {
    if (this.taskListId) {
      this.loadTasksByList(this.taskListId);
    } else if (this.categoryId) {
      this.loadTasksByCategory(this.categoryId);
    } else if (this.viewMode !== 'all') {
      this.loadTasksByMode(this.viewMode);
    } else {
      this.loadAllTasks();
    }
  }
  
  viewTaskDetails(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }
  
  editTask(taskId: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewTaskDetails
    this.router.navigate(['/tasks', taskId, 'edit']);
  }
  
  createTask(): void {
    let navigationExtras = {};
    
    if (this.taskListId) {
      navigationExtras = { queryParams: { listId: this.taskListId } };
    } else if (this.categoryId) {
      navigationExtras = { queryParams: { categoryId: this.categoryId } };
    }
    
    this.router.navigate(['/tasks/new'], navigationExtras);
  }
  
  deleteTask(taskId: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewTaskDetails
    
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete task';
            return of(null);
          })
        )
        .subscribe(() => {
          this.refreshTasks();
        });
    }
  }
  
  toggleTaskStatus(task: Task, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewTaskDetails
    
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' as const : 'COMPLETED' as const;
    
    // Create a new object without including unnecessary properties
    const taskUpdate = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId,
      taskListId: task.taskListId
    };
    
    if (newStatus === 'COMPLETED') {
      this.taskService.completeTask(task.id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to update task status';
            return of(null);
          })
        )
        .subscribe(() => {
          this.refreshTasks();
        });
    } else {
      this.taskService.updateTask(task.id, taskUpdate)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to update task status';
            return of(null);
          })
        )
        .subscribe(() => {
          this.refreshTasks();
        });
    }
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
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  formatShortDate(dateString: string | undefined): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  isDueSoon(dateString: string | undefined): boolean {
    if (!dateString) return false;
    
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    return diffDays >= 0 && diffDays <= 2; // Due within 2 days
  }
  
  isOverdue(dateString: string | undefined): boolean {
    if (!dateString) return false;
    
    const dueDate = new Date(dateString);
    const now = new Date();
    
    return dueDate < now && dueDate.toDateString() !== now.toDateString();
  }
}