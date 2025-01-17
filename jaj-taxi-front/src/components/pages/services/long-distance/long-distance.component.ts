import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-long-distance',
  standalone: true,
  templateUrl: './long-distance.component.html',
  styleUrls: ['./long-distance.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class LongDistanceComponent {
  pickupDateTime: string = ''; // Pickup Date/Time
  distance: number | null = null; // Distance in miles
  fareEstimate: number | null = null; // Discounted fare
  originalFare: number | null = null; // Original fare before discount

  calculateFare(event: Event): void {
    event.preventDefault();

    // Convert input date-time to a JavaScript Date object
    const pickupTime = new Date(this.pickupDateTime);

    // Determine the appropriate tariff based on time
    const tariff = this.getTariff(pickupTime);

    // Define base and additional costs for each tariff
    const baseFares: { [key: string]: number } = {
      '1': 3.5,
      '2': 5.1,
      '3': 6.8,
    };
    const additionalFares: { [key: string]: number } = {
      '1': 0.2,
      '2': 0.3,
      '3': 0.4,
    };
    const baseDistance = 0.25; // 440 yards in miles
    const additionalDistance = 0.1; // 176 yards in miles

    // Calculate additional distance cost
    const distanceCovered = Math.max(
      0,
      this.distance ? this.distance - baseDistance : 0,
    );
    const additionalDistanceCost =
      Math.ceil(distanceCovered / additionalDistance) *
      additionalFares[tariff.toString()];

    // Calculate the original fare
    this.originalFare =
      Math.round(
        (baseFares[tariff.toString()] + additionalDistanceCost) * 100,
      ) / 100;

    // Apply 10% discount for journeys of 20 miles or more
    if (this.distance && this.distance >= 20) {
      this.fareEstimate = Math.round(this.originalFare * 0.9 * 100) / 100;
    } else {
      this.fareEstimate = this.originalFare;
    }
  }

  getTariff(pickupTime: Date): number {
    const hour = pickupTime.getHours();
    const isHoliday = this.isPublicHoliday(pickupTime);
    const isChristmasOrNewYear = this.isChristmasOrNewYear(pickupTime);

    if (isChristmasOrNewYear) {
      return 3; // Tariff 3
    } else if ((hour >= 0 && hour < 6) || isHoliday) {
      return 2; // Tariff 2
    } else {
      return 1; // Tariff 1
    }
  }

  isPublicHoliday(date: Date): boolean {
    const publicHolidays = [
      new Date(date.getFullYear(), 0, 1).toDateString(), // New Year's Day
      new Date(date.getFullYear(), 11, 25).toDateString(), // Christmas Day
      new Date(date.getFullYear(), 11, 26).toDateString(), // Boxing Day
    ];

    return publicHolidays.includes(date.toDateString());
  }

  isChristmasOrNewYear(date: Date): boolean {
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();

    return (
      (month === 11 && day >= 24 && hour >= 18) || // Christmas Eve after 6pm
      (month === 11 && day <= 26) || // Christmas Day and Boxing Day
      (month === 11 && day === 31 && hour >= 18) || // New Year's Eve after 6pm
      (month === 0 && day <= 1) // New Year's Day
    );
  }

  checkDateTime(): void {
    if (this.pickupDateTime) {
      console.log('Date and time selected:', this.pickupDateTime);
    }
  }
}
