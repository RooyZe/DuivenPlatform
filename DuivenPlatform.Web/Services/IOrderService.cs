using DuivenPlatform.Web.Models;

namespace DuivenPlatform.Web.Services
{
    public interface IOrderService
    {
        Task<int?> CreateOrderAsync(CreateOrderDto order);
    }
}
