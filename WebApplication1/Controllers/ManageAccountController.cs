using CrossWorldApp.Models;
using CrossWorldApp.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CrossWorldApp.Controllers
{
    public class ManageAccountController : Controller
    {
        private readonly UserManager<CrossworldUser> _userManager;
        private readonly SignInManager<CrossworldUser> _signInManager;
        private readonly ILogger<ManageAccountController> _logger;

        public ManageAccountController(
            UserManager<CrossworldUser> userManager,
            SignInManager<CrossworldUser> signInManager,
            ILogger<ManageAccountController> logger

            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var userName = await _userManager.GetUserNameAsync(user);
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);

            var model = new IndexViewModel
            {
                Username = userName,
                Input = new IndexViewModel.InputModel { PhoneNumber = phoneNumber }
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Index(IndexViewModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (model.Input.PhoneNumber != phoneNumber)
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, model.Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    // you may want to use the ViewData to store the status message
                    ViewData["StatusMessage"] = "Unexpected error when trying to set phone number.";
                    return View(model);
                }
            }

            await _signInManager.RefreshSignInAsync(user);
            ViewData["StatusMessage"] = "Your profile has been updated";
            return View(model);
        }

        [HttpGet]
        [Authorize]
        public IActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                foreach (var error in changePasswordResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return View(model);
            }

            await _signInManager.RefreshSignInAsync(user);
            _logger.LogInformation("User changed their password successfully.");

            // Instead of StatusMessage, use TempData or ViewBag
            TempData["StatusMessage"] = "Your password has been changed.";

            return RedirectToAction("Index"); // You may want to implement a confirmation page.
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ChangeUsername()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            
            var model = new ChangeUsernameViewModel
            {
                Username = await _userManager.GetUserNameAsync(user)
            };

            return View(model);
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeUsername(ChangeUsernameViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            
            var setUsernameResult = await _userManager.SetUserNameAsync(user, model.Username);
            if (!setUsernameResult.Succeeded)
            {
                foreach (var error in setUsernameResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return View(model);
            }

            await _signInManager.RefreshSignInAsync(user);
            TempData["StatusMessage"] = "Your username has been changed.";

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> ExternalLogins()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var currentLogins = await _userManager.GetLoginsAsync(user);

            var model = new ExternalLoginsViewModel
            {
                CurrentLogins = await _userManager.GetLoginsAsync(user),
                OtherLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync())
                    .Where(auth => currentLogins.All(ul => auth.Name != ul.LoginProvider))
                    .ToList(),
                ShowRemoveButton = currentLogins.Count > 1 // Add password check logic here if necessary
            };

            return View(model);
        }
    }
}
