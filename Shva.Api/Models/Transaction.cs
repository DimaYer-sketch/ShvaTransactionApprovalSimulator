namespace Shva.Api.Models;

public class Transaction
{
    public int Id { get; set; }

    public string Region { get; set; } = string.Empty;

    public DateTime SubmittedTimeUtc { get; set; }

    public DateTime LocalTime { get; set; }

    public bool IsApproved { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}