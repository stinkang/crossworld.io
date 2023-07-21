using CrossWorldApp.Models;

namespace CrossWorldApp.ViewModels.Crosswords;

public class CrosswordsIndexViewModel
{
    public IEnumerable<TestCrossword> Crosswords { get; set; }
}