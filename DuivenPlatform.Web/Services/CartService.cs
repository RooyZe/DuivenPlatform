using DuivenPlatform.Web.Models;
using System.Text.Json;

namespace DuivenPlatform.Web.Services
{
    public class CartService : ICartService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string CartSessionKey = "Cart";

        public CartService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Add pigeon to cart
        public void AddToCart(PigeonDto pigeon)
        {
            var cart = GetCartItems();

            if (!cart.Any(c => c.PigeonId == pigeon.Id))
            {
                cart.Add(new CartItem
                {
                    PigeonId = pigeon.Id,
                    Title = pigeon.Title,
                    Price = pigeon.Price,
                    ImageUrl = pigeon.ImageUrl
                });
                SaveCart(cart);
            }
        }

        // Get all cart items
        public List<CartItem> GetCartItems()
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            var cartJson = session?.GetString(CartSessionKey);

            if (string.IsNullOrEmpty(cartJson))
                return new List<CartItem>();

            return JsonSerializer.Deserialize<List<CartItem>>(cartJson) ?? new List<CartItem>();
        }

        // Remove item from cart
        public void RemoveFromCart(int pigeonId)
        {
            var cart = GetCartItems();
            cart.RemoveAll(c => c.PigeonId == pigeonId);
            SaveCart(cart);
        }

        // Clear entire cart
        public void ClearCart()
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            session?.Remove(CartSessionKey);
        }

        // Get total item count
        public int GetCartCount()
        {
            return GetCartItems().Count;
        }

        // Calculate total price
        public decimal GetTotalPrice()
        {
            return GetCartItems().Sum(c => c.Price);
        }

        // Save cart to session
        private void SaveCart(List<CartItem> cart)
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            var cartJson = JsonSerializer.Serialize(cart);
            session?.SetString(CartSessionKey, cartJson);
        }
    }
}
