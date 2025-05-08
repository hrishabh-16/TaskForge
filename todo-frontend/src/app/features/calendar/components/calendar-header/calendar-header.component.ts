// todo-frontend/src/app/features/calendar/components/calendar-header/calendar-header.component.ts
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarView } from 'angular-calendar';

// Use type union instead of an enum extension
type ViewType = CalendarView | 'agenda';

@Component({
  selector: 'app-calendar-header',
  standalone: false,
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent implements OnChanges {
  @Input() view: ViewType = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<ViewType>();
  @Output() viewDateChange = new EventEmitter<Date>();

  // Use CalendarView directly and add a property for agenda
  CalendarView = CalendarView;
  agendaView = 'agenda' as ViewType;
  
  viewDateDisplay: string = '';

  ngOnChanges(): void {
    this.updateViewDateDisplay();
  }

  updateViewDateDisplay(): void {
    const date = new Date(this.viewDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    
    if (this.view === CalendarView.Day) {
      options.day = 'numeric';
    } else if (this.view === CalendarView.Week || this.view === 'agenda') {
      // Keep just month and year for week and agenda views
    }
    
    this.viewDateDisplay = date.toLocaleDateString(this.locale, options);
  }
}