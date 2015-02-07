;(function ($, window, document, undefined) {
    "use strict";

    var ZX = $.zx || {};

    if (ZX.fn) {
        return ZX;
    }

    ZX.version = '2.0.2';


    /** URI **/
    ZX.url = {};
    ZX.url.urls = {
        ajax: '',
        root: '',
        root_path: '',
        zlux: ''
    };
    /**
     * Push urls to the list
     * @param Object urls List of urls in JSON format
     */
    ZX.url.push = function (urls) {
        $.extend(ZX.url.urls, urls);
    };
    /**
     * Retrieves the specified url
     * @param String url || url:path The url to be retrieved
     * @param Object params List of params tu attach to the url
     * @return String The full url
     */
    ZX.url.get = function (url, params) {
        url = url.split(':');
        params = params === undefined ? {} : params;
        var result;

        if(url.length === 2 && url[1] !== '') {

            var root_path = ZX.url.urls.root_path.replace(/^\//, '');

            result = ZX.url._get(url[0]) + '/' + url[1]

            // make sure the joomla root path is not present
            .replace(new RegExp('^'+root_path, 'g'), '')
            .replace(new RegExp('^\/'+root_path, 'g'), '');

        } else {
            result = ZX.url._get(url[0]) + ($.isEmptyObject(params) ? '' : '&' + $.param(params));
        }

        return ZX.url.clean(result);
    };
    ZX.url._get = function (url) {
        return ZX.url.urls[url] !== undefined ? ZX.url.urls[url] : url;
    };
    /**
     * Clean an URL from double slash and others
     * @param String url The url to be cleaned
     */
    ZX.url.clean = function(url) {
        if (!url) return '';
        
        // return url and
        return url

        // replace \ with /
        .replace(/\\/g, '/')

        // replace double or more slashes
        .replace(/\/\/+/g, '/')

        // remove undefined
        .replace(/undefined/g, '')

        // remove / from end
        .replace(/\/$/g, '')

        // recover the http:// if set
        .replace(/:\//g, ':\/\/');
    };


    /** LANGUAGE **/
    ZX.lang = {};
    ZX.lang.strings = {};
    /**
     * Push language strings to the list
     * @param Object strings Translated string in JSON format.
     */
    ZX.lang.push = function (strings) {
        $.extend(ZX.lang.strings, strings);
    };
    /**
     * Retrieves the specified language string
     * @param String string String to look for.
     * @return String Translated string or the input string if it wasn't found.
     */
    ZX.lang.get = function (string) {
        return ZX.lang.strings[string] || string;
    };
    // alias
    ZX.lang._ = ZX.lang.get;
    /**
     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
     * @param String str String with tokens
     * @return String String with replaced tokens
     */
    ZX.lang.sprintf = function (str) {
        var args = [].slice.call(arguments, 1);

        str = ZX.lang.get(str);

        return str.replace(/%[a-z]/g, function () {
            var value = args.shift();
            return ZX.utils.typeOf(value) !== 'undefined' ? value : '';
        });
    };


    /** UTILS **/
    ZX.utils = {};
    // returns the object type
    ZX.utils.typeOf = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
    ZX.utils.options = function(string) {
        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};
        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    /**
    * @see http://stackoverflow.com/q/7616461/940217
    * @return number The hash number
    */
    String.prototype.hashCode = function(){
       if (Array.prototype.reduce){
           return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
       } 
       var hash = 0;
       if (this.length === 0) return hash;
       for (var i = 0; i < this.length; i++) {
           var character  = this.charCodeAt(i);
           hash  = ((hash<<5)-hash)+character;
           hash = hash & hash; // Convert to 32bit integer
       }
       return hash;
    };


    /** ASSETS **/
    ZX.assets = {};
    ZX.assets._ress = {}; // requested assets
    /**
     * Load requested assets and execute callback
     * @ress String or Array
     */
    ZX.assets.load = function(ress, callback, failcallback) {
        var req  = [];
        
        // clean vars
        ress = $.isArray(ress) ? ress:[ress];

        // load assets
        for (var i=0, len=ress.length; i<len; i++) {

            if(!ress[i]) continue;

            if (!ZX.assets._ress[ress[i]]) {
                if (ress[i].match(/\.js$/)) {
                    ZX.assets._ress[ress[i]] = ZX.assets.getScript(ZX.url.get('root:'+ress[i]));
                } else {
                    ZX.assets._ress[ress[i]] = ZX.assets.getCss(ZX.url.get('root:'+ress[i]));
                }
            }
            req.push(ZX.assets._ress[ress[i]]);
        }

        return $.when.apply($, req).done(callback).fail(function(){
            if (failcallback) {
                failcallback();
            } else {
                $.error("Require failed: \n" + ress.join(",\n"));
            }
        });
    };
    ZX.assets.getScript = function(url, callback) {
        var d = $.Deferred(), script = document.createElement('script');

        script.async = true;

        script.onload = function() {
            d.resolve();
            if(callback) { callback(script); }
        };

        script.onerror = function() {
            d.reject(url);
        };

        // IE 8 fix
        script.onreadystatechange = function() {
            if (this.readyState == 'loaded' || this.readyState == 'complete') {
                d.resolve();
                if(callback) { callback(script); }
            }
        };

        script.src = url;

        document.getElementsByTagName('head')[0].appendChild(script);

        return d.promise();
    };
    ZX.assets.getCss = function(url, callback){
        var d         = $.Deferred(),
            link      = document.createElement('link');
            link.type = 'text/css';
            link.rel  = 'stylesheet';
            link.href = url;

        document.getElementsByTagName('head')[0].appendChild(link);

        var img = document.createElement('img');
            img.onerror = function(){
                d.resolve();
                if(callback) callback(link);
            };
            img.src = url;

        return d.promise();
    };


    // ZX init functions
    var _ready = $.Deferred();
    ZX.ready = function() {
        return _ready.promise();
    };
    ZX.init = function() {
        _ready.resolve();
    };


    // declare zlux
    $.zx = ZX;

})(jQuery, window, document);