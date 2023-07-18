using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using CrossWorldApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CrossWorldApp;

public class CrossWorldDbContext : IdentityDbContext
{
    public CrossWorldDbContext(DbContextOptions<CrossWorldDbContext> options)
        : base(options)
    {
    }
    public DbSet<Crossword> Crosswords { get; set; }
    public DbSet<Clue> Clues { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CrosswordClue> CrosswordClues { get; set; }
    public DbSet<TestCrossword> TestCrosswords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CrosswordClue>()
            .HasKey(cc => new { cc.CrosswordId, cc.ClueId }); // Composite key

        modelBuilder.Entity<CrosswordClue>()
            .HasOne(cc => cc.Crossword)
            .WithMany(c => c.CrosswordClues)
            .HasForeignKey(cc => cc.CrosswordId);

        modelBuilder.Entity<CrosswordClue>()
            .HasOne(cc => cc.Clue)
            .WithMany(c => c.CrosswordClues)
            .HasForeignKey(cc => cc.ClueId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Uid)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(u => u.PublishedCrosswords)
            .WithOne(c => c.User) // No navigation property in Crossword
            .HasForeignKey("UserId"); // Name of the foreign key property

        modelBuilder.Entity<User>()
            .HasMany(u => u.PublishedTestCrosswords)
            .WithOne(t => t.User) // No navigation property in TestCrossword
            .HasForeignKey("UserId"); // Name of the foreign key property
    }

    // ... other properties and methods ...
}