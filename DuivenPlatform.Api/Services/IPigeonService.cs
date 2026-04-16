using DuivenPlatform.Api.Models;

namespace DuivenPlatform.Api.Services
{
    public interface IPigeonService
    {
        Task<List<Pigeon>> GetAllAsync();
        Task<Pigeon?> GetByIdAsync(int id);
        Task<Pigeon> CreateAsync(Pigeon pigeon);
    }
}
