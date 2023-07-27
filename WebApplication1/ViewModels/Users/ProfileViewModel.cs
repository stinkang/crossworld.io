using CrossWorldApp.Models;

namespace CrossWorldApp.ViewModels.Users;

public class ProfileViewModel
{
    public string UserName { get; set; }
    public List<TestCrossword> CompletedCrosswords { get; set; }
    
    public List<TestCrossword> PublishedCrosswords { get; set; }
}