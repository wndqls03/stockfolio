using Microsoft.AspNetCore.Mvc;
using Stockfolio.Api.Services;

namespace Stockfolio.Api.Controllers;

[ApiController]
[Route("api/stocks")]
public class StockController : ControllerBase
{
    private readonly FinnhubService _finnhubService;

    public StockController(FinnhubService finnhubService)
    {
        _finnhubService = finnhubService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var result = await _finnhubService.SearchAsync(q);
        return Ok(result);
    }
    [HttpGet("quote")]
    public async Task<IActionResult> GetQuote([FromQuery] string symbol)
    {
        var result = await _finnhubService.GetQuoteAsync(symbol);
        return Ok(new
        {
            currentPrice = result.CurrentPrice,
            change = result.Change,
            percentChange = result.PercentChange,
            high = result.High,
            low = result.Low,
            open = result.Open,
            previousClose = result.PreviousClose
        });
    }
}