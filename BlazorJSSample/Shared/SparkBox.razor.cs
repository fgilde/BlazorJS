using BlazorJS.Attributes;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorJSSample.Shared;

public partial class SparkBox
{
    protected override string ComponentJsFile() => "./js/SparkBox.js";
    protected override string ComponentJsInitializeMethodName() => "initializeSparkBox";

    /// <summary>Passed to JS as 'label' because [ForJs] lowercases the first char by default.</summary>
    [Parameter, ForJs]
    public string Label { get; set; } = "SparkBox";

    [Parameter, ForJs("pulseMs")]
    public int PulseInterval { get; set; } = 700;

    [Parameter]
    public EventCallback OnClicked { get; set; }

    [JSInvokable]
    public Task OnSparkClicked() => OnClicked.InvokeAsync();

    protected override async Task OnJsOptionsChanged()
    {
        if (JsReference != null)
            await JsReference.InvokeVoidAsync("setOptions", JsOptions());
    }

    private object JsOptions() => this.AsJsObject(new { glowColor = "#22d3ee" });

    // by default only ElementReference and the dotnet reference are passed, we also want the options
    public override object[] GetJsArguments() => new object[] { ElementReference, CreateDotNetObjectReference(), JsOptions() };
}
