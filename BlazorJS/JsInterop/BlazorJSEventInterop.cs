using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorJS.JsInterop;

public class BlazorJSEventInterop<TEventArgs> : IDisposable, IAsyncDisposable
//where TEventArgs : EventArgs 
{
    private readonly IJSRuntime _jsRuntime;
    public DotNetObjectReference<BlazorJSEventHelper<TEventArgs>> DotNetObjectReference;

    public BlazorJSEventInterop(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public Task<BlazorJSEventInterop<TEventArgs>> OnBlur(Func<TEventArgs, Task> callback, params string[] elementSelectors)
    {
        return OnBlur(elementSelectors, "click", callback);
    }

    public async Task<BlazorJSEventInterop<TEventArgs>> OnBlur(string[] elementSelectors, string eventName, Func<TEventArgs, Task> callback)
    {
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.addCustomEventListenerWhenNotIn", elementSelectors, eventName,
            DotNetObjectReference = Microsoft.JSInterop.DotNetObjectReference.Create(new BlazorJSEventHelper<TEventArgs>(callback))
        );
        return this;
    }

    public async Task<BlazorJSEventInterop<TEventArgs>> AddEventListener(string eventName, Func<TEventArgs, Task> callback, string elementSelector = null)
    {
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.addCustomEventListener",
            eventName,
            DotNetObjectReference = Microsoft.JSInterop.DotNetObjectReference.Create(new BlazorJSEventHelper<TEventArgs>(callback)), elementSelector  
        ); 
        return this;
    }

    public void Dispose()
    {
        DotNetObjectReference?.Dispose();
        DotNetObjectReference = null;
    }

    public async ValueTask DisposeAsync()
    {
        Dispose();
    }
}

public class BlazorJSEventHelper<TEventArgs>
//where TEventArgs: EventArgs
{
    private readonly Func<TEventArgs, Task> _callback;

    public BlazorJSEventHelper(Func<TEventArgs, Task> callback)
    {
        _callback = callback;
    }

    [JSInvokable]
    public Task OnCustomEvent(TEventArgs args)
    {
        return _callback(args);
    }
}
