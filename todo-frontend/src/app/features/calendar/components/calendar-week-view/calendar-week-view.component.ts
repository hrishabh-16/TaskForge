// todo-frontend/src/app/features/calendar/components/calendar-week-view/calendar-week-view.component.ts
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';

@Component({
  selector: 'app-calendar-week-view',
  standalone: false,
  templateUrl: './calendar-week-view.component.html',
  styleUrls: ['./calendar-week-view.component.css']
})
export class CalendarWeekViewComponent implements OnChanges {
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() refresh: any;
  
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  weekDays: any[] = [];
  weekTasks: { [key: string]: any[] } = {};
  
  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.generateWeekDays();
    this.organizeTasksByDay();
  }

  generateWeekDays(): void {
    const start = startOfWeek(this.viewDate, { weekStartsOn: 0 });
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      this.weekDays.push({
        date: day,
        isToday: this.isToday(day),
        dayName: this.formatDayName(day),
        dateNum: day.getDate(),
        dateKey: this.formatDateKey(day) // Add dateKey directly to each day object
      });
    }
  }

  organizeTasksByDay(): void {
    this.weekTasks = {};
    
    // Initialize empty arrays for each day
    this.weekDays.forEach(day => {
      this.weekTasks[day.dateKey] = [];
    });
    
    // Filter and organize events for the current week
    const weekStart = startOfWeek(this.viewDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(this.viewDate, { weekStartsOn: 0 });
    
    this.events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= weekStart && eventDate <= weekEnd;
      })
      .forEach(event => {
        const eventDate = new Date(event.start);
        const dateKey = this.formatDateKey(eventDate);
        
        if (this.weekTasks[dateKey]) {
          this.weekTasks[dateKey].push(event.meta.task);
        }
      });
    
    // Sort tasks for each day
    Object.keys(this.weekTasks).forEach(dateKey => {
      if (this.weekTasks[dateKey]) {
        this.weekTasks[dateKey].sort((a, b) => {
          // Sort by completion status, then by due date
          if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
          if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
          
          const dateA = new Date(a.dueDate || 0);
          const dateB = new Date(b.dueDate || 0);
          return dateA.getTime() - dateB.getTime();
        });
      }
    });
  }

  onTaskClick(task: any): void {
    this.router.navigate(['/tasks', task.id]);
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  private formatDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Changed to public so we can use it in the template
  public formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  isOverdue(task: any): boolean {
    if (!task.dueDate || task.status === 'COMPLETED') {
      return false;
    }
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now;
  }
  
  // Add this method to format time
  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}