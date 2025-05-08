// todo-frontend/src/app/features/calendar/components/calendar-day-view/calendar-day-view.component.ts
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-day-view',
  standalone: false,
  templateUrl: './calendar-day-view.component.html',
  styleUrls: ['./calendar-day-view.component.css']
})
export class CalendarDayViewComponent implements OnChanges {
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() refresh: any;
  
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  dayTasks: any[] = [];
  
  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.updateDayTasks();
  }

  updateDayTasks(): void {
    // Filter events for the current day
    const selectedDate = new Date(this.viewDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    this.dayTasks = this.events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= selectedDate && eventDate < nextDay;
      })
      .map(event => event.meta.task)
      .sort((a, b) => {
        // Sort by completion status, then by due date
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
        if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
        
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      });
  }

  onTaskClick(task: any): void {
    this.router.navigate(['/tasks', task.id]);
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isOverdue(task: any): boolean {
    if (!task.dueDate || task.status === 'COMPLETED') {
      return false;
    }
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now;
  }
  
}