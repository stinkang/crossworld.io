using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CrossWorldApp;
using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
using CrossWorldApp.ViewModels.Crosswords;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace CrossWorldApp.Controllers
{
    public class CrosswordsController : Controller
    {
        private readonly CrossWorldDbContext _context;
        private readonly ITestCrosswordRepository _testCrosswordRepository;
        private readonly ICrossworldUserService _userService;
        private readonly UserManager<CrossworldUser> _userManager;
        

        public CrosswordsController(
            CrossWorldDbContext context,
            ITestCrosswordRepository testCrosswordRepository,
            ICrossworldUserService userService,
            UserManager<CrossworldUser> userManager
            )
        {
            _context = context;
            _testCrosswordRepository = testCrosswordRepository;
            _userService = userService;
            _userManager = userManager;
        }

        // GET: Crosswords
        public async Task<IActionResult> Index(int page = 0, int pageSize = 10)
        {
            if (_context.TestCrosswords == null)
            {
                return Problem("Entity set 'CrossWorldDbContext.TestCrosswords'  is null.");
            }

            var crosswords = _testCrosswordRepository.GetTestCrosswordsWithSolves()
                .OrderByDescending(crosswords => crosswords.CreatedAt) 
                .Skip(page * pageSize)
                .Take(pageSize);
            
            var crosswordViewModels = crosswords
                .Select(crossword => new CrosswordIconViewModel(crossword));
              
            return View(new CrosswordsIndexViewModel { Crosswords = crosswordViewModels });
        }
        
        public async Task<JsonResult> CrosswordPage(int page = 0, int pageSize = 10)
        {
            if (_context.TestCrosswords == null)
            {
                return Json(new { error = "Crosswords are null" });
            }

            var crosswords = _testCrosswordRepository.GetTestCrosswordsWithSolves()
                .OrderByDescending(crosswords => crosswords.CreatedAt) 
                .Skip(page * pageSize)
                .Take(pageSize);
            
            var crosswordViewModels = crosswords
                .Select(crossword => new CrosswordIconViewModel(crossword));

            return Json(new { crosswordViewModels });
        }

        // GET: Crosswords/Details/5
        public async Task<JsonResult> Details(int? id)
        {
            if (id == null || _context.TestCrosswords == null)
            {
                return new JsonResult(new { error = "Not found crossword" });
            }

            var crossword = _testCrosswordRepository.GetTestCrosswordWithUser(id.Value);
            if (crossword == null)
            {
                return new JsonResult(new { error = "Not found crossword" });
            }

            return Json(
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
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Width,Height,Grid")] Crossword crossword)
        {
            if (ModelState.IsValid)
            {
                _context.Add(crossword);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(crossword);
        }

        // POST: Crosswords/Create2
        // To protect from overposting attacks, enable the specific properties you want to bind to.
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
            return View(crossword);
        }

        // GET: Crosswords/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Crosswords == null)
            {
                return NotFound();
            }

            var crossword = await _context.Crosswords.FindAsync(id);
            if (crossword == null)
            {
                return NotFound();
            }
            return View(crossword);
        }

        // POST: Crosswords/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
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
                    _context.Update(crossword);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CrosswordExists(crossword.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(crossword);
        }

        // GET: Crosswords/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Crosswords == null)
            {
                return NotFound();
            }

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
            if (_context.Crosswords == null)
            {
                return Problem("Entity set 'CrossWorldDbContext.Crosswords'  is null.");
            }
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
          return (_context.Crosswords?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
