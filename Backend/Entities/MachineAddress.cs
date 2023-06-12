namespace Backend.Entities;

public class MachineAddress
{
    public Guid Id { get; set; }
    
    public string Address { get; set; }
    public string NetworkName { get; set; }
    public string NetworkId { get; set; }
}