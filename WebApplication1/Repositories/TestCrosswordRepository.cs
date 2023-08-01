using CrossWorldApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CrossWorldApp.Repositories;

public class TestCrosswordRepository: ITestCrosswordRepository
{
    private readonly CrossWorldDbContext _context;

    public TestCrosswordRepository(CrossWorldDbContext context)
    {
        _context = context;
        var canConnect = context.Database.CanConnect();
        Console.WriteLine(canConnect);
    }

    public TestCrossword[] GetAllTestCrosswords()
    {
        return _context.TestCrosswords.ToArray();
    }

    public TestCrossword GetTestCrosswordById(int id)
    {
        return _context.TestCrosswords.Find(id);
    }

    public void AddTestCrossword(TestCrossword testCrossword)
    {
        _context.TestCrosswords.Add(testCrossword);
        _context.SaveChanges();
    }

    public void UpdateTestCrossword(TestCrossword testCrossword)
    {
        _context.Entry(testCrossword).State = EntityState.Modified;
        _context.SaveChanges();
    }

    public void DeleteTestCrossword(int id)
    {
        var testCrossword = _context.TestCrosswords.Find(id);
        if (testCrossword != null)
        {
            _context.TestCrosswords.Remove(testCrossword);
            _context.SaveChanges();
        }
    }

    public TestCrossword[] GetPublishedCrosswordsForUser(string userId)
    {
        return _context.TestCrosswords.Where(crossword => crossword.UserId == userId).ToArray();
    }
    
    public TestCrossword[] GetCompletedCrosswordsForUser(string userId)
    {
        var completedCrosswords = 
            (from solve in _context.Solves
            join crossword in _context.TestCrosswords on solve.TestCrosswordId equals crossword.Id
            where solve.UserId == userId && solve.IsSolved == true
            select crossword).ToArray();
        
        return completedCrosswords;
    }
    
    public TestCrossword GetTestCrosswordWithUser(int id)
    {
        return _context.TestCrosswords
            .Include(crossword => crossword.User)
            .FirstOrDefault(crossword => crossword.Id == id);
    }
    
    public TestCrossword[] GetTestCrosswordsWithSolves()
    {
        return _context.TestCrosswords.Include(crossword => crossword.Solves).ToArray();
    }

}

public interface ITestCrosswordRepository
{
    TestCrossword[] GetAllTestCrosswords();
    TestCrossword GetTestCrosswordById(int id);
    void AddTestCrossword(TestCrossword crossword);
    void UpdateTestCrossword(TestCrossword crossword);
    void DeleteTestCrossword(int id);

    TestCrossword[] GetPublishedCrosswordsForUser(string userId);
    
    TestCrossword[] GetCompletedCrosswordsForUser(string userId);

    TestCrossword GetTestCrosswordWithUser(int id);

    TestCrossword[] GetTestCrosswordsWithSolves();
}