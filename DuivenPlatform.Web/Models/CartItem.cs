namespace DuivenPlatform.Web.Models
{
    public class CartItem
    {
        public int PigeonId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
    }
}
