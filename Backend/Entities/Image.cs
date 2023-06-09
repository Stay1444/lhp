namespace Backend.Entities;

public class Image
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string DockerImage { get; set; }
    public int[] ExposedPorts { get; set; }
}