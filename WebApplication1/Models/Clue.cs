using System.ComponentModel.DataAnnotations;
namespace CrossWorldApp.Models;

public class Clue
{
    [Key]
    public int Id { get; set; }
    public string ClueText { get; set; }
    public string Answer { get; set; }
    
    public ICollection<CrosswordClue> CrosswordClues { get; set; } // The many-to-many joining table
}