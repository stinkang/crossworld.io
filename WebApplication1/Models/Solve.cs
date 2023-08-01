using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace CrossWorldApp.Models;

public class Solve
{
    [Key]
    public string Id { get; set; }
    
    public double MillisecondsElapsed { get; set; }
    
    public int TestCrosswordId { get; set; }
    
    [ForeignKey("TestCrosswordId")]
    public TestCrossword TestCrossword { get; set; }
    
    public string? UserId { get; set; }
    
    [ForeignKey("UserId")]
    public CrossworldUser? User { get; set; }

    public string? UserName { get; set; }
    
    [NotMapped]
    public List<List<string>> SolveGrid { get; set; }
    
    [System.Text.Json.Serialization.JsonIgnore]
    [Column(TypeName = "text")]
    public string GridString {
        get
        {
            return JsonConvert.SerializeObject(SolveGrid);
        }
        set
        {
            SolveGrid = JsonConvert.DeserializeObject<List<List<string>>>(value);
        }
    }
    
    public bool IsSolved { get; set; }
    
    public bool IsCoOp { get; set; }
    
    public bool UsedHints { get; set; }
}