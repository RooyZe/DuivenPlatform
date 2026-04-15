using DuivenPlatform.Web.Models;
using System.Net.Http.Json;

namespace DuivenPlatform.Web.Services
{
    public class PigeonService : IPigeonService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public PigeonService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<List<PigeonDto>> GetAllAsync()
        {
            var client = _httpClientFactory.CreateClient("DuivenPlatformApi");
            var pigeons = await client.GetFromJsonAsync<List<PigeonDto>>("api/pigeons");
            return pigeons ?? new List<PigeonDto>();
        }

        public async Task<PigeonDto?> GetByIdAsync(int id)
        {
            var client = _httpClientFactory.CreateClient("DuivenPlatformApi");
            var pigeon = await client.GetFromJsonAsync<PigeonDto>($"api/pigeons/{id}");
            return pigeon;
        }
    }
}
