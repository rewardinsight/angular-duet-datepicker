import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateUtilitiesService } from '../services/date-utilities.service';

@Component({
  selector: 'app-date-picker-day',
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

  public isToday: boolean = this.dateUtilitiesService.isEqual(this.day, this.today);
  public isMonth: boolean = this.dateUtilitiesService.isEqualMonth(this.day, this.focusedDay);
  public isFocused: boolean = this.dateUtilitiesService.isEqual(this.day, this.focusedDay);


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
}

export class OnDaySelectEvent {
  constructor(public event: MouseEvent, public day: Date) {}
}

export class OnKeyboardNavigationEvent {
  constructor(public event: KeyboardEvent) {}
}
