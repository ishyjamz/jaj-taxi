using jaj_taxi_back.Models.Dtos;

namespace jaj_taxi_back.Services
{
    public interface IEmailService
    {
        // Method to send booking confirmation emails (both customer and business)
        Task SendBookingConfirmationEmailAsync(BookingDto bookingDto);

        // Method to send airport booking confirmation emails (both customer and business)
        Task SendAirportBookingConfirmationEmailAsync(AirportBookingDto airportBookingDto);
    }
}