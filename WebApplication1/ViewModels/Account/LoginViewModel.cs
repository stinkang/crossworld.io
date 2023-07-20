using Microsoft.AspNetCore.Authentication;
using System.ComponentModel.DataAnnotations;

namespace CrossWorldApp.ViewModels.Account
{
    public class LoginViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        // If you also want to support External Logins like in the Razor Pages example
        //public IList<AuthenticationScheme> ExternalLogins { get; set; }
    }
}