using Microsoft.EntityFrameworkCore;

namespace CrossWorldApp.Repositories;
using CrossWorldApp.Models;

public class SolveRepository: ISolveRepository
{
    private readonly CrossWorldDbContext _context;

    public SolveRepository(CrossWorldDbContext context)
    {
        _context = context;
    }
    
    public Solve[] GetSolvesForUser(string userId)
    {
        return _context.Solves.Where(d => d.UserId == userId).ToArray();
    }
    
    public Solve? GetSolveById(string id)
    {
        return _context.Solves
            .Include(s => s.TestCrossword)
            .FirstOrDefault(s => s.Id == id);
    }
    
    public void AddSolve(Solve solve)
    {
        _context.Solves.Add(solve);
        _context.SaveChanges();
    }
    
    public void UpdateSolve(Solve solve)
    {
        var existingSolve = _context.Solves.FirstOrDefault(d => d.Id == solve.Id);
        if (existingSolve == null) return;
        existingSolve.MillisecondsElapsed = solve.MillisecondsElapsed;
        existingSolve.IsSolved = solve.IsSolved;
        existingSolve.IsCoOp = solve.IsCoOp;
        existingSolve.UsedHints = solve.UsedHints;
        existingSolve.SolveGrid = solve.SolveGrid;
            
        _context.Solves.Update(existingSolve);
        _context.SaveChanges();
    }
    
    public void DeleteSolve(string id)
    {
        var existingSolve = _context.Solves.FirstOrDefault(d => d.Id == id);
        if (existingSolve != null)
        {
            _context.Solves.Remove(existingSolve);
            _context.SaveChanges();
        }
    }
    
    public Solve[] GetCompletedSolvesForUser(string userId)
    {
        return _context.Solves.Where(solve => solve.UserId == userId && solve.IsSolved == true).ToArray();
    }
    
    public Solve[] GetCompletedSolvesForCrossword(int crosswordId)
    {
        return _context.Solves.Where(solve => solve.TestCrosswordId == crosswordId && solve.IsSolved == true).ToArray();
    }
}

public interface ISolveRepository
{
    Solve[] GetSolvesForUser(string userId);
    Solve GetSolveById(string id);
    void AddSolve(Solve solve);
    void UpdateSolve(Solve solve);
    void DeleteSolve(string id);
    Solve[] GetCompletedSolvesForUser(string userId);
    
    Solve[] GetCompletedSolvesForCrossword(int crosswordId);
}