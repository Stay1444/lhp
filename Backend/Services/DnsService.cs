using Backend.Entities;
using PfSense;

namespace Backend.Services;

public enum DnsJobType
{
    CreateOrUpdate,
    Delete,
}

public sealed class DnsService : BackgroundService
{
    private record DnsJob(Domain Domain, DnsJobType Type);
    
    private readonly PfSenseClient _pfSenseClient;
    private readonly PeriodicTimer _timer = new PeriodicTimer(TimeSpan.FromSeconds(60));
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1);
    private readonly List<DnsJob> _updates = new List<DnsJob>();

    private readonly ILogger<DnsService> _logger;

    public DnsService(PfSenseClient pfSenseClient, ILogger<DnsService> logger)
    {
        _pfSenseClient = pfSenseClient;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _timer.WaitForNextTickAsync(stoppingToken);
            await ProcessQueueAsync();
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

    public async Task<DnsJobType?> GetJobTypeAsync(Guid domainId)
    {
        try
        {
            await _semaphore.WaitAsync();

            return _updates.FirstOrDefault(x => x.Domain.Id == domainId)?.Type;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    private async Task ProcessQueueAsync()
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
            _logger.LogInformation("Successfully processed DNS Queue");
            _updates.Clear();
        }
        finally
        {
            _semaphore.Release();
        }
    }
}