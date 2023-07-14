using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorJS
{

    public abstract class ScriptsComponentBase : Microsoft.AspNetCore.Components.ComponentBase, IAsyncDisposable
    {

        bool _rendered;

        protected abstract DefaultFileType DefaultFileHandling { get; }

        [Inject] protected IJSRuntime JsRuntime { get; set; }

        public bool SourcesLoaded { get; private set; }

        [Parameter]
        public string Src { get; set; }


        [Parameter] public EventCallback<string> SourceLoaded { get; set; }

        [Parameter] public LoadBehaviour SourceLoadBehaviour { get; set; } = LoadBehaviour.OnAfterRender;

        [Parameter] public bool UnloadOnDispose { get; set; } = true;


        public string[] Sources => Src.Split(',');

        protected override void OnInitialized()
        {
            base.OnInitialized();
            if (SourceLoadBehaviour == LoadBehaviour.OnInitialized)
                    _= LoadSources(Sources);
        }

        protected override async Task OnInitializedAsync()
        {
            await base.OnInitializedAsync();
            if (SourceLoadBehaviour == LoadBehaviour.OnInitializedAsync)
                await LoadSources(Sources);
        }

        protected override void OnAfterRender(bool firstRender)
        {
            base.OnAfterRender(firstRender);
            if (firstRender)
            {
                if (SourceLoadBehaviour == LoadBehaviour.OnAfterRender)
                    _= LoadSources(Sources);
                _rendered = true;
            }
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            await base.OnAfterRenderAsync(firstRender);
            if (firstRender)
            {
                if (SourceLoadBehaviour == LoadBehaviour.OnAfterRenderAsync)
                    await LoadSources(Sources);
            }
        }

        [JSInvokable]
        public async void Loaded(string file)
        {
            await InvokeAsync(() => SourceLoaded.InvokeAsync(file));
        }

        protected async Task LoadSources(params string[] fileNames)
        {
            var callbackReference = DotNetObjectReference.Create(this);
            await JsRuntime.LoadFilesAsync(callbackReference, DefaultFileHandling, fileNames);
            SourcesLoaded = true;
        }

        protected async Task UnloadSources(params string[] fileNames)
        {
            if (_rendered)
                await JsRuntime.UnloadFilesAsync(fileNames);
        }
        
        public async ValueTask DisposeAsync()
        {
            if(UnloadOnDispose)
                await UnloadSources(Sources);
        }
    }


    public enum LoadBehaviour
    {
        OnAfterRender,
        OnInitialized,
        OnAfterRenderAsync,
        OnInitializedAsync,
    }

}