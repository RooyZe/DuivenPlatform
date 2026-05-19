using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DuivenPlatform.Api.Models;
using DuivenPlatform.Api.Services;

namespace DuivenPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PigeonsController : ControllerBase
    {
        private readonly IPigeonService _pigeonService;

        public PigeonsController(IPigeonService pigeonService)
        {
            _pigeonService = pigeonService;
        }

        // Get all pigeons from database
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pigeons = await _pigeonService.GetAllAsync();
            return Ok(pigeons);
        }

        // Get single pigeon by id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pigeon = await _pigeonService.GetByIdAsync(id);
            if (pigeon == null) return NotFound();
            return Ok(pigeon);
        }

        // Create new pigeon
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Pigeon pigeon)
        {
            var created = await _pigeonService.CreateAsync(pigeon);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Update pigeon
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Pigeon pigeon)
        {
            var updated = await _pigeonService.UpdateAsync(id, pigeon);
            if (updated == null)
            {
                return NotFound(new { message = "Duif niet gevonden" });
            }
            return Ok(updated);
        }

        // Delete pigeon
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _pigeonService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Duif niet gevonden" });
            }
            return Ok(new { message = "Duif succesvol verwijderd" });
        }
    }
}
