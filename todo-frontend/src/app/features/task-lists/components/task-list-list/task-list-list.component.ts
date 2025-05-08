import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskListService } from '../../services/task-list.service';
import { TaskListResponse } from '../../models/task-list.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-task-list-list',
  standalone: false,  
  templateUrl: './task-list-list.component.html',
  styleUrls: ['./task-list-list.component.css']
})
export class TaskListListComponent implements OnInit {
  Math = Math; // Expose Math for use in the template
  taskLists: TaskListResponse[] = [];
  filteredTaskLists: TaskListResponse[] = [];
  displayedTaskLists: TaskListResponse[] = []; // Task lists displayed on current page
  isLoading = true;
  error = '';
  searchKeyword = '';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private taskListService: TaskListService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Subscribe to query params for pagination
    this.route.queryParams.subscribe(params => {
      if (params['page'] && !isNaN(+params['page'])) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
      
      this.loadTaskLists();
    });
  }

  loadTaskLists(): void {
    this.isLoading = true;
    this.error = '';
    
    this.taskListService.getTaskLists()
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load task lists';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(taskLists => {
        this.taskLists = taskLists;
        this.applyFilter();
      });
  }
  
  applyFilter(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredTaskLists = [...this.taskLists];
    } else {
      const keyword = this.searchKeyword.toLowerCase().trim();
      this.filteredTaskLists = this.taskLists.filter(list => 
        list.name.toLowerCase().includes(keyword) || 
        (list.description && list.description.toLowerCase().includes(keyword))
      );
    }
    
    // Calculate total pages
    this.totalPages = Math.max(1, Math.ceil(this.filteredTaskLists.length / this.pageSize));
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatePageInUrl(this.currentPage);
    }
    
    // Apply pagination
    this.updateDisplayedTaskLists();
  }

  updateDisplayedTaskLists(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredTaskLists.length);
    this.displayedTaskLists = this.filteredTaskLists.slice(startIndex, endIndex);
  }
  
  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageInUrl(page);
      this.updateDisplayedTaskLists();
    }
  }
  
  goToFirstPage(): void {
    this.goToPage(1);
  }
  
  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  getDisplayedPageRange(): number[] {
    // Calculate a range of pages to display (max 5 pages)
    const totalPagesToShow = 5;
    const pages: number[] = [];
    
    let startPage = Math.max(1, this.currentPage - Math.floor(totalPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + totalPagesToShow - 1);
    
    // Adjust start page if we're near the end
    startPage = Math.max(1, endPage - totalPagesToShow + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  updatePageInUrl(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge'
    });
  }
  
  search(): void {
    this.currentPage = 1; // Reset to first page on search
    this.applyFilter();
    // Update URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: null },
      queryParamsHandling: 'merge'
    });
  }
  
  clearSearch(): void {
    this.searchKeyword = '';
    this.currentPage = 1; // Reset to first page
    this.applyFilter();
    // Update URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: null },
      queryParamsHandling: 'merge'
    });
  }
  
  createTaskList(): void {
    this.router.navigate(['/task-lists/new']);
  }
  
  viewTaskList(id: number): void {
    this.router.navigate(['/tasks'], { queryParams: { listId: id } });
  }
  
  editTaskList(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewTaskList
    this.router.navigate(['/task-lists', id, 'edit']);
  }
  
  deleteTaskList(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewTaskList
    
    if (confirm('Are you sure you want to delete this task list? All tasks in this list will be unassigned, but not deleted.')) {
      this.taskListService.deleteTaskList(id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete task list';
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadTaskLists();
        });
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
}