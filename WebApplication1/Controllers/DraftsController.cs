using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
using CrossWorldApp.ViewModels.Drafts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CrossWorldApp.Controllers;

public class DraftsController : Controller
{
    private readonly ILogger<DraftsController> _logger;
    private readonly UserManager<CrossworldUser> _userManager;
    private readonly IDraftRepository _draftRepository;
    private readonly ICrossworldUserService _userService;
    private readonly IDraftService _draftService;

    public DraftsController(
        ILogger<DraftsController> logger,
        UserManager<CrossworldUser> userManager,
        IDraftRepository draftRepository,
        ICrossworldUserService userService,
        IDraftService draftService
        )
    {
        _logger = logger;
        _userManager = userManager;
        _draftRepository = draftRepository;
        _userService = userService;
        _draftService = draftService;
    }

    public async Task<IActionResult> Index()
    {
        var user = await _userService.GetUserWithDraftsAsync(_userManager.GetUserId(User));
        if (user == null)
        {
            return RedirectToAction("Login", "Account");
        }

        var viewModel = _draftService.GetIndexViewModel(user.Drafts);

        return View(viewModel);
    }

    [HttpGet]
    public JsonResult DraftExists(string id)
    {
        var draft = _draftRepository.GetDraftById(id);
        return Json(draft != null);
    }

    [HttpPost]
    public async Task<JsonResult> Create()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Json(new { error = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
        }

        var draft = new Draft(user);

        _draftRepository.AddDraft(draft);

        return Json(new { id = draft.Id });
    }

    [HttpPut]
    public async Task<JsonResult> Update([FromBody] Draft draft)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Json(new { error = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
        }

        if (ModelState.IsValid)
        {
            draft.User = user;
            _logger.LogInformation($"Draft updated by {user.UserName}.");
            _draftRepository.UpdateDraft(draft);
        }

        return Json(new { id = draft.Id });
    }
    
    [HttpPost]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
        }

        _draftRepository.DeleteDraft(id);

        _logger.LogInformation($"Draft deleted by {user.UserName}.");

        return RedirectToAction(nameof(Index));
    }

    /*    [HttpPut]
        public async Task<IActionResult> UpdateByFirebaseId([FromBody] Draft draft)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (ModelState.IsValid)
            {
                draft.User = user;
                _logger.LogInformation($"Draft updated by {user.UserName}.");
                _draftRepository.UpdateDraftByFirebaseId(draft);
                return RedirectToAction(nameof(Index));
            }

            return View(draft);
        }*/

    // GET
    [HttpGet]
    [Route("/Drafts/Edit/{id}")]
    public async Task<IActionResult> Edit(string id)
    {
        var user = await _userManager.GetUserAsync(User);
        var draft = _draftRepository.GetDraftById(id);

        if (draft == null || draft.UserId != user.Id)
        {
            return NotFound();
        }

        var viewModel = new EditViewModel
        {
            InitialTitle = draft.Title,
            InitialGrid = draft.Grid,
            InitialClues = draft.Clues,
            Id = draft.Id
        };

        return View(viewModel);
    }
}