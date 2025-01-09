import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPickupComponent } from './address-pickup.component';

describe('AddressPickupComponent', () => {
  let component: AddressPickupComponent;
  let fixture: ComponentFixture<AddressPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressPickupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
