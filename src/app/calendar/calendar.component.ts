import { Component, OnInit, ViewChild, Host, ChangeDetectorRef, Inject, Optional, AfterViewInit, NgZone, OnChanges, Input } from '@angular/core';
import { MatCalendar, MatCalendarHeader } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @ViewChild(MatCalendarHeader) header: MatCalendarHeader<any>;
  @Input() extraVisitDates: Date[] = [];
  @Input() plannedVisitDates: Date[] = [];
  today = new Date();

  constructor(
    @Inject(MAT_DATE_FORMATS)  private _dateFormats: MatDateFormats,
    private _adapter: DateAdapter<Date>,
    private zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.extraVisitDates = [
      new Date(),
      new Date(2018,4,5),
      new Date(2018,4,18)
    ];

    this.plannedVisitDates = [
      new Date(2018,4,5)
    ];
  }

  ngOnInit() {

    this.calendar.stateChanges.subscribe(() => {
      setTimeout(() => {
        console.log('change', this.calendar.currentView);
        if (this.calendar.currentView === 'month') {
          setTimeout(() => this.addMonthVisits());
        }
        if (this.calendar.currentView === 'year') {
          setTimeout(() => this.addYearVisits());
        }
      })
    });
    this.calendar.selectedChange.subscribe(d => console.log('ddd'))
    this._changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    this.calendar.stateChanges.next();
    console.log(this.calendar.currentView);
  }

  ngAfterViewInit() {
    console.log(this.calendar._calendarHeaderPortal)
    this.addMonthVisits();
  }

  addMonthVisits() {
    const dates = this.getMonthsDates();
    dates.forEach(d => this.addPointsToDates(d));
  }

  addYearVisits() {

  }

  getYearMonths() {

  }

  getMonthsDates() {
    const DAYS_PER_WEEK = 7;
    const firstOfMonth = this._adapter.createDate(this._adapter.getYear(this.today), this._adapter.getMonth(this.today), 1);
    const firstWeekOffset = (DAYS_PER_WEEK + this._adapter.getDayOfWeek(firstOfMonth) - this._adapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
    const daysInMonth = this._adapter.getNumDaysInMonth(this.today);
    const dateNames = this._adapter.getDateNames();

    const dates = []
    for (let i = 0, cell = firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell == DAYS_PER_WEEK) {
        cell = 0;
      }
      const date = this._adapter.createDate(
            this._adapter.getYear(this.today),
            this._adapter.getMonth(this.today), i + 1);
      dates.push(date);
    }
    return dates;
  }

  addPointsToDates(date: Date) {
    const extraDatesTime = this.extraVisitDates.map(d => String(d.getTime()));
    const plannedDatesTime = this.plannedVisitDates.map(d => String(d.getTime()));

    const isExtra = extraDatesTime.includes(String(date.getTime()));
    const isPlanned = plannedDatesTime.includes(String(date.getTime()));

    const aria = this._adapter.format(date, this._dateFormats.display.dateA11yLabel);
    const el = document.querySelector(`[aria-label="${aria}"]`);

    if (isExtra && el) {
      el.querySelector('.mat-calendar-body-cell-content').classList.add('extra-visit');
    }
    if (isPlanned && el) {
      el.querySelector('.mat-calendar-body-cell-content').classList.add('planned-visit');
    }
  }

  addPointsToMonths(month) {
    const extraDatesTime = this.extraVisitDates.map(d => String(d.getTime()));
    const plannedDatesTime = this.plannedVisitDates.map(d => String(d.getTime()));

    //get current year and months from input dates
    const aria = this._adapter.format(this._adapter.createDate(this._adapter.getYear(this.today), month, 1), this._dateFormats.display.monthYearA11yLabel);
    const el = document.querySelector(`[aria-label="${aria}"]`);
  }
}
