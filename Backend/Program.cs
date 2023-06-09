using Backend.Services;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMvcCore(x =>
{
    x.ModelBinderProviders.Add(new FromSecurityAttribute());
});
builder.Services.AddNpgsql<LHPDatabaseContext>(builder.Configuration["Postgres"] ?? Environment.GetEnvironmentVariable("Postgres"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("LHP", policy =>
    {
        policy.AllowAnyMethod();
        policy.SetIsOriginAllowed(_ => true);
        policy.AllowAnyHeader();
        policy.AllowAnyOrigin();
    });
});

var app = builder.Build();

{ 
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<LHPDatabaseContext>();
    await dbContext.Database.MigrateAsync();
}

app.UseCors("LHP");

app.MapControllers();

app.Run();
