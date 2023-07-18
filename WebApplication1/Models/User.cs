using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CrossWorldApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Uid { get; set; }

        public string Username { get; set; }

        [JsonIgnore]
        public List<Crossword>? PublishedCrosswords { get; set; }

        [JsonIgnore]
        public List<TestCrossword>? PublishedTestCrosswords { get; set; }
    }
}
