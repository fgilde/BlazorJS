export class EventHelper {

    constructor() {
        this.listeners = new Map();
    }

    addCustomEventListener(name, dotNetObjectRef, elementSelector) {
        let target = elementSelector ? document.querySelector(elementSelector) : document;
        if (target) {
            let callback = (event) => {
                var args = this.cloneEvent(event, true);
                dotNetObjectRef.invokeMethodAsync('OnCustomEvent', args);
            };

            target.addEventListener(name, callback);

            this.listeners.set(dotNetObjectRef._id, { target, name, callback });
        }
        else {
            let observer = new MutationObserver((e) => {
                var res = e.filter(x => x.addedNodes && x.addedNodes[0] === document.querySelector(elementSelector));
                if (res.length) {
                    observer.disconnect();
                    this.addCustomEventListener(name, dotNetObjectRef, elementSelector);
                }
            });
            observer.observe(document, { characterData: true, childList: true, subtree: true });
        }
    }
    addCustomEventListenerWhenNotIn(selector, name, dotNetObjectRef) {
        let target = document;
        name = name || 'click';
        let callback = (event) => {
            let elements = selector.map(s => Array.from(document.querySelectorAll(s))).reduce((list, item) => list.concat(item)); // selectMany
            if (elements.every(e => !this.isWithin(event, e))) {
                var args = this.cloneEvent(event, true);
                dotNetObjectRef.invokeMethodAsync('OnCustomEvent', args);
            }
        };
        document.addEventListener(name, callback);
        this.listeners.set(dotNetObjectRef._id, { target, name, callback });
    }

    removeCustomEventListener(dotNetObjectRef) {
        if (dotNetObjectRef) {
            let listener = this.listeners.get(dotNetObjectRef._id);
            if (listener) {
                if (listener.dispose)
                    listener.dispose();
                else
                    listener.target.removeEventListener(listener.name, listener.callback);
                this.listeners.delete(dotNetObjectRef._id);
            }
        }
    }

    /**
     * Resolves a selector as soon as the element exists in the DOM.
     * Blazor renders after the interop call in many cases, so waiting is required.
     */
    whenElement(elementSelector, fallback, callback) {
        let element = elementSelector ? document.querySelector(elementSelector) : fallback;
        if (element) {
            callback(element);
            return;
        }
        let observer = new MutationObserver(() => {
            let found = document.querySelector(elementSelector);
            if (found) {
                observer.disconnect();
                callback(found);
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    /**
     * Reports size changes of an element (ResizeObserver). Without a selector the document element is observed.
     */
    observeResize(elementSelector, dotNetObjectRef) {
        this.whenElement(elementSelector, document.documentElement, (element) => {
            let observer = new ResizeObserver(entries => {
                let rect = entries[0].contentRect;
                dotNetObjectRef.invokeMethodAsync('OnCustomEvent', {
                    width: rect.width, height: rect.height, top: rect.top, left: rect.left
                });
            });
            observer.observe(element);
            this.listeners.set(dotNetObjectRef._id, { dispose: () => observer.disconnect() });
        });
    }

    /**
     * Reports whether an element is inside the viewport (IntersectionObserver).
     */
    observeVisibility(elementSelector, dotNetObjectRef, threshold) {
        this.whenElement(elementSelector, document.documentElement, (element) => {
            let observer = new IntersectionObserver(entries => {
                let entry = entries[0];
                dotNetObjectRef.invokeMethodAsync('OnCustomEvent', {
                    isVisible: entry.isIntersecting, ratio: entry.intersectionRatio
                });
            }, { threshold: threshold || 0 });
            observer.observe(element);
            this.listeners.set(dotNetObjectRef._id, { dispose: () => observer.disconnect() });
        });
    }

    isWithin(event, element) {
        let rect = element.getBoundingClientRect();
        return (event.clientX > rect.left &&
            event.clientX < rect.right &&
            event.clientY < rect.bottom &&
            event.clientY > rect.top);
    }
    stringifyEvent(e) {
        const obj = {};
        for (let k in e) {
            obj[k] = e[k];
        }
        return JSON.stringify(obj, (k, v) => {
            if (v instanceof Node)
                return 'Node';
            if (v instanceof Window)
                return 'Window';
            return v;
        }, ' ');
    }
    cloneEvent(e, serializable) {
        if (serializable) {
            return JSON.parse(this.stringifyEvent(event));
        }
        if (e === undefined || e === null)
            return undefined;
        function ClonedEvent() { }
        ;
        let clone = new ClonedEvent();
        for (let p in e) {
            let d = Object.getOwnPropertyDescriptor(e, p);
            if (d && (d.get || d.set))
                Object.defineProperty(clone, p, d);
            else
                clone[p] = e[p];
        }
        Object.setPrototypeOf(clone, e);
        return clone;
    }
}