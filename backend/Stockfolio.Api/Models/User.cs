namespace Stockfolio.Api.Models;

// The user entity. Granted a virtual cash balance on signup, which subsequent trade logic is based on.
public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public decimal CashBalance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
