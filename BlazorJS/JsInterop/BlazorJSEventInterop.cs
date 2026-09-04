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

    /// <summary>
    /// Observes the size of an element with a ResizeObserver and reports every change.
    /// Without a selector the document element is observed, which makes it a viewport resize listener.
    /// Use <see cref="ElementSizeArgs"/> as TEventArgs.
    /// </summary>
    public async Task<BlazorJSEventInterop<TEventArgs>> OnResize(Func<TEventArgs, Task> callback, string elementSelector = null)
    {
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.observeResize", elementSelector, Register(callback));
        return this;
    }

    /// <summary>
    /// Observes whether an element is inside the viewport with an IntersectionObserver.
    /// Useful for lazy loading or infinite scrolling. Use <see cref="ElementVisibilityArgs"/> as TEventArgs.
    /// </summary>
    /// <param name="threshold">Part of the element that has to be visible before the callback fires, 0 to 1.</param>
    public async Task<BlazorJSEventInterop<TEventArgs>> OnVisibilityChanged(Func<TEventArgs, Task> callback, string elementSelector, double threshold = 0)
    {
        await _jsRuntime.InvokeVoidAsync("BlazorJS.EventHelper.observeVisibility", elementSelector, Register(callback), threshold);
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
