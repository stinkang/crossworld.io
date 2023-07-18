namespace CrossWorldApp.Models;

public class Word
{
    public int Id { get; set; }
    public string Text { get; set; }
    
    // Clues for this word.
    public List<Clue> Clues { get; set; }
}