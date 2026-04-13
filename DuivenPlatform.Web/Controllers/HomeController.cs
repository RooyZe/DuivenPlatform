using DuivenPlatform.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DuivenPlatform.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Duiven()
        {
            return View();
        }

        public IActionResult Vluchten()
        {
            return View();
        }

        public IActionResult DuivenTeKoop()
        {
            return View();
        }

        public IActionResult Navigatie()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
