import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongDistanceComponent } from './long-distance.component';

describe('LongDistanceComponent', () => {
  let component: LongDistanceComponent;
  let fixture: ComponentFixture<LongDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LongDistanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LongDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
