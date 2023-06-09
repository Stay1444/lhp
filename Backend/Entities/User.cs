using System.Text.Json.Serialization;

namespace Backend.Entities;

public class User
{
    public Guid Id { get; set; }
    [JsonIgnore]
    public Guid Token { get; set; }
    public bool Admin { get; set; }
    
    public DateTimeOffset CreationDate { get; set; }
    public DateTimeOffset LastLoginDate { get; set; }
    
    public string Name { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ICollection<Domain>? Domains { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ICollection<Machine>? Machines { get; set; }
}
