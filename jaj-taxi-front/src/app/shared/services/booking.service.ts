import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { AirportBooking } from '../models/airport-booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://localhost:7164/api/Booking'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, booking);
  }

  createAirportBooking(booking: AirportBooking): Observable<any> {
    console.log('booking details', booking);
    return this.http.post(`${this.apiUrl}/createAirport`, booking);
  }
}
