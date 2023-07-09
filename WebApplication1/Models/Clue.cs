using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models;

public class Clue
{
    public int Id { get; set; }
    
    // Enum for direction of the clue (across or down)
    public enum Direction
    {
        Across,
        Down
    }

    public int Number { get; set; }
    public string ClueText { get; set; }
    public Direction ClueDirection { get; set; }
    public string Answer { get; set; }
    //public Word Answer { get; set; }
}