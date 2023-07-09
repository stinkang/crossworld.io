namespace WebApplication1.Models;

public class Crossword
{
    public int Id { get; set; }

    // Dimensions of the crossword
    public int Width { get; set; }
    public int Height { get; set; }

    // Clues for the crossword. 
    // Assuming a Clue class exists that contains properties for the clue text, direction, and number.
    public List<Clue> Clues { get; set; }

    // Grid squares. Could be 0 (white), -1 (black), or a different integer (for a word start).
    // Assuming it's a one-dimensional array, and you need to calculate position based on width and height.
    public int[] Grid { get; set; }
}