import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../app/shared/services/booking.service';
import { Booking } from '../../../app/shared/models/booking.model';
import { AirportBooking } from '../../../app/shared/models/airport-booking.model';
import { Status } from '../../../app/shared/enums/status.enum';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../elements/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.scss'],
  standalone: true,
  providers: [BookingService],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmModalComponent,
  ],
})
export class BookingManagementComponent implements OnInit {
  bookings: Booking[] = [];
  airportBookings: AirportBooking[] = [];
  selectedBookingId?: number;
  actionType: 'accept' | 'decline' = 'accept';
  showModal: boolean = false; // Controls modal visibility
  isAirportModal: boolean = false;
  modalMessage: string = ''; // Message passed to modal

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
    this.bookingService.getAirportBookings().subscribe((airportBookings) => {
      this.airportBookings = airportBookings;
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case 2:
        return 'Declined';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  // Open confirmation modal
  openConfirmationModal(
    action: 'accept' | 'decline',
    bookingId: number,
    isAirportModal: boolean,
  ): void {
    console.log(bookingId);
    this.selectedBookingId = bookingId;
    this.actionType = action;
    this.modalMessage =
      action === 'accept'
        ? 'Are you sure you want to accept this booking?'
        : 'Are you sure you want to decline this booking?';
    this.showModal = true;
    this.isAirportModal = isAirportModal;
  }

  onAirportModalConfirm(confirmed: boolean): void {
    if (confirmed && this.selectedBookingId !== undefined) {
      if (this.actionType === 'accept') {
        this.acceptAirportBooking(this.selectedBookingId);
      } else {
        this.declineAirportBooking(this.selectedBookingId);
      }
    }
    this.showModal = false; // Close the modal after confirmation
  }

  // Handle modal confirmation
  onModalConfirm(confirmed: boolean): void {
    if (confirmed && this.selectedBookingId !== undefined) {
      if (this.actionType === 'accept') {
        this.acceptBooking(this.selectedBookingId);
      } else {
        this.declineBooking(this.selectedBookingId);
      }
    }
    this.showModal = false; // Close the modal after confirmation
  }

  // Accept booking method with data reload
  acceptBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.ACCEPTED;
        this.bookingService.updateBooking(booking).subscribe({
          next: () => {
            console.log(`Booking with ID ${bookingId} accepted.`);
            this.loadBookings(); // Reload the data after accepting
          },
          error: (error) => {
            console.error('Error updating booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching booking:', error);
      },
    });
  }

  // Accept airport booking method with data reload
  acceptAirportBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getAirportBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.ACCEPTED;
        this.bookingService.updateAirportBooking(booking).subscribe({
          next: () => {
            console.log(`Airport booking with ID ${bookingId} accepted.`);
            this.loadBookings(); // Reload the data after accepting
          },
          error: (error) => {
            console.error('Error updating airport booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching airport booking:', error);
      },
    });
  }

  // Decline booking method with data reload
  declineBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.DECLINED;
        this.bookingService.updateBooking(booking).subscribe({
          next: () => {
            this.bookingService.deleteBooking(bookingId).subscribe({
              next: () => {
                console.log(
                  `Booking with ID ${bookingId} declined and deleted.`,
                );
                this.loadBookings(); // Reload the data after declining
              },
              error: (error) => {
                console.error('Error deleting booking:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error updating booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching booking:', error);
      },
    });
  }

  // Decline airport booking method with data reload
  declineAirportBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getAirportBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.DECLINED;
        this.bookingService.updateAirportBooking(booking).subscribe({
          next: () => {
            this.bookingService.deleteAirportBooking(bookingId).subscribe({
              next: () => {
                console.log(
                  `Airport booking with ID ${bookingId} declined and deleted.`,
                );
                this.loadBookings(); // Reload the data after declining
              },
              error: (error) => {
                console.error('Error deleting airport booking:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error updating airport booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching airport booking:', error);
      },
    });
  }

  // Complete booking method with data reload
  completeBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.COMPLETED;
        this.bookingService.updateBooking(booking).subscribe({
          next: () => {
            console.log(`Booking with ID ${bookingId} completed.`);
            this.loadBookings(); // Reload the data after completing
          },
          error: (error) => {
            console.error('Error updating booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching booking:', error);
      },
    });
  }

  // Complete airport booking method with data reload
  completeAirportBooking(bookingId?: number): void {
    if (!bookingId) {
      console.error('Invalid booking ID');
      return;
    }

    this.bookingService.getAirportBookingById(bookingId).subscribe({
      next: (booking) => {
        booking.status = Status.COMPLETED;
        this.bookingService.updateAirportBooking(booking).subscribe({
          next: () => {
            console.log(`Airport booking with ID ${bookingId} completed.`);
            this.loadBookings(); // Reload the data after completing
          },
          error: (error) => {
            console.error('Error updating airport booking status:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching airport booking:', error);
      },
    });
  }
}
