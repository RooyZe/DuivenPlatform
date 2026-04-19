using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace DuivenPlatform.Api.Models
{
    public class Pigeon
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        [DefaultValue(false)]
        public bool IsSold { get; set; } = false;
    }
}