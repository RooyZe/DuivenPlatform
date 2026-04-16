using Microsoft.EntityFrameworkCore;
using DuivenPlatform.Api.Models;

namespace DuivenPlatform.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Pigeon> Pigeons { get; set; } = null!;

        // Configure database model
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Pigeon>().Property(p => p.Price).HasColumnType("decimal(18,2)");
        }
    }
}
