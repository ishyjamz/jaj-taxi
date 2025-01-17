import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-station-pickup',
  standalone: true,
  templateUrl: './station-pickup.component.html',
  styleUrls: ['./station-pickup.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class StationPickupComponent {
  @ViewChild('bookingSection') bookingSection!: ElementRef;

  constructor() {}

  scrollToBooking(): void {
    this.bookingSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
