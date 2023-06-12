using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace PfSense;

public class PfSenseClient
{
    private HttpClient _client;

    public PfSenseClient(string clientId, string token, string endpoint)
    {
        var handler = new HttpClientHandler();
        handler.ClientCertificateOptions = ClientCertificateOption.Manual;
        handler.ServerCertificateCustomValidationCallback = 
            (httpRequestMessage, cert, cetChain, policyErrors) =>
            {
                return true;
            };

        _client = new HttpClient(handler);
        _client.BaseAddress = new Uri(endpoint);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(clientId, token);
    }
    
    public async Task<PfDNSHostOverride[]> GetHostOverrides()
    {
        var response = await _client.GetAsync("api/v1/services/unbound/host_override");
        var pfResponse = await response.Content.ReadFromJsonAsync<PfResponse<PfDNSHostOverride[]>>();
        return pfResponse!.Data;
    }

    public async Task AddHostOverride(PfDNSHostOverrideCreate hostOverride)
    {
        var content = new StringContent(JsonSerializer.Serialize(hostOverride, new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }), Encoding.UTF8, "application/json");
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        await _client.PostAsync("api/v1/services/unbound/host_override", content);
    }

    public async Task DeleteHostOverride(int id, bool apply = false)
    {
        await _client.DeleteAsync($"api/v1/services/unbound/host_override?id={id}&apply={apply}");
    }

    public async Task HostOverrideApply()
    {
        await _client.PostAsync("api/v1/services/unbound/apply", null);
    }
}