using Microsoft.EntityFrameworkCore;
using Stockfolio.Api.Models;

namespace Stockfolio.Api.Data;

// EF Core의 단일 진입점입니다. 엔티티를 데이터베이스에 매핑해 줍니다.
public class StockfolioDbContext : DbContext
{
    public StockfolioDbContext(DbContextOptions<StockfolioDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Holding> Holdings => Set<Holding>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.CashBalance).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Holding>(entity =>
        {
            entity.HasIndex(h => new { h.UserId, h.Symbol }).IsUnique();
            entity.Property(h => h.Quantity).HasColumnType("decimal(18,4)");
            entity.Property(h => h.AvgBuyPrice).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.Quantity).HasColumnType("decimal(18,4)");
            entity.Property(t => t.Price).HasColumnType("decimal(18,2)");
        });
    }
}
