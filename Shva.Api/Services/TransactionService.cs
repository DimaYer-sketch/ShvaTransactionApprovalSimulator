using Microsoft.EntityFrameworkCore;
using Shva.Api.Data;
using Shva.Api.DTOs;
using Shva.Api.Helpers;
using Shva.Api.Models;
using System.Globalization;

namespace Shva.Api.Services;

public class TransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TransactionResponse> SubmitAsync(SubmitTransactionRequest request)
    {
        var timeZone = TimeZoneHelper.GetTimeZone(request.Region);

        if (!TimeOnly.TryParseExact(request.Time, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var time))
        {
            throw new ArgumentException("Invalid time format.");
        }

        var nowUtc = DateTime.UtcNow;

        var simulatedUtc = new DateTime(
            nowUtc.Year,
            nowUtc.Month,
            nowUtc.Day,
            time.Hour,
            time.Minute,
            0,
            DateTimeKind.Utc
        );

        var localTime = TimeZoneInfo.ConvertTimeFromUtc(simulatedUtc, timeZone);

        var isApproved =
            localTime.TimeOfDay >= new TimeSpan(8, 0, 0) &&
            localTime.TimeOfDay < new TimeSpan(18, 0, 0);

        var entity = new Transaction
        {
            Region = request.Region,
            SubmittedTimeUtc = simulatedUtc,
            LocalTime = localTime,
            IsApproved = isApproved,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Transactions.Add(entity);
        await _context.SaveChangesAsync();

        return new TransactionResponse
        {
            Id = entity.Id,
            Region = entity.Region,
            LocalTime = entity.LocalTime.ToString("HH:mm"),
            IsApproved = entity.IsApproved
        };
    }

    public async Task<List<TransactionResponse>> GetApprovedAsync()
    {
        return await _context.Transactions
            .AsNoTracking()
            .Where(t => t.IsApproved)
            .OrderByDescending(t => t.CreatedAtUtc)
            .Select(t => new TransactionResponse
            {
                Id = t.Id,
                Region = t.Region,
                LocalTime = t.LocalTime.ToString("HH:mm"),
                IsApproved = t.IsApproved
            })
            .ToListAsync();
    }
}