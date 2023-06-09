using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("/api/domain")]
public class DomainController : Controller
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync(User user, [FromServices] LHPDatabaseContext db)
    {
        var domains = await db.Domains.Where(x => x.Owner.Id == user.Id).ToListAsync();
        return Ok(domains);
    }
}