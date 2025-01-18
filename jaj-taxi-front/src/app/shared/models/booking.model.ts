export interface Booking {
  id?: number; // Optional as it will be assigned by the backend
  name: string;
  email: string;
  phoneNumber: string;
  pickupLocation: string;
  dropOffLocation: string;
  date: string; // Use ISO 8601 format (e.g., "2025-01-18")
  time: string; // Use "HH:mm" format (e.g., "10:30")
  specialRequests?: string;
}
