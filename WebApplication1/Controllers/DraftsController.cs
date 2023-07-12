using Microsoft.AspNetCore.Mvc;

namespace CrossWorldApp.Controllers;

public class DraftsController : Controller
{
    // GET
    [Route("Draft/{id:int}")]
    public IActionResult Index(int? id)
    {
        return View(id);
    }
}