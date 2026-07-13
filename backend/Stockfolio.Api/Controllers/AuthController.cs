using Microsoft.AspNetCore.Mvc;
using Stockfolio.Api.Services;

namespace Stockfolio.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = _authService.Register(request.Email, request.Password);
            return Ok(new { user.Id, user.Email, user.CashBalance, token = _authService.CreateToken(user) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _authService.Login(request.Email, request.Password);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(new { user.Id, user.Email, user.CashBalance, token = _authService.CreateToken(user) });
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
