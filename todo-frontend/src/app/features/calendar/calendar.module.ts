// todo-frontend/src/app/features/calendar/calendar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarService } from './services/calendar.service';
import { TaskFormDialogComponent } from './components/task-form-dialog/task-form-dialog.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarDayViewComponent } from './components/calendar-day-view/calendar-day-view.component';
import { CalendarWeekViewComponent } from './components/calendar-week-view/calendar-week-view.component';
import { CalendarMonthViewComponent } from './components/calendar-month-view/calendar-month-view.component';
import { CalendarAgendaViewComponent } from './components/calendar-agenda-view/calendar-agenda-view.component';

// Import calendar library modules
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TaskItemComponent } from './components/task-item/task-item.component';

@NgModule({
  declarations: [
    CalendarComponent,
    TaskFormDialogComponent,
    CalendarHeaderComponent,
    CalendarDayViewComponent,
    CalendarWeekViewComponent,
    CalendarMonthViewComponent,
    CalendarAgendaViewComponent,
    TaskItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    CalendarComponent
  ],
  providers: [
    CalendarService
  ]
})
export class CalendarModule { }