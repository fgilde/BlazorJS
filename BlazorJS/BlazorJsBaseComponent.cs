#if NET6_0_OR_GREATER

using BlazorJS.Attributes;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;
using System;
using BlazorJS;

namespace BlazorJs;

/// <summary>
/// Base class for components that require a JS module to be imported and a JS object to be created.
/// </summary>
/// <typeparam name="T"></typeparam>
public abstract class BlazorJsBaseComponent<T> : ComponentBase, IAsyncDisposable
    where T : BlazorJsBaseComponent<T>
{
    [Inject] 
    protected IJSRuntime JsRuntime { get; set; }
    
    private readonly TaskCompletionSource<IJSObjectReference> _jsReferenceCreatedCompletionSource = new();

    protected abstract string ComponentJsFile();
    protected abstract string ComponentJsInitializeMethodName();

    /// <summary>
    /// The JS object reference.
    /// </summary>
    public IJSObjectReference JsReference { get; set; }

    /// <summary>
    /// The imported module reference
    /// </summary>
    public IJSObjectReference ModuleReference { get; set; }

    /// <summary>
    /// Reference to rendered element
    /// </summary>
    public ElementReference ElementReference { get; set; }

    /// <inheritdoc/>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
        if (firstRender)
        {
            await ImportModuleAndCreateJsAsync();
        }
    }

    /// <summary>
    /// Returns a task that completes when the reference is created
    /// </summary>
    public Task<IJSObjectReference> WaitReferenceCreatedAsync() => _jsReferenceCreatedCompletionSource.Task;

    /// <summary>
    /// Returns an object that is passed forward to the js initialize and constructor method
    /// </summary>
    public virtual object[] GetJsArguments() => new object[] { ElementReference, CreateDotNetObjectReference() };

    /// <summary>
    /// The dotnet object reference for the js module
    /// </summary>
    public virtual DotNetObjectReference<BlazorJsBaseComponent<T>> CreateDotNetObjectReference() => DotNetObjectReference.Create(this);

    public override async Task SetParametersAsync(ParameterView parameters)
    {
        var hasJsChanges = parameters.AffectedForJs(this);
        await base.SetParametersAsync(parameters);
        if (hasJsChanges)
            await OnJsOptionsChanged();
    }

    protected virtual Task OnJsOptionsChanged()
    {
        return Task.CompletedTask;
    }

    /// <summary>
    /// Virtual base method to import the module
    /// </summary>
    public virtual async Task ImportModuleAndCreateJsAsync()
    {
        var references = await JsRuntime.ImportModuleAndCreateJsAsync(ComponentJsFile(), ComponentJsInitializeMethodName(), GetJsArguments());
        JsReference = references.jsObjectReference;
        ModuleReference = references.moduleReference;
        _jsReferenceCreatedCompletionSource.TrySetResult(JsReference);
    }

    /// <inheritdoc/>
    public virtual async ValueTask DisposeAsync()
    {
        if (JsReference != null)
        {
            try
            {
                await JsReference.InvokeVoidAsync("dispose");
            }
            catch{ /*ignore*/ }            
            await JsReference.DisposeAsync();
        }

        if (ModuleReference != null)
            await ModuleReference.DisposeAsync();
    }
}

#endif