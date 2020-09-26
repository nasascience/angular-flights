import { TestBed } from '@angular/core/testing';

import { FutureFlightsService } from './future-flights.service';

describe('FutureFlightsService', () => {
  let service: FutureFlightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutureFlightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
