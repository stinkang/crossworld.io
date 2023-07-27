using CrossWorldApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CrossWorldApp.Repositories;

public class CrosswordRepository : ICrosswordRepository
{
    private readonly CrossWorldDbContext _context;

    public CrosswordRepository(CrossWorldDbContext context)
    {
        _context = context;
        var canConnect = context.Database.CanConnect();
        Console.WriteLine(canConnect);
    }

    public Crossword[] GetAllCrosswords()
    {
        return _context.Crosswords.ToArray();
    }

    public Crossword GetCrosswordById(int id)
    {
        return _context.Crosswords.Find(id);
    }

    public void AddCrossword(Crossword crossword)
    {
        _context.Crosswords.Add(crossword);
        _context.SaveChanges();
    }

    public void UpdateCrossword(Crossword crossword)
    {
        _context.Entry(crossword).State = EntityState.Modified;
        _context.SaveChanges();
    }

    public void DeleteCrossword(int id)
    {
        var crossword = _context.Crosswords.Find(id);
        if (crossword != null)
        {
            _context.Crosswords.Remove(crossword);
            _context.SaveChanges();
        }
    }
    
    
}

public interface ICrosswordRepository
{
    Crossword[] GetAllCrosswords();
    Crossword GetCrosswordById(int id);
    void AddCrossword(Crossword crossword);
    void UpdateCrossword(Crossword crossword);
    void DeleteCrossword(int id);
}