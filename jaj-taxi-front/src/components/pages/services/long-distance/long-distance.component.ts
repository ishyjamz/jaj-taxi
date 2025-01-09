import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-long-distance',
  templateUrl: './long-distance.component.html',
  styleUrls: ['./long-distance.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LongDistanceComponent {
  distance: number = 0;
  pricePerKm: number = 0.75; // Default price per km
  totalPrice: number | null = null;

  calculatePrice(): void {
    if (this.distance > 0 && this.pricePerKm > 0) {
      this.totalPrice = this.distance * this.pricePerKm;
    } else {
      this.totalPrice = null; // Reset if invalid values
    }
  }
}
