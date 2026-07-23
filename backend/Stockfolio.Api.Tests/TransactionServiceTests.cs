using Microsoft.EntityFrameworkCore;
using Stockfolio.Api.Data;
using Stockfolio.Api.Models;
using Stockfolio.Api.Services;

namespace Stockfolio.Api.Tests;

public class TransactionServiceTests
{
    private static StockfolioDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<StockfolioDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new StockfolioDbContext(options);
    }

    private static User SeedUser(StockfolioDbContext db, decimal cashBalance = 100000m)
    {
        var user = new User
        {
            Email = "trader@example.com",
            PasswordHash = "irrelevant-for-this-test",
            CashBalance = cashBalance,
        };
        db.Users.Add(user);
        db.SaveChanges();
        return user;
    }

    [Fact]
    public void Buy_ValidPurchase_DeductsCashAndCreatesHolding()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db, cashBalance: 100000m);
        var service = new TransactionService(db);

        service.Buy(user.Id, "AAPL", quantity: 10m, pricePerShare: 200m);

        var holding = db.Holdings.Single(h => h.UserId == user.Id && h.Symbol == "AAPL");
        Assert.Equal(10m, holding.Quantity);
        Assert.Equal(200m, holding.AvgBuyPrice);
        Assert.Equal(98000m, db.Users.Single(u => u.Id == user.Id).CashBalance);
        Assert.Single(db.Transactions.Where(t => t.UserId == user.Id && t.Type == "BUY"));
    }

    [Fact]
    public void Buy_ExistingHolding_RecalculatesWeightedAverageCost()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db, cashBalance: 100000m);
        var service = new TransactionService(db);

        service.Buy(user.Id, "AAPL", quantity: 10m, pricePerShare: 200m); // cost basis 2000
        service.Buy(user.Id, "AAPL", quantity: 10m, pricePerShare: 300m); // cost basis 3000

        var holding = db.Holdings.Single(h => h.UserId == user.Id && h.Symbol == "AAPL");
        Assert.Equal(20m, holding.Quantity);
        Assert.Equal(250m, holding.AvgBuyPrice); // (2000 + 3000) / 20
    }

    [Fact]
    public void Buy_InsufficientCashBalance_ThrowsInvalidOperationException()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db, cashBalance: 100m);
        var service = new TransactionService(db);

        var ex = Assert.Throws<InvalidOperationException>(
            () => service.Buy(user.Id, "AAPL", quantity: 10m, pricePerShare: 200m));

        Assert.Equal("Insufficient cash balance.", ex.Message);
        Assert.Empty(db.Holdings);
        Assert.Equal(100m, db.Users.Single(u => u.Id == user.Id).CashBalance);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void Buy_NonPositiveQuantity_ThrowsInvalidOperationException(decimal quantity)
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        var service = new TransactionService(db);

        Assert.Throws<InvalidOperationException>(
            () => service.Buy(user.Id, "AAPL", quantity, pricePerShare: 200m));
    }

    [Fact]
    public void Buy_NonPositivePrice_ThrowsInvalidOperationException()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        var service = new TransactionService(db);

        var ex = Assert.Throws<InvalidOperationException>(
            () => service.Buy(user.Id, "AAPL", quantity: 1m, pricePerShare: 0m));

        Assert.Equal("Invalid stock symbol.", ex.Message);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void Sell_NonPositiveQuantity_ThrowsInvalidOperationException(decimal quantity)
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        var service = new TransactionService(db);

        Assert.Throws<InvalidOperationException>(
            () => service.Sell(user.Id, "AAPL", quantity, pricePerShare: 250m));
    }

    [Fact]
    public void Sell_ValidSale_AddsCashAndReducesHolding()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db, cashBalance: 98000m);
        db.Holdings.Add(new Holding { UserId = user.Id, Symbol = "AAPL", Quantity = 10m, AvgBuyPrice = 200m });
        db.SaveChanges();
        var service = new TransactionService(db);

        service.Sell(user.Id, "AAPL", quantity: 4m, pricePerShare: 250m);

        var holding = db.Holdings.Single(h => h.UserId == user.Id && h.Symbol == "AAPL");
        Assert.Equal(6m, holding.Quantity);
        Assert.Equal(200m, holding.AvgBuyPrice); // cost basis unchanged on sell
        Assert.Equal(99000m, db.Users.Single(u => u.Id == user.Id).CashBalance); // 98000 + 4*250
        Assert.Single(db.Transactions.Where(t => t.UserId == user.Id && t.Type == "SELL"));
    }

    [Fact]
    public void Sell_SellingAllShares_RemovesHolding()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        db.Holdings.Add(new Holding { UserId = user.Id, Symbol = "AAPL", Quantity = 5m, AvgBuyPrice = 200m });
        db.SaveChanges();
        var service = new TransactionService(db);

        service.Sell(user.Id, "AAPL", quantity: 5m, pricePerShare: 250m);

        Assert.Empty(db.Holdings.Where(h => h.UserId == user.Id && h.Symbol == "AAPL"));
    }

    [Fact]
    public void Sell_ExceedsHeldQuantity_ThrowsInvalidOperationException()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        db.Holdings.Add(new Holding { UserId = user.Id, Symbol = "AAPL", Quantity = 3m, AvgBuyPrice = 200m });
        db.SaveChanges();
        var service = new TransactionService(db);

        var ex = Assert.Throws<InvalidOperationException>(
            () => service.Sell(user.Id, "AAPL", quantity: 4m, pricePerShare: 250m));

        Assert.Equal("Insufficient shares held.", ex.Message);
        Assert.Equal(3m, db.Holdings.Single(h => h.UserId == user.Id && h.Symbol == "AAPL").Quantity);
    }

    [Fact]
    public void Sell_NoExistingHolding_ThrowsInvalidOperationException()
    {
        using var db = CreateDbContext();
        var user = SeedUser(db);
        var service = new TransactionService(db);

        Assert.Throws<InvalidOperationException>(
            () => service.Sell(user.Id, "AAPL", quantity: 1m, pricePerShare: 250m));
    }
}
