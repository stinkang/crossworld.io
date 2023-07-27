using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
using CrossWorldApp.ViewModels.Crosswords;
using CrossWorldApp.ViewModels.Solve;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CrossWorldApp.Controllers;

public class SolveController : Controller
{
    private readonly ITestCrosswordRepository _testCrosswordRepository;
    private readonly ICrossworldUserService _userService;
    private readonly ISolveRepository _solveRepository;
    private readonly UserManager<CrossworldUser> _userManager;

    public SolveController(
        ITestCrosswordRepository testCrosswordRepository,
        ICrossworldUserService userService,
        UserManager<CrossworldUser> userManager,
        ISolveRepository solveRepository
    )
    {
        _testCrosswordRepository = testCrosswordRepository;
        _userService = userService;
        _userManager = userManager;
        _solveRepository = solveRepository;
    }
    
    // GET
    public IActionResult Index()
    {
        return View();
    }
    
    // GET: Solve/Create
    public IActionResult Create()
    {
        return View();
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm]int crosswordId)
    {
        var userId = _userManager.GetUserId(User);
        var user = await _userManager.GetUserAsync(User);
        var crossword = _testCrosswordRepository.GetTestCrosswordById(crosswordId);
        
        if (crossword == null || user == null)
        {
            return NotFound();
        }

        var solve = await _userService.UserSolveForCrossword(userId, crosswordId);
        
        if (solve == null)
        {
            solve = new Solve
            {
                Id = Guid.NewGuid().ToString(),
                TestCrosswordId = crossword.Id,
                User = user,
                IsCoOp = false,
                IsSolved = false,
                UsedHints = false,
                MillisecondsElapsed = 0.0
            };
            
            _solveRepository.AddSolve(solve);
        }

        return RedirectToAction("Edit", new { id = solve.Id });
    }

    [HttpGet]
    public async Task<IActionResult> Edit(string id)
    {
        var user = await _userService.GetUserWithDraftsAsync(_userManager.GetUserId(User));
        var solve = _solveRepository.GetSolveById(id);
        
        if (solve == null || user == null)
        {
            return NotFound();
        }
        
        var viewModel = new SolveViewModel
        {
            SolveId = solve.Id,
            CrosswordId = solve.TestCrosswordId,
            SolveGrid = new List<List<string>>(),
            IsSolved = solve.IsSolved,
            IsCoOp = solve.IsCoOp,
            UsedHints = solve.UsedHints,
            MillisecondsElapsed = solve.MillisecondsElapsed,
            TestCrosswordAuthor = "",
            TestCrosswordTitle = solve.TestCrossword.Title,
            TestCrosswordGrid = solve.TestCrossword.Grid
        };
        
        return View(viewModel);
    }
    
    [HttpPost]
    public async Task<JsonResult> Edit([FromBody]SolveViewModel viewModel)
    {
        var user = await _userService.GetUserWithDraftsAsync(_userManager.GetUserId(User));
        var solve = _solveRepository.GetSolveById(viewModel.SolveId);
        
        if (solve == null || user == null)
        {
            return Json(new { error = "not found" });
        }
        
        solve.IsSolved = viewModel.IsSolved;
        //solve.IsCoOp = viewModel.IsCoOp;
        //solve.UsedHints = viewModel.UsedHints;
        solve.MillisecondsElapsed = viewModel.MillisecondsElapsed;
        solve.SolveGrid = viewModel.SolveGrid;
        
        _solveRepository.UpdateSolve(solve);

        return Json(new { success = "ok" });
    }

    [HttpGet]
    [Route("/Solve/Game/{id}")]
    public async Task<IActionResult> Game(string id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user != null)
        {
            ViewData["userName"] = user.UserName;
        }
        ViewData["id"] = id;
        
        
        return View();
    }
}