import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiServicesComponent } from './taxi-services.component';

describe('TaxiServicesComponent', () => {
  let component: TaxiServicesComponent;
  let fixture: ComponentFixture<TaxiServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxiServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
