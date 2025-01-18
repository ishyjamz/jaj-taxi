using jaj_taxi_back.Services;
using MailKit.Net.Smtp;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IConfiguration configuration)
    {
        _emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>();
    }

    public async Task SendEmailAsync(string recipientEmail, string subject, string body)
    {
        // Create the email message
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
        emailMessage.To.Add(MailboxAddress.Parse(recipientEmail));
        emailMessage.Subject = subject;

        // Set the email body
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = body, // HTML content for email
            TextBody = MimeKit.Text.TextFormat.Plain.ToString() // Fallback plain text content
        };
        emailMessage.Body = bodyBuilder.ToMessageBody();

        // Send the email using SMTP
        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.Password);
            await client.SendAsync(emailMessage);
        }
        catch (Exception ex)
        {
            // Log exception or handle as required
            Console.WriteLine($"Error sending email: {ex.Message}");
            throw;
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}