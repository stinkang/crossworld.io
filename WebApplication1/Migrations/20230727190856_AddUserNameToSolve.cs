using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class AddUserNameToSolve : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Solves",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Solves");
        }
    }
}
