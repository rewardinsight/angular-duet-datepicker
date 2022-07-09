import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularDuetDatepickerComponent } from './angular-duet-datepicker/angular-duet-datepicker.component';
import { DatePickerDayComponent } from './date-picker-day/date-picker-day.component';
import { DatePickerInputComponent } from './date-picker-input/date-picker-input.component';
import { DatePickerMonthComponent } from './date-picker-month/date-picker-month.component';

@NgModule({
  declarations: [
    DatePickerDayComponent,
    DatePickerMonthComponent,
    DatePickerInputComponent,
    AngularDuetDatepickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AngularDuetDatepickerComponent
  ]
})
export class AngularDuetDatepickerModule { }
