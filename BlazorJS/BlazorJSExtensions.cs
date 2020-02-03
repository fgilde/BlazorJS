using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.FileProviders;
using Microsoft.JSInterop;

namespace BlazorJS
{
    public static class BlazorJSExtensions
    {
        private static bool initialized = false;
        private static async Task<IJSRuntime> EnsureCanWork(this IJSRuntime runtime)
        {
            if (!initialized)
            {
                var embeddedProvider = new EmbeddedFileProvider(Assembly.GetExecutingAssembly());
                var fileInfo = embeddedProvider.GetFileInfo("wwwroot/blazorJS.js");
                using var stream = fileInfo.CreateReadStream();
                using var reader = new StreamReader(stream, Encoding.Unicode);
                var javaScript = reader.ReadToEnd();
                await runtime.InvokeVoidAsync("eval", javaScript);
                initialized = true;
            }
            return runtime;
        }


        public static Task<string[]> GetLoadedScriptsAsync(this IJSRuntime runtime)
        {
            return runtime.InvokeAsync<string[]>("eval", "Array.from(document.querySelectorAll('script')).map(scriptTag => scriptTag.src)").AsTask();
        }

        internal static async Task<IJSRuntime> LoadJsAsync<T>(this IJSRuntime runtime, DotNetObjectReference<T> reference, params string[] fileNames) where T : class
        {
            await (await runtime.EnsureCanWork()).InvokeVoidAsync("BlazorJS.loadScripts", fileNames, reference);
            return runtime;
        }

        public static Task<IJSRuntime> LoadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            return runtime.LoadJsAsync<object>(null, fileNames);
        }

        public static async Task<IJSRuntime> UnloadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            await (await runtime.EnsureCanWork()).InvokeVoidAsync("BlazorJS.unloadScripts", fileNames);
            return runtime;
        }
    }
}