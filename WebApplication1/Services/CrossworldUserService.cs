using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CrossWorldApp.Services
{
    public class CrossworldUserService: ICrossworldUserService
    {
        private readonly UserManager<CrossworldUser> _userManager;
        private readonly IDraftRepository _draftRepo;

        public CrossworldUserService(UserManager<CrossworldUser> userManager, IDraftRepository draftRepo)
        {
            _userManager = userManager;
            _draftRepo = draftRepo;
        }

        public async Task<CrossworldUser> GetUserWithDraftsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            user.Drafts = _draftRepo.GetDraftsForUser(userId).ToList();
            return user;
        }
    }

    public interface ICrossworldUserService
    {
        Task<CrossworldUser> GetUserWithDraftsAsync(string userId);
    }
}
