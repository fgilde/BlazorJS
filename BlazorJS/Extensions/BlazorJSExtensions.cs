﻿using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.FileProviders;
using Microsoft.JSInterop;

namespace BlazorJS
{
    public static partial class BlazorJSExtensions
    {

        private static async Task<string> GetEmbeddedFileContentAsync(string file)
        {
            var embeddedProvider = new EmbeddedFileProvider(Assembly.GetExecutingAssembly());
            var fileInfo = embeddedProvider.GetFileInfo(file);
            await using var stream = fileInfo.CreateReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8);
            return await reader.ReadToEndAsync();
        }

        public static ValueTask AlertAsync(this IJSRuntime runtime, string message)
        {
            return runtime.InvokeVoidAsync("alert", message);
        }

        public static async Task<string> PromptAsync(this IJSRuntime runtime, string message = "", string value = "")
        {
            return await runtime.InvokeAsync<string>("prompt", message, value);
        }
        
        public static async Task<IJSRuntime> LoadCss(this IJSRuntime runtime, string cssFile)
        {
            var css = await GetEmbeddedFileContentAsync(cssFile);
            return await runtime.AddCss(css);
        }

        public static async Task<IJSRuntime> AddCss(this IJSRuntime runtime, string cssContent)
        {
            await runtime.InvokeVoidAsync("BlazorJS.addCss", cssContent);
            return runtime;
        }

        public static Task<string[]> GetLoadedScriptsAsync(this IJSRuntime runtime)
        {
            return runtime.InvokeAsync<string[]>("eval", "Array.from(document.querySelectorAll('script')).map(scriptTag => scriptTag.src)").AsTask();
        }

        public static async Task<IJSRuntime> LoadJsAsync<T>(this IJSRuntime runtime, DotNetObjectReference<T> reference, params string[] fileNames) where T : class
        {
            await runtime.InvokeVoidAsync("BlazorJS.loadScripts", fileNames, reference);
            return runtime;
        }

        public static Task<IJSRuntime> LoadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            return runtime.LoadJsAsync<object>(null, fileNames);
        }

        public static async Task<IJSRuntime> UnloadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            await runtime.InvokeVoidAsync("BlazorJS.unloadScripts", fileNames);
            return runtime;
        }

#if NET6_0_OR_GREATER

        public static async Task<IJSObjectReference> ImportModuleAsync(this IJSRuntime js, string file)
        {
            return await js.InvokeAsync<IJSObjectReference>("import", file);
        }

        public static async Task<(IJSObjectReference moduleReference, IJSObjectReference jsObjectReference)> ImportModuleAndCreateJsAsync(this IJSRuntime js, string file, string jsCreateMethod, params object?[]? args)
        {
            IJSObjectReference jsReference = null;
            var module = await js.ImportModuleAsync(file);
            if (module != null)
            {
                jsReference = await module.InvokeAsync<IJSObjectReference>(jsCreateMethod, args);
            }
            return (module, jsReference);
        }

#endif
        
    }
}