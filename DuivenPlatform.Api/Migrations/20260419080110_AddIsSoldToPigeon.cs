using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DuivenPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSoldToPigeon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSold",
                table: "Pigeons",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSold",
                table: "Pigeons");
        }
    }
}
