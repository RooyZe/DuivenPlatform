using DuivenPlatform.Web.Models;
using System.Net.Http.Json;

namespace DuivenPlatform.Web.Services
{
    public class OrderService : IOrderService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public OrderService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // Send order to API
        public async Task<int?> CreateOrderAsync(CreateOrderDto order)
        {
            var client = _httpClientFactory.CreateClient("DuivenPlatformApi");
            var response = await client.PostAsJsonAsync("api/orders", order);

            if (response.IsSuccessStatusCode)
            {
                var created = await response.Content.ReadFromJsonAsync<OrderResponseDto>();
                return created?.Id;
            }

            return null;
        }
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
    }
}
