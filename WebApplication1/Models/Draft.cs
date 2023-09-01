using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrossWorldApp.Models
{
    public class Draft
    {

        [Key]
        public string Id { get; set; }

        public string Title { get; set; }

        public string? UserId { get; set; } // Foreign key property

        [ForeignKey("UserId")]
        public CrossworldUser? User { get; set; }

        [NotMapped]
        public List<List<string>> Grid { get; set; }


        [System.Text.Json.Serialization.JsonIgnore]
        [Column(TypeName = "text")]
        public string GridString
        {
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

        public Draft(CrossworldUser? user)
        {
            Id = Guid.NewGuid().ToString();
            User = user;
            Grid = new List<List<string>>
            {
                new List<string> { " ", " ", " " },
                new List<string> { " ", " ", " " },
                new List<string> { " ", " ", " " }
            };
            Clues = new TestCrosswordClues
            {
                Across = new List<string?>
                {
                    null,
                    "",
                    null,
                    null,
                    "",
                    ""
                },
                Down = new List<string?>
                {
                    null,
                    "",
                    "",
                    ""
                }
            };
            Title = "Untitled";
        }

        public Draft()
        {
            Id = "";
            User = null;
            Grid = new List<List<string>>
            {
                new List<string> { " ", " ", " " },
                new List<string> { " ", " ", " " },
                new List<string> { " ", " ", " " }
            };
            Clues = new TestCrosswordClues();
            Title = "Untitled";
        }
    }
}
