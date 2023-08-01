namespace CrossWorldApp.ViewModels.Crosswords;

public class LeaderboardItemViewModel
{
    public bool IsCoOp { get; set; }
    public string UserName { get; set; }
    public double MillisecondsElapsed { get; set; }
    public bool UsedHints { get; set; }
    public string UserId { get; set; }
    public bool IsSolved { get; set; }

    public LeaderboardItemViewModel(Models.Solve solve)
    {
        IsCoOp = solve.IsCoOp;
        UserName = solve.UserName;
        MillisecondsElapsed = solve.MillisecondsElapsed;
        UsedHints = solve.UsedHints;
        UserId = solve.UserId;
        IsSolved = solve.IsSolved;
    }
}