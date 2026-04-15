using Microsoft.AspNetCore.Mvc;
using DuivenPlatform.Api.Models;
using DuivenPlatform.Api.Services;

namespace DuivenPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // Get all orders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        // Get order by id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // Create new order
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {
            var created = await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}
