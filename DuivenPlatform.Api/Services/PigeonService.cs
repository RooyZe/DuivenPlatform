using DuivenPlatform.Api.Data;
using DuivenPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DuivenPlatform.Api.Services
{
    // SECURITY: Mitigatie voor Threat ID 37 - Potential SQL Injection Vulnerability
    // Deze service gebruikt Entity Framework Core met LINQ queries.
    // EF Core genereert automatisch parameterized queries, waardoor SQL injection
    // niet mogelijk is. Alle gebruikersinvoer wordt veilig ge-escaped.
    public class PigeonService : IPigeonService
    {
        private readonly ApplicationDbContext _context;

        public PigeonService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Fetch all pigeons from database (only available ones)
        // SECURITY: .Where() en .ToListAsync() gebruiken parameterized queries
        public async Task<List<Pigeon>> GetAllAsync()
        {
            return await _context.Pigeons
                .Where(p => !p.IsSold)
                .AsNoTracking()
                .ToListAsync();
        }

        // Fetch single pigeon by id
        // SECURITY: .FirstOrDefaultAsync() gebruikt parameterized queries
        public async Task<Pigeon?> GetByIdAsync(int id)
        {
            return await _context.Pigeons.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        }

        // Add new pigeon to database
        public async Task<Pigeon> CreateAsync(Pigeon pigeon)
        {
            pigeon.IsSold = false; // Ensure new pigeons are not marked as sold
            _context.Pigeons.Add(pigeon);
            await _context.SaveChangesAsync();
            return pigeon;
        }
    }
}
