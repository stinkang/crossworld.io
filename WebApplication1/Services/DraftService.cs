using CrossWorldApp.Models;
using CrossWorldApp.ViewModels.Drafts;
using Microsoft.AspNetCore.Identity;

namespace CrossWorldApp.Services
{
    public class DraftService: IDraftService
    {
        public Draft newMini(CrossworldUser user)
        {
            var draft = new Draft
            {
                Id = Guid.NewGuid().ToString(),
                User = user,
                Title = "Untitled",
                Grid = new List<List<string>>
                {
                    new List<string> { ".", ".", ".", ".", "." },
                    new List<string> { ".", ".", ".", ".", "." },
                    new List<string> { ".", ".", ".", ".", "." },
                    new List<string> { ".", ".", ".", ".", "." },
                    new List<string> { ".", ".", ".", ".", "." },
                },
                Clues = new TestCrosswordClues
                {
                    Across = new List<string>(),
                    Down = new List<string>()
                }
            };
            return draft;
        }
        
        public DraftsIndexViewModel GetIndexViewModel(List<Draft> drafts)
        {
            var viewModel = new DraftsIndexViewModel
            {
                Drafts = drafts.Select(d => new DraftsIndexDraftViewModel
                {
                    Id = d.Id,
                    Title = d.Title,
                    Grid = d.Grid
                })
            };
            
            return viewModel;
        }
    }

    public interface IDraftService
    {
        Draft newMini(CrossworldUser user);
        DraftsIndexViewModel GetIndexViewModel(List<Draft> drafts);
    }
}
