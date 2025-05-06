import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../features/categories/services/category.service';
import { TaskListService } from '../../../features/task-lists/services/task-list.service';
import { TaskService } from '../../../features/tasks/services/task.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isMobileMenuOpen = false;
  isSidebarCollapsed = false; // Desktop sidebar collapse state
  categories: any[] = [];
  taskLists: any[] = [];
  isLoading = false;
  error = '';
  
  // Track section collapse states
  myTasksCollapsed = false;
  projectsCollapsed = false;
  categoriesCollapsed = false;
  
  // Task statistics
  taskStatistics = {
    today: 0,
    upcoming: 0,
    completed: 0,
    overdue: 0
  };

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private taskListService: TaskListService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadSidebarData();
  }

  loadSidebarData(): void {
    this.isLoading = true;
    
    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        this.isLoading = false;
        console.error('Category loading error:', err);
      }
    });
    
    // Load task lists (projects)
    this.taskListService.getTaskLists().subscribe({
      next: (data) => {
        this.taskLists = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load task lists';
        this.isLoading = false;
        console.error('Task list loading error:', err);
      }
    });
    
    // Load task statistics
    this.loadTaskStatistics();
  }
  
  loadTaskStatistics(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Today's tasks
        this.taskStatistics.today = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate < tomorrow;
          }
          return false;
        }).length;
        
        // Upcoming tasks (next 7 days excluding today)
        this.taskStatistics.upcoming = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            const dueDate = new Date(task.dueDate);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            return dueDate >= tomorrow && dueDate <= nextWeek;
          }
          return false;
        }).length;
        
        // Completed tasks
        this.taskStatistics.completed = tasks.filter(task => 
          task.status === 'COMPLETED'
        ).length;
        
        // Overdue tasks
        this.taskStatistics.overdue = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
          }
          return false;
        }).length;
      },
      error: (err) => {
        console.error('Error loading task statistics:', err);
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  toggleSection(section: string): void {
    switch(section) {
      case 'myTasks':
        this.myTasksCollapsed = !this.myTasksCollapsed;
        break;
      case 'projects':
        this.projectsCollapsed = !this.projectsCollapsed;
        break;
      case 'categories':
        this.categoriesCollapsed = !this.categoriesCollapsed;
        break;
    }
  }

  navigateTo(route: string): void {
    // Close mobile menu when navigating
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
    
    // Special handling for task-lists and categories to ensure proper navigation
    if (route.startsWith('/task-lists/') && !route.includes('new') && !route.includes('edit')) {
      const id = route.split('/').pop();
      if (id && !isNaN(+id)) {
        this.router.navigate(['/task-lists', id]);
      } else {
        this.router.navigate([route]);
      }
    } else if (route.startsWith('/categories/') && !route.includes('new') && !route.includes('edit')) {
      const id = route.split('/').pop();
      if (id && !isNaN(+id)) {
        this.router.navigate(['/categories', id]);
      } else {
        this.router.navigate([route]);
      }
    } else {
      this.router.navigate([route]);
    }
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
    
    // Close mobile menu
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}