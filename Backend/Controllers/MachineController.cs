using Backend.Entities;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers;

[ApiController]
[Route("/api/machine")]
public class MachineController : Controller
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync(User user)
    {
        return Ok(Guid.NewGuid());
    }
}