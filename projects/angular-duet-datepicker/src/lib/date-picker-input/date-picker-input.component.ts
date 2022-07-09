import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DuetLocalizedText } from '../date-localization';

export class OnClickEvent {
  constructor(public event: MouseEvent) {}
}

export type SeperatorLocation = {
  seperator: string;
  location: number;
}

@Component({
  selector: 'rwd-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerInputComponent),
      multi: true,
    }
  ],
})
export class DatePickerInputComponent implements OnInit, ControlValueAccessor {

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
  @Input() maxInputLength = 99;
  @Input() seperatorLocations: SeperatorLocation[] = [];

  constructor() { }

  onChange: any = () => {};
  onTouched: any = () => {};

  @Output() onClick = new EventEmitter<OnClickEvent>();
  @Output() onInputChange = new EventEmitter();

  writeValue(obj: any): void {
    this.formattedValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
  }

  handleOnClick(event: MouseEvent) {
    this.onClick.emit(new OnClickEvent(event));
  }

  handleOnInput(event: Event) {

    const inputElement = (event.target as HTMLInputElement);

    if (this.seperatorLocations.length > 0) {

      for(var i = 0; i < this.seperatorLocations.length; i++) {

        var p = this.seperatorLocations[i];

        const seperatorCount = inputElement.value.split(p.seperator).length - 1;

        if (inputElement.value.length - seperatorCount == p.location) {
          inputElement.value = inputElement.value + p.seperator;
          event.preventDefault();
          break;
        }
      }
    }

    this.onChange((event.target as HTMLInputElement).value);
    this.onInputChange.emit();
  }
}
