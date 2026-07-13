using Stockfolio.Api.Data;
using Stockfolio.Api.Models;

namespace Stockfolio.Api.Services;
public class PortfolioService
{
    private readonly StockfolioDbContext _dbContext;
    private readonly FinnhubService _finnhubService;

    public PortfolioService(StockfolioDbContext dbContext, FinnhubService finnhubService)
    {
        _dbContext = dbContext;
        _finnhubService = finnhubService;
    }

    public async Task<List<HoldingView>> GetHoldings(int userId)
    {
        var holdings = _dbContext.Holdings.Where(h=> h.UserId == userId).ToList();
        var holdingViews = new List<HoldingView>();
        foreach (var holding in holdings)
        {
            var quote = await _finnhubService.GetQuoteAsync(holding.Symbol);
            var marketValue = holding.Quantity * quote.CurrentPrice;
            var costBasis = holding.Quantity * holding.AvgBuyPrice;
            var unrealizedPL = marketValue - costBasis;

            holdingViews.Add(new HoldingView
            {
                Symbol = holding.Symbol,
                Quantity = holding.Quantity,
                AvgBuyPrice = holding.AvgBuyPrice,
                CurrentPrice = quote.CurrentPrice,
                MarketValue = marketValue,
                UnrealizedPL = unrealizedPL,
                UnrealizedPLPercent = costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0
            });
        }
        return holdingViews;
    }

    public async Task<PortfolioSummary> GetSummary(int userId)
    {
        var holdings = await GetHoldings(userId);
        var totalMarketValue = holdings.Sum(h => h.MarketValue);
        var totalCost = holdings.Sum(h => h.Quantity * h.AvgBuyPrice);
        var unrealizedPL = totalMarketValue - totalCost;
        var unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;
        var cashBalance = _dbContext.Users.Where(u => u.Id == userId).Select(u => u.CashBalance).FirstOrDefault();
        var totalAssets = totalMarketValue + cashBalance;
        var totalReturnPercent = (totalAssets - 100000) / 100000 * 100;

        return new PortfolioSummary
        {
            CashBalance = cashBalance,
            TotalAssets = totalAssets,
            TotalReturnPercent = totalReturnPercent
        };
    }
}
