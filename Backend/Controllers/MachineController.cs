using Backend.Entities;
using Backend.Services;
using Backend.Utils;
using Docker.DotNet;
using Docker.DotNet.Models;
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
        var machines = await db.Machines.Include(x => x.Image).Where(x => x.Owner.Id == user.Id).ToListAsync();

        return Ok(machines);
    }

    [HttpDelete("{id:guid}")]
    [SecureRoute]
    public async Task<IActionResult> DeleteAsync([FromContext] User user, Guid id, [FromServices] LHPDatabaseContext db, [FromServices] DockerClient dockerClient)
    {
        var machine = await db.Machines.FirstOrDefaultAsync(x => x.Id == id);

        if (machine is null)
        {
            return NotFound();
        }
        
        if (machine.Owner.Id != user.Id)
        {
            return Unauthorized();
        }

        var container = (await dockerClient.Containers.ListContainersAsync(new ContainersListParameters()
        {
            All = true
        })).FirstOrDefault(x => x.ID == machine.ContainerId);

        if (container is not null)
        {
            await dockerClient.Containers.StopContainerAsync(container.ID, new ContainerStopParameters());
            await dockerClient.Containers.RemoveContainerAsync(container.ID, new ContainerRemoveParameters());
        }
        
        
        if (container is null)
        {
            return NotFound();
        }
        
        db.Machines.Remove(machine);

        await db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("create")]
    [SecureRoute]
    public async Task<IActionResult> CreateAsync([FromContext] User user, [FromServices] LHPDatabaseContext db, [FromServices] DockerClient dockerClient,
        [FromBody] CreateMachineRequest createMachineRequest)
    {
        if (!createMachineRequest.Name.IsAlphaNumeric())
        {
            return BadRequest(new { code = 1, message = "Invalid Name." });
        }

        if (createMachineRequest.Name.Length < 3)
        {
            return BadRequest(new { code = 2, message = "Name must be longer than 3 letters" });
        }

        var machines = await db.Machines.Where(x => x.Owner.Id == user.Id).ToListAsync();

        if (machines.Any(x => x.Name.ToLower() == createMachineRequest.Name.ToLower()))
        {
            return BadRequest(new { code = 3, message = $"You already have a machine called {createMachineRequest.Name.ToLower()}" });
        }

        var image = await db.Images.FirstOrDefaultAsync(x => x.Id == createMachineRequest.ImageId);

        if (image is null)
        {
            return BadRequest(new { code = 4, message = "Image not found." });
        }

        var machineId = Guid.NewGuid();

        var address = await db.Addresses.FirstOrDefaultAsync(x => !db.Machines.Any(m => m.Address.Id == x.Id));

        if (address is null)
        {
            return BadRequest(new { code = 5, message = "No IP available. Contact an administator." });
        }
        
        var container = await dockerClient.Containers.CreateContainerAsync(new CreateContainerParameters()
        {
            Image = image.DockerImage,
            Name = machineId.ToString(),
            NetworkingConfig = new NetworkingConfig
            {
                EndpointsConfig = new Dictionary<string, EndpointSettings>()
                {
                    {address.NetworkName, new EndpointSettings()
                    {
                        NetworkID = address.NetworkId,
                        IPAddress = address.Address
                    }}
                }
            }
        });
        
        var machine = db.Machines.AddAsync(new Machine()
        {
            Id = machineId,
            Owner = user,
            Name = createMachineRequest.Name.ToLower().Trim(),
            CreationDate = DateTimeOffset.UtcNow,
            Image = image,
            ContainerId = container.ID,
            Address = address
        });

        await db.SaveChangesAsync();
        
        return Ok(machines);
    }

    [HttpGet("{id:guid}/status")]
    [SecureRoute]
    public async Task<IActionResult> GetStatusAsync([FromContext] User user, Guid id,
        [FromServices] LHPDatabaseContext db, [FromServices] DockerClient dockerClient)
    {
        var machine = await db.Machines.FirstOrDefaultAsync(x => x.Id == id);

        if (machine is null)
        {
            return NotFound();
        }

        if (machine.Owner.Id != user.Id)
        {
            return Unauthorized();
        }

        var container = (await dockerClient.Containers.ListContainersAsync(new ContainersListParameters()
        {
            All = true
        })).FirstOrDefault(x => x.ID == machine.ContainerId);

        if (container is null)
        {
            return NotFound();
        }

        return Ok(new { id = id.ToString(), status = container.State.ToLower() });
    }

    [HttpPost("{id:guid}/toggle")]
    [SecureRoute]
    public async Task<IActionResult> ToggleAsync([FromContext] User user, Guid id, [FromServices] LHPDatabaseContext db,
        [FromServices] DockerClient dockerClient)
    {
        var machine = await db.Machines.FirstOrDefaultAsync(x => x.Id == id);

        if (machine is null)
        {
            return NotFound();
        }

        if (machine.Owner.Id != user.Id)
        {
            return Unauthorized();
        }

        var container = (await dockerClient.Containers.ListContainersAsync(new ContainersListParameters()
        {
            All = true
        })).FirstOrDefault(x => x.ID == machine.ContainerId);

        if (container is null)
        {
            return NotFound();
        }

        switch (container.State.ToLower())
        {
            case "exited":
            case "created":
            {
                await dockerClient.Containers.StartContainerAsync(container.ID, new ContainerStartParameters());
                break;
            }
            case "running":
            {
                await dockerClient.Containers.StopContainerAsync(container.ID, new ContainerStopParameters());
                break;
            }
                
            default:
            {
                throw new NotImplementedException($"State {container.State} not recognized");
            }
        }

        container = (await dockerClient.Containers.ListContainersAsync(new ContainersListParameters()
        {
            All = true
        })).FirstOrDefault(x => x.ID == machine.ContainerId);

        if (container is null) return NotFound();
        
        return Ok(new { id = id.ToString(), status = container.State });
    }
}