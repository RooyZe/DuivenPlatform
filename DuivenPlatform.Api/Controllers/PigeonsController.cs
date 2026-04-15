using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Create([FromBody] Pigeon pigeon)
        {
            var created = await _pigeonService.CreateAsync(pigeon);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}
