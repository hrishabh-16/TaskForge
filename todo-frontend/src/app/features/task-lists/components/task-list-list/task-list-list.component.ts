import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  taskLists: TaskListResponse[] = [];
  filteredTaskLists: TaskListResponse[] = [];
  isLoading = true;
  error = '';
  searchKeyword = '';

  constructor(
    private taskListService: TaskListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTaskLists();
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
  }
  
  search(): void {
    this.applyFilter();
  }
  
  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilter();
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