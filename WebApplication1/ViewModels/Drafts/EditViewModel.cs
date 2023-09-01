using CrossWorldApp.Models;

namespace CrossWorldApp.ViewModels.Drafts;

public class EditViewModel
{
   public string? Id { get; set; }
   public string? InitialTitle { get; set; }
   public List<List<string>>? InitialGrid { get; set; }
   public TestCrosswordClues? InitialClues { get; set; }
}