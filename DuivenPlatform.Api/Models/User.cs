using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DuivenPlatform.Api.Models
{
    // ApplicationUser extends IdentityUser with custom fields
    public class ApplicationUser : IdentityUser<int>
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Email and PasswordHash are inherited from IdentityUser
        // Roles are managed by Identity's role system
    }
}
