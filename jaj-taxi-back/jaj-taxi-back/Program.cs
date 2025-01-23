using System.Text;
using jaj_taxi_back;
using jaj_taxi_back.Services;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using jaj_taxi_back.Helper;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<TaxiBookingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IBookingService, BookingService>();
builder.Services.Configure<BusinessEmailSettings>(builder.Configuration.GetSection("BusinessEmail"));
builder.Services.AddScoped<GoogleAuthService>();
builder.Services.AddSingleton<JwtTokenGenerator>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]))
        };
    });


// Register AutoMapper profile explicitly (if needed)
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Add CORS policy to allow requests from the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Replace with the actual frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add controllers and Swagger for API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS middleware
app.UseCors("AllowFrontend");

// Ensure compatibility for Npgsql timestamp behavior
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();