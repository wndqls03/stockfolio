using Stockfolio.Api.Data;
using Stockfolio.Api.Models;

namespace Stockfolio.Api.Services;

public class TransactionService
{
    private readonly StockfolioDbContext _dbContext;
    public TransactionService(StockfolioDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public void Buy(int userId, string stockSymbol, decimal quantity, decimal pricePerShare)
    {
        if(quantity <=0)
        {
            throw new InvalidOperationException("수량은 0보다 커야 합니다.");
        }
        if(pricePerShare <=0)
        {
            throw new InvalidOperationException("유효하지 않은 종목입니다.");
        }
        var user = _dbContext.Users.Find(userId);
        if (user == null)
        {
            throw new InvalidOperationException("존재하지 않는 사용자입니다.");
        }
        var totalCost = quantity*pricePerShare;
        if (user.CashBalance < totalCost)
        {
            throw new InvalidOperationException("잔액이 부족합니다.");
        }
        var existingHolding= _dbContext.Holdings.FirstOrDefault(h=> h.UserId == userId && h.Symbol == stockSymbol);
        if(existingHolding!=null)
        {
            existingHolding.AvgBuyPrice = (existingHolding.Quantity * existingHolding.AvgBuyPrice + quantity * pricePerShare) / (existingHolding.Quantity + quantity);
            existingHolding.Quantity += quantity;
        }
        else
        {
            var holding = new Holding
            {
                UserId = userId,
                Symbol = stockSymbol,
                Quantity = quantity,
                AvgBuyPrice = pricePerShare
            };
            _dbContext.Holdings.Add(holding);
        }
        user.CashBalance -= totalCost;
        var transaction = new Transaction
        {
            UserId = userId,
            Symbol = stockSymbol,
            Quantity = quantity,
            Price = pricePerShare,
            Type = "BUY",
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.Transactions.Add(transaction);
        _dbContext.SaveChanges();
    }
    public void Sell(int userId, string stockSymbol, decimal quantity, decimal pricePerShare)
    {
        if (quantity <= 0)
        {
            throw new InvalidOperationException("수량은 0보다 커야 합니다.");
        }
        if(pricePerShare <=0)
        {
            throw new InvalidOperationException("유효하지 않은 종목입니다.");
        }
        var user = _dbContext.Users.Find(userId);
        if (user == null)
        {
            throw new InvalidOperationException("존재하지 않는 사용자입니다.");
        }
        var existingHolding = _dbContext.Holdings.FirstOrDefault(h => h.UserId == userId && h.Symbol == stockSymbol);
        if (existingHolding == null || existingHolding.Quantity < quantity)
        {
            throw new InvalidOperationException("보유 주식이 부족합니다.");
        }
        existingHolding.Quantity -= quantity;
        if (existingHolding.Quantity == 0)
        {
            _dbContext.Holdings.Remove(existingHolding);
        }
        user.CashBalance += quantity * pricePerShare;
        var transaction = new Transaction
        {
            UserId = userId,
            Symbol = stockSymbol,
            Quantity = quantity,
            Price = pricePerShare,
            Type = "SELL",
            CreatedAt = DateTime.UtcNow
        };   
        _dbContext.Transactions.Add(transaction);
        _dbContext.SaveChanges();
    }

    public List<Transaction> GetTransactions(int userId)
    {
        return _dbContext.Transactions
            .Where(t=> t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToList();
    }
}