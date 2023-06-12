namespace PfSense;

public class PfResponse<T>
{
    public string Status { get; set; }
    public int Code { get; set; }
    public int Return { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
}