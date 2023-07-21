using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
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
            return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
        }

        return View(user.Drafts);
    }

    [HttpGet]
    public JsonResult DraftExists(string id)
    {
        var draft = _draftRepository.GetDraftById(id);
        return Json(draft != null);
    }

    [HttpGet]
    public async Task<JsonResult> Create()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return new JsonResult(new { error = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
        }

        var id = Guid.NewGuid().ToString();

        return new JsonResult(new { id = id });
    }

    [HttpPost]
    public async Task<JsonResult> Create(string id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return new JsonResult(new { error = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
        }

        Draft draft = new Draft();
        draft.Id = id;
        draft.User = user;

        return new JsonResult(new { draft = draft });
    }

    [HttpPost]
    public async Task<JsonResult> Create([FromBody] Draft draft)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return new JsonResult(new { error = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
        }
        if (!ModelState.IsValid)
        {
            return new JsonResult(new { error = "Invalid model state." });
        }
        draft.User = user;
        _draftRepository.AddDraft(draft);

        _logger.LogInformation($"Draft created by {user.UserName}.");

        return new JsonResult(new { draft = draft } );
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Draft draft)
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
            _draftRepository.UpdateDraft(draft);
            return RedirectToAction(nameof(Index));
        }

        return View(draft);
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
        CrossworldUser user = await _userManager.GetUserAsync(User);
        Draft draft = _draftRepository.GetDraftById(id);

        if (draft != null && draft.UserId != user.Id)
        {
            return NotFound();
        }

        if (draft == null)
        {
            await Create(id);
        }

        ViewData["id"] = id;

        return View();
    }
}