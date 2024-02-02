using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Components;

using IComponent = Microsoft.AspNetCore.Components.IComponent;

namespace BlazorJS.Attributes;

/// <summary>
/// This attribute can be used on Parameters to specify the name of the property in the js object
/// </summary>
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public class ForJs : Attribute
{
    /// <summary>
    /// Property name in the js object
    /// </summary>
    public string JsPropertyName { get; set; }

    /// <summary>
    /// If this is true, the property will be ignored when the object is converted to a js object
    /// This can be useful when you want to use the property in the component and trigger a js change but don't want to pass it to the js object
    /// </summary>
    public bool IgnoreOnParams { get; set; }

    public ForJs(string jsPropertyName = null)
    {
        JsPropertyName = jsPropertyName;

    }

    public static Dictionary<string, object> GetJsObjectFrom<T>(T source, object mergeWith = null)
    {
        var result = new Dictionary<string, object>();
        foreach (var prop in source.GetType().GetProperties())
        {
            var attr = prop.GetCustomAttribute<ForJs>();
            if (attr == null || attr.IgnoreOnParams) continue;
            var propName = attr.JsPropertyName ?? prop.Name.ToLower(true);
            var value = prop.GetValue(source);
            if ((prop.PropertyType.IsEnum || prop.PropertyType.IsNullableEnum()) && value != null)
            {
                DescriptionAttribute[] customAttributes = (DescriptionAttribute[])prop.PropertyType.GetField(value.ToString() ?? string.Empty)?.GetCustomAttributes(typeof(DescriptionAttribute), false);
                value = customAttributes?.Length > 0 ? customAttributes[0].Description : value;
            }
            result[propName] = value;
        }

        if (mergeWith != null)
        {
            foreach (var prop in mergeWith.GetType().GetProperties())
            {
                var propName = prop.Name;
                result[propName] = prop.GetValue(mergeWith); // This will overwrite existing keys
            }
        }

        return result;
    }

}

public static class ForJsHelper
{
    /// <summary>
    /// Creates a js object from the component with all properties that have the ForJs attribute.
    /// This object can then be passed to js functions
    /// </summary>
    public static Dictionary<string, object> AsJsObject<T>(this T value, object mergeWith = null) where T : IComponent => ForJs.GetJsObjectFrom(value, mergeWith);

    /// <summary>
    /// Returns true if the ParameterView has any property with the ForJs attribute that is not null
    /// </summary>
    public static bool AffectedForJs(this ParameterView parameters, IComponent component)
    {
        var propertiesToCheck = component.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(p => new
        {
            PropertyInfo = p,
            Attribute = p.GetCustomAttribute<ForJs>()
        }).Where(x => x.Attribute != null).ToList();

        foreach (var param in propertiesToCheck)
        {
            if (parameters.TryGetValue<object>(param.PropertyInfo.Name, out var valueAsObject) && valueAsObject != null)
                return true;
        }

        return false;
    }
}