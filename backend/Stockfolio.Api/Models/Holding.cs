namespace Stockfolio.Api.Models;

// Represents a currently held stock position. Unrealized P/L is derived from average buy price and quantity.
public class Holding
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Symbol { get; set; }
    public decimal Quantity { get; set; }
    public decimal AvgBuyPrice { get; set; }
}
