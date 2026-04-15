
using Microsoft.EntityFrameworkCore;
using DuivenPlatform.Api.Data;
using DuivenPlatform.Api.Models;
using DuivenPlatform.Api.Services;

namespace DuivenPlatform.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            if (!string.IsNullOrEmpty(connectionString))
            {
                builder.Services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
            }

            builder.Services.AddScoped<IPigeonService, PigeonService>();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<Data.ApplicationDbContext>();
                    context.Database.Migrate();
                    if (!context.Pigeons.Any())
                    {
                        context.Pigeons.AddRange(
                            new Models.Pigeon { Title = "Miss Milos", Price = 1400m, ImageUrl = "/images/miss-milos.jpg", Description = "Champion racing pigeon from top bloodlines" },
                            new Models.Pigeon { Title = "Red Rose", Price = 1400m, ImageUrl = "/images/red-rose.jpg", Description = "Beautiful red pigeon with excellent pedigree" }
                        );
                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while migrating or seeding the database.");
                }
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
