import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCalendar, MatCalendarBody, MatMonthView, MatCalendarHeader } from '@angular/material';
import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';

import { CustomHeader } from './calendar/calendar-header/calendar-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MAT-CALENDAR CUSTOMIZATION';
  header = CustomHeader;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  //don't set date as new Date(), because it sets time other than 00:00:00
  extraVisitDates = [
    new Date(2018,5,3),
    new Date(2018,4,5),
    new Date(2018,4,18)
  ];

  plannedVisitDates = [
    new Date(2018,4,5)
  ];

  updateDate(date) {
    this.extraVisitDates = [...this.extraVisitDates, date];
    this._changeDetectorRef.markForCheck();
  }
}
