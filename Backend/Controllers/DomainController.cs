using System.Net;
using Backend.Entities;
using Backend.Requests;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PfSense;

namespace Backend.Controllers;

[ApiController]
[Route("/api/domain")]
public class DomainController : Controller
{
    private readonly DnsUpdater _dnsUpdater;

    public DomainController(DnsUpdater dnsUpdater)
    {
        _dnsUpdater = dnsUpdater;
    }

    [HttpGet("list")]
    [SecureRoute]
    public async Task<IActionResult> ListAsync(User user, [FromServices] LHPDatabaseContext db)
    {
        // TODO: CHECK HERE DNSUPDATER STATE.
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

        await _dnsUpdater.QueueAsync(domain, DnsJobType.Delete);

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

        await _dnsUpdater.QueueAsync(domain, DnsJobType.CreateOrUpdate);

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

        await _dnsUpdater.QueueAsync(domain.Entity, DnsJobType.CreateOrUpdate);

        await db.SaveChangesAsync();
        
        return Ok(domain.Entity);
    }
    
}