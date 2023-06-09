using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace Backend.Utils;

public class UserModelBinder : Attribute, IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        return context.Metadata?.ModelType == typeof(User) ? new FromSecurityModelBinder() : null;
    }
}

public class FromSecurityModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.FieldName);

        if (valueProviderResult != ValueProviderResult.None)
        {
            bindingContext.Model = valueProviderResult.FirstValue;
            bindingContext.Result = ModelBindingResult.Success(bindingContext.Model);
        }
        else
        {
            var token = bindingContext.HttpContext.ExtractToken();

            if (token is null)
            {
                if (bindingContext.ModelMetadata.IsNullableValueType)
                {
                    bindingContext.Model = null;
                    bindingContext.Result = ModelBindingResult.Success(bindingContext.Model);
                    return;
                }
                
                bindingContext.Result = ModelBindingResult.Failed();
                return;
            }

            var database = bindingContext.HttpContext.RequestServices.GetService<LHPDatabaseContext>()!;
            var user = await database.Users.FirstOrDefaultAsync(x => x.Token == token);

            if (user is null)
            {
                bindingContext.Result = ModelBindingResult.Failed();
                return;
            }
            bindingContext.Model = user;
            bindingContext.Result = ModelBindingResult.Success(bindingContext.Model);
        }
    }
}