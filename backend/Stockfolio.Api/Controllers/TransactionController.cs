using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stockfolio.Api.Services;
using System.Security.Claims;

namespace Stockfolio.Api.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly TransactionService _transactionService;
    private readonly FinnhubService _finnhubService;

    public TransactionController(TransactionService transactionService, FinnhubService finnhubService)
    {
        _transactionService = transactionService;
        _finnhubService = finnhubService;
    }

    [HttpPost("buy")]
    public async Task<IActionResult> Buy([FromBody] TradeRequest request)
    {
        var quote = await _finnhubService.GetQuoteAsync(request.Symbol);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            _transactionService.Buy(userId, request.Symbol, request.Quantity, quote.CurrentPrice);
            return Ok(new { message = "Buy order completed" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("sell")]
    public async Task<IActionResult> Sell([FromBody] TradeRequest request)
    {
        var quote = await _finnhubService.GetQuoteAsync(request.Symbol);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            _transactionService.Sell(userId, request.Symbol, request.Quantity, quote.CurrentPrice);
            return Ok(new { message = "Sell order completed" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public IActionResult GetTransactions()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var transactions = _transactionService.GetTransactions(userId);
        return Ok(transactions);
    }
    public record TradeRequest(string Symbol, decimal Quantity);

}