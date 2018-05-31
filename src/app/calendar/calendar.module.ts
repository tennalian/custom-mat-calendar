import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatMonthView } from '@angular/material';

import { CalendarComponent } from './calendar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
  ],
  exports: [
    CalendarComponent
  ],
  declarations: [
    CalendarComponent
  ],
})
export class CalendarModule { }
