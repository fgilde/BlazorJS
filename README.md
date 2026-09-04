<p align="center">
  <img src="https://raw.githubusercontent.com/fgilde/BlazorJS/master/logo.png" alt="BlazorJS" width="200" />
</p>

<h1 align="center">BlazorJS</h1>

<p align="center">Better JavaScript interaction for Blazor.</p>

<p align="center">
  <a href="https://quickrun.org/run?repo=fgilde/BlazorJS"><img src="https://quickrun.org/badge.svg" alt="Run the sample with QuickRun" /></a>
  <a href="https://www.nuget.org/packages/BlazorJS"><img src="https://img.shields.io/nuget/v/BlazorJS?style=flat-square&color=8b5cf6&label=nuget" alt="NuGet" /></a>
  <a href="https://www.nuget.org/packages/BlazorJS"><img src="https://img.shields.io/nuget/dt/BlazorJS?style=flat-square&color=22d3ee&label=downloads" alt="Downloads" /></a>
  <img src="https://img.shields.io/badge/net6%20%E2%80%93%20net10-6366f1?style=flat-square" alt="Target frameworks" />
  <img src="https://img.shields.io/badge/license-MIT-8b5cf6?style=flat-square" alt="MIT" />
</p>

<p align="center">
  <b><a href="https://fgilde.github.io/BlazorJS/">📖 Documentation</a></b> &nbsp;·&nbsp;
  <a href="https://www.nuget.org/packages/BlazorJS">NuGet</a> &nbsp;·&nbsp;
  <a href="https://quickrun.org/run?repo=fgilde/BlazorJS">Run the sample</a>
</p>

---

## Run the sample

The repository ships a sample app with a live page for every feature. With
[QuickRun](https://quickrun.org) installed it is one click:

[![QuickRun](https://quickrun.org/badge.svg)](https://quickrun.org/run?repo=fgilde/BlazorJS)

Or the manual way:

```bash
dotnet run --project BlazorJSSample
```

## What it does

1. A **Scripts component** to load JavaScript and stylesheet files per page or component, unloaded again on dispose.
2. **IJSRuntime extensions for dynamic invocation** that remove the need to write JS wrapper functions for everything.
3. **Event interop** to hook any browser event, plus `ResizeObserver` and `IntersectionObserver`, onto a Blazor component.
4. **Clipboard, dialog and DOM helpers** with the browser quirks already handled.
5. A **base component** to import a module and create a JS object reference from it.

Target frameworks: `net10.0`, `net9.0`, `net8.0`, `net7.0`, `net6.0` and `netstandard2.1`.

## Installation

```bash
dotnet add package BlazorJS
```

Open `_Imports.razor` and add the usings:

```csharp
@using BlazorJS
@using BlazorJS.Attributes
@using BlazorJS.JsInterop
```

The browser side registers itself through a Blazor JS initializer, so there is no service registration
and no script tag to add.

---

### <ins>Scripts Component</ins>

The scripts component allows you to include every javascript file easily to your pages or components.
For example open any page like the `index.razor` and add

```html
<Scripts src="js/myjsfile.js"></Scripts>
```

This component can also load stylesheet files

```html
<Scripts src="js/myjsfile.js,css/mystyle.css"></Scripts>
```

#### Include multiple javascript files

Multiple js files can be loaded with a comma seperator `,`

```html
<Scripts src="js/myjsfile.js, js/myjsfile2.js"></Scripts>
```

#### Parameters

| Parameter | Default | Description |
|---|---|---|
| `Src` | – | One or more files, comma separated |
| `UnloadOnDispose` | `true` | Removes the elements again when the component is disposed |
| `SourceLoadBehaviour` | `OnAfterRender` | `OnInitialized`, `OnInitializedAsync`, `OnAfterRender` or `OnAfterRenderAsync` |
| `SourceLoaded` | – | `EventCallback<string>` raised per file once it finished loading |

The same from code:

```csharp
await jsRuntime.LoadFilesAsync("js/chart.js", "css/chart.css");
await jsRuntime.UnloadFilesAsync("js/chart.js");
```

### <ins>Extended Dynamic JS Invocation</ins>

The Dynamic Invocation extension for IJSRuntime allows for dynamic invocation of JavaScript functions from C#.
This extension provides a method `DInvokeVoidAsync`, which takes in a function to be invoked and an array of
objects to be passed as arguments to that function.

#### Simple Call

```csharp
await jsRuntime.DInvokeVoidAsync(window => window.alert("test"));
```

#### Passing Parameters

Only the source text of the lambda is transferred, so variables from your component do not exist in the browser.
Something like this is **not** enough:

```csharp
// DONT COPY THIS!! SAMPLE FOR NOT WORKING
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount));
```

Pass the parameters instead:

```csharp
await jsRuntime.DInvokeVoidAsync((window, c) => window.alert(c), currentCount);
await jsRuntime.DInvokeVoidAsync((window, c, p2, p3) => window.alert(c), currentCount, param2, param3);
```

```csharp
await jsRuntime.DInvokeVoidAsync((window, c, x) =>
        {
            window.alert(c);
            window.console.log(x);
        }, currentCount, "Flo");
```

Or add parameters with the class `JSArgument`, which keeps the original variable names:

```csharp
var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
var name = "John";
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount + " - " + date + name),
                                 JSArgument.For(currentCount).And(date).And(name));
```

#### Using return values

All samples above are also callable with a generic argument to use return values.

```csharp
var res = await jsRuntime.DInvokeAsync<string>(window => window.prompt());
Console.WriteLine(res);
```

Results can be reused as parameters:

```csharp
var hash = await jsRuntime.DInvokeAsync<string>(window =>
{
    window.alert(currentCount);
    return window.location.hash + "_" + currentCount;
}, new[] { JSArgument.For(currentCount) });
await jsRuntime.DInvokeVoidAsync(document => document.location.hash = hash, new[] { JSArgument.For(hash) });
// After alerting the currentCount we update the url in browser like this #1_2_3_4...
```

### <ins>Clipboard</ins>

`navigator.clipboard` only exists in a secure context. `CopyToClipboardAsync` uses it when available and
falls back to the legacy `execCommand` path otherwise, so it also works on plain http during development.

```csharp
var copied = await jsRuntime.CopyToClipboardAsync("Copied with BlazorJS");
if (!copied)
    await jsRuntime.AlertAsync("The browser refused the copy.");

// reading always needs a secure context and a user permission, returns null when denied
var text = await jsRuntime.ReadClipboardAsync();
```

### <ins>Simple event interop helper</ins>

A simple possibility to hook events, with an easy `OnBlur` extension for the click-outside case.

```csharp
private BlazorJSEventInterop<PointerEventArgs> _jsEvent;

_jsEvent = new BlazorJSEventInterop<PointerEventArgs>(_jsRuntime);
await _jsEvent.OnBlur(OnFocusLeft, ".element-selector");

private Task OnFocusLeft(PointerEventArgs arg)
{
    return Task.CompletedTask;
}
```

You can also use it manually with any event you want to.

```csharp
private BlazorJSEventInterop<PointerEventArgs> _jsEvent;

_jsEvent = new BlazorJSEventInterop<PointerEventArgs>(_jsRuntime);
await _jsEvent.AddEventListener("NameOfEvent", async args => { await YourCallBack(); }, ".element-selector");
```

If the selector does not exist yet, a MutationObserver waits for it and attaches the listener as soon as
Blazor rendered the element.

### <ins>Resize and visibility observers</ins>

The same interop class also exposes a `ResizeObserver` and an `IntersectionObserver`. Both are disconnected
when the interop instance is disposed.

```csharp
private BlazorJSEventInterop<ElementSizeArgs> _resize;
private BlazorJSEventInterop<ElementVisibilityArgs> _visibility;

_resize = new BlazorJSEventInterop<ElementSizeArgs>(_jsRuntime);
await _resize.OnResize(OnResized, ".my-chart");   // without a selector: the whole viewport

_visibility = new BlazorJSEventInterop<ElementVisibilityArgs>(_jsRuntime);
await _visibility.OnVisibilityChanged(LoadMore, "#load-more-marker", threshold: 0.5);

private Task OnResized(ElementSizeArgs args)              // Width, Height, Top, Left
    => InvokeAsync(() => RedrawChart(args.Width, args.Height));

private async Task LoadMore(ElementVisibilityArgs args)   // IsVisible, Ratio
{
    if (args.IsVisible)
        await LoadNextPage();
}
```

Typical use cases: redrawing a canvas or chart when its container changes, and infinite scrolling or lazy
loading with a marker element at the end of a list.

### <ins>Dialogs and small helpers</ins>

```csharp
await jsRuntime.AlertAsync("Saved");
var ok   = await jsRuntime.ConfirmAsync("Delete this item?");
var name = await jsRuntime.PromptAsync("Your name?", "Flo");

await jsRuntime.AddCss(".demo { color: #22d3ee }", "my-styles", skipIfElementExists: true);
await jsRuntime.LoadCss("css/component.css");   // from an <EmbeddedResource>

var exists  = await jsRuntime.IsElementAvailableAsync("my-element-id");
await jsRuntime.RemoveElementAsync("my-element-id");
var scripts = await jsRuntime.GetLoadedScriptsAsync();

// wait for a global that a third party script defines
var ready = await jsRuntime.WaitForNamespaceAsync("google.maps");
```

### <ins>BaseComponent for Js wrapper components</ins>

BlazorJS provides a small base component called `BlazorJsBaseComponent<T>` to create a JS wrapper component.
This is a simple way to create a JS object reference from a module and use it in your blazor component.

1. Create a razor component

<ins>YourComponent.razor</ins>

```html
@inherits BlazorJs.BlazorJsBaseComponent<YourComponent>

<div @ref="ElementReference">

</div>
```

<ins>YourComponent.razor.cs</ins>

```csharp
public partial class YourComponent
{
    protected override string ComponentJsFile() => "./js/PathToYourComponent.js";
    protected override string ComponentJsInitializeMethodName() => "initializeMethodForYourComponent";

    [Parameter]
    public string SomeGeneralParam { get; set; }

    [Parameter, ForJs]
    public int ParamForJs { get; set; } = 100;

    [Parameter, ForJs("anotherParamForJsWithDifferentNameInJs")]
    public int AnotherParamForJs { get; set; } = 100;

    protected override async Task OnJsOptionsChanged()
    {
        // This method will automatically be called when a parameter marked with [ForJs] has changed
        if (JsReference != null)
            await JsReference.InvokeVoidAsync("setOptions", MyJsOptions());
    }

    private object MyJsOptions()
    {
        return this.AsJsObject(new
        {
            configValueWirthoutParam = 123,
        });
    }

    /// <summary>
    /// Gets the JavaScript arguments to pass to the component.
    /// We override here because by default only the element reference and dotnet reference is passed
    /// but we want to have directly the JsOptions available.
    /// </summary>
    public override object[] GetJsArguments() => new[] { ElementReference, CreateDotNetObjectReference(), MyJsOptions() };
}
```

2. Create your js file thats located in the path you have defined in `ComponentJsFile()`

<ins>./js/PathToYourComponent.js</ins>

```javascript
class YourComponent {
    elementRef;
    dotnet;
    constructor(elementRef, dotNet, options) {
        this.elementRef = elementRef;
        this.dotnet = dotNet;
        this.createWhatever(options);
    }

     createWhatever(options) {
        // Do something with the options
        console.log(options.paramForJs);
        console.log(options.anotherParamForJsWithDifferentNameInJs);
        console.log(options.configValueWirthoutParam);
     }

    setOptions(options) {
        // Just update the options with the new ones
    }

    dispose() {
        // Dispose everything you created
    }
}

window.YourComponent = YourComponent;

// This method will be called from the BlazorJsBaseComponent and should match the name you have defined in `ComponentJsInitializeMethodName()`
export function initializeMethodForYourComponent(elementRef, dotnet, options) {
    return new YourComponent(elementRef, dotnet, options);
}
```

### <ins>Browser detect</ins>

```html
<BrowserDetect @bind-browserInfo="@Info"
               OSVersionUpdate="v => osVersion = v"
               OSArchitectureUpdate="a => architecture = a" />

@code {
    public BrowserInfo Info { get; set; }
}
```

`BrowserInfo` carries browser name and version, engine, operating system, screen resolution, time zone,
user agent and the `IsMobile` / `IsAndroid` / `IsIPhone` / `IsIPad` flags.

---

The full documentation lives at **[fgilde.github.io/BlazorJS](https://fgilde.github.io/BlazorJS/)**.
BlazorJS is MIT licensed.
