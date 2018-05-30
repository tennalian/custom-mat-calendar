import { Component } from '@angular/core';
import { MatCalendar, MatCalendarBody, MatMonthView, MatCalendarHeader } from '@angular/material';
import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  date: Date;

  update(date) {
    console.log(date);
  }
}
