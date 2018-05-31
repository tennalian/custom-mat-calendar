// **
//  * @license
//  * Copyright Google LLC All Rights Reserved.
//  *
//  * Use of this source code is governed by an MIT-style license that can be
//  * found in the LICENSE file at https://angular.io/license
//  */

// import {ComponentPortal, ComponentType, Portal} from '@angular/cdk/portal';
// import {
//   AfterContentInit,
//   AfterViewChecked,
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   EventEmitter,
//   forwardRef,
//   Inject,
//   Input,
//   OnChanges,
//   OnDestroy,
//   Optional,
//   Output,
//   SimpleChanges,
//   ViewChild,
//   ViewEncapsulation,
// } from '@angular/core';
// import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
// import {Subject, Subscription} from 'rxjs';
// import {createMissingDateImplError} from './datepicker-errors';
// import {MatDatepickerIntl} from './datepicker-intl';
// import {MatMonthView} from './month-view';
// import {MatMultiYearView, yearsPerPage} from './multi-year-view';
// import {MatYearView} from './year-view';

// /**
//  * Possible views for the calendar.
//  * @docs-private
//  */
// export type MatCalendarView = 'month' | 'year' | 'multi-year';

// /** Default header for MatCalendar */
// @Component({
//   moduleId: module.id,
//   selector: 'mat-calendar-header',
//   templateUrl: 'calendar-header.html',
//   exportAs: 'matCalendarHeader',
//   encapsulation: ViewEncapsulation.None,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class MatCalendarHeader<D> {
//   constructor(private _intl: MatDatepickerIntl,
//               @Inject(forwardRef(() => MatCalendar)) public calendar: MatCalendar<D>,
//               @Optional() private _dateAdapter: DateAdapter<D>,
//               @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
//               changeDetectorRef: ChangeDetectorRef) {

//     this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
//   }

//   /** The label for the current calendar view. */
//   get periodButtonText(): string {
//     if (this.calendar.currentView == 'month') {
//       return this._dateAdapter
//           .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
//               .toLocaleUpperCase();
//     }
//     if (this.calendar.currentView == 'year') {
//       return this._dateAdapter.getYearName(this.calendar.activeDate);
//     }
//     const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
//     const firstYearInView = this._dateAdapter.getYearName(
//         this._dateAdapter.createDate(activeYear - activeYear % 24, 0, 1));
//     const lastYearInView = this._dateAdapter.getYearName(
//         this._dateAdapter.createDate(activeYear + yearsPerPage - 1 - activeYear % 24, 0, 1));
//     return `${firstYearInView} \u2013 ${lastYearInView}`;
//   }

//   get periodButtonLabel(): string {
//     return this.calendar.currentView == 'month' ?
//         this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
//   }

//   /** The label for the the previous button. */
//   get prevButtonLabel(): string {
//     return {
//       'month': this._intl.prevMonthLabel,
//       'year': this._intl.prevYearLabel,
//       'multi-year': this._intl.prevMultiYearLabel
//     }[this.calendar.currentView];
//   }

//   /** The label for the the next button. */
//   get nextButtonLabel(): string {
//     return {
//       'month': this._intl.nextMonthLabel,
//       'year': this._intl.nextYearLabel,
//       'multi-year': this._intl.nextMultiYearLabel
//     }[this.calendar.currentView];
//   }

//   /** Handles user clicks on the period label. */
//   currentPeriodClicked(): void {
//     this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
//   }

//   /** Handles user clicks on the previous button. */
//   previousClicked(): void {
//     this.calendar.activeDate = this.calendar.currentView == 'month' ?
//         this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
//             this._dateAdapter.addCalendarYears(
//                 this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage
//             );
//   }

//   /** Handles user clicks on the next button. */
//   nextClicked(): void {
//     this.calendar.activeDate = this.calendar.currentView == 'month' ?
//         this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
//             this._dateAdapter.addCalendarYears(
//                 this.calendar.activeDate,
//                     this.calendar.currentView == 'year' ? 1 : yearsPerPage
//             );
//   }

//   /** Whether the previous period button is enabled. */
//   previousEnabled(): boolean {
//     if (!this.calendar.minDate) {
//       return true;
//     }
//     return !this.calendar.minDate ||
//         !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
//   }

//   /** Whether the next period button is enabled. */
//   nextEnabled(): boolean {
//     return !this.calendar.maxDate ||
//         !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
//   }

//   /** Whether the two dates represent the same view in the current view mode (month or year). */
//   private _isSameView(date1: D, date2: D): boolean {
//     if (this.calendar.currentView == 'month') {
//       return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
//           this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
//     }
//     if (this.calendar.currentView == 'year') {
//       return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
//     }
//     // Otherwise we are in 'multi-year' view.
//     return Math.floor(this._dateAdapter.getYear(date1) / yearsPerPage) ==
//         Math.floor(this._dateAdapter.getYear(date2) / yearsPerPage);
//   }
// }