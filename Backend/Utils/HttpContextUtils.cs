namespace Backend.Utils;

public static class HttpContextUtils
{
    public static Guid? ExtractToken(this HttpContext context)
    {
        var tokenString = context.Request.Headers.Authorization.ToString();

        if (!Guid.TryParse(tokenString, out var token))
        {
            return null;
        }

        return token;
    }
}