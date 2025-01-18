export interface AirportBooking {
  name: string;
  email: string;
  phoneNumber: string;
  pickupLocation: string;
  airportName: string;
  pickupDate: string; // Use ISO 8601 format (e.g., "2025-01-18")
  pickupTime: string; // Use "HH:mm" format (e.g., "10:30")
  specialRequests?: string;
  isReturnTrip: boolean;
  returnDate?: string | null; // Use ISO 8601 format (e.g., "2025-01-18")
  returnTime?: string | null; // Use "HH:mm" format (e.g., "10:30")
}
