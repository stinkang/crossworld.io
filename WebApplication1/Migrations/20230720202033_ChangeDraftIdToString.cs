using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrossWorldApp.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDraftIdToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new string Id column
            migrationBuilder.AddColumn<string>(
                name: "NewId",
                table: "Drafts",
                type: "nvarchar(450)",
                nullable: false);

            // Copy data from Id to NewId if necessary. 
            // NOTE: Be aware of the fact that you can't convert int to GUID directly. 
            // If you have existing data you should decide how to convert the old int ids to new string ids.
            // Drop the primary key constraint.
            migrationBuilder.DropPrimaryKey(
                name: "PK_Drafts",
                table: "Drafts");

            // Drop old Id column
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Drafts");

            // Rename NewId to Id
            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "Drafts",
                newName: "Id");

            // Add the primary key constraint back.
            migrationBuilder.AddPrimaryKey(
                name: "PK_Drafts",
                table: "Drafts",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the primary key constraint.
            migrationBuilder.DropPrimaryKey(
                name: "PK_Drafts",
                table: "Drafts");

            // Add back the original Id column
            migrationBuilder.AddColumn<int>(
                name: "OldId",
                table: "Drafts",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            // Copy data from NewId to Id if necessary.
            // If you had converted the old int ids to new string ids in the `Up` method,
            // you should decide how to convert the string ids back to int ids.

            // Drop the new Id column
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Drafts");

            // Rename OldId to Id
            migrationBuilder.RenameColumn(
                name: "OldId",
                table: "Drafts",
                newName: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Drafts",
                table: "Drafts",
                column: "Id");
        }
    }
}
