using System.Security.Claims;

namespace CrossWorldApp.Tests;

public static class UserTestUtils
{
    public static ClaimsPrincipal GetMockUser()
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Name, "TestUser")
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var user = new ClaimsPrincipal(identity);

        return user;
    }
}