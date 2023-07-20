using System.ComponentModel.DataAnnotations;

namespace CrossWorldApp.ViewModels.Account
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
