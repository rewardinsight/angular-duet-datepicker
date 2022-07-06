import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateUtilitiesService } from '../services/date-utilities.service';

@Component({
  selector: 'rwd-date-picker-day',
  templateUrl: './date-picker-day.component.html',
  styleUrls: ['./date-picker-day.component.scss'],
})
export class DatePickerDayComponent implements OnInit {
  @Input() focusedDay: Date = new Date();
  @Input() today: Date = new Date();
  @Input() day: Date = new Date();
  @Input() disabled: boolean = false;
  @Input() inRange?: boolean;
  @Input() isSelected: boolean = false;
  @Input() dateFormatter?: Intl.DateTimeFormat;

  @Output() onDaySelect = new EventEmitter<OnDaySelectEvent>();
  @Output() onKeyboardNavigation = new EventEmitter<OnKeyboardNavigationEvent>();

  public id = this.newGuid();

  get isMonth() {
    return this.dateUtilitiesService.isEqualMonth(this.day, this.focusedDay);
  }

  get isFocused() {
    const isFocused = this.dateUtilitiesService.isEqual(this.day, this.focusedDay);

    if (isFocused) {
      document.getElementById(this.id)?.focus();
    }

    return isFocused;
  }

  get isToday() {
    return this.dateUtilitiesService.isEqual(this.day, this.today);
  }

  constructor(private dateUtilitiesService: DateUtilitiesService) {
  }

  ngOnInit(): void {
  }

  handleClick(e: MouseEvent) {
    this.onDaySelect.emit(new OnDaySelectEvent(e, this.day));
  }

  handleKeyboardNavigation(e: KeyboardEvent) {
    this.onKeyboardNavigation.emit(new OnKeyboardNavigationEvent(e));
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export class OnDaySelectEvent {
  constructor(public event: MouseEvent, public day: Date) {}
}

export class OnKeyboardNavigationEvent {
  constructor(public event: KeyboardEvent) {}
}


