using CrossWorldApp.Models;
using CrossWorldApp.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CrossWorldApp.Services
{
    public class CrossworldUserService: ICrossworldUserService
    {
        private readonly UserManager<CrossworldUser> _userManager;
        private readonly IDraftRepository _draftRepo;
        private readonly ISolveRepository _solveRepo;
        private readonly ITestCrosswordRepository _testCrosswordRepository;

        public CrossworldUserService(
            UserManager<CrossworldUser> userManager,
            IDraftRepository draftRepo,
            ISolveRepository solveRepo,
            ITestCrosswordRepository testCrosswordRepository
            )
        {
            _userManager = userManager;
            _draftRepo = draftRepo;
            _solveRepo = solveRepo;
            _testCrosswordRepository = testCrosswordRepository;
        }

        public async Task<CrossworldUser> GetUserWithDraftsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            user.Drafts = _draftRepo.GetDraftsForUser(userId).ToList();
            return user;
        }

        public async Task<CrossworldUser> GetUserWithSolvesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            user.Solves = _solveRepo.GetSolvesForUser(userId).ToList();
            return user;
        }
        
        public async Task<CrossworldUser> GetUserWithTestCrosswordsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            user.PublishedTestCrosswords = _testCrosswordRepository.GetPublishedCrosswordsForUser(userId).ToList();
            return user;
        }
        
        public async Task<Solve> UserSolveForCrossword(string userId, int crosswordId)
        {
            var user = await GetUserWithSolvesAsync(userId);
            return user.Solves.FirstOrDefault(s => s.TestCrosswordId == crosswordId);
        }
    }

    public interface ICrossworldUserService
    {
        Task<CrossworldUser> GetUserWithDraftsAsync(string userId);
        Task<CrossworldUser> GetUserWithSolvesAsync(string userId);
        
        Task<CrossworldUser> GetUserWithTestCrosswordsAsync(string userId);
        
        Task<Solve> UserSolveForCrossword(string userId, int crosswordId);
    }
}
