using DuivenPlatform.Api.Data;
using DuivenPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DuivenPlatform.Api.Services
{
    public class PigeonService : IPigeonService
    {
        private readonly ApplicationDbContext _context;

        public PigeonService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Fetch all pigeons from database
        public async Task<List<Pigeon>> GetAllAsync()
        {
            return await _context.Pigeons.AsNoTracking().ToListAsync();
        }

        // Fetch single pigeon by id
        public async Task<Pigeon?> GetByIdAsync(int id)
        {
            return await _context.Pigeons.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        }

        // Add new pigeon to database
        public async Task<Pigeon> CreateAsync(Pigeon pigeon)
        {
            _context.Pigeons.Add(pigeon);
            await _context.SaveChangesAsync();
            return pigeon;
        }
    }
}
