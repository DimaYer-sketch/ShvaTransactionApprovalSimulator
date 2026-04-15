using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shva.Api.DTOs;
using Shva.Api.Services;

namespace Shva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly TransactionService _transactionService;

    public TransactionsController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Submit([FromBody] SubmitTransactionRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var result = await _transactionService.SubmitAsync(request);
        return Ok(result);
    }

    [HttpGet("approved")]
    public async Task<ActionResult<List<TransactionResponse>>> GetApproved()
    {
        var result = await _transactionService.GetApprovedAsync();
        return Ok(result);
    }
}