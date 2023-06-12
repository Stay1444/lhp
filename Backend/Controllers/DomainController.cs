using System.Net;
using Backend.Entities;
using Backend.Requests;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PfSense;

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

    [HttpGet("{id:guid}")]
    [SecureRoute]
    public async Task<IActionResult> GetAsync(User user, Guid id, [FromServices] LHPDatabaseContext db)
    {
        var domain = await db.Domains.FirstOrDefaultAsync(x => x.Id == id);

        if (domain is null) return NotFound();

        if (domain.Owner.Id != user.Id) return Unauthorized();

        return Ok(domain);
    }
    
    [HttpDelete("{id:guid}")]
    [SecureRoute]
    public async Task<IActionResult> DeleteAsync(User user, Guid id, [FromServices] LHPDatabaseContext db, [FromServices] PfSenseClient pfSenseClient)
    {
        var domain = await db.Domains.FirstOrDefaultAsync(x => x.Id == id);

        if (domain is null) return NotFound();

        if (domain.Owner.Id != user.Id) return Unauthorized();

        db.Domains.Remove(domain);

        var overrides = await pfSenseClient.GetHostOverrides();

        for (var i = 0; i < overrides.Length; i++)
        {
            var o = overrides[i];

            if (o.Host == domain.Host && o.Domain == domain.Tld)
            {
                await pfSenseClient.DeleteHostOverride(i);
                break;
            }
        }

        await pfSenseClient.HostOverrideApply();
        
        await db.SaveChangesAsync();
        
        return Ok();
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

    [HttpPatch("{id:guid}")]
    [SecureRoute]
    public async Task<IActionResult> UpdateAsync([FromContext] User user, Guid id, [FromServices] LHPDatabaseContext db, [FromServices] PfSenseClient pfSenseClient, [FromBody] UpdateDomainRequest updateDomainRequest)
    {
        var domain = await db.Domains.FirstOrDefaultAsync(x => x.Id == id);

        if (domain is null) return NotFound();

        if (domain.Owner.Id != user.Id) return Unauthorized();

        if (!IPAddress.TryParse(updateDomainRequest.target, out _))
        {
            return BadRequest(new { code = 1, message = "Invalid IP Address" });
        }
        
        domain.Target = updateDomainRequest.target;
        
        await db.SaveChangesAsync();

        var overrides = await pfSenseClient.GetHostOverrides();

        for (var i = 0; i < overrides.Length; i++)
        {
            var o = overrides[i];

            if (o.Host == domain.Host && o.Domain == domain.Tld)
            {
                await pfSenseClient.DeleteHostOverride(i);
                break;
            }
        }

        _ = Task.Run(async () =>
        {
            await pfSenseClient.AddHostOverride(new()
            {
                Host = domain.Host,
                Domain = domain.Tld,
                Ip = new[] { updateDomainRequest.target },
                Apply = true,
                Description = "Managed by LHP"
            });
        });
        

        return Ok();
    }
    
    [HttpPost("register")]
    [SecureRoute]
    public async Task<IActionResult> RegisterAsync([FromContext] User user, [FromServices] LHPDatabaseContext db, [FromServices] PfSenseClient pfSenseClient,
        [FromBody] RegisterDomainRequest registerDomainRequest)
    {
        if (!registerDomainRequest.Domain.IsAlphaNumeric() || !registerDomainRequest.Domain.IsAlphaNumeric())
        {
            return BadRequest(new { code = 1, message = "Domain can only contain alpha-numeric characters."});
        }

        if (!IPAddress.TryParse(registerDomainRequest.Target, out _))
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

        _ = Task.Run(async () => pfSenseClient.AddHostOverride(new()
        {
            Host = registerDomainRequest.Domain,
            Domain = registerDomainRequest.Tld,
            Ip = new[] { registerDomainRequest.Target },
            Apply = true,
            Description = "Managed by LHP"
        }));

        await db.SaveChangesAsync();
        
        return Ok(domain.Entity);
    }
    
}