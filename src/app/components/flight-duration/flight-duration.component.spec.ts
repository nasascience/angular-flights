import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDurationComponent } from './flight-duration.component';

describe('FlightDurationComponent', () => {
  let component: FlightDurationComponent;
  let fixture: ComponentFixture<FlightDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
