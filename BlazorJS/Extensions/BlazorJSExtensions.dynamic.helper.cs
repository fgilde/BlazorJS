using Microsoft.JSInterop;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace BlazorJS;

public static partial class BlazorJSExtensions
{
    private static ValueTask<T> InternalInvokeAsync<T>(IJSRuntime runtime, CancellationToken token, string caller)
    {
        return InternalInvokeAsync<T>(runtime, token, caller, Array.Empty<object>());
    }

    private static ValueTask<T> InternalInvokeAsync<T>(IJSRuntime runtime, CancellationToken token, string caller, JSArgument[] args)
    {
        if (args?.Any() == true)
            caller = EnsureVariables(caller, args.Select(a => a.Name).ToArray());
        return InternalInvokeAsync<T>(runtime, token, caller, args?.Select(a => a.Value)?.ToArray());
    }

    private static ValueTask<T> InternalInvokeAsync<T>(IJSRuntime runtime, CancellationToken token, string caller, object[] args)
    {
        return runtime.InvokeAsync<T>("BlazorJS.execute", token, caller, args);
    }


    private static ValueTask InternalInvokeVoidAsync(IJSRuntime runtime, CancellationToken token, string caller)
    {
        return InternalInvokeVoidAsync(runtime, token, caller, Array.Empty<object>());
    }

    private static ValueTask InternalInvokeVoidAsync(IJSRuntime runtime, CancellationToken token, string caller, JSArgument[] args)
    {
        if (args?.Any() == true)
            caller = EnsureVariables(caller, args.Select(a => a.Name).ToArray());
        return InternalInvokeVoidAsync(runtime, token, caller, args?.Select(a => a.Value)?.ToArray());
    }

    private static ValueTask InternalInvokeVoidAsync(IJSRuntime runtime, CancellationToken token, string caller, object[] args)
    {
        return runtime.InvokeVoidAsync("BlazorJS.execute", token, caller, args);
    }

    private static string EnsureVariables(string jsFunction, params string[] variables)
    {
        int lambdaStart = jsFunction.IndexOf("=>");
        string lambda = jsFunction.Substring(0, lambdaStart).Trim();
        string pattern = @"[a-zA-Z_$][a-zA-Z_$0-9]*";
        MatchCollection matches = Regex.Matches(lambda, pattern);
        var presentVariables = matches.Select(m => m.Value).ToList();
        var missingVariables = variables.Where(v => !presentVariables.Contains(v)).ToList();
        if (missingVariables.Any())
        {
            if (!lambda.StartsWith("("))
                lambda = "(" + lambda;
            lambda = lambda.TrimEnd(')') + ", " + string.Join(", ", missingVariables) + ")";
        }
        return lambda + jsFunction.Substring(lambdaStart);
    }

    private static string ReplaceVariablesWithValuesInJsFunction(string fn, JSArgument[] args)
    {
        if (args?.Any() == true)
            fn = args.Where(a => GetVariableNames(fn).Contains(a.Name)).Aggregate(fn, (current, jsArgument) => current.Replace(jsArgument.Name, jsArgument.Value.ToString()));
        return fn;
    }


    private static string[] GetVariableNames(string jsString)
    {
        string pattern = @"[a-zA-Z_$][a-zA-Z_$0-9]*";
        MatchCollection matches = Regex.Matches(jsString, pattern);
        string[] variableNames = new string[matches.Count];
        for (int i = 0; i < matches.Count; i++)
        {
            variableNames[i] = matches[i].Value;
        }
        return variableNames;
    }
}