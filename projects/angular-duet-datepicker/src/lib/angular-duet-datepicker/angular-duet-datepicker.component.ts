import {
  Component,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import isoAdapter, { DuetDateAdapter } from '../date-adapter';
import defaultLocalization, { DuetLocalizedText } from '../date-localization';
import { OnDaySelectEvent } from '../date-picker-day/date-picker-day.component';
import { SeperatorLocation } from '../date-picker-input/date-picker-input.component';
import { DuetDatePickerDirection, keyCode } from '../datepicker-types';
import {
  DateUtilitiesService,
  DaysOfWeek,
} from '../services/date-utilities.service';

@Component({
  selector: 'rwd-angular-duet-datepicker',
  templateUrl: './angular-duet-datepicker.component.html',
  styleUrls: ['./angular-duet-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularDuetDatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AngularDuetDatepickerComponent,
      multi: true
    }
  ],
})
export class AngularDuetDatepickerComponent implements OnInit, ControlValueAccessor, Validator {

  constructor(private dateUtilitiesService: DateUtilitiesService) {}

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    let validationErrors: ValidationErrors = [];

    if(this.required && this.selectedDay == undefined) {
      validationErrors['push']({"DateRequiredError": "Date is required"});
      return validationErrors;
    }

    if (this.minDate != undefined && this.selectedDay != undefined) {
      if (this.selectedDay < this.minDate) {
        validationErrors['push']({"MinDateError": "Selected date is less than the minimum date"});
      }
    }

    if (this.maxDate != undefined && this.selectedDay != undefined) {
      if (this.selectedDay > this.maxDate) {
        validationErrors['push']({"MaxDateError": "Selected date is greater than the maximum date"});
      }
    }

    return validationErrors;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(obj: any): void {
    this.selectedDay = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @Input() name: string = 'date';
  @Input() identifier: string = '';
  @Input() disabled: boolean = false;
  @Input() role?: string;
  @Input() direction: DuetDatePickerDirection = 'right';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Input() min: string = '1900-01-01';
  @Input() max: string = '2099-12-30';
  @Input() maxInputLength = 99;
  @Input() firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
  @Input() localization: DuetLocalizedText = defaultLocalization;
  @Input() dateAdapter: DuetDateAdapter = isoAdapter;
  @Input() seperatorLocations: SeperatorLocation[] = [];
  @Input() showNumericKeypadOnMobile: boolean = false;
  @Input() hideCalendarFromScreenreader = false;
  @Input() preventPaste = false;

  public dateFormatShort?: Intl.DateTimeFormat;
  public dateFormatLong?: Intl.DateTimeFormat;

  public dateInput = '';
  public selectedDay?: any;
  public focusedDay = new Date();
  public dialogOpen = false;

  public monthSelectId =
    this.dateUtilitiesService.createIdentifier('DuetDateMonth');
  public yearSelectId =
    this.dateUtilitiesService.createIdentifier('DuetDateYear');
  public dialogLabelId =
    this.dateUtilitiesService.createIdentifier('DuetDateLabel');

  public valueAsDate?: Date;
  public formattedDate?: string;
  public selectedYear?: number;
  public focusedMonth: number = 0;
  public focusedYear: number = 1900;
  public minDate?: Date;
  public maxDate?: Date;
  public prevMonthDisabled?: boolean;
  public nextMonthDisabled?: boolean;
  public minYear?: number;
  public maxYear?: number;


  ngOnInit(): void {
    this.createDateFormatters();

    let today = new Date();

    this.minDate = this.dateUtilitiesService.parseISODate(this.min);

    if (this.max == '') {
      this.maxDate = new Date();
    } else {
      this.maxDate = this.dateUtilitiesService.parseISODate(this.max);
    }

    if (this.maxDate == undefined) {
      throw Error('Max Date undefined');
    }

    if (this.value != '') {
      this.valueAsDate = this.dateUtilitiesService.parseISODate(this.value);

      if (!this.valueAsDate) {
        throw new Error('Value as date invalid');
      }

      this.focusedDay = this.valueAsDate;

      if (this.valueAsDate && this.valueAsDate > this.maxDate) {
        throw new Error('Supplied date greater than maximum date');
      }
    } else {
      if (this.maxDate < today) {
        this.focusedDay = this.maxDate;
      } else {
        this.focusedDay = today;
      }
    }

    if (this.valueAsDate == undefined) {
      this.formattedDate = '';
    } else {
      this.formattedDate =
        this.valueAsDate && this.dateAdapter.format(this.valueAsDate);
    }

    this.selectedYear = (this.valueAsDate || this.focusedDay).getFullYear();

    this.focusedMonth = this.focusedDay.getMonth();
    this.focusedYear = this.focusedDay.getFullYear();

    this.prevMonthDisabled =
      this.minDate != null &&
      this.minDate.getMonth() === this.focusedMonth &&
      this.minDate.getFullYear() === this.focusedYear;

    this.nextMonthDisabled =
      this.maxDate != null &&
      this.maxDate.getMonth() === this.focusedMonth &&
      this.maxDate.getFullYear() === this.focusedYear;

    this.minYear = this.minDate
      ? this.minDate.getFullYear()
      : this.selectedYear - 10;
    this.maxYear = this.maxDate
      ? this.maxDate.getFullYear()
      : this.selectedYear + 10;
  }

  createDateFormatters() {
    this.dateFormatShort = new Intl.DateTimeFormat(this.localization.locale, {
      day: 'numeric',
      month: 'long',
    });
    this.dateFormatLong = new Intl.DateTimeFormat(this.localization.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  toggleDialog() {
    this.dialogOpen = !this.dialogOpen;

    if (!this.dialogOpen && this.selectedDay != undefined) {
      this.setFocusedDay(this.selectedDay);
    }
  }

  setMonth(month: number) {
    const min = this.dateUtilitiesService.setMonth(
      this.dateUtilitiesService.startOfMonth(this.focusedDay),
      month
    );
    const max = this.dateUtilitiesService.endOfMonth(min);
    const date = this.dateUtilitiesService.setMonth(this.focusedDay, month);

    this.setFocusedDay(this.dateUtilitiesService.clamp(date, min, max));
  }

  setYear(year: number) {
    const min = this.dateUtilitiesService.setYear(
      this.dateUtilitiesService.startOfMonth(this.focusedDay),
      year
    );
    const max = this.dateUtilitiesService.endOfMonth(min);
    const date = this.dateUtilitiesService.setYear(this.focusedDay, year);

    this.setFocusedDay(this.dateUtilitiesService.clamp(date, min, max));
  }

  setFocusedDay(day: Date) {
    this.focusedDay = this.dateUtilitiesService.clamp(
      day,
      this.dateUtilitiesService.parseISODate(this.min),
      this.dateUtilitiesService.parseISODate(this.max)
    );

    this.focusedMonth = this.focusedDay.getMonth();
    this.focusedYear = this.focusedDay.getFullYear();

    this.prevMonthDisabled =
      this.minDate != null &&
      this.minDate.getMonth() === this.focusedMonth &&
      this.minDate.getFullYear() === this.focusedYear;

    this.nextMonthDisabled =
      this.maxDate != null &&
      this.maxDate.getMonth() === this.focusedMonth &&
      this.maxDate.getFullYear() === this.focusedYear;
  }

  handleMonthSelect = (e: any) => {
    this.setMonth(parseInt(e.target.value, 10));
  };

  handleYearSelect = (e: any) => {
    this.setYear(parseInt(e.target.value, 10));
  };

  isMonthDisabled(i: number): boolean {
    if (!this.focusedYear) {
      return true;
    }

    const date = new Date(this.focusedYear, i, 1);
    const minDate = this.minDate
      ? this.dateUtilitiesService.startOfMonth(this.minDate)
      : undefined;
    const maxDate = this.maxDate
      ? this.dateUtilitiesService.endOfMonth(this.maxDate)
      : undefined;

    return !this.dateUtilitiesService.inRange(date, minDate, maxDate);
  }

  range(from?: number, to?: number) {
    if (from == undefined || to == undefined) {
      throw new Error('From or To Undefined');
    }

    var result: number[] = [];
    for (var i = from; i <= to; i++) {
      result.push(i);
    }
    return result;
  }

  handleNextMonthClick = (event: any) => {
    event.preventDefault();
    this.addMonths(1);
  };

  handlePreviousMonthClick = (event: any) => {
    event.preventDefault();
    this.addMonths(-1);
  };

  addMonths(months: number) {
    this.setMonth(this.focusedDay.getMonth() + months);
  }

  handleDaySelect = (e: OnDaySelectEvent) => {
    this.toggleDialog();
    this.dateInput = this.dateAdapter.format(this.selectedDay);
    this.setFocusedDay(this.selectedDay);

    this.onChange(this.selectedDay);
  };

  addDays(days: number) {
    this.setFocusedDay(
      this.dateUtilitiesService.addDays(this.focusedDay, days)
    );
  }

  addYears(years: number) {
    this.setYear(this.focusedDay.getFullYear() + years);
  }

  startOfWeek() {
    this.setFocusedDay(
      this.dateUtilitiesService.startOfWeek(
        this.focusedDay,
        this.firstDayOfWeek
      )
    );
  }

  endOfWeek() {
    this.setFocusedDay(
      this.dateUtilitiesService.endOfWeek(this.focusedDay, this.firstDayOfWeek)
    );
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardNavigation = (event: KeyboardEvent) => {
    if (!this.dialogOpen) {
      return;
    }

    var handled = true;

    switch (event.keyCode) {
      case keyCode.PAGE_UP:
        if (event.shiftKey) {
          this.addYears(-1);
        } else {
          this.addMonths(-1);
        }
        break;
      case keyCode.PAGE_DOWN:
        if (event.shiftKey) {
          this.addYears(1);
        } else {
          this.addMonths(1);
        }
        break;
      case keyCode.HOME:
        this.startOfWeek();
        break;
      case keyCode.END:
        this.endOfWeek();
        break;
      case keyCode.ESC:
        this.toggleDialog();
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const dialogWrapper = document.getElementById('dialog-wrapper') as any;
    const datePickerButton = document.getElementById('date-picker-button') as any;

    if (!this.dialogOpen) {
      return
    }

    const isClickOutside = !event.composedPath().includes(dialogWrapper) && !event.composedPath().includes(datePickerButton);

    if (isClickOutside) {
      this.toggleDialog();
    }
  }

  handleInputChange() {

    const parsed = this.dateAdapter.parse(this.dateInput, this.dateUtilitiesService.createDate);

    this.selectedDay = parsed;
    this.onChange(this.selectedDay);

    if (parsed != undefined) {
      this.setFocusedDay(parsed);
    }
  }

  inputTouched() {
    this.onTouched();
  }
}
