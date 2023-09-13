import { EventHelper } from './BlazorJS.lib.eventHelper.js';
import { BrowserDetector, UAParser } from './BlazorJS.lib.browserDetect.js';

window.BlazorJS = {

    isLoaded: function (filename) {
        var loadedElements = Array.from(document.querySelectorAll('script,link'));
        return loadedElements.some(elm => filename.endsWith(elm.src) || filename.endsWith(elm.href));
    },
    
    loadFiles: function (fileNames, defaultFileHandling, dotNet) {
        fileNames = (typeof fileNames === 'string' ? [fileNames] : fileNames).map(f => f.trim());
        fileNames.filter(filename => !this.isLoaded(filename))
            .forEach(filename => {
                var element;                
                if (filename.endsWith('.js') || (defaultFileHandling === 'script' && !filename.endsWith('.css'))) {
                    element = document.createElement('script');
                    element.src = filename;
                    element.async = true;
                } else {
                    element = document.createElement('link');
                    element.href = filename;
                    element.rel = 'stylesheet';
                }
                element.addEventListener('load', function () {
                    if (dotNet) {
                        dotNet.invokeMethodAsync('Loaded', filename);
                    }
                });
                document.getElementsByTagName('head')[0].appendChild(element);
            });
    },

    unloadFiles: function (fileNames) {
        fileNames = typeof fileNames === 'string' ? [fileNames] : fileNames;
        fileNames.filter(filename => this.isLoaded(filename)).forEach(filename => {
            var elementsToUnload = Array.from(document.querySelectorAll(`script[src$="${filename}"],link[href$="${filename}"]`));
            elementsToUnload.forEach(element => {
                element.parentNode.removeChild(element);
            });
        });
    },
    
    loadScripts: function (fileNames, dotNet) {
        this.loadFiles(fileNames, 'script', dotNet);
    },
    
    unloadScripts: function (fileNames) {
        this.unloadFiles(fileNames);
    },

    execute: function (script, params) {
        return eval(script)(window, ...params);
    },

    addCss: function (cssContent, id, skipIfElementExists) {
        var css = cssContent,
            head = document.head || document.getElementsByTagName('head')[0],
            style;

        if (id) {
            style = document.getElementById(id);
        }

        if (!style) {
            style = document.createElement('style');
            head.appendChild(style);

            style.type = 'text/css';
            if (id) {
                style.id = id;
            }
        } else {
            if (skipIfElementExists) {
                return;
            }
        }

        if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText += css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    },


    EventHelper: new EventHelper(),
    BrowserDetector: new BrowserDetector(),
    UAParser: UAParser
};