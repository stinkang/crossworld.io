using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1;

public class CrossWorldDbContext : DbContext
{
    public CrossWorldDbContext(DbContextOptions<CrossWorldDbContext> options)
        : base(options)
    {
    }
    public DbSet<Crossword> Crosswords { get; set; }
    public DbSet<Clue> Clues { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Crossword>()
            .HasMany(c => c.Clues)
            .WithOne() // No navigation property in Clue
            .HasForeignKey("CrosswordId"); // Name of the foreign key property
    }

    // ... other properties and methods ...
}