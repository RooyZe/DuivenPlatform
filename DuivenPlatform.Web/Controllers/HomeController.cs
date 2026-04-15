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

        public HomeController(ILogger<HomeController> logger, IPigeonService pigeonService)
        {
            _logger = logger;
            _pigeonService = pigeonService;
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

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
