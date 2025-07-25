﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuickSell.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class TestUsers5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomUsername",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomUsername",
                table: "AspNetUsers");
        }
    }
}
