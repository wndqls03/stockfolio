namespace Stockfolio.Api.Models;

// Records a buy/sell transaction. Used by the portfolio history screen and analytics.
public class Transaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Symbol { get; set; }
    public required string Type { get; set; } // BUY / SELL
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
