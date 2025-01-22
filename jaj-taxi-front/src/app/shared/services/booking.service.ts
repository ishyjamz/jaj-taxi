import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirportBooking } from '../models/airport-booking.model';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:5189/api/Booking';

  constructor(private http: HttpClient) {}

  // Create a new booking
  createBooking(booking: Booking): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, booking);
  }

  // Create a new airport booking
  createAirportBooking(booking: AirportBooking): Observable<any> {
    return this.http.post(`${this.apiUrl}/createAirport`, booking);
  }

  // Fetch all bookings
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/get`);
  }

  // Fetch all airport bookings
  getAirportBookings(): Observable<AirportBooking[]> {
    return this.http.get<AirportBooking[]>(`${this.apiUrl}/getAirport`);
  }

  // Fetch a booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/get/${id}`);
  }

  // Fetch a booking by ID
  getAirportBookingById(id: number): Observable<AirportBooking> {
    return this.http.get<AirportBooking>(`${this.apiUrl}/getAirport/${id}`);
  }

  // Update a booking
  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(
      `${this.apiUrl}/update/${booking.id}`,
      booking,
    );
  }

  // Update an airport booking
  updateAirportBooking(booking: AirportBooking): Observable<AirportBooking> {
    return this.http.put<AirportBooking>(
      `${this.apiUrl}/updateAirport/${booking.id}`,
      booking,
    );
  }

  // Delete a booking by ID
  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${bookingId}`);
  }

  // Delete an airport booking by ID
  deleteAirportBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAirport/${bookingId}`);
  }
}
