using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorJS.JsInterop;

public class BlazorJSEventInterop<TEventArgs> : IAsyncDisposable
//where TEventArgs : EventArgs 
{
    private readonly IJSRuntime _jsRuntime;
    public IList<DotNetObjectReference<BlazorJSEventHelper<TEventArgs>>> DotNetObjectReferences = new List<DotNetObjectReference<BlazorJSEventHelper<TEventArgs>>>();

    private DotNetObjectReference<BlazorJSEventHelper<TEventArgs>> Register(Func<TEventArgs, Task> callback)
    {
        var res = DotNetObjectReference.Create(new BlazorJSEventHelper<TEventArgs>(callback));
        DotNetObjectReferences.Add(res);
        return res;
    }

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
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.addCustomEventListenerWhenNotIn", elementSelectors, eventName, Register(callback));
        return this;
    }

    public async Task<BlazorJSEventInterop<TEventArgs>> AddEventListener(string eventName, Func<TEventArgs, Task> callback, string elementSelector = null)
    {
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.addCustomEventListener", eventName, Register(callback), elementSelector); 
        return this;
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var dotNetObjectReference in DotNetObjectReferences)
        {
            if (dotNetObjectReference == null) 
                continue;
            try
            {
                await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.removeCustomEventListener", dotNetObjectReference);
            }
            catch {/* Ignored */}

            try
            {
                dotNetObjectReference.Dispose();
            }
            catch { /* Ignored */}
            dotNetObjectReference.Dispose();
        }
        DotNetObjectReferences.Clear();
    }
}

public class BlazorJSEventHelper<TEventArgs>
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
