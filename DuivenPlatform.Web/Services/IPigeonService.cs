using DuivenPlatform.Web.Models;

namespace DuivenPlatform.Web.Services
{
    public interface IPigeonService
    {
        Task<List<PigeonDto>> GetAllAsync();
        Task<PigeonDto?> GetByIdAsync(int id);
    }
}
