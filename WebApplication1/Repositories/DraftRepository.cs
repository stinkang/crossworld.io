using CrossWorldApp.Models;

namespace CrossWorldApp.Repositories
{

    public class DraftRepository: IDraftRepository
    {
        private readonly CrossWorldDbContext _context;

        public DraftRepository(CrossWorldDbContext context)
        {
            _context = context;
        }

        public Draft[] GetDraftsForUser(string userId)
        {
            return _context.Drafts.Where(d => d.UserId == userId).ToArray();
        }

        public Draft? GetDraftById(string id)
        {
            return _context.Drafts.FirstOrDefault(d => d.Id == id);
        }

        public void AddDraft(Draft draft)
        {
            _context.Drafts.Add(draft);
            _context.SaveChanges();
        }

        public void UpdateDraft(Draft draft)
        {
            var existingDraft = _context.Drafts.FirstOrDefault(d => d.Id == draft.Id);
            if (existingDraft != null)
            {
                existingDraft.Title = draft.Title;
                existingDraft.Grid = draft.Grid;
                existingDraft.Clues = draft.Clues;
                _context.Drafts.Update(existingDraft);
                _context.SaveChanges();
            }
        }

        public void DeleteDraft(string id)
        {
            var existingDraft = _context.Drafts.FirstOrDefault(d => d.Id == id);
            if (existingDraft != null)
            {
                _context.Drafts.Remove(existingDraft);
                _context.SaveChanges();
            }
        }
    }

    public interface IDraftRepository
    {
        Draft[] GetDraftsForUser(string userId);
        Draft GetDraftById(string id);
        void AddDraft(Draft draft);
        void UpdateDraft(Draft draft);
        void DeleteDraft(string id);
    }
}
