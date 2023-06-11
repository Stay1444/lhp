using System.Net;
using Backend.Entities;
using Backend.Requests;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("/api/domain")]
public class DomainController : Controller
{
    [HttpGet("list")]
    [SecureRoute]
    public async Task<IActionResult> ListAsync(User user, [FromServices] LHPDatabaseContext db)
    {
        var domains = await db.Domains.Where(x => x.Owner.Id == user.Id).ToListAsync();
        return Ok(domains);
    }
    
    [HttpPost("check")]
    public async Task<IActionResult> CheckAsync([FromServices] LHPDatabaseContext db, [FromBody] CheckDomainRequest checkDomainRequest) 
    {
        if (!checkDomainRequest.Domain.IsAlphaNumeric() || !checkDomainRequest.Domain.IsAlphaNumeric())
        {
            return BadRequest(new { code = 1, message = "Domain can only contain alpha-numeric characters."});
        }

        if (await db.Domains.AnyAsync(x =>
                x.Host == checkDomainRequest.Domain.ToLower() && x.Tld == checkDomainRequest.Tld.ToLower()))
        {
            return BadRequest(new { code = 2, message = "Domain already taken." });
        }

        return Ok();
    }

    [HttpPost("register")]
    [SecureRoute]
    public async Task<IActionResult> RegisterAsync([FromContext] User user, [FromServices] LHPDatabaseContext db,
        [FromBody] RegisterDomainRequest registerDomainRequest)
    {
        if (!registerDomainRequest.Domain.IsAlphaNumeric() || !registerDomainRequest.Domain.IsAlphaNumeric())
        {
            return BadRequest(new { code = 1, message = "Domain can only contain alpha-numeric characters."});
        }

        if (!IPAddress.TryParse(registerDomainRequest.Target, out var ip))
        {
            return BadRequest(new { code = 2, message = "Invalid IP Address"});
        }
        
        if (await db.Domains.AnyAsync(x =>
                x.Host == registerDomainRequest.Domain.ToLower() && x.Tld == registerDomainRequest.Tld.ToLower()))
        {
            return BadRequest(new { code = 3, message = "Domain already taken." });
        }

        var domain = await db.Domains.AddAsync(new Domain()
        {
            Id = Guid.NewGuid(),
            Owner = user,
            Host = registerDomainRequest.Domain,
            Tld = registerDomainRequest.Tld,
            Target = registerDomainRequest.Target
        });

        await db.SaveChangesAsync();
        
        return Ok(domain.Entity);
    }
}