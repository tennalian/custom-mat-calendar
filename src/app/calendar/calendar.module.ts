import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatMonthView } from '@angular/material';

import { CalendarComponent } from './calendar.component';
import { CustomHeader } from './calendar-header/calendar-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  exports: [
    CalendarComponent
  ],
  declarations: [
    CalendarComponent,
    CustomHeader
  ],
  entryComponents: [
    CustomHeader
  ]
})
export class CalendarModule { }
