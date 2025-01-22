import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookingService } from '../../../../app/shared/services/booking.service';
import { Booking } from '../../../../app/shared/models/booking.model';
import { Status } from '../../../../app/shared/enums/status.enum';

@Component({
  selector: 'app-address-pickup',
  standalone: true,
  templateUrl: './address-pickup.component.html',
  styleUrls: ['./address-pickup.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  providers: [BookingService],
})
export class AddressPickupComponent {
  @ViewChild('bookingSection') bookingSection!: ElementRef;
  bookingForm!: FormGroup;

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

  scrollToBooking(): void {
    this.bookingSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
