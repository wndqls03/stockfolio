namespace Stockfolio.Api.Models;

// 현재 보유 종목을 나타냅니다. 평균 매입가와 수량을 기준으로 평가 손익을 계산합니다.
public class Holding
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Symbol { get; set; }
    public decimal Quantity { get; set; }
    public decimal AvgBuyPrice { get; set; }
}
