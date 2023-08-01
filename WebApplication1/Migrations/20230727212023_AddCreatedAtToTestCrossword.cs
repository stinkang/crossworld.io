using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedAtToTestCrossword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TestCrosswords",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "getutcdate()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TestCrosswords");
        }
    }
}
