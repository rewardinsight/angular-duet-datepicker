import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DuetLocalizedText } from '../date-localization';
import { DateUtilitiesService } from '../services/date-utilities.service';

@Component({
  selector: 'rwd-date-picker-day',
  templateUrl: './date-picker-day.component.html',
  styleUrls: ['./date-picker-day.component.scss'],
})
export class DatePickerDayComponent implements OnInit, AfterContentInit {

  @Input() focusedDay: Date = new Date();
  @Input() today: Date = new Date();
  @Input() day: Date = new Date();

  @Input() disabled: boolean = false;
  @Input() inRange?: boolean;
  @Input() isSelected: boolean = false;
  @Input() dateFormatter?: Intl.DateTimeFormat;
  @Input() tabIndex = 0;
  @Input() localization?: DuetLocalizedText;

  @Output() onDaySelect = new EventEmitter<OnDaySelectEvent>();

  public isMonth?: boolean;
  public isFocused?: boolean;
  public isToday?: boolean;

  public ariaLabel = 'Select';

  constructor(private dateUtilitiesService: DateUtilitiesService) {
  }

  ngAfterContentInit(): void {
    this.isMonth = this.dateUtilitiesService.isEqualMonth(this.day, this.focusedDay);
    this.isFocused = this.dateUtilitiesService.isEqual(this.day, this.focusedDay);
    this.isToday = this.dateUtilitiesService.isEqual(this.day, this.today);
    this.ariaLabel = this.dateFormatter?.format(this.day) + ' - ' + this.localization?.selectThisDateMessage;
  }

  ngOnInit(): void {
  }

  handleClick(e: MouseEvent) {
    this.onDaySelect.emit(new OnDaySelectEvent(e, this.day));
  }
}

export class OnDaySelectEvent {
  constructor(public event: MouseEvent, public day: Date) {}
}
