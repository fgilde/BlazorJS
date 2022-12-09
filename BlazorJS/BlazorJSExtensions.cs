using System;
using System.Dynamic;
using System.IO;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ExpressionTreeToString;
using Microsoft.Extensions.FileProviders;
using Microsoft.JSInterop;
using Nextended.Core.Extensions;
using ZSpitz.Util;

namespace BlazorJS
{
    public static class BlazorJSExtensions
    {
        private static bool initialized = false;
        private static async Task<IJSRuntime> EnsureCanWork(this IJSRuntime runtime)
        {
            await runtime.InvokeVoidAsync("eval", await GetEmbeddedFileContentAsync("wwwroot/blazorJS.js"));
            initialized = true;
            
            return runtime;
        }

        private static async Task<string> GetEmbeddedFileContentAsync(string file)
        {
            var embeddedProvider = new EmbeddedFileProvider(Assembly.GetExecutingAssembly());
            var fileInfo = embeddedProvider.GetFileInfo(file);
            await using var stream = fileInfo.CreateReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8);
            return await reader.ReadToEndAsync();
        }


        //public static ValueTask InvokeDVoidAsync(this IJSRuntime runtime, Expression<Func<dynamic,object>> func, TimeSpan timeout, params object[] args)
        //{
        //    var fn = func.ToString();
        //    return runtime.InvokeVoidAsync(fn, timeout, args);
        //}

        //public static ValueTask InvokeVoidAsync(this IJSRuntime runtime, Func<dynamic, dynamic> func, CancellationToken token, params object[] args)
        //{
        //    var fn = func.ToExpression().ToString("C#");
        //    return runtime.InvokeVoidAsync(fn, token, args);
        //}

        //public static ValueTask InvokeVoidAsync(this IJSRuntime runtime, Func<dynamic, dynamic> func, params object[] args)
        //{
        //    var fn = func.ToExpression().ToString("C#");
        //    return runtime.InvokeVoidAsync(fn, args);
        //}

        //public static ValueTask<T> InvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic> func, TimeSpan timeout, params object[] args)
        //{
        //    var fn = func.ToExpression().ToString("C#");
        //    return runtime.InvokeAsync<T>(fn, timeout, args);
        //}

        //public static ValueTask<T> InvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic> func, CancellationToken token, params object[] args)
        //{
        //    var fn = func.ToExpression().ToString("C#");
        //    return runtime.InvokeAsync<T>(fn, token, args);
        //}

        //public static ValueTask<T> InvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic> func, params object[] args)
        //{
        //    var fn = func.ToExpression().ToString("C#");
        //    return runtime.InvokeAsync<T>(fn, args);
        //}

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