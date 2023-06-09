using System.Text.Json.Serialization;

namespace Backend.Entities;

public enum MachineState
{
    Stopped,
    Running,
}

public class Machine
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public MachineState State { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public MachineImage Image { get; set; }
    
    [JsonIgnore]
    public string? ContainerId { get; set; }
}