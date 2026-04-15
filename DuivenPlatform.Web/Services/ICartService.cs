using DuivenPlatform.Web.Models;

namespace DuivenPlatform.Web.Services
{
    public interface ICartService
    {
        void AddToCart(PigeonDto pigeon);
        List<CartItem> GetCartItems();
        void RemoveFromCart(int pigeonId);
        void ClearCart();
        int GetCartCount();
        decimal GetTotalPrice();
    }
}
