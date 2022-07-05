import { TestBed } from '@angular/core/testing';

import { AngularDuetDatepickerService } from './angular-duet-datepicker.service';

describe('AngularDuetDatepickerService', () => {
  let service: AngularDuetDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDuetDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
