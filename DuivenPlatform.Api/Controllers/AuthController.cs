using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using DuivenPlatform.Api.Models;

namespace DuivenPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole<int>> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match" });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                Location = request.Location,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            // Add user to Customer role by default
            await _userManager.AddToRoleAsync(user, "Customer");

            // Sign in the user automatically after registration
            await _signInManager.SignInAsync(user, isPersistent: false);

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber,
                Location = user.Location,
                Role = roles.FirstOrDefault() ?? "Customer"
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var result = await _signInManager.PasswordSignInAsync(
                user.UserName!,
                request.Password,
                isPersistent: false,
                lockoutOnFailure: false
            );

            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber,
                Location = user.Location,
                Role = roles.FirstOrDefault() ?? "Customer"
            });
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber,
                Location = user.Location,
                Role = roles.FirstOrDefault() ?? "Customer"
            });
        }
    }

    // DTOs
    public class RegisterRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
