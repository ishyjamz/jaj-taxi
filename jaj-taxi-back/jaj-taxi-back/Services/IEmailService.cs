namespace jaj_taxi_back.Services;

public interface IEmailService
{
    Task SendEmailAsync(string recipientEmail, string subject, string body);
}