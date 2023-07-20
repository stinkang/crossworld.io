using System.ComponentModel.DataAnnotations;

namespace CrossWorldApp.ViewModels.Account
{
    public class IndexViewModel
    {
        public string Username { get; set; }
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Phone]
            [Display(Name = "Phone number")]
            public string PhoneNumber { get; set; }
        }
    }
}
