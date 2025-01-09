import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-station-pickup',
  standalone: true, // Mark this component as standalone
  imports: [CommonModule, RouterModule, FormsModule], // Include necessary modules
  templateUrl: './station-pickup.component.html',
  styleUrls: ['./station-pickup.component.scss'],
})
export class StationPickupComponent {
  // Inputs for the fare calculator
  tariff: string = '1'; // Default to Tariff 1
  distance: number = 0; // Distance in yards
  waitingTime: number = 0; // Waiting time in seconds

  // Result
  calculatedFare: number | null = null;

  // Calculate Fare Logic
  calculateFare(): void {
    let baseFare = 0;
    let additionalFarePerUnit = 0;
    let additionalDistanceUnit = 0;
    let additionalTimeUnit = 0;

    // Determine rates based on tariff
    switch (this.tariff) {
      case '1': // Tariff 1
        baseFare = 3.5;
        additionalFarePerUnit = 0.2;
        additionalDistanceUnit = 176;
        additionalTimeUnit = 39.24;
        break;
      case '2': // Tariff 2
        baseFare = 5.1;
        additionalFarePerUnit = 0.3;
        additionalDistanceUnit = 176;
        additionalTimeUnit = 39.24;
        break;
      case '3': // Tariff 3
        baseFare = 6.8;
        additionalFarePerUnit = 0.4;
        additionalDistanceUnit = 176;
        additionalTimeUnit = 39.24;
        break;
      default:
        this.calculatedFare = null;
        return;
    }

    // Calculate additional fares based on distance and waiting time
    const extraDistanceFare =
      Math.ceil(Math.max(0, this.distance - 440) / additionalDistanceUnit) *
      additionalFarePerUnit;
    const extraTimeFare =
      Math.ceil(Math.max(0, this.waitingTime) / additionalTimeUnit) *
      additionalFarePerUnit;

    // Total fare calculation
    this.calculatedFare = baseFare + extraDistanceFare + extraTimeFare;
  }
}
