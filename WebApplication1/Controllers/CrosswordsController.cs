using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CrossWorldApp;
using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.ViewModels.Crosswords;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace CrossWorldApp.Controllers
{
    public class CrosswordsController : Controller
    {
        private readonly CrossWorldDbContext _context;
        private readonly ITestCrosswordRepository _testCrosswordRepository;

        public CrosswordsController(
            CrossWorldDbContext context,
            ITestCrosswordRepository testCrosswordRepository
            )
        {
            _context = context;
            _testCrosswordRepository = testCrosswordRepository;
        }

        // GET: Crosswords
        public async Task<IActionResult> Index()
        {
              return _context.TestCrosswords != null ? 
                          View(new CrosswordsIndexViewModel
                          {
                              Crosswords = await _context.TestCrosswords.ToListAsync()
                          }) :
                          Problem("Entity set 'CrossWorldDbContext.TestCrosswords'  is null.");
        }

        // GET: Crosswords/Details/5
        public async Task<IActionResult> Details(int? id)
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
            if (ModelState.IsValid)
            {
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
