using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DuivenPlatform.Api.Data;
using DuivenPlatform.Api.Models;

namespace DuivenPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PigeonsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PigeonsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pigeons = await _context.Pigeons.AsNoTracking().ToListAsync();
            return Ok(pigeons);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pigeon = await _context.Pigeons.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (pigeon == null) return NotFound();
            return Ok(pigeon);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pigeon pigeon)
        {
            _context.Pigeons.Add(pigeon);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pigeon.Id }, pigeon);
        }
    }
}
