using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Backend.Utils;

[AttributeUsage(AttributeTargets.Method)]
public class SecureRouteAttribute : ActionFilterAttribute
{
    public bool RequireAdmin { get; }

    public SecureRouteAttribute(bool requireAdmin = false)
    {
        this.RequireAdmin = requireAdmin;
    }
    
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
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
        
        await next();
    }
}