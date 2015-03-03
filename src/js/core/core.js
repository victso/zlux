(function ($, UI) {
    "use strict";

    var ZX = {};

    ZX.version = '2.0.3';

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
           return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);              
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


    window.zlux = ZX;
    $.zx        = ZX;


    UI.ready(function() {

        // style workaround wrapping root elements with zlux    
        $('[data-uk-nestable]').on('nestable-start', function() {
            $('.uk-nestable-list-dragged').wrap('<div class="zx" />');
        });

        ZX.component.bootComponents();
    });

    return ZX;

})(jQuery, UIkit);