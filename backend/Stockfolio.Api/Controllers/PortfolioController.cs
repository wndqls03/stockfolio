using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stockfolio.Api.Services;
using System.Security.Claims;

namespace Stockfolio.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/portfolio")]
public class PortfolioController : ControllerBase
{
    private readonly PortfolioService _portfolioService;
    
    public PortfolioController(PortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }
    

    [HttpGet]
    public async Task<IActionResult> GetHoldings()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var holdings = await _portfolioService.GetHoldings(userId);
        return Ok(holdings);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetPortfolio()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var portfolio = await _portfolioService.GetSummary(userId);
        return Ok(portfolio);
    }
}