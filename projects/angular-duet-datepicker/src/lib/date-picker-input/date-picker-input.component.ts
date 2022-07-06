import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DuetLocalizedText } from '../date-localization';

export class OnClickEvent {
  constructor(public event: MouseEvent) {}
}

export class OnInputEvent {
  constructor(public event: Event) {}
}

export class OnBlurEvent {
  constructor(public event: FocusEvent) {}
}

export class OnFocusEvent {
  constructor(public event: FocusEvent) {}
}

@Component({
  selector: 'rwd-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent implements OnInit {

  @Input() value?: string;
  @Input() formattedValue?: string;
  @Input() valueAsDate?: Date;
  @Input() localization?: DuetLocalizedText;
  @Input() name?: string;
  @Input() identifier?: string;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() role?: string;
  @Input() dateFormatter?: Intl.DateTimeFormat;

  @Output() onClick = new EventEmitter<OnClickEvent>();
  @Output() onInput = new EventEmitter<OnInputEvent>();
  @Output() onBlur = new EventEmitter<OnBlurEvent>();
  @Output() onFocus = new EventEmitter<OnFocusEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  handleOnClick(event: MouseEvent) {
    this.onClick.emit(new OnClickEvent(event));
  }

  handleOnInput(event: Event) {
    this.onInput.emit(new OnInputEvent(event));
  }

  handleOnBlur(event: FocusEvent) {
    this.onBlur.emit(new OnBlurEvent(event));
  }

  handleOnFocus(event: FocusEvent) {
    this.onFocus.emit(new OnFocusEvent(event));
  }
}
