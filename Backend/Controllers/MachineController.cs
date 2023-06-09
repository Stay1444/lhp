using Backend.Entities;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Backend.Controllers;

[ApiController]
[Route("/api/machine")]
public class MachineController : Controller
{
    [HttpGet("list")]
    [SecureRoute]
    public async Task<IActionResult> ListAsync(User user, [FromServices] LHPDatabaseContext db)
    {
        var machines = await db.Machines.Where(x => x.Owner.Id == user.Id).ToListAsync();

        return Ok(machines);
    }
}