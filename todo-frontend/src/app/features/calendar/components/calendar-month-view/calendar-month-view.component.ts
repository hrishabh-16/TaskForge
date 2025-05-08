// todo-frontend/src/app/features/calendar/components/calendar-month-view/calendar-month-view.component.ts
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';
import { addDays, endOfMonth, format, getDaysInMonth, startOfMonth } from 'date-fns';

@Component({
  selector: 'app-calendar-month-view',
  standalone: false,
  templateUrl: './calendar-month-view.component.html',
  styleUrls: ['./calendar-month-view.component.css']
})
export class CalendarMonthViewComponent implements OnChanges {
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() refresh: any;
  
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  days: any[] = [];
  weeks: any[][] = [];
  monthName: string = '';
  
  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.generateCalendarDays();
    this.organizeEvents();
  }

  generateCalendarDays(): void {
    this.days = [];
    this.weeks = [];
    
    const startDate = startOfMonth(this.viewDate);
    const endDate = endOfMonth(this.viewDate);
    const daysInMonth = getDaysInMonth(this.viewDate);
    
    // Get month name
    this.monthName = format(this.viewDate, 'MMMM yyyy');
    
    // Get the day of the week that the month starts (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = startDate.getDay();
    
    // Add padding days before the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = addDays(startDate, -startDayOfWeek + i);
      this.days.push({
        date: prevDate,
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: this.isToday(prevDate),
        events: []
      });
    }
    
    // Add days of the current month
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = addDays(startDate, i);
      this.days.push({
        date: currentDate,
        dayNumber: currentDate.getDate(),
        isCurrentMonth: true,
        isToday: this.isToday(currentDate),
        events: []
      });
    }
    
    // Add padding days after the end of the month to complete the last week
    const endDayOfWeek = endDate.getDay();
    const paddingDaysCount = 6 - endDayOfWeek;
    
    for (let i = 1; i <= paddingDaysCount; i++) {
      const nextDate = addDays(endDate, i);
      this.days.push({
        date: nextDate,
        dayNumber: nextDate.getDate(),
        isCurrentMonth: false,
        isToday: this.isToday(nextDate),
        events: []
      });
    }
    
    // Divide into weeks
    for (let i = 0; i < this.days.length; i += 7) {
      this.weeks.push(this.days.slice(i, i + 7));
    }
  }

  organizeEvents(): void {
    // Reset events for all days
    this.days.forEach(day => {
      day.events = [];
    });
    
    // Assign events to days
    this.events.forEach(event => {
      const eventDate = new Date(event.start);
      
      // Find the day for this event
      const day = this.days.find(d => 
        d.date.getDate() === eventDate.getDate() && 
        d.date.getMonth() === eventDate.getMonth() && 
        d.date.getFullYear() === eventDate.getFullYear()
      );
      
      if (day) {
        day.events.push(event);
      }
    });
    
    // Sort events for each day
    this.days.forEach(day => {
      day.events.sort((a: any, b: any) => {
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
  }

  onTaskClick(event: CalendarEvent): void {
    this.eventClicked.emit(event);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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