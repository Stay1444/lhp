namespace Backend.Requests;

public record RegisterDomainRequest(string Domain, string Tld, string Target);