using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers;

public class CrosswordFeedController : Controller
{
    private readonly ICrosswordRepository _crosswordRepository;

    public CrosswordFeedController(ICrosswordRepository crosswordRepository)
    {
        _crosswordRepository = crosswordRepository;
    }

    public IActionResult Index()
    {
        var crosswords = _crosswordRepository.GetAllCrosswords();
        return View(crosswords);
    }

    public IActionResult Details(int id)
    {
        var crossword = _crosswordRepository.GetCrosswordById(id);
        if (crossword == null)
        {
            return NotFound();
        }
        return View(crossword);
    }
    
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(Crossword crossword)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _crosswordRepository.AddCrossword(crossword);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult Edit(int id, Crossword crossword)
    {
        if (!ModelState.IsValid || id != crossword.Id)
        {
            return BadRequest(ModelState);
        }
        var existingCrossword = _crosswordRepository.GetCrosswordById(id);
        if (existingCrossword == null)
        {
            return NotFound();
        }
        _crosswordRepository.UpdateCrossword(crossword);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult Delete(int id)
    {
        var crossword = _crosswordRepository.GetCrosswordById(id);
        if (crossword == null)
        {
            return NotFound();
        }
        _crosswordRepository.DeleteCrossword(id);
        return RedirectToAction("Index");
    }
}
