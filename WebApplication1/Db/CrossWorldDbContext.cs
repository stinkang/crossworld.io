using Microsoft.EntityFrameworkCore;
using CrossWorldApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CrossWorldApp.Controllers;

namespace CrossWorldApp;

public class CrossWorldDbContext : IdentityDbContext<CrossworldUser>
{
    public CrossWorldDbContext(DbContextOptions<CrossWorldDbContext> options)
        : base(options)
    {
    }
    public DbSet<Crossword> Crosswords { get; set; }
    public DbSet<Clue> Clues { get; set; }
    public DbSet<CrosswordClue> CrosswordClues { get; set; }
    public DbSet<TestCrossword> TestCrosswords { get; set; }

    public DbSet<Draft> Drafts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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

        modelBuilder.Entity<CrossworldUser>()
            .HasIndex(u => u.UserName)
            .IsUnique();

        modelBuilder.Entity<CrossworldUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<CrossworldUser>()
            .HasMany(u => u.PublishedCrosswords)
            .WithOne(c => c.User) // No navigation property in Crossword
            .HasForeignKey(c => c.UserId); // Name of the foreign key property

        modelBuilder.Entity<CrossworldUser>()
            .HasMany(u => u.PublishedTestCrosswords)
            .WithOne(t => t.User) // No navigation property in TestCrossword
            .HasForeignKey(t => t.UserId); // Name of the foreign key property

        modelBuilder.Entity<CrossworldUser>()
            .HasMany(u => u.Drafts)
            .WithOne(d => d.User) // No navigation property in Draft
            .HasForeignKey(d => d.UserId); // Name of the foreign key property
    }

    // ... other properties and methods ...
}