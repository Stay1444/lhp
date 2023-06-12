using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class LHPDatabaseContext : DbContext
{
    public LHPDatabaseContext(DbContextOptions<LHPDatabaseContext> options) : base(options)
    {
        
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Domain> Domains { get; set; }
    public DbSet<Machine> Machines { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<MachineAddress> Addresses { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Domain>(e =>
        {
            e.HasKey(x => x.Id);

            e.HasOne<User>(x => x.Owner);
        });

        modelBuilder.Entity<Machine>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne<User>(x => x.Owner);
            e.HasOne<Image>(x => x.Image);
            e.HasOne<MachineAddress>(x => x.Address);
        });

        modelBuilder.Entity<MachineAddress>(e =>
        {
            e.HasKey(x => x.Id);
        });
        
        modelBuilder.Entity<Image>(e =>
        {
            e.HasKey(x => x.Id);
        });
        
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);

            e.HasMany<Domain>(x => x.Domains);
            e.HasMany<Machine>(x => x.Machines);
        });
    }
}