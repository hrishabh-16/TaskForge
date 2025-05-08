import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAgendaViewComponent } from './calendar-agenda-view.component';

describe('CalendarAgendaViewComponent', () => {
  let component: CalendarAgendaViewComponent;
  let fixture: ComponentFixture<CalendarAgendaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarAgendaViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarAgendaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
