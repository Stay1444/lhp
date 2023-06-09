using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Backend.Utils;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class SecureRouteAttribute : ActionFilterAttribute, IAsyncAuthorizationFilter
{
    public bool RequireAdmin { get; }

    public SecureRouteAttribute(bool requireAdmin = false)
    {
        this.RequireAdmin = requireAdmin;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var token = context.HttpContext.ExtractToken();

        if (token is null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
        
        var db = context.HttpContext.RequestServices.GetService<LHPDatabaseContext>();

        if (db is null)
        {
            throw new Exception("Failed to get database from SecureRoute attribute!");
        }

        var user = await db.Users.FirstOrDefaultAsync(x => x.Token == token);

        if (user is null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        if (RequireAdmin && !user.Admin)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
    }
}