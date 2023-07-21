using CrossWorldApp.Models;
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
    }

    public interface IDraftService
    {
        Draft newMini(CrossworldUser user);
    }
}
