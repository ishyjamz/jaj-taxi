import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../../app/shared/services/booking.service';
import { CommonModule } from '@angular/common';
import { AirportBooking } from '../../../../app/shared/models/airport-booking.model';
import { Status } from '../../../../app/shared/enums/status.enum';

@Component({
  selector: 'app-airport-transfer',
  standalone: true, // This marks it as a standalone component
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [BookingService],
  templateUrl: './airport-transfer.component.html',
  styleUrls: ['./airport-transfer.component.scss'],
})
export class AirportTransferComponent implements OnInit {
  bookingForm!: FormGroup;
  isReturnTrip = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      airportName: ['', Validators.required],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      specialRequests: [''],
      isReturnTrip: [false],
      returnDate: [null], // Optional
      returnTime: [null], // Optional
      status: [Status.PENDING],
    });
  }

  onReturnTripChange(): void {
    this.isReturnTrip = this.bookingForm.get('isReturnTrip')?.value;
    if (!this.isReturnTrip) {
      // Reset the return trip fields when it's a one-way trip
      this.bookingForm.get('returnDate')?.reset();
      this.bookingForm.get('returnTime')?.reset();
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;

      // Prepare payload
      const payload: AirportBooking = {
        ...formData,
      };

      console.log('Payload being sent to API:', payload);

      // Submit the booking
      this.bookingService.createAirportBooking(payload).subscribe({
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

  scrollToBooking(): void {
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
