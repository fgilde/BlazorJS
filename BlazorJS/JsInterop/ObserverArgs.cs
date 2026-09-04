namespace BlazorJS.JsInterop;

/// <summary>
/// Reported by <see cref="BlazorJSEventInterop{TEventArgs}.OnResize"/> whenever an observed element changes its size.
/// </summary>
public class ElementSizeArgs
{
    public double Width { get; set; }
    public double Height { get; set; }
    public double Top { get; set; }
    public double Left { get; set; }
}

/// <summary>
/// Reported by <see cref="BlazorJSEventInterop{TEventArgs}.OnVisibilityChanged"/> whenever an observed element enters or leaves the viewport.
/// </summary>
public class ElementVisibilityArgs
{
    /// <summary>True while any part of the element (respecting the threshold) is inside the viewport.</summary>
    public bool IsVisible { get; set; }

    /// <summary>How much of the element is visible, 0 to 1.</summary>
    public double Ratio { get; set; }
}
