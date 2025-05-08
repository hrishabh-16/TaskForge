// todo-frontend/src/app/features/calendar/components/calendar-agenda-view/calendar-agenda-view.component.ts
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';
import { endOfMonth, startOfMonth, isWithinInterval, format, addDays } from 'date-fns';

@Component({
  selector: 'app-calendar-agenda-view',
  standalone: false,
  templateUrl: './calendar-agenda-view.component.html',
  styleUrls: ['./calendar-agenda-view.component.css']
})
export class CalendarAgendaViewComponent implements OnChanges {
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() refresh: any;
  
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  groupedEvents: { [key: string]: any[] } = {};
  dateKeys: string[] = [];
  
  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.organizeEventsByDate();
  }

  organizeEventsByDate(): void {
    this.groupedEvents = {};
    this.dateKeys = [];
    
    // Get start and end of the month
    const start = startOfMonth(this.viewDate);
    const end = endOfMonth(this.viewDate);
    
    // Filter events for the current month
    const monthEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return isWithinInterval(eventDate, { start, end });
    });
    
    // Group events by date
    monthEvents.forEach(event => {
      const eventDate = new Date(event.start);
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      
      if (!this.groupedEvents[dateKey]) {
        this.groupedEvents[dateKey] = [];
      }
      
      this.groupedEvents[dateKey].push(event);
    });
    
    // Sort events for each day
    Object.keys(this.groupedEvents).forEach(dateKey => {
      this.groupedEvents[dateKey].sort((a, b) => {
        // Sort completed tasks last
        if (a.meta?.task?.status === 'COMPLETED' && b.meta?.task?.status !== 'COMPLETED') return 1;
        if (a.meta?.task?.status !== 'COMPLETED' && b.meta?.task?.status === 'COMPLETED') return -1;
        
        // Sort by priority next
        const priorityOrder: { [key: string]: number } = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
        const aPriority = a.meta?.task?.priority ? priorityOrder[a.meta.task.priority] : 999;
        const bPriority = b.meta?.task?.priority ? priorityOrder[b.meta.task.priority] : 999;
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // Finally sort by time
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
    });
    
    // Get sorted date keys
    this.dateKeys = Object.keys(this.groupedEvents).sort();
  }

  onTaskClick(event: CalendarEvent): void {
    this.eventClicked.emit(event);
  }

  isToday(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMMM d');
    }
  }

  isOverdue(task: any): boolean {
    if (!task.dueDate || task.status === 'COMPLETED') {
      return false;
    }
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now;
  }

  getTaskStatusClass(task: any): string {
    if (task.status === 'COMPLETED') {
      return 'bg-green-100 border-green-300 text-green-800';
    } else if (this.isOverdue(task)) {
      return 'bg-red-100 border-red-300 text-red-800';
    } else if (task.status === 'IN_PROGRESS') {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    } else if (task.status === 'ON_HOLD') {
      return 'bg-purple-100 border-purple-300 text-purple-800';
    } else {
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'; // PENDING
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}