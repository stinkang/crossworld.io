using CrossWorldApp.Models;
using CrossWorldApp.Repositories;

namespace WebApplication1.Services;

public class CrosswordService: ICrosswordService
{
    private readonly ITestCrosswordRepository _testCrosswordRepository;
    
    public CrosswordService(ITestCrosswordRepository testCrosswordRepository)
    {
        _testCrosswordRepository = testCrosswordRepository;
    }
    
}

public interface ICrosswordService
{
    
}