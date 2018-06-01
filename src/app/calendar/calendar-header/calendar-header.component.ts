import { MatCalendar, MatDateFormats, MAT_DATE_FORMATS, DateAdapter, MatDatepickerIntl } from "@angular/material";
import { Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, forwardRef } from "@angular/core";

const YEARS_PER_PAGE = 24;

@Component({
  selector: 'header',
  templateUrl: './calendar-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomHeader<Date> {
  label: string;
  constructor(
    private _intl: MatDatepickerIntl,
    @Inject(forwardRef(() => MatCalendar)) public calendar: MatCalendar<Date>,
    @Optional() private _dateAdapter: DateAdapter<Date>,
    @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
    this.label = this.getLabel();
  }

  get prevButtonLabel(): string {
    return this._intl.prevMonthLabel
  }

  get nextButtonLabel(): string {
    return this._intl.nextMonthLabel
  }

  getLabel() {
    return this._dateAdapter.format(
      this._dateAdapter.createDate(this._dateAdapter.getYear(this.calendar.activeDate), this._dateAdapter.getMonth(this.calendar.activeDate), 1),
      this._dateFormats.display.monthYearA11yLabel);
  }

  previousClicked(): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1)
    this.label = this.getLabel();
  }

  nextClicked(): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1)
    this.label = this.getLabel();
  }

  previousEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
        !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
  }

  nextEnabled(): boolean {
    return !this.calendar.maxDate ||
        !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
  }

  private _isSameView(date1: Date, date2: Date): boolean {
    return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
      this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
  }
}
