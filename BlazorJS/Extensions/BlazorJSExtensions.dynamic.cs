using System;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorJS
{

#if NET6_0_OR_GREATER
    public static partial class BlazorJSExtensions
    {

        #region Void Invokes

        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic> func, object[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeVoidAsync(runtime, token, caller, args);
        }

        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, args);

        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic> func, object arg1, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic> func, object arg1, object arg2, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5});
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, object arg9, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 });
        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, object arg9, object arg10, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeVoidAsync(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10 });


        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic> func, Expression<Func<object>>[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return DInvokeVoidAsync(runtime, func, args.Select(JSArgument.For).ToArray(), token, caller);
        }

        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic> func, JSArgument[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeVoidAsync(runtime, token, caller, args);
        }

        public static ValueTask DInvokeVoidAsync(this IJSRuntime runtime, Action<dynamic> func,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeVoidAsync(runtime, token, caller);
        }

        #endregion

        #region Generic Invokes

        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, object> func, object[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeAsync<T>(runtime, token, caller, args);
        }

        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object[] args, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, args);

        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, object> func, object arg1, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, object> func, object arg1, object arg2, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, object arg9, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 });
        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, dynamic, object> func, object arg1, object arg2, object arg3, object arg4, object arg5, object arg6, object arg7, object arg8, object arg9, object arg10, CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null) =>
            InternalInvokeAsync<T>(runtime, token, caller, new[] { arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10 });



        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, object> func, Expression<Func<object>>[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return DInvokeAsync<T>(runtime, func, args.Select(JSArgument.For).ToArray(), token, caller);
        }

        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, object> func, JSArgument[] args,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeAsync<T>(runtime, token, caller, args);
        }

        public static ValueTask<T> DInvokeAsync<T>(this IJSRuntime runtime, Func<dynamic, object> func,
            CancellationToken token = default, [CallerArgumentExpression("func")] string caller = null)
        {
            return InternalInvokeAsync<T>(runtime, token, caller);
        }

        #endregion

    }
#endif

}