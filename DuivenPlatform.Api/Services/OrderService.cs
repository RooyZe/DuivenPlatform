using DuivenPlatform.Api.Data;
using DuivenPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DuivenPlatform.Api.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            order.OrderDate = DateTime.UtcNow;

            // Markeer alle duiven in de bestelling als verkocht
            foreach (var item in order.OrderItems)
            {
                var pigeon = await _context.Pigeons.FindAsync(item.PigeonId);
                if (pigeon != null && !pigeon.IsSold)
                {
                    pigeon.IsSold = true;
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
