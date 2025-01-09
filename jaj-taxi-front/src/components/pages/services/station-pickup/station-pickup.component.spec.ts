import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPickupComponent } from './station-pickup.component';

describe('StationPickupComponent', () => {
  let component: StationPickupComponent;
  let fixture: ComponentFixture<StationPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationPickupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
