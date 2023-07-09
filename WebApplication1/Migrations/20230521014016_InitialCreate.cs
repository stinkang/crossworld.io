using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Crosswords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Width = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    Letters = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Numbers = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Crosswords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<int>(type: "int", nullable: false),
                    ClueText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClueDirection = table.Column<int>(type: "int", nullable: false),
                    CrosswordId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clues_Crosswords_CrosswordId",
                        column: x => x.CrosswordId,
                        principalTable: "Crosswords",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clues_CrosswordId",
                table: "Clues",
                column: "CrosswordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Clues");

            migrationBuilder.DropTable(
                name: "Crosswords");
        }
    }
}
