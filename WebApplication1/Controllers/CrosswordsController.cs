using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.ViewModels.Crosswords;
using Microsoft.AspNetCore.Identity;

namespace CrossWorldApp.Controllers;
public class CrosswordsController : Controller
{
    private readonly ICrossWorldDbContext _context;
    private readonly ITestCrosswordRepository _testCrosswordRepository;
    private readonly UserManager<CrossworldUser> _userManager;

    public CrosswordsController(
        ICrossWorldDbContext context,
        ITestCrosswordRepository testCrosswordRepository,
        UserManager<CrossworldUser> userManager
        )
    {
        _context = context;
        _testCrosswordRepository = testCrosswordRepository;
        _userManager = userManager;
    }

    // GET: Crosswords
    public IActionResult Index(int page = 0, int pageSize = 10)
    {
        var crosswords = _testCrosswordRepository.GetTestCrosswordsWithSolves()
            .OrderByDescending(crosswords => crosswords.CreatedAt)
            .Skip(page * pageSize)
            .Take(pageSize);

        var crosswordViewModels = crosswords
            .Select(crossword => new CrosswordIconViewModel(crossword));
        
        var viewModel = new CrosswordsIndexViewModel { Crosswords = crosswordViewModels, IsLoggedIn = User.Identity!.IsAuthenticated };

        return View(viewModel);
    }
    
    public JsonResult CrosswordPage(int page = 0, int pageSize = 10)
    {
        var crosswords = _testCrosswordRepository.GetTestCrosswordsWithSolves()
            .OrderByDescending(crosswords => crosswords.CreatedAt) 
            .Skip(page * pageSize)
            .Take(pageSize);
        
        var crosswordViewModels = crosswords
            .Select(crossword => new CrosswordIconViewModel(crossword));

        return new JsonResult(new { crosswordViewModels });
    }

    // GET: Crosswords/Details/5
    public JsonResult Details(int? id)
    {
        if (id == null)
        {
            return new JsonResult(new { error = "Not found crossword" });
        }

        var crossword = _testCrosswordRepository.GetTestCrosswordWithUser(id.Value);
        if (crossword == null)
        {
            return new JsonResult(new { error = "Not found crossword" });
        }
        
        if (crossword.User == null)
        {
            return new JsonResult(new { error = "Crossword User is null" });
        }

        return new JsonResult(
            new
            {
                info = new
                {
                    author = crossword.IsAnonymous ? "Anonymous" : crossword.User.UserName, 
                    title = crossword.Title
                }, 
                grid = crossword.Grid,
                clues = crossword.Clues
            }
        );
    }

    // GET: Crosswords/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: Crosswords/Create
    // To protect from over posting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Width,Height,Grid")] Crossword crossword)
    {
        if (ModelState.IsValid)
        {
            _context.Crosswords.Add(crossword);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(crossword);
    }

    // POST: Crosswords/Create2
    // To protect from over posting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    public async Task<IActionResult> Create2([FromBody] TestCrossword crossword)
    {
        var user = await _userManager.GetUserAsync(User);
        
        if (ModelState.IsValid)
        {
            crossword.UserId = user.Id;
            crossword.Author = crossword.IsAnonymous ? "Anonymous" : user.UserName;
            _testCrosswordRepository.AddTestCrossword(crossword);
            return RedirectToAction(nameof(Index));
        }
        return RedirectToAction(nameof(Index));
    }

    // GET: Crosswords/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        var crossword = await _context.Crosswords.FindAsync(id);
        if (crossword == null)
        {
            return NotFound();
        }
        return View(crossword);
    }

    // POST: Crosswords/Edit/5
    // To protect from over posting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("Id,Width,Height,Grid")] Crossword crossword)
    {
        if (id != crossword.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Crosswords.Update(crossword);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CrosswordExists(crossword.Id))
                {
                    return NotFound();
                }
                throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(crossword);
    }

    // GET: Crosswords/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
        var crossword = await _context.Crosswords
            .FirstOrDefaultAsync(m => m.Id == id);
        if (crossword == null)
        {
            return NotFound();
        }

        return View(crossword);
    }

    // POST: Crosswords/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var crossword = await _context.Crosswords.FindAsync(id);
        if (crossword != null)
        {
            _context.Crosswords.Remove(crossword);
        }
        
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool CrosswordExists(int id)
    {
      return _context.Crosswords.Any(e => e.Id == id);
    }
}
