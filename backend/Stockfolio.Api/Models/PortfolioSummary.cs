namespace Stockfolio.Api.Models;

public class PortfolioSummary
{
    public decimal CashBalance { get; set; }
    public decimal TotalAssets { get; set; }
    public decimal TotalReturnPercent { get; set; }
}
