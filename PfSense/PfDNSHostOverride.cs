using System.Text.Json.Serialization;

namespace PfSense;

public class PfDNSHostOverrideCreate
{
    public string[] Aliases { get; set; } = Array.Empty<string>();
    public string Host { get; set; }
    public string Domain { get; set; }
    public string[] Ip { get; set; }
    [JsonPropertyName("descr")] public string Description { get; set; } = "";
    public bool Apply { get; set; }
}

public class PfDNSHostOverride
{
    public string Host { get; set; }
    public string Domain { get; set; }
    public string Ip { get; set; }
    [JsonPropertyName("descr")]
    public string Description { get; set; }
}