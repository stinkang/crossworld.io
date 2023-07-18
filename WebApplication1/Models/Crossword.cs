using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace CrossWorldApp.Models;

public class Crossword
{
    [Key]
    public int Id { get; set; }

    public string Title { get; set; }

    public string Author { get; set; }

    public ICollection<CrosswordClue> CrosswordClues { get; set; } // The many-to-many joining table

    public int UserId { get; set; } // Foreign key property
    
    [ForeignKey("UserId")]
    public User User { get; set; }

    [Column(TypeName = "text")]
    public string GridJson { get; set; }

    [NotMapped]
    public List<List<string>>? Grid
    {
        get
        {
            return GridJson == null ? null : JsonConvert.DeserializeObject<List<List<string>>>(GridJson);
        }
        set
        {
            GridJson = JsonConvert.SerializeObject(value);
        }
    }
}