using System.Text.Json.Serialization;

namespace Backend.Entities;

public class Machine
{
    public Guid Id { get; set; }
    [JsonIgnore]
    public User Owner { get; set; }

    public string Name { get; set; }
    
    public bool Running { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public Image Image { get; set; }
    
    [JsonIgnore]
    public string? ContainerId { get; set; }
}