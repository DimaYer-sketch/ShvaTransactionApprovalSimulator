using System.Runtime.InteropServices;

namespace Shva.Api.Helpers;

public static class TimeZoneHelper
{
    private static readonly Dictionary<string, string> WindowsTimeZones = new()
    {
        { "israel", "Israel Standard Time" },
        { "france", "Romance Standard Time" },
        { "usa", "Eastern Standard Time" },
        { "japan", "Tokyo Standard Time" },
        { "cyprus", "GTB Standard Time" },
        { "italy", "W. Europe Standard Time" }
    };

    private static readonly Dictionary<string, string> IanaTimeZones = new()
    {
        { "israel", "Asia/Jerusalem" },
        { "france", "Europe/Paris" },
        { "usa", "America/New_York" },
        { "japan", "Asia/Tokyo" },
        { "cyprus", "Asia/Nicosia" },
        { "italy", "Europe/Rome" }
    };

    public static TimeZoneInfo GetTimeZone(string region)
    {
        if (string.IsNullOrWhiteSpace(region))
            throw new ArgumentException("Region is required.");

        var key = region.Trim().ToLowerInvariant();

        var timeZoneId = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? GetTimeZoneId(WindowsTimeZones, key)
            : GetTimeZoneId(IanaTimeZones, key);

        return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
    }

    private static string GetTimeZoneId(Dictionary<string, string> source, string key)
    {
        if (!source.TryGetValue(key, out var value))
            throw new ArgumentException("Unsupported region.");

        return value;
    }
}