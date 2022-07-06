import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import defaultLocalization, { DuetLocalizedText } from '../date-localization';
import {
  DateUtilitiesService,
  DaysOfWeek,
} from '../services/date-utilities.service';
import isoAdapter, { DuetDateAdapter } from '../date-adapter';
import {
  OnClickEvent,
  OnFocusEvent,
  OnInputEvent,
} from '../date-picker-input/date-picker-input.component';
import {
  OnDaySelectEvent,
  OnKeyboardNavigationEvent,
} from '../date-picker-day/date-picker-day.component';

const keyCode = {
  TAB: 9,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export type DuetDatePickerChangeEvent = {
  component: 'duet-date-picker';
  valueAsDate: Date;
  value: string;
};
export type DuetDatePickerFocusEvent = {
  component: 'duet-date-picker';
};
export type DuetDatePickerOpenEvent = {
  component: 'duet-date-picker';
};
export type DuetDatePickerCloseEvent = {
  component: 'duet-date-picker';
};
export type DuetDatePickerDirection = 'left' | 'right';

const DISALLOWED_CHARACTERS = /[^0-9\.\/\-]+/g;
const TRANSITION_MS = 300;

export type DateDisabledPredicate = (date: Date) => boolean;

@Component({
  selector: 'rwd-angular-duet-datepicker',
  templateUrl: './angular-duet-datepicker.component.html',
  styleUrls: ['./angular-duet-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AngularDuetDatepickerComponent implements OnInit {
  public activeFocus = false;
  public focusedDay = new Date();
  public open = false;

  public dateFormatShort?: Intl.DateTimeFormat;
  public dateFormatLong?: Intl.DateTimeFormat;

  get valueAsDate() {
    return this.dateUtilitiesService.parseISODate(this.value) ?? new Date();
  }

  get formattedDate() {
    return this.valueAsDate && this.dateAdapter.format(this.valueAsDate);
  }

  get selectedYear() {
    return (this.valueAsDate || this.focusedDay).getFullYear();
  }

  get focusedMonth() {
    return this.focusedDay.getMonth();
  }

  get focusedYear() {
    return this.focusedDay.getFullYear();
  }

  get minDate() {
    return this.dateUtilitiesService.parseISODate(this.min);
  }

  get maxDate() {
    return this.dateUtilitiesService.parseISODate(this.max);
  }

  get prevMonthDisabled() {
    return (
      this.minDate != null &&
      this.minDate.getMonth() === this.focusedMonth &&
      this.minDate.getFullYear() === this.focusedYear
    );
  }

  get nextMonthDisabled() {
    return (
      this.maxDate != null &&
      this.maxDate.getMonth() === this.focusedMonth &&
      this.maxDate.getFullYear() === this.focusedYear
    );
  }

  get minYear() {
    return this.minDate ? this.minDate.getFullYear() : this.selectedYear - 10;
  }

  get maxYear() {
    return this.maxDate ? this.maxDate.getFullYear() : this.selectedYear + 10;
  }

  @Input() name: string = 'date';
  @Input() identifier: string = '';
  @Input() disabled: boolean = false;
  @Input() role?: string;
  @Input() direction: DuetDatePickerDirection = 'right';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Input() min: string = '';
  @Input() max: string = '';
  @Input() firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
  @Input() localization: DuetLocalizedText = defaultLocalization;
  @Input() dateAdapter: DuetDateAdapter = isoAdapter;

  @Output() duetChange = new EventEmitter<DuetDatePickerChangeEvent>();
  @Output() duetBlur = new EventEmitter<DuetDatePickerFocusEvent>();
  @Output() duetFocus = new EventEmitter<DuetDatePickerFocusEvent>();
  @Output() duetOpen = new EventEmitter<DuetDatePickerOpenEvent>();
  @Output() duetClose = new EventEmitter<DuetDatePickerCloseEvent>();

  public initialTouchX: number = -1;
  public initialTouchY: number = -1;

  public monthSelectId =
    this.dateUtilitiesService.createIdentifier('DuetDateMonth');
  public yearSelectId =
    this.dateUtilitiesService.createIdentifier('DuetDateYear');
  public dialogLabelId =
    this.dateUtilitiesService.createIdentifier('DuetDateLabel');

  @ViewChild('dialog-wrapper') dialogWrapper:
    | ElementRef<HTMLElement>
    | undefined;

  constructor(public dateUtilitiesService: DateUtilitiesService) {}

  ngOnInit(): void {}

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

  range(from: number, to: number) {
    var result: number[] = [];
    for (var i = from; i <= to; i++) {
      result.push(i);
    }
    return result;
  }

  cleanValue(input: HTMLInputElement, regex: RegExp): string {
    const value = input.value;
    const cursor = input.selectionStart ?? undefined;

    const beforeCursor = value.slice(0, cursor);
    const afterCursor = value.slice(cursor, value.length);

    const filteredBeforeCursor = beforeCursor.replace(regex, '');
    const filterAfterCursor = afterCursor.replace(regex, '');

    const newValue = filteredBeforeCursor + filterAfterCursor;
    const newCursor = filteredBeforeCursor.length;

    input.value = newValue;
    input.selectionStart = input.selectionEnd = newCursor;

    return newValue;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {

    const dialogWrapper = document.getElementById('dialog-wrapper') as any;
    const datePickerButton = document.getElementById('date-picker-button') as any;

    if (!this.open) {
      return
    }

    const isClickOutside = !event.composedPath().includes(dialogWrapper) && !event.composedPath().includes(datePickerButton);

    if (isClickOutside) {
      this.hide(false)
    }
  }

  hide(moveFocusToButton: boolean) {
    this.open = false;

    this.duetClose.emit({
      component: "duet-date-picker",
    })
  }

  show() {
    this.open = true;

    this.duetOpen.emit({
      component: "duet-date-picker",
    });

    this.setFocusedDay(this.dateUtilitiesService.parseISODate(this.value) || new Date());
  }

  enableActiveFocus = () => {
    this.activeFocus = true;
  };

  disableActiveFocus = () => {
    this.activeFocus = false;
  };

  addDays(days: number) {
    this.setFocusedDay(
      this.dateUtilitiesService.addDays(this.focusedDay, days)
    );
  }

  addMonths(months: number) {
    this.setMonth(this.focusedDay.getMonth() + months);
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
  }

  toggleOpen = (e: OnClickEvent) => {
    e.event.preventDefault();
    this.open ? this.hide(false) : this.show();
  };

  handleEscKey = (event: any) => {
    if (event.keyCode === keyCode.ESC) {
      this.hide(true);
    }
  };

  handleBlur = (event: OnFocusEvent) => {
    event.event.stopPropagation();

    this.duetBlur.emit({
      component: 'duet-date-picker',
    });
  };

  handleFocus = (event: OnFocusEvent) => {
    event.event.stopPropagation();

    this.duetFocus.emit({
      component: 'duet-date-picker',
    });
  };

  handleTouchStart = (event: any) => {
    const touch = event.changedTouches[0];
    this.initialTouchX = touch.pageX;
    this.initialTouchY = touch.pageY;
  };

  handleTouchMove = (event: any) => {
    event.preventDefault();
  };

  handleTouchEnd = (event: any) => {
    const touch = event.changedTouches[0];
    const distX = touch.pageX - this.initialTouchX; // get horizontal dist traveled
    const distY = touch.pageY - this.initialTouchY; // get vertical dist traveled
    const threshold = 70;

    const isHorizontalSwipe =
      Math.abs(distX) >= threshold && Math.abs(distY) <= threshold;
    const isDownwardsSwipe =
      Math.abs(distY) >= threshold && Math.abs(distX) <= threshold && distY > 0;

    if (isHorizontalSwipe) {
      this.addMonths(distX < 0 ? 1 : -1);
    } else if (isDownwardsSwipe) {
      this.hide(false);
      event.preventDefault();
    }

    this.initialTouchY = -1;
    this.initialTouchX = -1;
  };

  handleNextMonthClick = (event: any) => {
    event.preventDefault();
    this.addMonths(1);
  };

  handlePreviousMonthClick = (event: any) => {
    event.preventDefault();
    this.addMonths(-1);
  };

  handleFirstFocusableKeydown = (event: any) => {
    // this ensures focus is trapped inside the dialog
    if (event.keyCode === keyCode.TAB && event.shiftKey) {
      // this.focusedDayNode.focus() hmmm.....
      event.preventDefault();
    }
  };

  handleKeyboardNavigation = (event: OnKeyboardNavigationEvent) => {
    // handle tab separately, since it needs to be treated
    // differently to other keyboard interactions
    if (event.event.keyCode === keyCode.TAB && !event.event.shiftKey) {
      event.event.preventDefault();
      //this.firstFocusableElement.focus()
      return;
    }

    var handled = true;

    switch (event.event.keyCode) {
      case keyCode.RIGHT:
        this.addDays(1);
        break;
      case keyCode.LEFT:
        this.addDays(-1);
        break;
      case keyCode.DOWN:
        this.addDays(7);
        break;
      case keyCode.UP:
        this.addDays(-7);
        break;
      case keyCode.PAGE_UP:
        if (event.event.shiftKey) {
          this.addYears(-1);
        } else {
          this.addMonths(-1);
        }
        break;
      case keyCode.PAGE_DOWN:
        if (event.event.shiftKey) {
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
        this.hide(true);
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.event.preventDefault();
      this.enableActiveFocus();
    }
  };

  isDateDisabled(day: Date): boolean {
    return false;
  }

  isMonthDisabled(i: number): boolean {
    const date = new Date(this.focusedYear, i, 1);
    const minDate = this.minDate
      ? this.dateUtilitiesService.startOfMonth(this.minDate)
      : undefined;
    const maxDate = this.maxDate
      ? this.dateUtilitiesService.endOfMonth(this.maxDate)
      : undefined;

    return !this.dateUtilitiesService.inRange(date, minDate, maxDate);
  }

  handleDaySelect = (e: OnDaySelectEvent) => {
    const isInRange = this.dateUtilitiesService.inRange(
      e.day,
      this.dateUtilitiesService.parseISODate(this.min),
      this.dateUtilitiesService.parseISODate(this.max)
    );
    const isAllowed = !this.isDateDisabled(e.day);

    if (isInRange && isAllowed) {
      this.setValue(e.day);
      this.hide(true);
    } else {
      // for consistency we should set the focused day in cases where
      // user has selected a day that has been specifically disallowed
      this.setFocusedDay(e.day);
    }
  };

  handleMonthSelect = (e: any) => {
    this.setMonth(parseInt(e.target.value, 10));
  };

  handleYearSelect = (e: any) => {
    this.setYear(parseInt(e.target.value, 10));
  };

  handleInputChange = (event: OnInputEvent) => {

    const target = event.event.target as HTMLInputElement;

    // // clean up any invalid characters
    this.cleanValue(target, DISALLOWED_CHARACTERS)

    const parsed = this.dateAdapter.parse(target.value, this.dateUtilitiesService.createDate);

    if (parsed != undefined && parsed || target.value === "") {
      this.setValue(parsed)
    }
  };

  setValue(date: any) {
    this.value = this.dateUtilitiesService.printISODate(date);

    this.duetChange.emit({
      component: "duet-date-picker",
      value: this.value,
      valueAsDate: date,
    });
  }
}
