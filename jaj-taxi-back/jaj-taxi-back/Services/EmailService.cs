using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Threading.Tasks;
using jaj_taxi_back.Models.Dtos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace jaj_taxi_back.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;
        private readonly string _businessEmail;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>() 
                             ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger;
            _businessEmail = configuration.GetValue<string>("BusinessEmailSettings:Address");
        }

        public async Task SendBookingConfirmationEmailAsync(BookingDto bookingDto)
        {
            var customerEmailBody = GetCustomerEmailBody(bookingDto);
            var businessEmailBody = GetBusinessEmailBody(bookingDto);
            await SendEmailsAsync(bookingDto.Email, customerEmailBody, businessEmailBody);
        }

        public async Task SendAirportBookingConfirmationEmailAsync(AirportBookingDto airportBookingDto)
        {
            var customerEmailBody = GetCustomerEmailBody(airportBookingDto);
            var businessEmailBody = GetBusinessEmailBody(airportBookingDto);
            await SendEmailsAsync(airportBookingDto.Email, customerEmailBody, businessEmailBody);
        }

        // Unified method to send emails to customer and business
        private async Task SendEmailsAsync(string recipientEmail, string customerEmailBody, string businessEmailBody)
        {
            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                emailMessage.To.Add(MailboxAddress.Parse(recipientEmail));
                emailMessage.Subject = "Booking Confirmation";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = customerEmailBody,
                    TextBody = "This email contains HTML content. Please view it in an HTML-compatible email client."
                };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.Password);
                await client.SendAsync(emailMessage);

                // Send email to business
                emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                emailMessage.To.Add(MailboxAddress.Parse(_businessEmail));
                emailMessage.Subject = "New Booking Alert";

                bodyBuilder.HtmlBody = businessEmailBody;
                emailMessage.Body = bodyBuilder.ToMessageBody();

                await client.SendAsync(emailMessage);

                _logger.LogInformation("Emails successfully sent for booking.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while sending booking emails.");
                throw new InvalidOperationException("Error sending emails.", ex);
            }
        }

        // Helper methods to generate the email bodies

        private string GetCustomerEmailBody(BookingDto bookingDto) => $@"
            <h2>Booking Confirmation</h2>
            <p>Dear {bookingDto.Name},</p>
            <p>Your booking is confirmed for {bookingDto.Date:yyyy-MM-dd} at {bookingDto.Time}.</p>
            <p>Pickup: {bookingDto.PickupLocation}</p>
            <p>Drop-off: {bookingDto.DropOffLocation}</p>
            <p>Thank you for choosing Jaj Taxi!</p>";

        private string GetBusinessEmailBody(BookingDto bookingDto) => $@"
            <h1>New Booking Alert</h1>
            <p>A new booking has been made:</p>
            <ul>
                <li>Name: {bookingDto.Name}</li>
                <li>Email: {bookingDto.Email}</li>
                <li>Pickup: {bookingDto.PickupLocation}</li>
                <li>Drop-off: {bookingDto.DropOffLocation}</li>
                <li>Date: {bookingDto.Date:yyyy-MM-dd}</li>
                <li>Time: {bookingDto.Time}</li>
            </ul>";

        private string GetCustomerEmailBody(AirportBookingDto airportBookingDto) => $@"
            <h2>Airport Booking Confirmation</h2>
            <p>Dear {airportBookingDto.Name},</p>
            <p>Your airport booking is confirmed for {airportBookingDto.PickupDate:yyyy-MM-dd} at {airportBookingDto.PickupTime}.</p>
            <p>Pickup: {airportBookingDto.PickupLocation}</p>
            <p>Destination: {airportBookingDto.AirportName}</p>
            {GetReturnDetails(airportBookingDto)}
            <p>Thank you for choosing Jaj Taxi!</p>";

        private string GetBusinessEmailBody(AirportBookingDto airportBookingDto) => $@"
            <h1>New Airport Booking Alert</h1>
            <p>A new airport booking has been made:</p>
            <ul>
                <li>Name: {airportBookingDto.Name}</li>
                <li>Email: {airportBookingDto.Email}</li>
                <li>Pickup: {airportBookingDto.PickupLocation}</li>
                <li>Airport: {airportBookingDto.AirportName}</li>
                <li>Pickup Date: {airportBookingDto.PickupDate:yyyy-MM-dd}</li>
                <li>Pickup Time: {airportBookingDto.PickupTime}</li>
                {GetReturnDetails(airportBookingDto)}
            </ul>";

        private string GetReturnDetails(AirportBookingDto airportBookingDto)
        {
            if (!airportBookingDto.IsReturnTrip || airportBookingDto.ReturnDate == null || string.IsNullOrEmpty(airportBookingDto.ReturnTime))
            {
                return "<p>No return trip details provided.</p>";
            }

            return $@"
                <p>Return Date: {airportBookingDto.ReturnDate:yyyy-MM-dd}</p>
                <p>Return Time: {airportBookingDto.ReturnTime}</p>";
        }
    }
}
