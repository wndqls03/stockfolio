namespace Stockfolio.Api.Models;
public class HoldingView
{
    public string Symbol { get; set; } = "";
    public decimal Quantity { get; set; }
    public decimal AvgBuyPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal MarketValue { get; set; }        // Quantity * CurrentPrice
    public decimal UnrealizedPL { get; set; }        // MarketValue - (Quantity * AvgBuyPrice)
    public decimal UnrealizedPLPercent { get; set; } // UnrealizedPL / (Quantity * AvgBuyPrice) * 100
}
