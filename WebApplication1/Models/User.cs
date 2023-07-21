using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CrossWorldApp.Models
{
    public class User
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        [JsonIgnore]
        public List<Crossword>? PublishedCrosswords { get; set; }

        [JsonIgnore]
        public List<TestCrossword>? PublishedTestCrosswords { get; set; }

        [JsonIgnore]
        public List<Draft>? Drafts { get; set; }
    }
}
