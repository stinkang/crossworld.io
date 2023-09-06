using CrossWorldApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CrossWorldApp;

public interface ICrossWorldDbContext
{
    DbSet<Crossword> Crosswords { get; set; }
    DbSet<Clue> Clues { get; set; }
    DbSet<CrosswordClue> CrosswordClues { get; set; }
    DbSet<TestCrossword> TestCrosswords { get; set; }
    DbSet<Draft> Drafts { get; set; }
    DbSet<Solve> Solves { get; set; }
        
    // Add other DbSet properties or methods you might use

    int SaveChanges();
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}