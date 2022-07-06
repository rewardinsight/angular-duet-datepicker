import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerMonthComponent } from './date-picker-month.component';

describe('DatePickerMonthComponent', () => {
  let component: DatePickerMonthComponent;
  let fixture: ComponentFixture<DatePickerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
