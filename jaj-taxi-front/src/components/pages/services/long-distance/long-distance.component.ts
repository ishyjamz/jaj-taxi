import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Booking } from '../../../../app/shared/models/booking.model';
import { BookingService } from '../../../../app/shared/services/booking.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Status } from '../../../../app/shared/enums/status.enum';

@Component({
  selector: 'app-long-distance',
  standalone: true,
  templateUrl: './long-distance.component.html',
  styleUrls: ['./long-distance.component.scss'],
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [BookingService],
})
export class LongDistanceComponent implements OnInit {
  bookingForm!: FormGroup;
  fareEstimate: number | null = null; // Discounted fare
  originalFare: number | null = null; // Original fare before discount

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      date: [Date.now, Validators.required],
      time: ['', Validators.required],
      specialRequests: [''],
      status: [Status.PENDING],
      distance: [null],
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;

      // Prepare the payload to match the backend DTO
      const payload: Booking = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        pickupLocation: formData.pickupLocation,
        dropOffLocation: formData.dropOffLocation,
        date: formData.date, // ISO format
        time: formData.time, // HH:mm format
        specialRequests: formData.specialRequests || '',
        status: formData.status,
      };

      console.log('Payload being sent to API:', payload);

      // Submit the booking
      this.bookingService.createBooking(payload).subscribe({
        next: (response) => {
          console.log('Booking submitted successfully:', response);
          alert('Booking submitted successfully!');
          this.bookingForm.reset();
        },
        error: (error) => {
          console.error('Error submitting booking:', error);
          alert(
            `An error occurred: ${error.error?.message || 'Unable to process the request.'}`,
          );
        },
      });
    } else {
      console.log('Form is invalid:', this.bookingForm);
      alert('Please fill out the form correctly.');
    }
  }

  calculateFare(): void {
    if (this.bookingForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const { date, time, distance } = this.bookingForm.value;

    // Combine `date` and `time` into a single Date object
    const pickupDateTime = new Date(`${date}T${time}`);

    // Log combined date-time for debugging
    console.log('pickupDateTime:', pickupDateTime);

    if (isNaN(pickupDateTime.getTime())) {
      alert('Invalid date or time. Please check your input.');
      return;
    }

    // Tariff logic based on time of day, holidays, or special dates
    const tariff = this.getTariff(pickupDateTime);

    // Base and additional cost configurations for each tariff
    const baseFares: { [key: string]: number } = {
      '1': 3.5, // Daytime
      '2': 5.1, // Nighttime or holiday
      '3': 6.8, // Christmas, New Year, etc.
    };

    const additionalFares: { [key: string]: number } = {
      '1': 0.2, // Cost per additional unit during daytime
      '2': 0.3, // Cost per additional unit during nighttime/holiday
      '3': 0.4, // Cost per additional unit during Christmas/New Year
    };

    const baseDistance = 0.25; // Base distance included in fare (440 yards in miles)
    const additionalDistance = 0.1; // Additional distance unit (176 yards in miles)

    // Calculate distance-related costs
    const distanceCovered = Math.max(distance - baseDistance, 0);
    const additionalDistanceCost =
      Math.ceil(distanceCovered / additionalDistance) *
      additionalFares[tariff.toString()];

    // Calculate fare
    this.originalFare = +(
      baseFares[tariff.toString()] + additionalDistanceCost
    ).toFixed(2);

    // Apply 10% discount for journeys 20 miles or more
    this.fareEstimate =
      distance >= 20
        ? +(this.originalFare * 0.9).toFixed(2)
        : this.originalFare;

    console.log(
      `Estimated Fare: £${this.fareEstimate}, Original Fare: £${this.originalFare}`,
    );
  }

  getTariff(pickupTime: Date): number {
    const hour = pickupTime.getHours();
    const isHoliday = this.isPublicHoliday(pickupTime);
    const isChristmasOrNewYear = this.isChristmasOrNewYear(pickupTime);

    if (isChristmasOrNewYear) {
      return 3; // Tariff 3: Special rates for Christmas/New Year
    } else if ((hour >= 0 && hour < 6) || isHoliday) {
      return 2; // Tariff 2: Nighttime or holiday rates
    } else {
      return 1; // Tariff 1: Standard daytime rates
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
      (month === 11 && day >= 24 && hour >= 18) || // Christmas Eve (after 6 PM)
      (month === 11 && day <= 26) || // Christmas Day and Boxing Day
      (month === 11 && day === 31 && hour >= 18) || // New Year's Eve (after 6 PM)
      (month === 0 && day === 1) // New Year's Day
    );
  }

  scrollToBooking(): void {
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
