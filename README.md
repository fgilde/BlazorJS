# BlazorJS
BlazorJS is a small package to use a Scripts Component on every page or component to load JavaScript files when not loaded, and unload automatically.

### Using

Add the nuget Package `BlazorJS` to your blazor project

Open `_Imports.razor`from your project and add using for BlazorJS

```
...
@using BlazorJS

```

Now your are able to include every javascipt file easily to your pages or components. 
For example open any page like the `index.razor` and add 

```html
<Scripts src="js/myjsfile.js"></Scripts>
```

#### Include multiple javascript files
Multiple js files can be loaded with a comma seperator `,`

```html
<Scripts src="js/myjsfile.js, js/myjsfile2.js"></Scripts>
```

#### Planned Features
Notice this is an early first version of an idea to load and unload javascript dependencies for pages and components.
Generel it is planned to enable easy bundling and minification