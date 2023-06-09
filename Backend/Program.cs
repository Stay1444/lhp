using Backend.Services;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMvcCore(x =>
{
    x.ModelBinderProviders.Insert(0, new FromSecurityAttribute());
});
builder.Services.AddNpgsql<LHPDatabaseContext>(builder.Configuration["Postgres"] ?? Environment.GetEnvironmentVariable("Postgres"));

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<LHPDatabaseContext>();
    await dbContext.Database.MigrateAsync();
}

app.MapControllers();

app.Run();
