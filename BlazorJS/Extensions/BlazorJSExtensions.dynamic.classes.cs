using System.Linq.Expressions;
using System;
using System.Runtime.CompilerServices;
using System.Linq;


namespace BlazorJS;


public class JSArgument
{
    private JSArgument()
    { }

    public string Name { get; set; }
    public object Value { get; set; }

    public JSArgument[] ToArray() => new[] { this };

    public JSArgument[] And(Expression<Func<object>> expression)
        => new[] { this, For(expression) };

#if NET6_0_OR_GREATER

    public JSArgument[] And(object value, [CallerArgumentExpression("value")] string name = null)
        => new[] { this, For(value, name) };

    public static JSArgument For(object value, [CallerArgumentExpression("value")] string name = null) => new JSArgument { Name = name, Value = value };

#endif    

    public static JSArgument For(Expression<Func<object>> expression)
    {
        var name = GetMemberName(expression);
        var value = expression.Compile()();
        return new JSArgument { Name = name, Value = value };
    }

    private static string GetMemberName<T>(Expression<Func<T>> expr)
    {
        var body = expr.Body;
        if (body is MemberExpression || body is UnaryExpression)
        {
            MemberExpression memberExpression = body as MemberExpression ?? (MemberExpression)((UnaryExpression)body).Operand;
            return memberExpression.Member.Name;
        }

        return expr.ToString();
    }
}

public static class JSArgumentExtensions
{
    public static JSArgument[] And(this JSArgument[] array, Expression<Func<object>> expression)
        => array.Concat(JSArgument.For(expression).ToArray()).ToArray();

#if NET6_0_OR_GREATER
    public static JSArgument[] And(this JSArgument[] array, object value, [CallerArgumentExpression("value")] string name = null)
        => array.Concat(JSArgument.For(value, name).ToArray()).ToArray();
#endif
    
}

