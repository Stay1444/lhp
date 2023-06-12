using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using PfSense;

namespace Backend.Services;

public enum DnsJobType
{
    CreateOrUpdate,
    Delete,
}

public sealed class DnsUpdater : BackgroundService
{
    private record DnsJob(Domain Domain, DnsJobType Type);
    
    private readonly LHPDatabaseContext _db;
    private readonly PfSenseClient _pfSenseClient;
    private readonly PeriodicTimer _timer = new PeriodicTimer(TimeSpan.FromSeconds(60));
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1);
    private readonly List<DnsJob> _updates = new List<DnsJob>();

    private ILogger<DnsUpdater> _logger;

    public DnsUpdater(LHPDatabaseContext db, PfSenseClient pfSenseClient, ILogger<DnsUpdater> logger)
    {
        _db = db;
        _pfSenseClient = pfSenseClient;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _timer.WaitForNextTickAsync(stoppingToken);
            await Work();
        }
    }

    public async Task QueueAsync(Domain domain, DnsJobType jobType)
    {
        try
        {
            await _semaphore.WaitAsync();
            _updates.Add(new DnsJob(domain, jobType));
        }
        finally
        {
            _semaphore.Release();
        }
    }


    private async Task Work()
    {
        try
        {
            await _semaphore.WaitAsync();

            bool changed = false;

            foreach (var update in _updates)
            {
                var existingOverrides = await _pfSenseClient.GetHostOverrides();
                var matchingHostOverrides = existingOverrides.Select((v, i) => (v, i))
                    .Where(x => x.v.Host.Equals(update.Domain.Host, StringComparison.OrdinalIgnoreCase) &&
                                x.v.Domain.Equals(update.Domain.Tld, StringComparison.OrdinalIgnoreCase)).ToArray();

                switch (update.Type)
                {
                    case DnsJobType.CreateOrUpdate:
                    {
                        if (matchingHostOverrides.Length > 0)
                        {
                            foreach (var ho in matchingHostOverrides)
                            {
                                await _pfSenseClient.DeleteHostOverride(ho.i);
                                _logger.LogInformation("Deleted host override index {i} {id}", ho.i, update.Domain.Id);

                                await _pfSenseClient.AddHostOverride(new PfDNSHostOverrideCreate()
                                {
                                    Host = update.Domain.Host,
                                    Domain = update.Domain.Tld,
                                    Ip = new []{ update.Domain.Target },
                                    Apply = false,
                                    Description = "Managed by LHP"
                                });
                                changed = true;
                            }
                        }
                        else
                        {
                            await _pfSenseClient.AddHostOverride(new PfDNSHostOverrideCreate()
                            {
                                Host = update.Domain.Host,
                                Domain = update.Domain.Tld,
                                Ip = new []{ update.Domain.Target },
                                Apply = false,
                                Description = "Managed by LHP"
                            });
                            changed = true;
                        }

                        break;
                    }
                    case DnsJobType.Delete:
                    {
                        if (matchingHostOverrides.Length > 0)
                        {
                            foreach (var ho in matchingHostOverrides)
                            {
                                await _pfSenseClient.DeleteHostOverride(ho.i);
                                _logger.LogInformation("Deleted host override index {i} {id}", ho.i, update.Domain.Id);
                                changed = true;
                            }
                        }

                        break;
                    }
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                if (changed)
                {
                    await _pfSenseClient.HostOverrideApply();
                }
            }
        }
        finally
        {
            _semaphore.Release();
        }
    }
}