// todo-frontend/src/app/features/calendar/components/calendar/calendar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { CalendarService } from '../../services/calendar.service';
import { TaskService } from '../../../tasks/services/task.service';
import { TaskStatus } from '../../../../core/models/task.model';
import { CategoryService } from '../../../categories/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

// Use type union instead of an enum extension
type ViewType = CalendarView | 'agenda';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: ViewType = CalendarView.Month;
  CalendarView = CalendarView;
  agendaView = 'agenda' as ViewType;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  refresh = new Subject<void>();
  isOpen = false;
  
  // Filter properties
  categories: any[] = [];
  selectedCategories: number[] = [];
  showCompleted: boolean = true;
  categoryDropdownOpen: boolean = false;

  // Loading state
  loading: boolean = false;
  
  // Subscriptions
  private subscriptions = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    private calendarService: CalendarService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Load initial events
    this.loadEvents();
    
    // Load categories for filters
    this.loadCategories();
    
    // Subscribe to WebSocket updates
    this.subscriptions.add(
      this.calendarService.taskUpdates$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadEvents();
        })
    );
    
    // Subscribe to filter changes
    this.subscriptions.add(
      this.calendarService.filters$
        .pipe(takeUntil(this.destroy$))
        .subscribe(filters => {
          this.categories = filters.categories;
          this.selectedCategories = filters.selectedCategories;
          this.showCompleted = filters.showCompleted;
        })
    );
    
    // Subscribe to view changes
    this.subscriptions.add(
      this.calendarService.view$
        .pipe(takeUntil(this.destroy$))
        .subscribe(view => {
          this.view = this.getCalendarView(view);
        })
    );
    
    // Subscribe to date changes
    this.subscriptions.add(
      this.calendarService.currentDate$
        .pipe(takeUntil(this.destroy$))
        .subscribe(date => {
          this.viewDate = date;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCategoryFilter(): void {
    // Get selected category IDs
    const selectedCategories = this.categories
      .filter(category => category.selected)
      .map(category => category.id);
    
    // Update filters
    this.selectedCategories = selectedCategories;
    this.updateFilters();
  }

  loadEvents(): void {
    this.loading = true;
    this.subscriptions.add(
      this.calendarService.getCalendarEvents().subscribe(
        events => {
          this.events = events;
          this.refresh.next();
          this.loading = false;
        },
        error => {
          console.error('Error loading calendar events:', error);
          this.loading = false;
        }
      )
    );
  }

  loadCategories(): void {
    this.subscriptions.add(
      this.categoryService.getCategories().subscribe(
        categories => {
          this.categories = categories;
        },
        error => {
          console.error('Error loading categories:', error);
        }
      )
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      
      // Open task creation dialog
      if (events.length === 0) {
        this.openTaskFormDialog(date);
      }
    }
  }

  eventClicked(event: CalendarEvent): void {
    // Navigate to task detail
    this.router.navigate(['/tasks', event.id]);
  }

  setView(view: ViewType): void {
    this.view = view;
    this.calendarService.changeView(this.getViewName(view));
    this.activeDayIsOpen = false;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  updateFilters(): void {
    const filters = {
      selectedCategories: this.selectedCategories,
      showCompleted: this.showCompleted
    };
    
    this.calendarService.updateFilters(filters);
    this.loadEvents();
  }

  openTaskFormDialog(date: Date): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: { date: date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }

  private getCalendarView(viewName: string): ViewType {
    switch (viewName) {
      case 'day':
        return CalendarView.Day;
      case 'week':
        return CalendarView.Week;
      case 'agenda':
        return 'agenda';
      case 'month':
      default:
        return CalendarView.Month;
    }
  }

  private getViewName(view: ViewType): string {
    switch (view) {
      case CalendarView.Day:
        return 'day';
      case CalendarView.Week:
        return 'week';
      case 'agenda':
        return 'agenda';
      case CalendarView.Month:
      default:
        return 'month';
    }
  }
  
  toggleCategory(categoryId: number): void {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryId];
    }
    this.updateFilters();
  }
}