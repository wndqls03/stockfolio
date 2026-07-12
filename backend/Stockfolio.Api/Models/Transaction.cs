namespace Stockfolio.Api.Models;

// 매수/매도 기록을 남깁니다. 포트폴리오의 히스토리 화면과 분석에 사용됩니다.
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
