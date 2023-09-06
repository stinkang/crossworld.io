using CrossWorldApp.Controllers;
using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using CrossWorldApp.ViewModels.Crosswords;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NUnit.Framework;

namespace CrossWorldApp.Tests;

[TestFixture]
public class CrosswordsControllerTests
{
    #nullable disable
    private CrosswordsController _sut;
    private ICrossWorldDbContext _context;
    private ITestCrosswordRepository _testCrosswordRepository;
    private UserManager<CrossworldUser> _userManager;
    #nullable restore

    [SetUp]
    public void Setup()
    {
        _context = Substitute.For<ICrossWorldDbContext>();
        _testCrosswordRepository = Substitute.For<ITestCrosswordRepository>();
        _userManager = Substitute.For<UserManager<CrossworldUser>>(
            Substitute.For<IUserStore<CrossworldUser>>(), null, null, null, null, null, null, null, null);

        _sut = new CrosswordsController(_context, _testCrosswordRepository, _userManager);

        _sut.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = UserTestUtils.GetMockUser()
            }
        };
    }

    [Test]
    public void Index_ReturnsViewWithModel()
    {
        // Add some setup logic if needed.
        var result = _sut.Index() as ViewResult;
        Assert.IsNotNull(result);
        Assert.IsInstanceOf<CrosswordsIndexViewModel>(result!.Model);
    }

    [Test]
    public void Details_IdIsNull_ReturnsJsonError()
    {
        var result = _sut.Details(null);
        
        dynamic? value = result.Value;
        string? error = value?.error;    
        
        Assert.IsNotNull(error);
        Assert.AreEqual("Not found crossword", error);
    }

    [Test]
    public async Task Create_InvalidModel_ReturnsView()
    {
        _sut.ModelState.AddModelError("error", "some error");
        var result = await _sut.Create(new Crossword()) as ViewResult;
        Assert.IsNotNull(result);
    }

// ... Other tests for Create


}
