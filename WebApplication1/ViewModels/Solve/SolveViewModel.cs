namespace CrossWorldApp.ViewModels.Solve;
using CrossWorldApp.Models;

public class SolveViewModel
{
    public string SolveId { get; set; }
    
    public int CrosswordId { get; set; }
    
    public double MillisecondsElapsed { get; set; }
    
    public List<List<string>> SolveGrid { get; set; }

    public bool IsSolved { get; set; }
    
    public bool IsCoOp { get; set; }
    
    public bool UsedHints { get; set; }
    
    public string TestCrosswordTitle { get; set; }
    
    public string TestCrosswordAuthor { get; set; }
    
    public List<List<string>> TestCrosswordGrid { get; set; }
}