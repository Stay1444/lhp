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
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Domain>(e =>
        {
            e.HasKey(x => x.Id);

            e.HasOne<User>(x => x.Owner);
        });
        
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);

            e.HasMany<Domain>(x => x.Domains);
        });
    }
}