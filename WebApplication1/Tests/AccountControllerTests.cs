using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NUnit.Framework;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CrossWorldApp.Models;
using CrossWorldApp.ViewModels.Account;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace CrossWorldApp.Tests
{
    [TestFixture]
    public class AccountControllerTests
    {
        private AccountController _sut;
        private SignInManager<CrossworldUser> _signInManager;
        private UserManager<CrossworldUser> _userManager;
        private ILogger<AccountController> _logger;
        private IEmailSender _emailSender;

        [SetUp]
        public void SetUp()
        {
            // Substituting the dependencies
            _userManager = Substitute.For<UserManager<CrossworldUser>>(Substitute.For<IUserStore<CrossworldUser>>(), null, null, null, null, null, null, null, null);
            _signInManager = Substitute.For<SignInManager<CrossworldUser>>(_userManager, Substitute.For<IHttpContextAccessor>(), Substitute.For<IUserClaimsPrincipalFactory<CrossworldUser>>(), null, null, null, null);
            _logger = Substitute.For<ILogger<AccountController>>();
            _emailSender = Substitute.For<IEmailSender>();

            // Creating the system under test (_sut)
            _sut = new AccountController(_signInManager, _userManager, _emailSender, _logger);
            
            // Create a substitute for IUrlHelper
            var urlHelper = Substitute.For<IUrlHelper>();

            // Create a factory that returns the IUrlHelper
            var urlHelperFactory = Substitute.For<IUrlHelperFactory>();
            urlHelperFactory.GetUrlHelper(Arg.Any<ActionContext>()).Returns(urlHelper);

            // Create a substitute for the TempData dictionary
            var tempData = Substitute.For<ITempDataDictionary>();

            // Create a factory that returns the TempData dictionary
            var tempDataFactory = Substitute.For<ITempDataDictionaryFactory>();
            tempDataFactory.GetTempData(Arg.Any<HttpContext>()).Returns(tempData);
            
            // Create a substitute for the authentication service
            var authenticationService = Substitute.For<IAuthenticationService>();
            authenticationService.SignOutAsync(Arg.Any<HttpContext>(), Arg.Any<string>(), Arg.Any<AuthenticationProperties>()).Returns(Task.CompletedTask);

            // Create a service provider that returns the authentication service
            var serviceProvider = Substitute.For<IServiceProvider>();
            serviceProvider.GetService(typeof(IAuthenticationService)).Returns(authenticationService);
            serviceProvider.GetService(typeof(ITempDataDictionaryFactory)).Returns(tempDataFactory);
            serviceProvider.GetService(typeof(IUrlHelperFactory)).Returns(urlHelperFactory);
            
            // Set up ControllerContext
            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    RequestServices = serviceProvider
                }
            };
        }

        [Test]
        public void Register_UserIsAuthenticated_RedirectsToHome()
        {
            // Arrange
            // Substituting that the user is already authenticated
            _sut.ControllerContext.HttpContext.User = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.Authentication, "true")
                    }, "TestAuthentication"
                )
            );


            // Act
            var result = _sut.Register();

            // Assert
            var redirectToActionResult = result as RedirectToActionResult;
            Assert.AreEqual("Index", redirectToActionResult!.ActionName);
            Assert.AreEqual("Home", redirectToActionResult.ControllerName);
        }

        
        [Test]
        public async Task Register_WhenModelStateIsInvalid_ReturnsViewWithModel()
        {
            // Arrange
            _sut.ModelState.AddModelError("Error", "Test error");
            var model = new RegisterViewModel();

            // Act
            var result = await _sut.Register(model);

            // Assert
            Assert.That(result, Is.InstanceOf<ViewResult>());
            Assert.That(((ViewResult)result).Model, Is.EqualTo(model));
        }

        [Test]
        public async Task Register_WhenRegistrationSucceeds_RedirectsToCrosswordsIndex()
        {
            // Arrange
            var model = new RegisterViewModel { Username = "testuser", Email = "test@example.com", Password = "password" };
            _userManager.CreateAsync(Arg.Any<CrossworldUser>(), model.Password).Returns(IdentityResult.Success);

            // Act
            var result = await _sut.Register(model);

            // Assert
            Assert.That(result, Is.InstanceOf<RedirectToActionResult>());
            Assert.That(((RedirectToActionResult)result).ActionName, Is.EqualTo("Index"));
            Assert.That(((RedirectToActionResult)result).ControllerName, Is.EqualTo("Crosswords"));
        }

        [Test]
        public async Task Register_WhenRegistrationFails_ReturnsViewWithModel()
        {
            // Arrange
            var model = new RegisterViewModel();
            var identityError = new IdentityError { Description = "Test error" };
            _userManager.CreateAsync(Arg.Any<CrossworldUser>(), model.Password).Returns(IdentityResult.Failed(identityError));

            // Act
            var result = await _sut.Register(model);

            // Assert
            Assert.That(result, Is.InstanceOf<ViewResult>());
            Assert.That(((ViewResult)result).Model, Is.EqualTo(model));
            // You may also want to verify that the error has been added to the ModelState.
        }
        
        [Test]
        public async Task Login_Get_ReturnsViewWithExternalLogins()
        {
            // Arrange
            var externalAuthSchemes = new List<AuthenticationScheme> { new AuthenticationScheme("Test", "Test", typeof(IAuthenticationHandler)) };
            _signInManager.GetExternalAuthenticationSchemesAsync().Returns(externalAuthSchemes);

            // Act
            var result = await _sut.Login();

            // Assert
            Assert.That(result, Is.InstanceOf<ViewResult>());
            Assert.That(_sut.ViewBag.ExternalLogins, Is.EqualTo(externalAuthSchemes));
        }
        
        [Test]
        public async Task Login_Post_WhenLoginSucceeds_RedirectsToReturnUrl()
        {
            // Arrange
            var model = new LoginViewModel { Username = "testuser", Password = "password" };
            _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false).Returns(SignInResult.Success);
            var returnUrl = "/sampleReturnUrl";
            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    Request = { Query = new QueryCollection(new Dictionary<string, StringValues> { { "returnUrl", returnUrl } }) }
                }
            };

            // Act
            var result = await _sut.Login(model);

            // Assert
            Assert.That(result, Is.InstanceOf<LocalRedirectResult>());
            Assert.That(((LocalRedirectResult)result).Url, Is.EqualTo(returnUrl));
        }
        
        [Test]
        public async Task Logout_Post_RedirectsToReturnUrlIfExists()
        {
            // Arrange
            var returnUrl = "/sampleReturnUrl";

            // Act
            var result = await _sut.Logout(returnUrl);

            // Assert
            await _signInManager.Received().SignOutAsync();
            _logger.Received().LogInformation("User logged out.");
            Assert.That(result, Is.InstanceOf<LocalRedirectResult>());
            Assert.That(((LocalRedirectResult)result).Url, Is.EqualTo(returnUrl));
        }
        
        [Test]
        public async Task Logout_Post_RedirectsToHomeIndexIfReturnUrlDoesNotExist()
        {
            // Arrange

            // Act
            var result = await _sut.Logout();

            // Assert
            await _signInManager.Received().SignOutAsync();
            _logger.Received().LogInformation("User logged out.");
            Assert.That(result, Is.InstanceOf<RedirectToActionResult>());
            Assert.That(((RedirectToActionResult)result).ActionName, Is.EqualTo("Index"));
            Assert.That(((RedirectToActionResult)result).ControllerName, Is.EqualTo("Home"));
        }
        
        [Test]
        public async Task ForgotPassword_InvalidModelState_ReturnsViewWithModel()
        {
            // Arrange
            _sut.ModelState.AddModelError("Error", "Sample error");
            var model = new ForgotPasswordViewModel();

            // Act
            var result = await _sut.ForgotPassword(model);

            // Assert
            Assert.That(result, Is.InstanceOf<ViewResult>());
            Assert.That(((ViewResult)result).Model, Is.EqualTo(model));
        }

        [Test]
        public async Task ForgotPassword_UserNotFoundOrEmailNotConfirmed_RedirectsToConfirmation()
        {
            // Arrange
            var model = new ForgotPasswordViewModel { Email = "test@example.com" };
            _userManager.FindByEmailAsync(model.Email).Returns(Task.FromResult<CrossworldUser?>(null));

            // Act
            var result = await _sut.ForgotPassword(model);

            // Assert
            Assert.That(result, Is.InstanceOf<RedirectToActionResult>());
            Assert.That(((RedirectToActionResult)result).ActionName, Is.EqualTo("ForgotPasswordConfirmation"));
        }

        [Test]
        public async Task ForgotPassword_ValidUserAndEmail_ResetsPasswordAndRedirectsToConfirmation()
        {
            // Arrange
            var user = new CrossworldUser { Email = "test@example.com" };
            var model = new ForgotPasswordViewModel { Email = user.Email };
            var token = "sampleToken";
            _userManager.FindByEmailAsync(user.Email).Returns(Task.FromResult(user));
            _userManager.IsEmailConfirmedAsync(user).Returns(Task.FromResult(true));
            _userManager.GeneratePasswordResetTokenAsync(user).Returns(Task.FromResult(token));

            // Act
            var result = await _sut.ForgotPassword(model);

            // Assert
            await _userManager.Received(1).GeneratePasswordResetTokenAsync(user);
            await _emailSender.Received(1).SendEmailAsync(user.Email, "Reset Password", Arg.Any<string>());
            Assert.That(result, Is.InstanceOf<RedirectToActionResult>());
            Assert.That(((RedirectToActionResult)result).ActionName, Is.EqualTo("ForgotPasswordConfirmation"));
        }
        
        [Test]
        public void ForgotPasswordConfirmation_ReturnsView()
        {
            var result = _sut.ForgotPasswordConfirmation();

            Assert.IsInstanceOf<ViewResult>(result);
        }
        
        [Test]
        public void ResetPassword_Get_WithoutCode_ReturnsBadRequest()
        {
            var result = _sut.ResetPassword();

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public void ResetPassword_Get_WithCode_ReturnsViewWithModel()
        {
            var code = "sampleCode";
            var result = _sut.ResetPassword(code) as ViewResult;

            Assert.NotNull(result);
            var model = result.Model as ResetPasswordViewModel;
            Assert.NotNull(model);
            Assert.AreEqual(Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)), model.Code);
        }
        [Test]
        public async Task ResetPassword_Post_InvalidModelState_ReturnsView()
        {
            _sut.ModelState.AddModelError("error", "sample error");
            var result = await _sut.ResetPassword(new ResetPasswordViewModel());

            Assert.IsInstanceOf<ViewResult>(result);
        }

// Test when user is null
        [Test]
        public async Task ResetPassword_Post_UserNotFound_RedirectsToConfirmation()
        {
            _userManager.FindByEmailAsync(Arg.Any<string>()).Returns((CrossworldUser)null);

            var result = await _sut.ResetPassword(new ResetPasswordViewModel { Email = "test@test.com" });

            Assert.IsInstanceOf<RedirectToPageResult>(result);
            Assert.AreEqual("./ResetPasswordConfirmation", ((RedirectToPageResult)result).PageName);
        }

// Test when password reset succeeds
        [Test]
        public async Task ResetPassword_Post_Success_RedirectsToConfirmation()
        {
            var user = new CrossworldUser();
            _userManager.FindByEmailAsync(Arg.Any<string>()).Returns(user);
            _userManager.ResetPasswordAsync(user, Arg.Any<string>(), Arg.Any<string>()).Returns(IdentityResult.Success);

            var result = await _sut.ResetPassword(new ResetPasswordViewModel());

            Assert.IsInstanceOf<RedirectToPageResult>(result);
            Assert.AreEqual("./ResetPasswordConfirmation", ((RedirectToPageResult)result).PageName);
        }

// Test when password reset fails
        [Test]
        public async Task ResetPassword_Post_Failure_ReturnsViewWithModel()
        {
            var user = new CrossworldUser();
            var identityError = new IdentityError { Description = "Test error" };
            _userManager.FindByEmailAsync(Arg.Any<string>()).Returns(user);
            _userManager.ResetPasswordAsync(user, Arg.Any<string>(), Arg.Any<string>()).Returns(IdentityResult.Failed(identityError));

            var result = await _sut.ResetPassword(new ResetPasswordViewModel());

            Assert.IsInstanceOf<ViewResult>(result);
        }

// Add more tests to cover other cases as needed

        [Test]
        public void ResetPasswordConfirmation_ReturnsView()
        {
            var result = _sut.ResetPasswordConfirmation();

            Assert.IsInstanceOf<ViewResult>(result);
        }

    }
}
