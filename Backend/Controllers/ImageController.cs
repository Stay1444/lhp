using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/image")]
public class ImageController : Controller
{
    [HttpGet("list")]
    [SecureRoute]
    public async Task<IActionResult> ListAsync([FromServices] LHPDatabaseContext db)
    {
        return Ok(await db.Images.ToListAsync());
    }
}