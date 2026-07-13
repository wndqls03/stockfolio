using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Stockfolio.Api.Data;
using Stockfolio.Api.Models;

namespace Stockfolio.Api.Services;

// 인증과 JWT 발급을 담당하는 서비스입니다. 로그인/회원가입 로직을 한 곳에 모아 관리합니다.
public class AuthService
{
    private readonly StockfolioDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthService(StockfolioDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public string CreateToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key가 설정되지 않았습니다.");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "stockfolio",
            audience: _configuration["Jwt:Audience"] ?? "stockfolio-client",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public User Register(string email, string password)
    {
        var existing = _dbContext.Users.FirstOrDefault(u => u.Email == email);
        if (existing is not null)
        {
            throw new InvalidOperationException("이미 사용 중인 이메일입니다.");
        }

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CashBalance = 100000m
        };

        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return user;
    }

    public User? Login(string email, string password)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
        if (user is null)
        {
            return null;
        }

        var isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        return isValid ? user : null;
    }
}
