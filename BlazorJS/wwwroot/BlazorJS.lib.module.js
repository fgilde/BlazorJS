import { EventHelper } from './BlazorJS.lib.eventHelper.js';
import { BrowserDetector, UAParser } from './BlazorJS.lib.browserDetect.js';

window.BlazorJS = {

    isLoaded: function (filename) {
        var normalizePath = function (path) {
            // Create an anchor element to use the browser's native ability to resolve URLs
            var a = document.createElement('a');
            a.href = path;
            // Return normalized path without query string or hash
            return a.href.split(/[?#]/)[0];
        };

        var normalizedFilename = normalizePath(filename).toLowerCase();
        var loadedElements = Array.from(document.querySelectorAll('script,link'));

        return loadedElements.some(elm => {
            var elementPath = elm.tagName === 'SCRIPT' ? elm.src : elm.href;
            return normalizePath(elementPath).toLowerCase() === normalizedFilename;
        });
    },

    createAndLoadElement: function (filename, defaultFileHandling, dotNet) {
        return new Promise((resolve, reject) => {
            var element;
            var isScript = filename.includes('.js') || (defaultFileHandling === 'script' && !filename.includes('.css'));

            if (isScript) {
                element = document.createElement('script');
                element.src = filename;
                element.async = true;
            } else {
                element = document.createElement('link');
                element.href = filename;
                element.rel = 'stylesheet';
            }

            element.addEventListener('load', () => {
                if (dotNet) {
                    dotNet.invokeMethodAsync('Loaded', filename);
                }
                resolve(filename);
            });

            element.addEventListener('error', () => {
                reject(new Error(`Failed to load ${filename}`));
            });

            document.getElementsByTagName('head')[0].appendChild(element);
        });
    },


    
    loadFiles: function (fileNames, defaultFileHandling, dotNet) {
        fileNames = (typeof fileNames === 'string' ? [fileNames] : fileNames).map(f => f.trim());
        fileNames.filter(filename => !this.isLoaded(filename))
            .forEach(filename => {
                this.createAndLoadElement(filename, defaultFileHandling, dotNet)
                    .then(() => {/* File loaded successfully */ })
                    .catch(error => console.error(error));
            });
    },

    waitFilesLoaded: function (fileNames, defaultFileHandling, dotNet) {
        fileNames = (typeof fileNames === 'string' ? [fileNames] : fileNames).map(f => f.trim());
        var loadPromises = fileNames.filter(filename => !this.isLoaded(filename))
            .map(filename => this.createAndLoadElement(filename, defaultFileHandling, dotNet));

        return Promise.all(loadPromises);
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


    /**
     * Saving a file. Uses the File System Access API when the browser has it, so the user gets a real
     * save dialog and picks the location, and falls back to a plain download otherwise.
     */
    files: {
        save: async function (fileName, streamRef, mimeType) {
            var buffer = await streamRef.arrayBuffer();
            return await window.BlazorJS.files.saveBlob(fileName, new Blob([buffer], { type: mimeType || '' }), mimeType);
        },

        saveBlob: async function (fileName, blob, mimeType) {
            if (window.showSaveFilePicker) {
                try {
                    var handle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: window.BlazorJS.files.pickerTypes(fileName, mimeType)
                    });
                    var writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    return true;
                } catch (e) {
                    // the user closed the dialog - not an error, and not a reason to download anyway
                    if (e && e.name === 'AbortError')
                        return false;
                    // no permission, cross origin iframe, ... - fall through to the download
                }
            }

            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
            return true;
        },

        // pre-selects the extension in the save dialog instead of offering 'all files' only
        pickerTypes: function (fileName, mimeType) {
            var dot = fileName.lastIndexOf('.');
            if (dot < 1 || !mimeType)
                return undefined;
            var accept = {};
            accept[mimeType] = [fileName.substring(dot).toLowerCase()];
            return [{ description: fileName.substring(dot + 1).toUpperCase() + ' file', accept: accept }];
        }
    },

    /**
     * Clipboard access with a fallback for browsers / insecure contexts without navigator.clipboard.
     */
    clipboard: {
        write: async function (text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return true;
                }
            } catch (e) { /* fall through to the legacy path */ }

            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            var copied = false;
            try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
            document.body.removeChild(area);
            return copied;
        },

        read: async function () {
            try {
                if (navigator.clipboard && window.isSecureContext)
                    return await navigator.clipboard.readText();
            } catch (e) { /* permission denied or unsupported */ }
            return null;
        }
    },

    EventHelper: new EventHelper(),
    BrowserDetector: new BrowserDetector(),
    UAParser: UAParser
};