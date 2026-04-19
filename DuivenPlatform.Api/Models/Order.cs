using System.ComponentModel.DataAnnotations;

namespace DuivenPlatform.Api.Models
{
    // ASVS V5.1.1: Input validation using data annotations
    public class Order
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Naam is verplicht")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Naam moet tussen 2 en 100 karakters zijn")]
        public string CustomerName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is verplicht")]
        [EmailAddress(ErrorMessage = "Ongeldig emailadres")]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Ongeldig telefoonnummer")]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Range(0.01, 999999.99, ErrorMessage = "Totaalprijs moet tussen €0.01 en €999999.99 zijn")]
        public decimal TotalPrice { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
