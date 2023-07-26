using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class AddSolves : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Solves",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MillisecondsElapsed = table.Column<double>(type: "float", nullable: false),
                    TestCrosswordId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GridString = table.Column<string>(type: "text", nullable: false),
                    IsSolved = table.Column<bool>(type: "bit", nullable: false),
                    IsCoOp = table.Column<bool>(type: "bit", nullable: false),
                    UsedHints = table.Column<bool>(type: "bit", nullable: false),
                    CrosswordId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Solves", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Solves_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Solves_Crosswords_CrosswordId",
                        column: x => x.CrosswordId,
                        principalTable: "Crosswords",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Solves_TestCrosswords_TestCrosswordId",
                        column: x => x.TestCrosswordId,
                        principalTable: "TestCrosswords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Solves_CrosswordId",
                table: "Solves",
                column: "CrosswordId");

            migrationBuilder.CreateIndex(
                name: "IX_Solves_TestCrosswordId",
                table: "Solves",
                column: "TestCrosswordId");

            migrationBuilder.CreateIndex(
                name: "IX_Solves_UserId",
                table: "Solves",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Solves");
        }
    }
}
