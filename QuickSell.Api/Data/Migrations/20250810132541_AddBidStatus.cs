using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickSell.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBidStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WinningBid",
                table: "Bids");

            migrationBuilder.AddColumn<int>(
                name: "BidStatus",
                table: "Bids",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BidStatus",
                table: "Bids");

            migrationBuilder.AddColumn<bool>(
                name: "WinningBid",
                table: "Bids",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
