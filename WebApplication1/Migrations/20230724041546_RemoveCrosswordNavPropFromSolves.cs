using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCrosswordNavPropFromSolves : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Solves_Crosswords_CrosswordId",
                table: "Solves");

            migrationBuilder.DropIndex(
                name: "IX_Solves_CrosswordId",
                table: "Solves");

            migrationBuilder.DropColumn(
                name: "CrosswordId",
                table: "Solves");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CrosswordId",
                table: "Solves",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Solves_CrosswordId",
                table: "Solves",
                column: "CrosswordId");

            migrationBuilder.AddForeignKey(
                name: "FK_Solves_Crosswords_CrosswordId",
                table: "Solves",
                column: "CrosswordId",
                principalTable: "Crosswords",
                principalColumn: "Id");
        }
    }
}
