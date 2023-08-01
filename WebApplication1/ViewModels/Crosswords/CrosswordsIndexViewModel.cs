using CrossWorldApp.Models;

namespace CrossWorldApp.ViewModels.Crosswords;

public class CrosswordsIndexViewModel
{
    public IEnumerable<CrosswordIconViewModel> Crosswords { get; set; }
}