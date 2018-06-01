import { Component, OnInit, ViewChild, Host, ChangeDetectorRef, Inject, EventEmitter, Optional, AfterViewInit, NgZone, OnChanges, Input, Renderer2, Renderer, ElementRef, OnDestroy, Output } from '@angular/core';
import { MatCalendar } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

const YEARS_PER_PAGE = 24;
const DAYS_PER_WEEK = 7;

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnDestroy, AfterViewInit, OnChanges {

  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Input() extraVisitDates: Date[] = [];
  @Input() plannedVisitDates: Date[] = [];
  @Output() selectedDate: EventEmitter<Date> = new EventEmitter();
  activeDate: Date;
  activeYearDate: Date;
  listenClickViewBtnFunc: Function;
  listenClickNextBtnFunc: Function;
  listenClickPrevBtnFunc: Function;

  constructor(
    @Inject(MAT_DATE_FORMATS)  private _dateFormats: MatDateFormats,
    private element: ElementRef,
    private renderer: Renderer,
    private _adapter: DateAdapter<Date>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.activeDate = this._adapter.today();
    this.activeYearDate = this._adapter.today();
  }

  ngOnChanges() {
    this.calendar.stateChanges.next();
  }

  ngAfterViewInit() {
    this.calendar.stateChanges.subscribe(() => setTimeout(() => this.checkCurrentView()));
    this.calendar.selectedChange.subscribe((d) => this.selectedDate.emit(d));
    const btn = this.element.nativeElement.querySelector('.mat-calendar-period-button');
    const btnPrev = this.element.nativeElement.querySelector('.mat-calendar-previous-button');
    const btnNext= this.element.nativeElement.querySelector('.mat-calendar-next-button');

    this.listenClickViewBtnFunc = this.renderer.listenGlobal(btn, 'click', (event: MouseEvent) => this.checkCurrentView());
    this.listenClickNextBtnFunc = this.renderer.listenGlobal(btnNext, 'click', (event: MouseEvent) => {
      if (this.calendar.currentView === 'multi-year') {
        this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, YEARS_PER_PAGE);
        this.getYears();
      }
      if (this.calendar.currentView === 'month') {
        this.activeDate = this._adapter.addCalendarMonths(this.activeDate, 1);
        this.getDates();
      }
    });
    this.listenClickPrevBtnFunc = this.renderer.listenGlobal(btnPrev, 'click', (event: MouseEvent) => {
      if (this.calendar.currentView === 'multi-year') {
        this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, -YEARS_PER_PAGE);
        this.getYears();
      }
      if (this.calendar.currentView === 'month') {
        this.activeDate = this._adapter.addCalendarMonths(this.activeDate, -1);
        this.getDates();
      }
    });
    this.checkCurrentView();
  }

  ngOnDestroy() {
    if (this.listenClickViewBtnFunc) {
      this.listenClickViewBtnFunc();
    }
    if (this.listenClickNextBtnFunc) {
      this.listenClickNextBtnFunc();
    }
    if (this.listenClickPrevBtnFunc) {
      this.listenClickPrevBtnFunc();
    }
    this.calendar.stateChanges.unsubscribe();
    this.calendar.selectedChange.unsubscribe();
  }

  checkCurrentView() {
    if (this.calendar.currentView === 'month') {
      setTimeout(() => this.getDates());
    }
    if (this.calendar.currentView === 'year') {
      setTimeout(() => this.getMonths());
    }
    if (this.calendar.currentView === 'multi-year') {
      setTimeout(() => this.getYears());
    }
  }

  getDates() {
    const dates = this.getMonthsDates();
    dates.forEach(d => this.addPointsToDates(d));
  }

  getMonths() {
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    months.forEach(m => this.addPointsToMonths(m));
  }

  getYears() {
    const years = []
    const activeYear = this._adapter.getYear(this.activeYearDate);
    const activeOffset = activeYear % YEARS_PER_PAGE;

    for (let i = 0; i < YEARS_PER_PAGE; i++) {
      years.push(activeYear - activeOffset + i);
    }
    years.forEach(y => this.addPointsToYears(y));
  }

  getMonthsDates() {
    const firstOfMonth = this._adapter.createDate(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), 1);
    const firstWeekOffset = (DAYS_PER_WEEK + this._adapter.getDayOfWeek(firstOfMonth) - this._adapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
    const daysInMonth = this._adapter.getNumDaysInMonth(this.activeDate);

    const dates = []
    for (let i = 0, cell = firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell == DAYS_PER_WEEK) {
        cell = 0;
      }
      const date = this._adapter.createDate(
            this._adapter.getYear(this.activeDate),
            this._adapter.getMonth(this.activeDate), i + 1);
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

    this.addPoints(isPlanned, isExtra, aria);
  }

  addPointsToMonths(month: number) {
    const extraDatesTime = this.extraVisitDates.map(d => this._adapter.getMonth(d));
    const plannedDatesTime = this.plannedVisitDates.map(d => this._adapter.getMonth(d));

    const isExtra = extraDatesTime.includes(month);
    const isPlanned = plannedDatesTime.includes(month);

    const aria = this._adapter.format(this._adapter.createDate(this._adapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);

    this.addPoints(isPlanned, isExtra, aria);
  }

  addPointsToYears(year: number) {
    const extraDatesTime = this.extraVisitDates.map(d => this._adapter.getYear(d));
    const plannedDatesTime = this.plannedVisitDates.map(d => this._adapter.getYear(d));

    const isExtra = extraDatesTime.includes(year);
    const isPlanned = plannedDatesTime.includes(year);

    this.addPoints(isPlanned, isExtra, String(year));
  }

  addPoints(isPlanned: boolean, isExtra: boolean, aria: string) {
    const el = document.querySelector(`[aria-label="${aria}"]`);

    if (this.calendar.currentView === 'month') {
      if (isExtra && el) {
        el.querySelector('.mat-calendar-body-cell-content').classList.add('extra-point');
      }
      if (isPlanned && el) {
        el.querySelector('.mat-calendar-body-cell-content').classList.add('planned-point');
      }
    } else {
      if (el && (isExtra || isPlanned)) {
        el.querySelector('.mat-calendar-body-cell-content').classList.add('info-point');
      }
    }
  }
}
