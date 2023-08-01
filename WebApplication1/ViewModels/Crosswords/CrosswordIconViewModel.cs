using CrossWorldApp.Models;

namespace CrossWorldApp.ViewModels.Crosswords;

public class CrosswordIconViewModel
{
    public int Id { get; set; }
    
    public string UserId { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public bool IsAnonymous { get; set; }
    public List<LeaderboardItemViewModel> Solves { get; set; }
    public List<List<string>> Grid { get; set; }

    public CrosswordIconViewModel(TestCrossword crossword)
    {
        Id = crossword.Id;
        Title = crossword.Title;
        UserId = crossword.UserId;
        Author = crossword.Author;
        IsAnonymous = crossword.IsAnonymous;
        Grid = crossword.Grid;
        Solves = crossword.Solves.Select(solve => new LeaderboardItemViewModel(solve)).ToList();
    }
}