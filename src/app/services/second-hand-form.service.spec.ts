import { TestBed } from '@angular/core/testing';

import { SecondHandFormService } from './second-hand-form.service';

describe('SecondHandFormService', () => {
  let service: SecondHandFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondHandFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
