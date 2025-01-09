import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-address-pickup',
  standalone: true, // Mark this component as standalone
  imports: [CommonModule, FormsModule, RouterModule], // Add necessary imports
  templateUrl: './address-pickup.component.html',
  styleUrls: ['./address-pickup.component.scss'],
})
export class AddressPickupComponent {
  distance: number = 0;
  basePrice: number = 10; // Default base price for pickup
  pricePerKm: number = 0.5; // Default price per km
  totalPrice: number | null = null;

  calculatePrice(): void {
    if (this.distance > 0 && this.basePrice > 0 && this.pricePerKm > 0) {
      this.totalPrice = this.basePrice + this.distance * this.pricePerKm;
    } else {
      this.totalPrice = null; // Reset if invalid values
    }
  }
}
