using System;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorJS
{

    public abstract class ScriptsComponentBase : Microsoft.AspNetCore.Components.ComponentBase, IDisposable
    {

        bool rendered;

        [Inject] protected IJSRuntime JsRuntime { get; set; }


        [Parameter]
        public string Src { get; set; }

        //[Parameter]
        //public bool Minify { get; set; } = false;

        //[Parameter]
        //public bool Bundle { get; set; } = false;

        [Parameter]
        public EventCallback<string> SourceLoaded { get; set; }


        public string[] Sources => Src.Split(',');

        protected override void OnAfterRender(bool firstRender)
        {
            base.OnAfterRender(firstRender);
            LoadJs(Sources);
            rendered = true;
        }

        [JSInvokable]
        public async void Loaded(string file)
        {
            await InvokeAsync(() => SourceLoaded.InvokeAsync(file));
        }

        protected async void LoadJs(params string[] fileNames)
        {
            var callbackReference = DotNetObjectReference.Create(this);
            await JsRuntime.LoadJsAsync(callbackReference, fileNames);
        }

        protected async void UnloadJs(params string[] fileNames)
        {
            if (rendered)
                await JsRuntime.UnloadJsAsync(fileNames);
        }

        public void Dispose()
        {
            UnloadJs(Sources);
        }

    }
}