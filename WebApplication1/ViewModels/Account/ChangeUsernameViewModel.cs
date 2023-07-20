using System.ComponentModel.DataAnnotations;

namespace CrossWorldApp.ViewModels.Account
{
    public class ChangeUsernameViewModel
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; }
    }
}
