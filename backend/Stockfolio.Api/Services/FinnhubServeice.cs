using Stockfolio.Api.Models; // Quote/Search 결과를 담을 타입을 따로 만든다면

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
        return result ?? throw new Exception("Finnhub 응답을 받지 못했습니다.");
    }
}