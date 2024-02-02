using System;

namespace BlazorJS;

internal static class InternalExtensions
{
    public static bool IsNullableEnum(this Type t) => Nullable.GetUnderlyingType(t) is { IsEnum: true };

    public static string ToLower(this string input, bool firstCharOnly) => !firstCharOnly ? input.ToLower() : input[..1].ToLower() + input.Remove(0, 1);
}