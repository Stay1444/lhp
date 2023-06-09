using System.Net;
using System.Text.Json.Serialization;

namespace Backend.Entities;

public class Domain
{
    public Guid Id { get; set; }
    [JsonIgnore]
    public User Owner { get; set; }
    public string Host { get; set; }
    public string Tld { get; set; }

    public string Target { get; set; }
    
    public string FullDomain()
    {
        return $"{Host}.{Tld}";
    }
}