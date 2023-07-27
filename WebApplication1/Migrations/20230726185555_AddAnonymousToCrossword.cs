using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class AddAnonymousToCrossword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isAnonymous",
                table: "Drafts");

            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "TestCrosswords",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "TestCrosswords");

            migrationBuilder.AddColumn<bool>(
                name: "isAnonymous",
                table: "Drafts",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
