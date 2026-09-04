#if NET6_0_OR_GREATER

using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorJS
{
    public static partial class BlazorJSExtensions
    {
        /// <summary>
        /// Saves content as a file in the browser. When the browser supports the File System Access API the
        /// user gets a real save dialog and picks the location, otherwise it falls back to a plain download.
        /// The content is streamed, so it also works in Blazor Server without hitting the SignalR message size limit.
        /// </summary>
        /// <param name="fileName">Suggested file name, including the extension.</param>
        /// <param name="content">The content. The stream is disposed unless <paramref name="leaveOpen"/> is set.</param>
        /// <param name="mimeType">Content type. Only used to pre-select the file type in the save dialog.</param>
        /// <returns>False when the user closed the save dialog, otherwise true.</returns>
        /// <remarks>Must be called from a user interaction like a button click, browsers reject a save dialog without one.</remarks>
        public static async Task<bool> SaveFileAsync(this IJSRuntime runtime, string fileName, Stream content,
            string mimeType = null, bool leaveOpen = false)
        {
            using var streamReference = new DotNetStreamReference(content, leaveOpen);
            return await runtime.InvokeAsync<bool>("BlazorJS.files.save", fileName, streamReference, mimeType);
        }

        /// <inheritdoc cref="SaveFileAsync(IJSRuntime, string, Stream, string, bool)"/>
        public static Task<bool> SaveFileAsync(this IJSRuntime runtime, string fileName, byte[] content, string mimeType = null)
            => runtime.SaveFileAsync(fileName, new MemoryStream(content), mimeType);

        /// <inheritdoc cref="SaveFileAsync(IJSRuntime, string, Stream, string, bool)"/>
        public static Task<bool> SaveFileAsync(this IJSRuntime runtime, string fileName, string content, string mimeType = "text/plain")
            => runtime.SaveFileAsync(fileName, Encoding.UTF8.GetBytes(content), mimeType);
    }
}

#endif
