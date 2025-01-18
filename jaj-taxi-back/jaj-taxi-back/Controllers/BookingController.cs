using jaj_taxi_back.Models;
using jaj_taxi_back.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace jaj_taxi_back.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly TaxiBookingDbContext _dbContext;
    private readonly string _businessEmail;
    private readonly ILogger<BookingController> _logger;

    public BookingController(
        IEmailService emailService,
        TaxiBookingDbContext dbContext,
        IOptions<BusinessEmailSettings> businessEmailSettings,
        ILogger<BookingController> logger)
    {
        _emailService = emailService;
        _dbContext = dbContext;
        _businessEmail = businessEmailSettings.Value.Address;
        _logger = logger;
    }

    // General method to ensure DateTime values are in UTC
    private DateTime EnsureUtc(DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Unspecified)
        {
            return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }
        return dateTime.Kind == DateTimeKind.Local ? dateTime.ToUniversalTime() : dateTime;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid booking request received: {ModelState}", ModelState);
            return BadRequest(ModelState);
        }

        try
        {
            // Ensure DateTime is in UTC
            booking.Date = EnsureUtc(booking.Date);

            // Save the booking
            _dbContext.Bookings.Add(booking);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Booking successfully saved to the database.");

            // Send emails
            await SendBookingEmails(booking);

            return Ok(new { Message = "Booking successfully created.", BookingDetails = booking });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the booking.");
            return StatusCode(500, "An error occurred while processing your booking.");
        }
    }

    [HttpPost("createAirport")]
    public async Task<IActionResult> CreateAirportBooking([FromBody] AirportBooking booking)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid airport booking request received: {ModelState}", ModelState);
            return BadRequest(ModelState);
        }

        try
        {
            // Ensure DateTime values are in UTC
            booking.PickupDate = EnsureUtc(booking.PickupDate);
            if (booking.ReturnDate.HasValue)
            {
                booking.ReturnDate = EnsureUtc(booking.ReturnDate.Value);
            }

            // Save the booking
            _dbContext.AirportBookings.Add(booking);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Airport booking successfully saved to the database.");

            // Send emails
            await SendAirportBookingEmails(booking);

            return Ok(new { Message = "Airport booking successfully created.", BookingDetails = booking });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the airport booking.");
            return StatusCode(500, "An error occurred while processing your airport booking.");
        }
    }

    // Helper method to send emails for general bookings
    private async Task SendBookingEmails(Booking booking)
    {
        string customerEmailBody = GetCustomerEmailBody(booking);
        string businessEmailBody = GetBusinessEmailBody(booking);

        await _emailService.SendEmailAsync(booking.Email, "Booking Confirmation", customerEmailBody);
        await _emailService.SendEmailAsync(_businessEmail, "New Booking Alert", businessEmailBody);
        _logger.LogInformation("Emails successfully sent for booking.");
    }

    // Helper method to send emails for airport bookings
    private async Task SendAirportBookingEmails(AirportBooking booking)
    {
        string customerEmailBody = GetCustomerEmailBody(booking);
        string businessEmailBody = GetBusinessEmailBody(booking);

        await _emailService.SendEmailAsync(booking.Email, "Airport Booking Confirmation", customerEmailBody);
        await _emailService.SendEmailAsync(_businessEmail, "New Airport Booking Alert", businessEmailBody);
        _logger.LogInformation("Emails successfully sent for airport booking.");
    }

    private string GetCustomerEmailBody(Booking booking) => $@"
        <h2>Booking Confirmation</h2>
        <p>Dear {booking.Name},</p>
        <p>Thank you for your booking with us. Here are the details of your booking:</p>
        <p>Your booking is confirmed for {booking.Date:yyyy-MM-dd} at {booking.Time}.</p>
        <p>Pickup: {booking.PickupLocation}</p>
        <p>Drop-off: {booking.DropOffLocation}</p>
        <p>Kind regards,<br/>Jaj Taxi Team</p>";

    private string GetBusinessEmailBody(Booking booking) => $@"
        <h1>New Booking Alert</h1>
        <p>A new booking has been made:</p>
        <ul>
            <li>Name: {booking.Name}</li>
            <li>Email: {booking.Email}</li>
            <li>Pickup: {booking.PickupLocation}</li>
            <li>Drop-off: {booking.DropOffLocation}</li>
            <li>Date: {booking.Date:yyyy-MM-dd}</li>
            <li>Time: {booking.Time}</li>
        </ul>";

    private string GetCustomerEmailBody([FromBody] AirportBooking booking)
    {
        // Ensure return details are handled safely
        string returnDetails = booking.IsReturnTrip && booking.ReturnDate.HasValue && booking.ReturnTime != String.Empty
            ? $"<p>Returning on {booking.ReturnDate:yyyy-MM-dd} at {booking.ReturnTime}</p>"
            : string.Empty;

        // Safely format PickupTime
        return $@"
        <h2>Airport Booking Confirmation</h2>
        <p>Dear {booking.Name},</p>
        <p>Thank you for your booking with us. Here are the details:</p>
        <p>Pickup Date: {booking.PickupDate:yyyy-MM-dd} at {booking.PickupTime}</p>
        <p>Pickup Location: {booking.PickupLocation}</p>
        <p>Destination: {booking.AirportName}</p>
        {returnDetails}
        <p>Kind regards,<br/>Jaj Taxi Team</p>";
    }


    private string GetBusinessEmailBody([FromBody] AirportBooking booking)
    {
        string returnDetails = booking.IsReturnTrip && booking.ReturnDate.HasValue && booking.ReturnTime != string.Empty
            ? $@"
            <li>Return Date: {booking.ReturnDate:yyyy-MM-dd}</li>
            <li>Return Time: {booking.ReturnTime}</li>"
            : "<li>No return trip</li>";

        return $@"
        <h1>New Airport Booking Alert</h1>
        <p>A new booking has been made:</p>
        <ul>
            <li>Name: {booking.Name}</li>
            <li>Email: {booking.Email}</li>
            <li>Pickup: {booking.PickupLocation}</li>
            <li>Airport: {booking.AirportName}</li>
            <li>Pickup Date: {booking.PickupDate:yyyy-MM-dd}</li>
            <li>Pickup Time: {booking.PickupTime}</li>
            {returnDetails}
        </ul>";
    }
}
