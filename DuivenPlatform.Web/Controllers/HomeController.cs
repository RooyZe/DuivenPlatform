using DuivenPlatform.Web.Models;
using DuivenPlatform.Web.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DuivenPlatform.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IPigeonService _pigeonService;
        private readonly ICartService _cartService;
        private readonly IOrderService _orderService;

        public HomeController(ILogger<HomeController> logger, IPigeonService pigeonService, ICartService cartService, IOrderService orderService)
        {
            _logger = logger;
            _pigeonService = pigeonService;
            _cartService = cartService;
            _orderService = orderService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Pigeons()
        {
            return View();
        }

        public IActionResult Races()
        {
            return View();
        }

        public async Task<IActionResult> PigeonsForSale()
        {
            var pigeons = await _pigeonService.GetAllAsync();
            return View(pigeons);
        }

        public IActionResult Navigation()
        {
            return View();
        }

        // Add pigeon to cart
        [HttpPost]
        public async Task<IActionResult> AddToCart(int id)
        {
            var pigeon = await _pigeonService.GetByIdAsync(id);
            if (pigeon != null)
            {
                _cartService.AddToCart(pigeon);
            }
            return RedirectToAction(nameof(PigeonsForSale));
        }

        // Show cart page
        public IActionResult Cart()
        {
            var cartItems = _cartService.GetCartItems();
            return View(cartItems);
        }

        // Remove item from cart
        [HttpPost]
        public IActionResult RemoveFromCart(int id)
        {
            _cartService.RemoveFromCart(id);
            return RedirectToAction(nameof(Cart));
        }

        // Show checkout page
        public IActionResult Checkout()
        {
            var cartItems = _cartService.GetCartItems();
            if (!cartItems.Any())
            {
                return RedirectToAction(nameof(Cart));
            }
            return View();
        }

        // Process checkout
        [HttpPost]
        public async Task<IActionResult> Checkout(string customerName, string email, string? phoneNumber, string? address)
        {
            var cartItems = _cartService.GetCartItems();
            if (!cartItems.Any())
            {
                return RedirectToAction(nameof(Cart));
            }

            var order = new CreateOrderDto
            {
                CustomerName = customerName,
                Email = email,
                PhoneNumber = phoneNumber,
                Address = address,
                TotalPrice = _cartService.GetTotalPrice(),
                OrderItems = cartItems.Select(c => new OrderItemDto
                {
                    PigeonId = c.PigeonId,
                    PigeonTitle = c.Title,
                    Price = c.Price
                }).ToList()
            };

            var orderId = await _orderService.CreateOrderAsync(order);

            if (orderId.HasValue)
            {
                _cartService.ClearCart();
                return RedirectToAction(nameof(OrderConfirmation), new { id = orderId.Value });
            }

            return RedirectToAction(nameof(Checkout));
        }

        // Order confirmation page
        public IActionResult OrderConfirmation(int id)
        {
            ViewBag.OrderId = id;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
