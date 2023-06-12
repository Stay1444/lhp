using Backend.Services;
using Backend.Utils;
using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.EntityFrameworkCore;
using PfSense;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMvcCore(x =>
{
    x.ModelBinderProviders.Insert(0, new UserModelBinderProvider());
});
builder.Services.AddNpgsql<LHPDatabaseContext>(builder.Configuration["Postgres"] ?? Environment.GetEnvironmentVariable("Postgres"));

var dockerClient = new DockerClientConfiguration(new Uri("unix:///var/run/docker.sock")).CreateClient();

builder.Services.AddSingleton<PfSenseClient>((_) => new PfSenseClient(Environment.GetEnvironmentVariable("PF_CID")!, Environment.GetEnvironmentVariable("PF_TOKEN")!, Environment.GetEnvironmentVariable("PF_ADDRESS")!));
builder.Services.AddSingleton(dockerClient);

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
