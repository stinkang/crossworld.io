using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CrossWorldApp.Models
{
    public class TestCrossword
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public string Author { get; set; }

        public string? UserId { get; set; } // Foreign key property

        [ForeignKey("UserId")]
        public CrossworldUser? User { get; set; }

        [NotMapped]
        public List<List<string>> Grid {  get; set; }


        [System.Text.Json.Serialization.JsonIgnore]
        [Column(TypeName = "text")]
        public string GridString {
            get
            {
                return JsonConvert.SerializeObject(Grid);
            }
            set
            {
                Grid = JsonConvert.DeserializeObject<List<List<string>>>(value);
            }
        }

        [NotMapped]
        public TestCrosswordClues Clues { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [Column(TypeName = "text")]
        public string CluesString
        {
            get
            {
                return JsonConvert.SerializeObject(Clues);
            }
            set
            {
                Clues = JsonConvert.DeserializeObject<TestCrosswordClues>(value);
            }
        }

    }
}
