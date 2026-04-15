namespace Shva.Api.DTOs;

public class TransactionResponse
{
    public int Id { get; set; }

    public string Region { get; set; } = string.Empty;

    public string LocalTime { get; set; } = string.Empty;

    public bool IsApproved { get; set; }
}