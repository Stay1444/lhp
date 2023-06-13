using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("/api/address")]
public class AddressController : Controller
{
    //TODO: THIS IS A DIRTY TEMPORAL THING.
    // IT DOES NOT HAVE ANY KIND OF AUTHENTICATION OR SECURITY.
    public record AddRangeRequest(string NetworkName, string NetworkId, string[] Addresses);

    [HttpPost("add-range")]
    public async Task<IActionResult> AddRange([FromBody] AddRangeRequest rangeRequest,
        [FromServices] LHPDatabaseContext db)
    {
        foreach (var address in rangeRequest.Addresses)
        {
            await db.Addresses.AddAsync(new MachineAddress()
            {
                Id = Guid.NewGuid(),
                NetworkId = rangeRequest.NetworkId,
                NetworkName = rangeRequest.NetworkName,
                Address = address
            });
        }

        await db.SaveChangesAsync();
        return Ok($"Added {rangeRequest.Addresses.Length} addresses");
    }
}