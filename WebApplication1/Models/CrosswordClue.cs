namespace CrossWorldApp.Models;

public class CrosswordClue
{
    public int CrosswordId { get; set; } // Foreign key property
    public Crossword Crossword { get; set; } // Navigation property

    public int ClueId { get; set; } // Foreign key property
    public Clue Clue { get; set; } // Navigation property
}