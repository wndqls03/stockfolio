using System.Text.Json.Serialization;

namespace Stockfolio.Api.Models;

public class StockSearchResult
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("result")]
    public List<StockSearchItem> Result { get; set; } = new();
}

public class StockSearchItem
{
    [JsonPropertyName("description")]
    public string Description { get; set; } = "";

    [JsonPropertyName("displaySymbol")]
    public string DisplaySymbol { get; set; } = "";

    [JsonPropertyName("symbol")]
    public string Symbol { get; set; } = "";

    [JsonPropertyName("type")]
    public string Type { get; set; } = "";
}
