using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAnswerToStringForClue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clues_Word_AnswerId",
                table: "Clues");

            migrationBuilder.DropTable(
                name: "Word");

            migrationBuilder.DropIndex(
                name: "IX_Clues_AnswerId",
                table: "Clues");

            migrationBuilder.DropColumn(
                name: "AnswerId",
                table: "Clues");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "Clues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "Clues");

            migrationBuilder.AddColumn<int>(
                name: "AnswerId",
                table: "Clues",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Word",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Word", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clues_AnswerId",
                table: "Clues",
                column: "AnswerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clues_Word_AnswerId",
                table: "Clues",
                column: "AnswerId",
                principalTable: "Word",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
