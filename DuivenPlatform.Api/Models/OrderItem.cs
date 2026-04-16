using System.Text.Json.Serialization;

namespace DuivenPlatform.Api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int PigeonId { get; set; }
        public string PigeonTitle { get; set; } = string.Empty;
        public decimal Price { get; set; }

        [JsonIgnore]
        public Order? Order { get; set; }
    }
}
