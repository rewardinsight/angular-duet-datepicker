import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DuetLocalizedText } from '../date-localization';
import { OnDaySelectEvent, OnKeyboardNavigationEvent } from '../date-picker-day/date-picker-day.component';
import { DateUtilitiesService, DaysOfWeek } from '../services/date-utilities.service';

export type DateDisabledPredicate = (date: Date) => boolean

@Component({
  selector: 'rwd-date-picker-month',
  templateUrl: './date-picker-month.component.html',
  styleUrls: ['./date-picker-month.component.scss'],
})
export class DatePickerMonthComponent implements OnInit {

  @Input() selectedDate: Date = new Date();
  @Input() focusedDate: Date = new Date();
  @Input() labelledById: string = '';
  @Input() localization?: DuetLocalizedText;
  @Input() firstDayOfWeek?: DaysOfWeek;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() dateFormatter?: Intl.DateTimeFormat;
  @Input() isDateDisabled: DateDisabledPredicate = () => false;

  @Output() onDaySelect = new EventEmitter<OnDaySelectEvent>();
  @Output() onKeyboardNavigation = new EventEmitter<OnKeyboardNavigationEvent>();

  // public days: Date[] = this.dateUtilitiesService.getViewOfMonth(this.focusedDate, this.firstDayOfWeek);
  public today = new Date()

  constructor(public dateUtilitiesService: DateUtilitiesService) {}

  ngOnInit(): void {}

  chunk(array: Date[], chunkSize: number): Date[][] {
    const result = []

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }

    return result
  }

  handleOnDaySelectEvent(e: OnDaySelectEvent) {
    this.onDaySelect.emit(e);
  }

  handleOnKeyboardNavigation(e: OnKeyboardNavigationEvent) {
    this.onKeyboardNavigation.emit(e);
  }

  get days() {
    return this.dateUtilitiesService.getViewOfMonth(this.focusedDate, this.firstDayOfWeek);
  }
}
