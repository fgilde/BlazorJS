class SparkBox {
    element;
    dotnet;
    timer;

    constructor(element, dotnet, options) {
        this.element = element;
        this.dotnet = dotnet;
        this.setOptions(options);
    }

    setOptions(options) {
        this.element.textContent = options.label ?? 'SparkBox';
        this.element.style.color = options.glowColor;
        this.element.style.textShadow = `0 0 18px ${options.glowColor}`;
        this.element.style.transition = 'opacity .4s ease';

        clearInterval(this.timer);
        let visible = true;
        this.timer = setInterval(() => {
            visible = !visible;
            this.element.style.opacity = visible ? '1' : '.25';
        }, options.pulseMs);
    }

    // called from the JS side, ends up in the [JSInvokable] method of the component
    notifyClick() {
        return this.dotnet.invokeMethodAsync('OnSparkClicked');
    }

    dispose() {
        clearInterval(this.timer);
    }
}

export function initializeSparkBox(element, dotnet, options) {
    const box = new SparkBox(element, dotnet, options);
    element.addEventListener('click', () => box.notifyClick());
    return box;
}
