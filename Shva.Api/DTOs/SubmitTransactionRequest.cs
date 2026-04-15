using System.ComponentModel.DataAnnotations;

namespace Shva.Api.DTOs;

public class SubmitTransactionRequest
{
    [Required]
    public string Region { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^([01]\d|2[0-3]):([0-5]\d)$", ErrorMessage = "Time must be in HH:mm format.")]
    public string Time { get; set; } = string.Empty;
}