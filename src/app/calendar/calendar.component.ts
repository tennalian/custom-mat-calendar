import { Component, OnInit, ViewChild, Host, ChangeDetectorRef, Inject, EventEmitter, Optional, AfterViewInit, NgZone, OnChanges, Input, Renderer2, Renderer, ElementRef, OnDestroy, Output } from '@angular/core';
import { MatCalendar } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

const YEARS_PER_PAGE = 24;
const DAYS_PER_WEEK = 7;

export class CustomDateAdapter extends NativeDateAdapter {
  private localeData = moment.localeData('ru-RU');

  getFirstDayOfWeek(): number {
    return 1;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
        return this.localeData.weekdays();
      case 'short':
        return this.localeData.weekdaysShort();
      case 'narrow':
        return this.localeData.weekdaysShort();
    }
  }
}

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class CalendarComponent implements OnDestroy, AfterViewInit, OnChanges {

  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  @Input() extraVisitDates: Date[] = [];
  @Input() plannedVisitDates: Date[] = [];
  @Input() header:any = null;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() dateFilter: Function;
  @Output() selectedDate: EventEmitter<Date> = new EventEmitter();
  today: Date;
  tmpActiveDate: Date;
  activeDate: Date;
  activeYearDate: Date;
  listenClickViewBtnFunc: Function;
  listenClickNextBtnFunc: Function;
  listenClickPrevBtnFunc: Function;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DATE_FORMATS)  private _dateFormats: MatDateFormats,
    private element: ElementRef,
    private renderer: Renderer,
    private _adapter: DateAdapter<Date>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.today = this._adapter.today();
    this.activeDate = this._adapter.today();
    this.activeYearDate = this._adapter.today();
    this.tmpActiveDate = this.activeDate;
  }

  ngOnChanges() {
    this.calendar.stateChanges.next();
  }

  ngAfterViewInit() {
    this.subscriptions = [
      this.calendar.stateChanges.subscribe(() => setTimeout(() => this.checkCurrentView())),
      this.calendar.selectedChange.subscribe((d) => this.selectedDate.emit(d)),
      this.calendar.monthSelected.subscribe((m) => {
        this.activeDate = m;
        this.tmpActiveDate = this.activeDate;
      }),
      this.calendar.yearSelected.subscribe((y) => {
        this.activeDate = y;
        this.activeYearDate = y;
      })
    ];

    let btn = null;
    let btnPrev = null;
    let btnNext = null;
    if (!this.header) {
      btn = this.element.nativeElement.querySelector('.mat-calendar-period-button');
      btnPrev = this.element.nativeElement.querySelector('.mat-calendar-previous-button');
      btnNext= this.element.nativeElement.querySelector('.mat-calendar-next-button');
    } else {
      btnPrev = this.element.nativeElement.querySelector('.calendar-previous-button');
      btnNext= this.element.nativeElement.querySelector('.calendar-next-button');
    }

    if (btn) {
      this.listenClickViewBtnFunc = this.renderer.listenGlobal(btn, 'click', (event: MouseEvent) => {
        if (this.calendar.currentView === 'month') {
          const date = this._adapter.getMonth(this.tmpActiveDate);
          const month = this._adapter.getMonth(this.tmpActiveDate);
          const year = this._adapter.getYear(this.activeYearDate);
          const activeDate = new Date(year, month, date);
          this.activeDate = activeDate;
        }
        this.checkCurrentView();
      });
    }

    if (btnNext) {
      this.listenClickNextBtnFunc = this.renderer.listenGlobal(btnNext, 'click', (event: MouseEvent) => {
        if (this.calendar.currentView === 'multi-year') {
          this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, YEARS_PER_PAGE);
          this.getYears();
        }
        if (this.calendar.currentView === 'year') {
          this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, 1);
          this.getMonths();
        }
        if (this.calendar.currentView === 'month') {
          this.activeDate = this._adapter.addCalendarMonths(this.activeDate, 1);
          this.tmpActiveDate = this.activeDate;
          this.getDates();
        }
      });
    }

    if (btnPrev) {
      this.listenClickPrevBtnFunc = this.renderer.listenGlobal(btnPrev, 'click', (event: MouseEvent) => {
        if (this.calendar.currentView === 'multi-year') {
          this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, -YEARS_PER_PAGE);
          this.getYears();
        }
        if (this.calendar.currentView === 'year') {
          this.activeYearDate = this._adapter.addCalendarYears(this.activeYearDate, -1);
          this.getMonths();
        }
        if (this.calendar.currentView === 'month') {
          this.activeDate = this._adapter.addCalendarMonths(this.activeDate, -1);
          this.tmpActiveDate = this.activeDate;
          this.getDates();
        }
      });
    }
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

    this.subscriptions.map(s => s.unsubscribe());
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

    if (isExtra || isPlanned) {
      this.addPoint(isPlanned, isExtra, aria);
    }
  }

  addPointsToMonths(month: number) {
    const extraAliases = this.extraVisitDates.map(d => {
      const m = this._adapter.getMonth(d);
      return this._adapter.format(this._adapter.createDate(this._adapter.getYear(d), m, 1), this._dateFormats.display.monthYearA11yLabel);
    });
    const plannedAliases = this.plannedVisitDates.map(d => {
      const m = this._adapter.getMonth(d);
      return this._adapter.format(this._adapter.createDate(this._adapter.getYear(d), m, 1), this._dateFormats.display.monthYearA11yLabel);
    });
    const aria = this._adapter.format(this._adapter.createDate(this._adapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
    const isExtra = extraAliases.includes(aria);
    const isPlanned = plannedAliases.includes(aria);

    if (isExtra || isPlanned) {
      setTimeout(() => this.addPoint(isPlanned, isExtra, aria));
    }
  }

  addPointsToYears(year: number) {
    const extraDatesTime = this.extraVisitDates.map(d => this._adapter.getYear(d));
    const plannedDatesTime = this.plannedVisitDates.map(d => this._adapter.getYear(d));
    const isExtra = extraDatesTime.includes(year);
    const isPlanned = plannedDatesTime.includes(year);

    if (isExtra || isPlanned) {
      this.addPoint(isPlanned, isExtra, String(year));
    }
  }

  removeAllPoints() {
    const els = this.element.nativeElement.querySelectorAll('[aria-label]');
    els.forEach(element => {
      const point = element.querySelector('.mat-calendar-body-cell-content');
      if (point) {
        point.classList.remove('extra-point');
        point.classList.remove('planned-point');
        point.classList.remove('info-point');
      }
    });
  }

  addPoint(isPlanned: boolean, isExtra: boolean, aria: string) {
    const el = this.element.nativeElement.querySelector(`[aria-label="${aria}"]`);
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
