using System.ComponentModel.DataAnnotations;

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
    }
}