using System.Text.Json.Serialization;

namespace Stockfolio.Api.Models;

public class StockQuote
{
    [JsonPropertyName("c")]  public decimal CurrentPrice { get; set; }
    [JsonPropertyName("d")]  public decimal? Change { get; set; }
    [JsonPropertyName("dp")] public decimal? PercentChange { get; set; }
    [JsonPropertyName("h")]  public decimal High { get; set; }
    [JsonPropertyName("l")]  public decimal Low { get; set; }
    [JsonPropertyName("o")]  public decimal Open { get; set; }
    [JsonPropertyName("pc")] public decimal PreviousClose { get; set; }
}
