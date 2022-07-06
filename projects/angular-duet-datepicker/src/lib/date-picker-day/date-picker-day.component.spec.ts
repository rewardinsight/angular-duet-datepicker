import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerDayComponent } from './date-picker-day.component';

describe('DatePickerDayComponent', () => {
  let component: DatePickerDayComponent;
  let fixture: ComponentFixture<DatePickerDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
