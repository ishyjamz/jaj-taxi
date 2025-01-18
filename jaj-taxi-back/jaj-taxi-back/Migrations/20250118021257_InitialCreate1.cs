using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jaj_taxi_back.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ReturnTime",
                table: "AirportBookings",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(TimeSpan),
                oldType: "interval",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PickupTime",
                table: "AirportBookings",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "ReturnTime",
                table: "AirportBookings",
                type: "interval",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "PickupTime",
                table: "AirportBookings",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
