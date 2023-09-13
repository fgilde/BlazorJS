export class BrowserDetector {

    constructor() {
        this.devices = [
            ['a7', '640x1136', ['iPhone 5', 'iPhone 5s']],
            ['a7', '1536x2048', ['iPad Air', 'iPad Mini 2', 'iPad Mini 3', 'iPad Pro 9.7']],
            ['a8', '640x1136', ['iPod touch (6th gen)']],
            ['a8', '750x1334', ['iPhone 6']],
            ['a8', '1242x2208', ['iPhone 6 Plus']],
            ['a8', '1536x2048', ['iPad Air 2', 'iPad Mini 4']],
            ['a9', '640x1136', ['iPhone SE']],
            ['a9', '750x1334', ['iPhone 6s']],
            ['a9', '1242x2208', ['iPhone 6s Plus']],
            ['a9x', '1536x2048', ['iPad Pro (1st gen 9.7-inch)']],
            ['a9x', '2048x2732', ['iPad Pro (1st gen 12.9-inch)']],
            ['a10', '750x1334', ['iPhone 7']],
            ['a10', '1242x2208', ['iPhone 7 Plus']],
            ['a10x', '1668x2224', ['iPad Pro (2th gen 10.5-inch)']],
            ['a10x', '2048x2732', ['iPad Pro (2th gen 12.9-inch)']],
            ['a11', '750x1334', ['iPhone 8']],
            ['a11', '1242x2208', ['iPhone 8 Plus']],
            ['a11', '1125x2436', ['iPhone X']],
            ['a12', '828x1792', ['iPhone Xr']],
            ['a12', '1125x2436', ['iPhone Xs']],
            ['a12', '1242x2688', ['iPhone Xs Max']],
            ['a12x', '1668x2388', ['iPad Pro (3rd gen 11-inch)']],
            ['a12x', '2048x2732', ['iPad Pro (3rd gen 12.9-inch)']],
            ['a15', '2556x1179', ['iPhone 14']],
            ['a15', '2796x1290', ['iPhone 14 Max']]
        ];
    }
    
    detect(dotNetObjectRef) {
        var parser = new UAParser();
        var result = parser.getResult();

        var gl = this.getGlRenderer();

        var isMobile = navigator.userAgent.toLowerCase().indexOf('mobile') > -1 ?? (this.isiOS()),
            isTablet = navigator.userAgent.toLowerCase().indexOf('tablet') > -1 ?? (this.isiPadOS() || this.isiPadPro()),
            isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1,
            isiPhone = this.isiOS(),
            isiPad = this.isiPadOS() || this.isiPadPro();

        var agent = window.navigator.userAgent;
        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        var deviceVendor = result.device.vendor ?? '';
        if (deviceVendor === '' && (isiPad || isiPhone || this.isiPadPro()))
            deviceVendor = 'Apple Inc.';

        var deviceModel = result.device.model ?? '';
        var deviceType = result.device.type ?? '';

        console.log('Device model ->' + deviceModel);
        if (deviceModel === 'iPad' || isiPad) {
            deviceType = 'iPad';
            deviceModel = this.getModels().toString();
        }
        else if (deviceModel === 'iPhone' || isiPhone) {
            deviceType = 'iPhone';
            deviceModel = this.getModels().toString();
        }

        var osName = parser.getOS().name;
        var osVersion = parser.getOS().version;

        var winVer = '';

        if (typeof navigator.userAgentData !== 'undefined') {
            navigator.userAgentData.getHighEntropyValues(["platformVersion"])
                .then(ua => {
                    if (navigator.userAgentData.platform === "Windows") {
                        var majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
                        if (majorPlatformVersion >= 13) {
                            winVer = "11 or later";
                        }
                        else {
                            switch (majorPlatformVersion) {
                                case 0:
                                    winVer = "7/8/8.1";
                                    break;
                                case 1:
                                    winVer = "10 (1507)";
                                    break;
                                case 2:
                                    winVer = "10 (1511)";
                                    break;
                                case 3:
                                    winVer = "10 (1607)";
                                    break;
                                case 4:
                                    winVer = "10 (1703)";
                                    break;
                                case 5:
                                    winVer = "10 (1709)";
                                    break;
                                case 6:
                                    winVer = "10 (1803)";
                                    break;
                                case 7:
                                    winVer = "10 (1809)";
                                    break;
                                case 8:
                                    winVer = "10 (1903 or 10 1909)";
                                    break;
                                case 10:
                                    winVer = "10 (2004 or 20H2 or 21H1 or 21H2)";
                                    break;
                                default:
                                    break;
                            }
                        }

                        osVersion = winVer;

                        dotNetObjectRef.invokeMethodAsync('OSUpdateString', winVer).then(null, function (err) {
                            throw new Error(err);
                        });
                    }
                    else if (navigator.userAgentData.platform === "macOS") {
                        var macVer = ua.platformVersion;
                        dotNetObjectRef.invokeMethodAsync('OSUpdateString', macVer).then(null, function (err) {
                            throw new Error(err);
                        });
                    }
                });

            navigator.userAgentData.getHighEntropyValues(["architecture", "bitness"])
                .then(ua => {
                    if (navigator.userAgentData.platform === "Windows") {
                        var winCPU = '';
                        if (ua.architecture === 'x86') {
                            if (ua.bitness === '64') {
                                winCPU = "x86_64";
                            }
                            else if (ua.bitness === '32') {
                                winCPU = "x86";
                            }
                        }
                        else if (ua.architecture === 'arm') {
                            if (ua.bitness === '64') {
                                winCPU = "ARM64";
                            }
                            else if (ua.bitness === '32') {
                                winCPU = "ARM32";
                            }
                        }

                        dotNetObjectRef.invokeMethodAsync('OSArchitectureUpdateString', winCPU).then(null, function (err) {
                            throw new Error(err);
                        });
                    }
                    else if (navigator.userAgentData.platform === "macOS") {
                        var macCPU = ua.architecture + ' ' + ua.bitness;
                        dotNetObjectRef.invokeMethodAsync('OSArchitectureUpdateString', macCPU).then(null, function (err) {
                            throw new Error(err);
                        });
                    }
                });
        }

        var rtn = {
            BrowserMajor: result.browser.major ?? '',
            BrowserName: result.browser.name ?? '',
            BrowserVersion: result.browser.version ?? '',
            CPUArchitect: result.cpu.architecture ?? '',
            DeviceModel: deviceModel,
            DeviceType: deviceType,
            DeviceVendor: deviceVendor,
            EngineName: result.engine.name ?? '',
            EngineVersion: result.engine.version ?? '',
            GPURenderer: gl.glRenderer,
            GPUVendor: gl.glVendor,
            IsDesktop: this.isDesktop(),
            IsMobile: isMobile ?? false,
            IsTablet: isTablet ?? false,
            IsAndroid: isAndroid ?? false,
            IsIPhone: isiPhone ?? false,
            IsIPad: isiPad ?? false,
            isIpadPro: this.isiPadPro(),
            OSName: osName,
            OSVersion: osVersion,
            ScreenResolution: (window.screen.width * window.devicePixelRatio) + 'x' + (window.screen.height * window.devicePixelRatio),
            TimeZone: timeZone,
            UserAgent: agent
        };

        return rtn;
    }

    isiOS() {
        return (/iPhone|iPod/.test(navigator.platform));
    }

    isiPadOS() {
        return (/iPad/.test(navigator.platform));
    }

    isiPadPro() {
        var ratio = window.devicePixelRatio || 1;
        var screen = {
            width: window.screen.width * ratio,
            height: window.screen.height * ratio
        };

        return (screen.width === 2048 && screen.height === 2732) ||
            (screen.width === 2732 && screen.height === 2048) ||
            (screen.width === 1536 && screen.height === 2048) ||
            (screen.width === 2048 && screen.height === 1536);
    }

    isDesktop() {
        if ((navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|kindle|mobile|pda|psp|treo)/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/operamini/i)) ||
            (navigator.userAgent.match(/blackberry/i)) ||
            (navigator.userAgent.match(/(palmos|palm|hiptop|avantgo|plucker|xiino|blazer|elaine)/i)) ||
            (navigator.userAgent.match(/(windowsce; ppc;|windows ce;smartphone;|windows ce; iemobile) /i)) ||
            (navigator.userAgent.match(/android/i)) || this.isiOS() || this.isiPadOS() || this.isiPadPro()) {
            return false;
        }
        else {
            return true;
        }
    }

    OSVersion() {
        var rtn = "";

        var userAgent = window.navigator.userAgent;

        if (userAgent.indexOf("Windows NT 10.0") > 0) {
            rtn = "Windows 10/11";
        }
        else if (userAgent.indexOf("Windows NT 6.3") > 0) {
            rtn = "Windows 8.1";
        }
        else if (userAgent.indexOf("Windows NT 6.2") > 0) {
            rtn = "Windows 8";
        }
        else if (userAgent.indexOf("Windows NT 6.1") > 0) {
            rtn = "Windows 7";
        }
        else if (userAgent.indexOf("Windows NT 6.0") > 0) {
            rtn = "Windows Vista";
        }
        else if (userAgent.indexOf("Windows NT 5.2") > 0) {
            rtn = "Windows Server 2003; Windows XP x64 Edition";
        }
        else if (userAgent.indexOf("Windows NT 5.1") > 0) {
            rtn = "Windows XP";
        }
        else if (userAgent.indexOf("Windows NT 5.01") > 0) {
            rtn = "Windows 2000, Service Pack 1 (SP1)";
        }
        else if (userAgent.indexOf("Windows NT 5.0") > 0) {
            rtn = "Windows 2000";
        }
        else if (userAgent.indexOf("Windows NT 4.0") > 0) {
            rtn = "Microsoft Windows NT 4.0";
        }
        else if (userAgent.indexOf("Win 9x 4.90") > 0) {
            rtn = "Windows Millennium Edition (Windows Me)";
        }
        else if (userAgent.indexOf("Windows 98") > 0) {
            rtn = "Windows 98";
        }
        else if (userAgent.indexOf("Windows 95") > 0) {
            rtn = "Windows 95";
        }
        else if (userAgent.indexOf("Windows CE") > 0) {
            rtn = "Windows CE";
        }
        else if (userAgent.indexOf("iPhone OS") > 0) {
            rtn = "iPhone OS";
        }
        else if (userAgent.indexOf("Mac OS") > 0) {
            rtn = "Max OS";
        }
        else if (userAgent.indexOf("Android") > 0) {
            rtn = "Android";
        }
        else if (userAgent.indexOf("Silk") > 0) {
            rtn = "Amazon Fire";
        }
        else if (userAgent.indexOf("facebook") > 0) {
            rtn = "Facebook External Hit";
        }
        else if (userAgent.indexOf("Twitterbot") > 0) {
            rtn = "Twitterbot";
        }
        else if (userAgent.indexOf("WhatsApp") > 0) {
            rtn = "WhatsApp";
        }
        else {
            //Others
        }

        return rtn; 
    }

    getCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }
        return this.canvas;
    }

    getGl() {
        if (!this.gl) {
            this.gl = this.getCanvas().getContext('webgl');
        }
        return this.gl;
    }

    getResolution() {
        const ratio = window.devicePixelRatio || 1;
        return `${Math.min(screen.width, screen.height) * ratio}x${Math.max(screen.width, screen.height) * ratio}`;
    }

    getGlRenderer() {
        let glVendor = 'Unknown';

        if (!this.glRenderer) {
            const gl = document.createElement("canvas").getContext("webgl");
            const ext = gl.getExtension("WEBGL_debug_renderer_info");
            if (ext) {
                this.glRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
                glVendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
            } else {
                this.glRenderer = "Unknown";
            }
        }

        return { glRenderer: this.glRenderer, glVendor };
    }

    getModels() {
        if (this.models === undefined) {
            const gpu = this.getGlRenderer();
            const matches = gpu.glRenderer.toLowerCase().includes('apple');
            const res = this.getResolution();
            this.models = ['unknown'];

            if (matches) {
                for (let i = 0; i < this.devices.length; i++) {
                    const device = this.devices[i];
                    const res2 = res.split('x').reverse().join('x');
                    if (res === device[1] || res2 === device[1]) {
                        this.models = device[2];
                        break;
                    }
                }
            }
        }

        return this.models;
    }

    getDeviceInfo() {
        if (window.MobileDevice === undefined) {
            window.MobileDevice = {};
        }

        window.MobileDevice.getGlRenderer = this.getGlRenderer.bind(this);
        window.MobileDevice.getModels = this.getModels.bind(this);
        window.MobileDevice.getResolution = this.getResolution.bind(this);

        const currentModels = this.getModels();

        for (let i = 0; i < currentModels.length; i++) {
            const model = `${currentModels[i].toLowerCase()} `;
            if (model.startsWith("math")) {
                return true;
            }
        }
    }
}

export class UAParser {
    // Library Constants
    VERSION = '0.7.31';
    LIBVERSION = '0.7.31';
    EMPTY = '';
    UNKNOWN = '?';
    FUNC_TYPE = 'function';
    UNDEF_TYPE = 'undefined';
    OBJ_TYPE = 'object';
    STR_TYPE = 'string';
    MAJOR = 'major';
    MODEL = 'model';
    NAME = 'name';
    TYPE = 'type';
    VENDOR = 'vendor';
    VERSION = 'version';
    ARCHITECTURE = 'architecture';
    CONSOLE = 'console';
    MOBILE = 'mobile';
    TABLET = 'tablet';
    SMARTTV = 'smarttv';
    WEARABLE = 'wearable';
    EMBEDDED = 'embedded';
    UA_MAX_LENGTH = 275;

    // Vendor Constants
    AMAZON = 'Amazon';
    APPLE = 'Apple';
    ASUS = 'ASUS';
    BLACKBERRY = 'BlackBerry';
    BROWSER = 'Browser';
    CHROME = 'Chrome';
    EDGE = 'Edge';
    FIREFOX = 'Firefox';
    GOOGLE = 'Google';
    HUAWEI = 'Huawei';
    LG = 'LG';
    MICROSOFT = 'Microsoft';
    MOTOROLA = 'Motorola';
    OPERA = 'Opera';
    SAMSUNG = 'Samsung';
    SONY = 'Sony';
    XIAOMI = 'Xiaomi';
    ZEBRA = 'Zebra';
    FACEBOOK = 'Facebook';

    oldSafariMap = {
        '1.0': '/8',
        '1.2': '/1',
        '1.3': '/3',
        '2.0': '/412',
        '2.0.2': '/416',
        '2.0.3': '/417',
        '2.0.4': '/419',
        '?': '/'
    };

    windowsVersionMap = {
        'ME': '4.90',
        'NT 3.11': 'NT3.51',
        'NT 4.0': 'NT4.0',
        '2000': 'NT 5.0',
        'XP': ['NT 5.1', 'NT 5.2'],
        'Vista': 'NT 6.0',
        '7': 'NT 6.1',
        '8': 'NT 6.2',
        '8.1': 'NT 6.3',
        '10': ['NT 6.4', 'NT 10.0'],
        'RT': 'ARM'
    };

    regexes = {

        browser: [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
        ], [this.VERSION, [this.NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [this.VERSION, [this.NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [this.NAME, this.VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [this.VERSION, [this.NAME, this.OPERA + ' Mini']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [this.VERSION, [this.NAME, this.OPERA]], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,               // Avant/IEMobile/SlimBrowser
            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,                                  // Baidu Browser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,
            // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [this.NAME, this.VERSION], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [this.VERSION, [this.NAME, 'UC' + this.BROWSER]], [
            /\bqbcore\/([\w\.]+)/i                                              // WeChat Desktop for Windows Built-in Browser
            ], [this.VERSION, [this.NAME, 'WeChat(Win) Desktop']], [
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [this.VERSION, [this.NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [this.VERSION, [this.NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [this.VERSION, [this.NAME, 'IE']], [
            /yabrowser\/([\w\.]+)/i                                             // Yandex
            ], [this.VERSION, [this.NAME, 'Yandex']], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[this.NAME, /(.+)/, '$1 Secure ' + this.BROWSER], this.VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [this.VERSION, [this.NAME, this.FIREFOX + ' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [this.VERSION, [this.NAME, this.OPERA + ' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [this.VERSION, [this.NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [this.VERSION, [this.NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [this.VERSION, [this.NAME, this.OPERA + ' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [this.VERSION, [this.NAME, 'MIUI ' + this.BROWSER]], [
            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
            ], [this.VERSION, [this.NAME, this.FIREFOX]], [
            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
            ], [[this.NAME, '360 ' + this.BROWSER]], [
            /(oculus|samsung|sailfish)browser\/([\w\.]+)/i
            ], [[this.NAME, /(.+)/, '$1 ' + this.BROWSER], this.VERSION], [                      // Oculus/Samsung/Sailfish Browser
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[this.NAME, /_/g, ' '], this.VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
            ], [this.NAME, this.VERSION], [
            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
            /(lbbrowser)/i                                                      // LieBao Browser
            ], [this.NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[this.NAME, this.FACEBOOK], this.VERSION], [
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(chromium|instagram)[\/ ]([-\w\.]+)/i                              // Chromium/Instagram
            ], [this.NAME, this.VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [this.VERSION, [this.NAME, 'GSA']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [this.VERSION, [this.NAME, this.CHROME + ' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[this.NAME, this.CHROME + ' WebView'], this.VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [this.VERSION, [this.NAME, 'Android ' + this.BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [this.NAME, this.VERSION], [

            /version\/([\w\.]+) .*mobile\/\w+ (safari)/i                        // Mobile Safari
            ], [this.VERSION, [this.NAME, 'Mobile Safari']], [
            /version\/([\w\.]+) .*(mobile ?safari|safari)/i                     // Safari & Safari Mobile
            ], [this.VERSION, this.NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [this.NAME, [this.VERSION, this.strMapper, this.oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [this.NAME, this.VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[this.NAME, 'Netscape'], this.VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [this.VERSION, [this.NAME, this.FIREFOX + ' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i                                              // Links
            ], [this.NAME, this.VERSION]
        ],

        cpu: [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
        ], [[this.ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
        ], [[this.ARCHITECTURE, this.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
        ], [[this.ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
        ], [[this.ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
        ], [[this.ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
        ], [[this.ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
        ], [[this.ARCHITECTURE, /ower/, this.EMPTY, this.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
        ], [[this.ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ], [[this.ARCHITECTURE, this.lowerize]]
        ],

        device: [[

            //////////////////////////
            // this.MOBILES & TABLETS
            // Ordered by popularity
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
        ], [this.MODEL, [this.VENDOR, this.SAMSUNG], [this.TYPE, this.TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
        ], [this.MODEL, [this.VENDOR, this.SAMSUNG], [this.TYPE, this.MOBILE]], [

            // this.APPLE
            /\((ip(?:hone|od)[\w ]*);/i                                         // iPod/iPhone
        ], [this.MODEL, [this.VENDOR, this.APPLE], [this.TYPE, this.MOBILE]], [
            /\((ipad);[-\w\),; ]+this.APPLE/i,                                       // iPad
            /this.APPLEcoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [this.MODEL, [this.VENDOR, this.APPLE], [this.TYPE, this.TABLET]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [this.MODEL, [this.VENDOR, this.HUAWEI], [this.TYPE, this.TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i
            ], [this.MODEL, [this.VENDOR, this.HUAWEI], [this.TYPE, this.MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+)(?: bui|\))/i,                                       // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' this.MODELs
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[this.MODEL, /_/g, ' '], [this.VENDOR, this.XIAOMI], [this.TYPE, this.MOBILE]], [
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ], [[this.MODEL, /_/g, ' '], [this.VENDOR, this.XIAOMI], [this.TYPE, this.TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
        ], [this.MODEL, [this.VENDOR, 'OPPO'], [this.TYPE, this.MOBILE]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
        ], [this.MODEL, [this.VENDOR, 'Vivo'], [this.TYPE, this.MOBILE]], [

            // Realme
            /\b(rmx[12]\d{3})(?: bui|;|\))/i
        ], [this.MODEL, [this.VENDOR, 'Realme'], [this.TYPE, this.MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [this.MODEL, [this.VENDOR, this.MOTOROLA], [this.TYPE, this.MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [this.MODEL, [this.VENDOR, this.MOTOROLA], [this.TYPE, this.TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [this.MODEL, [this.VENDOR, this.LG], [this.TYPE, this.TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [this.MODEL, [this.VENDOR, this.LG], [this.TYPE, this.MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [this.MODEL, [this.VENDOR, 'Lenovo'], [this.TYPE, this.TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
        ], [[this.MODEL, /_/g, ' '], [this.VENDOR, 'Nokia'], [this.TYPE, this.MOBILE]], [

            // this.GOOGLE
            /(pixel c)\b/i                                                      // this.GOOGLE Pixel C
            ], [this.MODEL, [this.VENDOR, this.GOOGLE], [this.TYPE, this.TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // this.GOOGLE Pixel
        ], [this.MODEL, [this.VENDOR, this.GOOGLE], [this.TYPE, this.MOBILE]], [

            // this.SONY
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
        ], [this.MODEL, [this.VENDOR, this.SONY], [this.TYPE, this.MOBILE]], [
            /this.SONY tablet [ps]/i,
            /\b(?:this.SONY)?sgp\w+(?: bui|\))/i
            ], [[this.MODEL, 'Xperia Tablet'], [this.VENDOR, this.SONY], [this.TYPE, this.TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
        ], [this.MODEL, [this.VENDOR, 'OnePlus'], [this.TYPE, this.MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi)( bui|\))/i,                                         // Kindle Fire without Silk
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [this.MODEL, [this.VENDOR, this.AMAZON], [this.TYPE, this.TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[this.MODEL, /(.+)/g, 'Fire Phone $1'], [this.VENDOR, this.AMAZON], [this.TYPE, this.MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [this.MODEL, this.VENDOR, [this.TYPE, this.TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [this.MODEL, [this.VENDOR, this.BLACKBERRY], [this.TYPE, this.MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [this.MODEL, [this.VENDOR, this.ASUS], [this.TYPE, this.TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [this.MODEL, [this.VENDOR, this.ASUS], [this.TYPE, this.MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [this.MODEL, [this.VENDOR, 'HTC'], [this.TYPE, this.TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic|this.SONY(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/this.SONY
        ], [this.VENDOR, [this.MODEL, /_/g, ' '], [this.TYPE, this.MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [this.MODEL, [this.VENDOR, 'Acer'], [this.TYPE, this.TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
        ], [this.MODEL, [this.VENDOR, 'Meizu'], [this.TYPE, this.MOBILE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
        ], [this.MODEL, [this.VENDOR, 'Sharp'], [this.TYPE, this.MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|this.SONYericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
            // BlackBerry/BenQ/Palm/this.SONY-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(MICROSOFT); (lumia[\w ]+)/i,                                      // this.MICROSOFT Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
        ], [this.VENDOR, this.MODEL, [this.TYPE, this.MOBILE]], [

            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [this.VENDOR, this.MODEL, [this.TYPE, this.TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [this.MODEL, [this.VENDOR, this.MICROSOFT], [this.TYPE, this.TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
        ], [this.MODEL, [this.VENDOR, 'Fairphone'], [this.TYPE, this.MOBILE]], [
            /(u304aa)/i                                                         // AT&T
        ], [this.MODEL, [this.VENDOR, 'AT&T'], [this.TYPE, this.MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
        ], [this.MODEL, [this.VENDOR, 'Siemens'], [this.TYPE, this.MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [this.MODEL, [this.VENDOR, 'RCA'], [this.TYPE, this.TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [this.MODEL, [this.VENDOR, 'Dell'], [this.TYPE, this.TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [this.MODEL, [this.VENDOR, 'Verizon'], [this.TYPE, this.TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [this.MODEL, [this.VENDOR, 'Barnes & Noble'], [this.TYPE, this.TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [this.MODEL, [this.VENDOR, 'NuVision'], [this.TYPE, this.TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [this.MODEL, [this.VENDOR, 'ZTE'], [this.TYPE, this.TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
        ], [this.MODEL, [this.VENDOR, 'ZTE'], [this.TYPE, this.MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN this.MOBILE
        ], [this.MODEL, [this.VENDOR, 'Swiss'], [this.TYPE, this.MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [this.MODEL, [this.VENDOR, 'Swiss'], [this.TYPE, this.TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [this.MODEL, [this.VENDOR, 'Zeki'], [this.TYPE, this.TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[this.VENDOR, 'Dragon Touch'], this.MODEL, [this.TYPE, this.TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [this.MODEL, [this.VENDOR, 'Insignia'], [this.TYPE, this.TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [this.MODEL, [this.VENDOR, 'NextBook'], [this.TYPE, this.TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
        ], [[this.VENDOR, 'Voice'], this.MODEL, [this.TYPE, this.MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
        ], [[this.VENDOR, 'LvTel'], this.MODEL, [this.TYPE, this.MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
        ], [this.MODEL, [this.VENDOR, 'Essential'], [this.TYPE, this.MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [this.MODEL, [this.VENDOR, 'Envizen'], [this.TYPE, this.TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [this.MODEL, [this.VENDOR, 'MachSpeed'], [this.TYPE, this.TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [this.MODEL, [this.VENDOR, 'Rotor'], [this.TYPE, this.TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [this.MODEL, [this.VENDOR, 'Nvidia'], [this.TYPE, this.TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
        ], [this.VENDOR, this.MODEL, [this.TYPE, this.MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // this.MICROSOFT Kin
        ], [[this.MODEL, /\./g, ' '], [this.VENDOR, this.MICROSOFT], [this.TYPE, this.MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // this.ZEBRA
            ], [this.MODEL, [this.VENDOR, this.ZEBRA], [this.TYPE, this.TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
        ], [this.MODEL, [this.VENDOR, this.ZEBRA], [this.TYPE, this.MOBILE]], [

            ///////////////////
            // this.CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
        ], [this.VENDOR, this.MODEL, [this.TYPE, this.CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
        ], [this.MODEL, [this.VENDOR, 'Nvidia'], [this.TYPE, this.CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
        ], [this.MODEL, [this.VENDOR, this.SONY], [this.TYPE, this.CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // this.MICROSOFT Xbox
        ], [this.MODEL, [this.VENDOR, this.MICROSOFT], [this.TYPE, this.CONSOLE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [this.VENDOR, [this.TYPE, this.SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[this.MODEL, /^/, 'SmartTV'], [this.VENDOR, this.SAMSUNG], [this.TYPE, this.SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[this.VENDOR, this.LG], [this.TYPE, this.SMARTTV]], [
            /(this.APPLE) ?tv/i                                                      // this.APPLE TV
            ], [this.VENDOR, [this.MODEL, this.APPLE + ' TV'], [this.TYPE, this.SMARTTV]], [
            /crkey/i                                                            // this.GOOGLE Chromecast
            ], [[this.MODEL, this.CHROME + 'cast'], [this.VENDOR, this.GOOGLE], [this.TYPE, this.SMARTTV]], [
            /droid.+aft(\w)( bui|\))/i                                          // Fire TV
            ], [this.MODEL, [this.VENDOR, this.AMAZON], [this.TYPE, this.SMARTTV]], [
            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [this.MODEL, [this.VENDOR, 'Sharp'], [this.TYPE, this.SMARTTV]], [
            /(bravia[\w- ]+) bui/i                                              // this.SONY
            ], [this.MODEL, [this.VENDOR, this.SONY], [this.TYPE, this.SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i               // HbbTV devices
            ], [[this.VENDOR, this.trim], [this.MODEL, this.trim], [this.TYPE, this.SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified this.VENDORs
        ], [[this.TYPE, this.SMARTTV]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [this.VENDOR, this.MODEL, [this.TYPE, this.WEARABLE]], [
            /droid.+; (glass) \d/i                                              // this.GOOGLE Glass
        ], [this.MODEL, [this.VENDOR, this.GOOGLE], [this.TYPE, this.WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
        ], [this.MODEL, [this.VENDOR, this.ZEBRA], [this.TYPE, this.WEARABLE]], [
            /(quest( 2)?)/i                                                     // Oculus Quest
        ], [this.MODEL, [this.VENDOR, this.FACEBOOK], [this.TYPE, this.WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
        ], [this.VENDOR, [this.TYPE, this.EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|\) this.APPLEw).+? this.MOBILE safari/i           // Android Phones from Unidentified this.VENDORs
        ], [this.MODEL, [this.TYPE, this.MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) this.APPLEw).+?(?! this.MOBILE) safari/i       // Android Tablets from Unidentified this.VENDORs
            ], [this.MODEL, [this.TYPE, this.TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+this.MOBILE))/i                      // Unidentifiable Tablet
            ], [[this.TYPE, this.TABLET]], [
            /(phone|this.MOBILE(?:[;\/]| safari)|pda(?=.+windows ce))/i              // Unidentifiable this.MOBILE
        ], [[this.TYPE, this.MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
        ], [this.MODEL, [this.VENDOR, 'Generic']]
        ],

        engine: [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
        ], [this.VERSION, [this.NAME, this.EDGE + 'HTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [this.VERSION, [this.NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i                                       // iCab
            ], [this.NAME, this.VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [this.VERSION, this.NAME]
        ],

        os: [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
        ], [this.NAME, this.VERSION], [
            /(windows) nt 6\.2; (arm)/i,                                        // Windows RT
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,            // Windows Phone
            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
            ], [this.NAME, [this.VERSION, this.strMapper, this.windowsVersionMap]], [
            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[this.NAME, 'Windows'], [this.VERSION, this.strMapper, this.windowsVersionMap]], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /cfnetwork\/.+darwin/i
            ], [[this.VERSION, /_/g, '.'], [this.NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[this.NAME, 'Mac OS'], [this.VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86)/i                              // Android-x86
            ], [this.VERSION, this.NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [this.NAME, this.VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [this.VERSION, [this.NAME, this.BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [this.VERSION, [this.NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [this.VERSION, [this.NAME, this.FIREFOX + ' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [this.VERSION, [this.NAME, 'webOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [this.VERSION, [this.NAME, this.CHROME + 'cast']], [
            /(cros) [\w]+ ([\w\.]+\w)/i                                         // Chromium OS
            ], [[this.NAME, 'Chromium OS'], this.VERSION], [

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
            // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [this.NAME, this.VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[this.NAME, 'Solaris'], this.VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,            // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [this.NAME, this.VERSION]
        ]
    };

    constructor(ua, extensions) {
        if (typeof ua === 'object') {
            extensions = ua;
            ua = undefined;
        }
     
        this._ua = ua || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : UAParser.EMPTY);
        this._rgxmap = extensions ? this.extend(this.regexes, extensions) : this.regexes;
        this.setUA(this._ua);
    }

    // Helper functions
    extend(regexes, extensions) {
        var mergedRegexes = {};
        for (var i in regexes) {
            if (extensions[i] && extensions[i].length % 2 === 0) {
                mergedRegexes[i] = extensions[i].concat(regexes[i]);
            } else {
                mergedRegexes[i] = regexes[i];
            }
        }
        return mergedRegexes;
    }

    enumerize(arr) {
        var enums = {};
        for (var i = 0; i < arr.length; i++) {
            enums[arr[i].toUpperCase()] = arr[i];
        }
        return enums;
    }

    has(str1, str2) {
        return typeof str1 === this.STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
    }

    lowerize(str) {
        return str.toLowerCase();
    }

    majorize(version) {
        return typeof (version) === this.STR_TYPE ? version.replace(/[^\d\.]/g, this.EMPTY).split('.')[0] : undefined;
    }

    trim(str, len) {
        if (typeof (str) === this.STR_TYPE) {
            str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, this.EMPTY);
            return typeof (len) === this.UNDEF_TYPE ? str : str.substring(0, this.UA_MAX_LENGTH);
        }
    }

    rgxMapper(ua, arrays) {
        var i = 0, j, k, p, q, matches, match;

        // loop through all regexes maps
        while (i < arrays.length && !matches) {

            var regex = arrays[i],       // even sequence (0,2,4,..)
                props = arrays[i + 1];   // odd sequence (1,3,5,..)
            j = k = 0;

            // try matching uastring with regexes
            while (j < regex.length && !matches) {

                matches = regex[j++].exec(ua);

                if (!!matches) {
                    for (p = 0; p < props.length; p++) {
                        match = matches[++k];
                        q = props[p];
                        // check if given property is actually array
                        if (typeof q === this.OBJ_TYPE && q.length > 0) {
                            if (q.length === 2) {
                                if (typeof q[1] == this.FUNC_TYPE) {
                                    // assign modified match
                                    this[q[0]] = q[1].call(this, match);
                                } else {
                                    // assign given value, ignore regex match
                                    this[q[0]] = q[1];
                                }
                            } else if (q.length === 3) {
                                // check whether function or regex
                                if (typeof q[1] === this.FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                    // call function (usually string mapper)
                                    this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                } else {
                                    // sanitize match using given regex
                                    this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                }
                            } else if (q.length === 4) {
                                this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                            }
                        } else {
                            this[q] = match ? match : undefined;
                        }
                    }
                }
            }
            i += 2;
        }
    }

    strMapper(str, map) {
        for (var i in map) {
            // check if current value is array
            if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                for (var j = 0; j < map[i].length; j++) {
                    if (has(map[i][j], str)) {
                        return (i === UNKNOWN) ? undefined : i;
                    }
                }
            } else if (has(map[i], str)) {
                return (i === UNKNOWN) ? undefined : i;
            }
        }
        return str;
    }

    getBrowser() {
        var _browser = {};
        _browser[this.NAME] = undefined;
        _browser[this.VERSION] = undefined;
        this.rgxMapper.call(_browser, this._ua, this._rgxmap.browser);
        _browser.major = this.majorize(_browser.version);
        return _browser;
    }

    getCPU() {
        var _cpu = {};
        _cpu[this.ARCHITECTURE] = undefined;
        this.rgxMapper.call(_cpu, this._ua, this._rgxmap.cpu);
        return _cpu;
    }

    getDevice() {
        var _device = {};
        _device[this.VENDOR] = undefined;
        _device[this.MODEL] = undefined;
        _device[this.TYPE] = undefined;
        this.rgxMapper.call(_device, this._ua, this._rgxmap.device);
        return _device;
    }

    getEngine() {
        var _engine = {};
        _engine[this.NAME] = undefined;
        _engine[this.VERSION] = undefined;
        this.rgxMapper.call(_engine, this._ua, this._rgxmap.engine);
        return _engine;
    }

    getOS() {
        var _os = {};
        _os[this.NAME] = undefined;
        _os[this.VERSION] = undefined;
        this.rgxMapper.call(_os, this._ua, this._rgxmap.os);
        return _os;
    }

    getResult() {
        return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
        };
    }

    getUA() {
        return this._ua;
    }

    setUA(ua) {
        this._ua = (typeof ua === this.STR_TYPE && ua.length > this.UA_MAX_LENGTH) ? this.trim(ua, this.UA_MAX_LENGTH) : ua;
        return this;
    }
}