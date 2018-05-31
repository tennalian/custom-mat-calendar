import { Component } from '@angular/core';
import { MatCalendar, MatCalendarBody, MatMonthView, MatCalendarHeader } from '@angular/material';
import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MAT CALENDAR CUSTOMIZATION';

  extraVisitDates = [
    new Date(),
    new Date(2018,4,5),
    new Date(2018,4,18)
  ];

  plannedVisitDates = [
    new Date(2018,4,5)
  ];

  updateDate(date) {
    this.extraVisitDates = [...this.extraVisitDates, date];
  }
}
