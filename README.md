# BlazorJS
BlazorJS is a small package to have better interaction with JavaScript.

1. Use a Scripts Component on every page or component to load JavaScript or Stylesheet files when not loaded, and unload automatically on dispose if you want to.
2. This library provides extensions for IJSRuntime for dynamic invocation that eliminates the requirement to create JS wrapping functions for everything
3. A possibility to hook events on a Blazor component or page.
4. Import a module and create a JS object reference from it


### Using Scripts Component

Add the nuget Package `BlazorJS` to your blazor project

Open `_Imports.razor`from your project and add using for BlazorJS

```
...
@using BlazorJS

```

Now your are able to include every javascipt file easily to your pages or components. 
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

### Extension Dynamic JS Invocation

The Dynamic Invocation extension for IJSRuntime allows for dynamic invocation of JavaScript functions from C#. This extension provides a single method, DInvokeVoidAsync, which takes in two arguments: a function to be invoked and an array of objects to be passed as arguments to that function.

Usage
The `DInvokeVoidAsync` method can be called on any instance of IJSRuntime, and takes in general two arguments: a function to be invoked and an array of objects to be passed as arguments to that function.

Here are some examples of how the method can be used:

#### Simple Call
```csharp
await jsRuntime.DInvokeVoidAsync(window => window.alert("test"));
```

#### Passing Parameters 
###### if in your scope a variable is available. (In the base Blazor Sample the currentCount for example) Something like this is not enough
```csharp
// DONT COPY THIS!! SAMPLE FOR NOT WORKING
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount));
```

###### For doing this we need to pass the parameters. You can do it like this
```csharp
await jsRuntime.DInvokeVoidAsync((window, c) => window.alert(c), currentCount);
await jsRuntime.DInvokeVoidAsync((window, c, p2, p3..) => window.alert(c), currentCount, param2, param3, ...);
```

```csharp
await jsRuntime.DInvokeVoidAsync((window, c, x) =>
        {
            window.alert(c);
            window.console.log(x);
        }, currentCount, "Flo");
		
```


###### or you can add parameters with the class JSArgument and an approach like this
```csharp
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount), JSArgument.For(currentCount).ToArray());
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount + " - " + date + name), JSArgument.For(currentCount).And(date).And(name));
```

###### ..if you here need more parameters you can simple add them to an array or use the And method
```csharp
var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
var name = "John";
await jsRuntime.DInvokeVoidAsync(window => window.alert(currentCount + " - " + date + name), JSArgument.For(currentCount).And(date).And(name));
```

#### Using return values

All seen samples are also callable with an generic arg to use return values.

###### You can use return values from javascript functions like this
```csharp
var res = await jsRuntime.DInvokeAsync<string>(window => window.prompt());
Console.WriteLine(res);
```

###### Also you can reuse the results as parameter and writing something like this
```csharp
var hash = await jsRuntime.DInvokeAsync<string>(window =>
{
    window.alert(currentCount);
    return window.location.hash + "_" + currentCount;
}, new[] { JSArgument.For(currentCount) });
await jsRuntime.DInvokeVoidAsync(document => document.location.hash = hash, new[] { JSArgument.For(hash) });
// After alerting the currentCount we update the url in browser like this #1_2_3_4...
```

It is important to note that the function passed to DInvokeVoidAsync must be a lambda expression that takes in a dynamic and dynamic parameter.

Conclusion
This extension provides a simple and easy way to invoke JavaScript functions from C# with support for dynamic arguments. 

### Simple event interop helper 
A simple possibility to hook events that should be extended more but currently supports an easy OnBlur extension for any element.

```c#
private BlazorJSEventInterop<PointerEventArgs> _jsEvent;

_jsEvent = new BlazorJSEventInterop<PointerEventArgs>(_jsRuntime);
await _jsEvent.OnBlur(OnFocusLeft, ".element-selector");

private Task OnFocusLeft(PointerEventArgs arg)
{
    return Task.CompletedTask;
}
```

You can also use it manually with any event you want to.

```c#
private BlazorJSEventInterop<PointerEventArgs> _jsEvent;

_jsEvent = new BlazorJSEventInterop<PointerEventArgs>(_jsRuntime);
await _jsEvent.AddEventListener("NameOfEvent", async args => { await YourCallBack(); }, ".element-selector");

```