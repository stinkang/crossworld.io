using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFirebaseId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "FirebaseId",
                table: "Drafts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FirebaseId",
                table: "Drafts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
