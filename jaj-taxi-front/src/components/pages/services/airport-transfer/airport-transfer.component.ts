import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-airport-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './airport-transfer.component.html',
  styleUrls: ['./airport-transfer.component.scss'],
})
export class AirportTransferComponent {
  isReturnTrip: boolean | null = false; // Tracks Yes/No for return trip
  isSameLocation: boolean | null = true; // Tracks Yes/No for same return location;
  @ViewChild('bookingSection') bookingSection!: ElementRef;

  onReturnTripChange() {
    if (!this.isReturnTrip) {
      this.isSameLocation = null; // Reset same-location choice
    }
  }

  onSameLocationChange() {
    // Additional logic can be added here if needed
  }

  scrollToBooking(): void {
    this.bookingSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
