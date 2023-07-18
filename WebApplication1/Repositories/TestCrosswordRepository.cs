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
}

public interface ITestCrosswordRepository
{
    TestCrossword[] GetAllTestCrosswords();
    TestCrossword GetTestCrosswordById(int id);
    void AddTestCrossword(TestCrossword crossword);
    void UpdateTestCrossword(TestCrossword crossword);
    void DeleteTestCrossword(int id);
}