using System.Text.RegularExpressions;

namespace Backend.Utils;

public static class StringUtils
{
    private static readonly Regex AlphaNumericRegex = new Regex("^[a-zA-Z0-9]+$", RegexOptions.Compiled);
    private static readonly Regex UsernameRegex = new Regex("^[a-zA-Z0-9]+$", RegexOptions.Compiled);
    
    public static bool IsAlphaNumeric(this string? input)
    {
        return !string.IsNullOrEmpty(input) && AlphaNumericRegex.IsMatch(input);
    }
    
    public static bool IsValidUsername(this string? input)
    {
        return !string.IsNullOrEmpty(input) && UsernameRegex.IsMatch(input);
    }
}