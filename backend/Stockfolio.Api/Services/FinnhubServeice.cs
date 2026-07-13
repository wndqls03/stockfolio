using Stockfolio.Api.Models;

namespace Stockfolio.Api.Services;

public class FinnhubService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    public FinnhubService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }
    public async Task<StockSearchResult> SearchAsync(string query)
    {
        var apiKey = _configuration["APIKeys:Finnhub_API"];
        var encodedQuery = Uri.EscapeDataString(query);
        var url = $"https://finnhub.io/api/v1/search?q={encodedQuery}&token={apiKey}";
        var result = await _httpClient.GetFromJsonAsync<StockSearchResult>(url);
        return result ?? new StockSearchResult();
    }
    public async Task<StockQuote> GetQuoteAsync(string symbol)
    {
        var apiKey = _configuration["APIKeys:Finnhub_API"];
        var encodedSymbol = Uri.EscapeDataString(symbol);
        var url = $"https://finnhub.io/api/v1/quote?symbol={encodedSymbol}&token={apiKey}";
        var result = await _httpClient.GetFromJsonAsync<StockQuote>(url);
        return result ?? throw new Exception("No response received from Finnhub.");
    }
}