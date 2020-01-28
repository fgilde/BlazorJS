window.BlazorJS = {
    loadScripts: function (fileNames, dotNet) {
        var loadedScripts = Array.from(document.querySelectorAll('script'));
        fileNames = typeof fileNames === 'string' ? [fileNames] : fileNames;
        fileNames.filter(filename => loadedScripts.some(elm => !elm.src.endsWith(filename))).forEach(filename => {
            var script = document.createElement('script');
            script.src = filename;
            script.async = true;
            script.addEventListener('load', function() {
                dotNet.invokeMethodAsync('Loaded', filename);
            });
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    },

    unloadScripts: function (fileNames) {
        var loadedScripts = Array.from(document.querySelectorAll('script'));
        fileNames = typeof fileNames === 'string' ? [fileNames] : fileNames;
        loadedScripts.filter(s => fileNames.some(f => s.src.endsWith(f))).forEach(script => {
            script.parentNode.removeChild(script);
        });
    }
};