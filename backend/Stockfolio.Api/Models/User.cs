namespace Stockfolio.Api.Models;

// 사용자 엔티티입니다. 가입 시 가상 현금 잔고를 지급하고, 이후 거래 로직의 기준이 됩니다.
public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public decimal CashBalance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
