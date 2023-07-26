using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace CrossWorldApp.Models
{
    public class CrossworldUser: IdentityUser
    {
        [JsonIgnore]
        public List<Crossword>? PublishedCrosswords { get; set; }

        [JsonIgnore]
        public List<TestCrossword>? PublishedTestCrosswords { get; set; }
        
        [JsonIgnore]
        public List<Solve>? Solves { get; set; }

        [JsonIgnore]
        public List<Draft>? Drafts { get; set; }
    }
}
