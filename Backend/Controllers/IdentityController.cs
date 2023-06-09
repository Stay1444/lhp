using Backend.Entities;
using Backend.Requests;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("/api/identity")]
public class IdentityController : Controller
{
    [HttpGet("me")]
    public IActionResult GetCurrentUser([FromSecurity] User? user)
    {
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromServices] LHPDatabaseContext db, [FromBody] LoginRequest loginRequest)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Name == loginRequest.Name);
        return user is null ? Unauthorized() : Ok(new { token = user.Token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromServices] LHPDatabaseContext db,
        [FromBody] RegisterRequest registerRequest)
    {
        if (!registerRequest.Name.IsValidUsername() || registerRequest.Name.Length < 3 || registerRequest.Name.Length > 32)
        {
            return BadRequest("Invalid username.");
        }
        
        if (await db.Users.AnyAsync(x => x.Name == registerRequest.Name))
        {
            return BadRequest("Name is already taken.");
        }

        var user = await db.Users.AddAsync(new User()
        {
            Id = Guid.NewGuid(),
            Token = Guid.NewGuid(),
            Name = registerRequest.Name,
            CreationDate = DateTimeOffset.UtcNow,
            Admin = false,
            LastLoginDate = DateTimeOffset.MinValue
        });

        await db.SaveChangesAsync();

        return Ok(new { token = user.Entity.Token });
    }
}