using System.ComponentModel;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace BlazorJS
{
    public static partial class BlazorJSExtensions
    {

        internal static string ToDescriptionString(this Enum val)
        {
            DescriptionAttribute[] customAttributes = (DescriptionAttribute[])val.GetType().GetField(val.ToString()).GetCustomAttributes(typeof(DescriptionAttribute), false);
            return customAttributes.Length == 0 ? val.ToString() : customAttributes[0].Description;
        }

        public static Task<bool> WaitForNamespaceAsync(this IJSRuntime js, string ns) 
            => WaitForNamespaceAsync(js, ns, TimeSpan.FromSeconds(3), TimeSpan.FromMilliseconds(100));
        
        public static async Task<bool> WaitForNamespaceAsync(this IJSRuntime js, string ns, TimeSpan timeout, TimeSpan checkInterval)
        {            
            var startTime = DateTime.Now;
            while (true)
            {
                bool isAvailable = await IsNamespaceAvailableAsync(js, ns);
                if (isAvailable)                
                    return true;                
                if ((DateTime.Now - startTime) > timeout)                
                    return false;                 
                await Task.Delay(checkInterval);
            }
        }
        
        public static async Task<bool> IsNamespaceAvailableAsync(this IJSRuntime js, string ns)
            => await js.InvokeAsync<bool>("eval", $"typeof {ns} !== 'undefined'");

        public static Task<bool> IsEventWithin(this IJSRuntime runtime, MouseEventArgs args, ElementReference element)
            => runtime.InvokeAsync<bool>("BlazorJS.EventHelper.isWithin", args, element).AsTask();

        public static async Task<bool> IsElementAvailableAsync(this IJSRuntime js, string elementId)
            => await js.InvokeAsync<bool>("eval", $"!!document.getElementById('{elementId}')");

        public static async Task RemoveElementAsync(this IJSRuntime js, string id)
        {
            var script = $"var element = document.getElementById('{id}'); if (element) element.parentNode.removeChild(element);";
            await js.InvokeVoidAsync("eval", script);
        }

        private static async Task<string> GetEmbeddedFileContentAsync(Assembly assembly, string file)
        {
            // EmbeddedResource names are '{RootNamespace}.{path with / replaced by .}', so a suffix match is enough.
            var suffix = "." + file.Replace('/', '.').TrimStart('.');
            var name = Array.Find(assembly.GetManifestResourceNames(), n => n.EndsWith(suffix, StringComparison.OrdinalIgnoreCase));
            if (name == null)
                throw new FileNotFoundException($"No embedded resource matching '{file}' found in {assembly.GetName().Name}. Add it as <EmbeddedResource> to your project.", file);
            using var stream = assembly.GetManifestResourceStream(name);
            using var reader = new StreamReader(stream, Encoding.UTF8);
            return await reader.ReadToEndAsync();
        }

        public static ValueTask AlertAsync(this IJSRuntime runtime, string message)
        {
            return runtime.InvokeVoidAsync("alert", message);
        }

        public static async Task<bool> ConfirmAsync(this IJSRuntime runtime, string message)
        {
            return await runtime.InvokeAsync<bool>("confirm", message);
        }

        public static async Task<string> PromptAsync(this IJSRuntime runtime, string message = "", string value = "")
        {
            return await runtime.InvokeAsync<string>("prompt", message, value);
        }

        /// <summary>
        /// Copies text to the clipboard. Falls back to the legacy execCommand path when navigator.clipboard is
        /// unavailable (insecure context, older browser). Returns false if the copy was rejected.
        /// </summary>
        public static async Task<bool> CopyToClipboardAsync(this IJSRuntime runtime, string text)
        {
            return await runtime.InvokeAsync<bool>("BlazorJS.clipboard.write", text);
        }

        /// <summary>
        /// Reads text from the clipboard. Returns null when the browser denies access
        /// (reading always requires a secure context and a user permission).
        /// </summary>
        public static async Task<string> ReadClipboardAsync(this IJSRuntime runtime)
        {
            return await runtime.InvokeAsync<string>("BlazorJS.clipboard.read");
        }

        /// <summary>
        /// Loads a css file that is embedded as EmbeddedResource in the given assembly (default: the calling assembly) and adds it to the document.
        /// </summary>
        public static async Task<IJSRuntime> LoadCss(this IJSRuntime runtime, string cssFile, Assembly assembly = null)
        {
            var css = await GetEmbeddedFileContentAsync(assembly ?? Assembly.GetCallingAssembly(), cssFile);
            return await runtime.AddCss(css);
        }

        public static async Task<IJSRuntime> AddCss(this IJSRuntime runtime, string cssContent, string id = "", bool skipIfElementExists = false)
        {
            await runtime.InvokeVoidAsync("BlazorJS.addCss", cssContent, id, skipIfElementExists);
            return runtime;
        }

        public static Task<string[]> GetLoadedScriptsAsync(this IJSRuntime runtime)
        {
            return runtime.InvokeAsync<string[]>("eval", "Array.from(document.querySelectorAll('script')).map(scriptTag => scriptTag.src)").AsTask();
        }

        public static async Task<IJSRuntime> LoadFilesAsync<T>(this IJSRuntime runtime, DotNetObjectReference<T> reference, DefaultFileType defaultFileHandlingForUnknown, params string[] fileNames) where T : class
        {
            var defaultFileHandling = defaultFileHandlingForUnknown.ToDescriptionString();
            //await runtime.InvokeVoidAsync("BlazorJS.loadFiles", fileNames, defaultFileHandling, reference);
            await runtime.InvokeVoidAsync("BlazorJS.waitFilesLoaded", fileNames, defaultFileHandling, reference);
            return runtime;
        }

        public static Task<IJSRuntime> LoadFilesAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            return runtime.LoadFilesAsync<object>(null, DefaultFileType.Script, fileNames);
        }

        [Obsolete("Use LoadFilesAsync instead")]
        public static async Task<IJSRuntime> LoadJsAsync<T>(this IJSRuntime runtime, DotNetObjectReference<T> reference, params string[] fileNames) where T : class
        {
            await runtime.InvokeVoidAsync("BlazorJS.loadScripts", fileNames, reference);
            return runtime;
        }

        [Obsolete("Use LoadFilesAsync instead")]
        public static Task<IJSRuntime> LoadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            return runtime.LoadJsAsync<object>(null, fileNames);
        }

        public static async Task<IJSRuntime> UnloadFilesAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            await runtime.InvokeVoidAsync("BlazorJS.unloadFiles", fileNames);
            return runtime;
        }

        [Obsolete("Use UnloadFilesAsync instead")]
        public static async Task<IJSRuntime> UnloadJsAsync(this IJSRuntime runtime, params string[] fileNames)
        {
            await runtime.InvokeVoidAsync("BlazorJS.unloadScripts", fileNames);
            return runtime;
        }


#if NET6_0_OR_GREATER


        public static Task<IJSObjectReference> ImportModuleBlazorJS(this IJSRuntime runtime)
        {            
            return runtime.InvokeAsync<IJSObjectReference>("import", "./_content/BlazorJS/BlazorJS.lib.module.js").AsTask();
        }

        /// <summary>
        /// Imports a module and creates a JS object reference from it this reference will then be stored under js window object.
        /// </summary>
        public static async Task<IJSObjectReference> ImportModuleAsAsync(this IJSRuntime js, string file, string windowNamespace, bool fromDefault = true)
        {
            var res = await js.ImportModuleAsync(file);
            await js.DInvokeVoidAsync((window, reference, name, useDefault) => window[name] = useDefault ? (reference["default"] || reference) : reference, res, windowNamespace, fromDefault);
            return res;
        }

        public static async Task<IJSObjectReference> ImportModuleAsync(this IJSRuntime js, string file)
        {
            return await js.InvokeAsync<IJSObjectReference>("import", file);
        }

        /// <summary>
        /// Import a module and create a JS object reference from it using the specified method for initialization.
        /// </summary>
        /// <param name="js"></param>
        /// <param name="file"></param>
        /// <param name="jsCreateMethod"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public static async Task<(IJSObjectReference moduleReference, IJSObjectReference jsObjectReference)> ImportModuleAndCreateJsAsync(this IJSRuntime js, string file, string jsCreateMethod, params object?[]? args)
        {
            IJSObjectReference jsReference = null;
            var module = await js.ImportModuleAsync(file);
            if (module != null && !string.IsNullOrEmpty(jsCreateMethod))
            {
                jsReference = await module.InvokeAsync<IJSObjectReference>(jsCreateMethod, args);
            }
            return (module, jsReference);
        }
#else

       public static Task ImportModuleBlazorJS(this IJSRuntime runtime)
       {
            return runtime.InvokeVoidAsync("import", "./_content/BlazorJS/BlazorJS.lib.module.js").AsTask();
       }

        public static async Task ImportModuleAsync(this IJSRuntime js, string file)
        {
            await js.InvokeVoidAsync("import", file).AsTask();
        }

#endif

    }
}