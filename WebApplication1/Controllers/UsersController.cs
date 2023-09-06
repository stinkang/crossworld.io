using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CrossWorldApp.Models;
using CrossWorldApp;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
using CrossWorldApp.ViewModels;
using CrossWorldApp.ViewModels.Users;
using Microsoft.AspNetCore.Identity;

namespace CrossWorldApp.Controllers
{
    public class UsersController : Controller
    {
        private readonly CrossWorldDbContext _context;
        private readonly UserManager<CrossworldUser> _userManager;
        private readonly ICrossworldUserService _userService;
        private readonly ITestCrosswordRepository _crosswordRepository;
        private readonly SignInManager<CrossworldUser> _signInManager;


        public UsersController(
            CrossWorldDbContext context,
            UserManager<CrossworldUser> userManager,
            ICrossworldUserService userService,
            ITestCrosswordRepository crosswordRepository,
            ISolveRepository solveRepository,
            SignInManager<CrossworldUser> signInManager
            )
        {
            _context = context;
            _userManager = userManager;
            _userService = userService;
            _crosswordRepository = crosswordRepository;
            _signInManager = signInManager;
        }

        // GET: Users
        public async Task<IActionResult> Index()
        {
              return _context.Users != null ? 
                          View(await _context.Users.ToListAsync()) :
                          Problem("Entity set 'CrossWorldDbContext.User'  is null.");
        }

        // GET: Users/Details/5
        public async Task<IActionResult> Details(string? id)
        {
            if (id == null || _context.Users == null)
            {
                return NotFound();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(m => m.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // GET: Users/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Users/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                _context.Add(user);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // GET: Users/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Users == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        // POST: Users/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Id,Uid,Username")] User user)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || currentUser.Id != id)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            
            if (id != user.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(user);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(user.Id))
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
            return View(user);
        }

        // GET: Users/Delete/5
        public async Task<IActionResult> Delete(string? id)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || currentUser.Id != id)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            
            if (id == null || _context.Users == null)
            {
                return NotFound();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(m => m.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed()
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'CrossWorldDbContext.User'  is null.");
            }
            
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            
            await _signInManager.SignOutAsync();
            
            _context.Users.Remove(currentUser);
            _context.TestCrosswords.RemoveRange(_context.TestCrosswords.Where(c => c.UserId == currentUser.Id));
            _context.Solves.RemoveRange(_context.Solves.Where(s => s.UserId == currentUser.Id));
            _context.Drafts.RemoveRange(_context.Drafts.Where(d => d.UserId == currentUser.Id));

            await _context.SaveChangesAsync();
            
            return RedirectToAction("Index", "Crosswords");
        }
        
        [HttpGet]
        [Route("User/Profile/{userName}")]
        public async Task<IActionResult> Profile(string userName)
        {
            var profileUser = await _userService.GetUserByUserNameWithTestCrosswordsAsync(userName);

            var viewModel = new ProfileViewModel
            {
                UserName = profileUser.UserName,
                CompletedCrosswords = _crosswordRepository.GetCompletedCrosswordsForUser(profileUser.Id).ToList(),
                PublishedCrosswords = profileUser.PublishedTestCrosswords.ToList()
            };

            return View(viewModel);
        }

        private bool UserExists(string id)
        {
          return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
