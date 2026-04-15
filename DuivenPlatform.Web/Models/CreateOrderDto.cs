namespace DuivenPlatform.Web.Models
{
    public class CreateOrderDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int PigeonId { get; set; }
        public string PigeonTitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
