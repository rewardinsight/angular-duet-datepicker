import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DuetLocalizedText } from '../date-localization';
import { OnDaySelectEvent } from '../date-picker-day/date-picker-day.component';
import { DateUtilitiesService, DaysOfWeek } from '../services/date-utilities.service';

export type DateDisabledPredicate = (date: Date) => boolean

@Component({
  selector: 'rwd-date-picker-month',
  templateUrl: './date-picker-month.component.html',
  styleUrls: ['./date-picker-month.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerMonthComponent),
      multi: true,
    }
  ],
})
export class DatePickerMonthComponent implements OnInit, AfterContentInit, ControlValueAccessor {

  @Input() selectedDate?: Date;
  @Input() labelledById: string = '';
  @Input() localization?: DuetLocalizedText;
  @Input() firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() dateFormatter?: Intl.DateTimeFormat;
  @Input() isDateDisabled: DateDisabledPredicate = () => false;

  private _focusedDate: Date = new Date();

  @Input() set focusedDate(value: Date) {
    this._focusedDate = value;
    this.days = this.getViewOfMonth();
    this.weeks = this.chunk(this.days, 7);
  }

  get focusedDate() {
    return this._focusedDate;
  }

  @Output() onDaySelect = new EventEmitter<OnDaySelectEvent>();

  public today = new Date()

  constructor(public dateUtilitiesService: DateUtilitiesService) {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(obj: any): void {
    this.selectedDate = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  days?: Date[];
  weeks?: Date[][];

  ngAfterContentInit(): void {

  }

  ngOnInit(): void {
    this.days = this.getViewOfMonth();
    this.weeks = this.chunk(this.days, 7);
  }

  getViewOfMonth() {
    if (this.firstDayOfWeek == undefined) {
      throw new Error("First day of week undefined");
    }

    let days = this.dateUtilitiesService.getViewOfMonth(this.focusedDate, this.firstDayOfWeek);
    return days;
  }

  chunk(array: Date[], chunkSize: number): Date[][] {
    const result = []

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }

    return result
  }

  handleOnDaySelectEvent(e: OnDaySelectEvent) {
    this.onChange(e.day);
    this.onDaySelect.emit(e);
  }
}
