import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-pickup',
  standalone: true,
  templateUrl: './address-pickup.component.html',
  styleUrls: ['./address-pickup.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddressPickupComponent {
  @ViewChild('bookingSection') bookingSection!: ElementRef;

  constructor() {}

  scrollToBooking(): void {
    this.bookingSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
