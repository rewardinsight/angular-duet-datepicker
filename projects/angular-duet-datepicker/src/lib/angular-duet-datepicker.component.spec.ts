import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDuetDatepickerComponent } from './angular-duet-datepicker.component';

describe('AngularDuetDatepickerComponent', () => {
  let component: AngularDuetDatepickerComponent;
  let fixture: ComponentFixture<AngularDuetDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularDuetDatepickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularDuetDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
