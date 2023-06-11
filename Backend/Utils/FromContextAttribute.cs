using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.Utils;

public class FromContextAttribute : Attribute, IBindingSourceMetadata
{
    public BindingSource? BindingSource { get; } = BindingSource.Custom;
}