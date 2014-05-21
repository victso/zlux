;(function ($, window, document, undefined) {
    "use strict";

    var ZX = $.zlux || {};

    if (ZX.fn) {
        return ZX;
    }

    ZX.version = '1.0';

    ZX.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!ZX[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = ZX[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };


    /** URL **/
    ZX.url = {};
    ZX.url.root_url = ''; // populated by zlux helper
    ZX.url.root = function (url) {
        // make sure the url has no the root_path on it
        var patt = new RegExp('^' + ZX.url.root_url);
        url = ZX.utils.typeOf(url) === 'string' ? url.replace(patt, '') : '';
        // rturn the root + the cleaned url
        return ZX.url.root_url + url;
    };
    ZX.url.base_url = ''; // populated by zlux helper
    ZX.url.base = function (url) {
        return ZX.url.base_url + (url || '');
    };
    ZX.url.zlfw_url = 'plugins/system/zlframework/zlframework/';
    ZX.url.zlfw = function (url) {
        return ZX.url.zlfw_url + (url || '');
    };
    ZX.url.ajax = function (controller, task, params) {
        // make sure params is defined
        params = params === undefined ? {} : params;
        // ser init vars
        var app_id = params.app_id || ZX.zoo.app_id,
            option = params.option || (ZX.com_zl ? 'com_zoolanders' : 'com_zoo');

        // avoid repeating main params
        delete params.option;
        delete params.app_id;

        // prepare and return the url
        return ZX.url.base_url + 'index.php?option=' + option +
            '&controller=' + controller +
            '&task=' + task +
            (app_id ? '&app_id=' + app_id : '') +
            '&format=raw' + 
            ($.isEmptyObject(params) ? '' : '&' + $.param(params));
    };


    /** LANGUAGE **/
    ZX.lang = {};
    ZX.lang.strings = {};
    /**
     * Add the language strings to the array
     * @param {Object} strings Translated string in JSON format.
     */
    ZX.lang.set = function (strings) {
        $.extend(ZX.lang.strings, strings);
    };
    /**
     * Retrieves the specified language string
     * @param {String} string String to look for.
     * @return {String} Translated string or the input string if it wasn't found.
     */
    ZX.lang.get = function (string) {
        return ZX.lang.strings[string] || string;
    };
    // alias
    ZX.lang._ = ZX.lang.get;
    /**
     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
     * @param {String} str String with tokens
     * @return {String} String with replaced tokens
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
     * Clean a path from double slash and others
     * @param {String} path The path to be cleaned
     */
    ZX.utils.cleanPath = function(path) {
        if (!path) return;
        
        // return path and
        return path

        // replace \ with /
        .replace(/\\/g, '/')

        // replace // with /
        .replace(/\/\//g, '/')

        // remove undefined
        .replace(/undefined/g, '')

        // remove / from end
        .replace(/\/$/g, '')

        // recover the http:// if set
        .replace(/:\//g, ':\/\/');
    };


    /** AJAX **/
    ZX.ajax = {};
    /**
     * Ajax request
     * @param {Object} settings The request settings
     * @return {Promise} The ajax promise
     */
    ZX.ajax.request = function(settings)
    {
        // set defaults
        var response = {success:false, errors:[], notices:[]},
            queue = settings.queue ? settings.queue : null;

        // delete custom params, just in case
        delete settings.queue;

        // set request defaults
        settings = $.extend({
            // dataType: 'json',
            type: 'POST'
        }, settings);

        // return a promise
        return $.Deferred(function( defer )
        {
            // use AjaxQ if queue param present, fallback to $.ajax()
            var name = queue ? 'ajaxq' : 'ajax',
                args = queue ? [queue, settings] : [settings];

            // request  
            $[name].apply(this, args)

            // response recieved
            .done(function(json, a, b)
            {
                // json response is assumed
                if (ZX.utils.typeOf(json) !== 'object')
                {
                    try {
                        // parse response detecting if there was some server side error
                        json = $.parseJSON(json);

                    // handle exception
                    } catch(e) {
                        response.errors.push(String(json));
                        response.errors.push('An server-side error occurred. ' + String(e));
                        defer.reject(response);
                    }
                }

                else if (json.success)
                    defer.resolve(json);
                else
                    defer.reject(json);
            })
            
            // something went wrong
            .fail(function(jqxhr, status, error)
            {
                // handle errors
                switch (jqxhr.status) {
                    case 403:
                        response.errors.push('The session has expired.');
                        break;
                    case 404:
                        response.errors.push('The requested URL is not accesible.');
                        break;
                    case 500:
                        response.errors.push('A server-side error has occurred.');
                        break;

                    default:
                        response.errors.push('An error occurred: ' + status + '\n Error: ' + error);
                        break;
                }

                // set response status
                response.status = jqxhr.status;

                // reject
                defer.reject(response);
            });

        }).promise();
    };


    $.zlux = ZX;
    $.fn.zx = ZX.fn;

    return ZX;


    /** ASSETS **/
    zlux.assets = {};
    zlux.assets._ress = {}; // requested assets
    // store known assets for fast loading
    zlux.assets.known = {
        "dates":{
            "css":"plugins/system/zlframework/zlframework/zlux/DatesManager/style.css",
            "js":"plugins/system/zlframework/zlframework/zlux/DatesManager/plugin.js"
        },
        "dialog":{
            "css":"plugins/system/zlframework/zlframework/zlux/DialogManager/style.css",
            "js":"plugins/system/zlframework/zlframework/zlux/DialogManager/plugin.js"
        },
        "fields":{
            "css":"plugins/system/zlframework/zlframework/zlux/FieldsManager/style.css",
            "js":"plugins/system/zlframework/zlframework/zlux/FieldsManager/plugin.js"
        },
        "files":{
            "css":"plugins/system/zlframework/zlframework/zlux/FilesManager/style.css",
            "js":"plugins/system/zlframework/zlframework/zlux/FilesManager/plugin.js"
        },
        "items":{
            "css":"plugins/system/zlframework/zlframework/zlux/ItemsManager/style.css",
            "js":"plugins/system/zlframework/zlframework/zlux/ItemsManager/plugin.js"
        }
    };

    /**
     * Load requested assets and execute callback
     * @ress String or Array
     */
    zlux.assets.load = function(ress, callback, failcallback) {
        var req  = [];

        // if is string check for related known ressources
        if (zlux.utils.typeOf(ress) == 'string' && $.zlux.assets.known[ress] !== undefined){
            ress = $.map(zlux.assets.known[ress], function(value, index) {
                return [value];
            });
        }
        
        // clean vars
        ress = $.isArray(ress) ? ress:[ress];

        // load assets
        for (var i=0, len=ress.length; i<len; i++) {

            if(!ress[i]) continue;

            if (!zlux.assets._ress[ress[i]]) {
                if (ress[i].match(/\.js$/)) {
                    zlux.assets._ress[ress[i]] = zlux.assets.getScript(zlux.url.root(ress[i]));
                } else {
                    zlux.assets._ress[ress[i]] = zlux.assets.getCss(zlux.url.root(ress[i]));
                }
            }
            req.push(zlux.assets._ress[ress[i]]);
        }

        return $.when.apply($, req).done(callback).fail(function(){
            if (failcallback) {
                failcallback();
            } else {
                $.error("Require failed: \n" + ress.join(",\n"));
            }
        });
    };
    zlux.assets.getScript = function(url, callback) {
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
    zlux.assets.getCss = function(url, callback){
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


   
    /** SUPPORT **/
    zlux.support = {};
    zlux.support.touch = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );


   
  


    /** UX **/
    zlux.ux = {};
    /**
     * Ajax request and notify the answer
     * @param {Object} request The ajax request
     * @param {Object} notify The notify settings
     * @return {Promise} The ajax promise
     */
    zlux.ux.requestAndNotify = function(request, notify)
    {
        // set defaults
        notify = notify === undefined ? {} : notify;

        // request
        return zlux.ajax.request(request)
        .done(function(response){

            if(notify.group) $.UIkit.notify.closeAll(notify.group);

            // display message
            if(response.message) zlux.uikit.notify(response.message, $.extend({
                status: 'success'
            }, notify));
            
        }).fail(function(response){

            if(notify.group) $.UIkit.notify.closeAll(notify.group);

            // display errors
            if(response.errors.length) $.each(response.errors, function(){
                zlux.uikit.notify(this, $.extend({
                    status: 'danger'
                }, notify));
            });
            // display notices
            if(response.notices.length) $.each(response.notices, function(){
                zlux.uikit.notify(this, $.extend({
                    status: 'warning'
                }, notify));
            });
        });
    };


    // set zlux
    $.zlux = zlux;
    $.fn.zlux = zlux.fn;
})(jQuery, window, document);


/* ===================================================
 * ZLUX Main
 * https://zoolanders.com/extensions/zl-framework
 * ===================================================
 * Copyright (C) JOOlanders SL 
 * http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
 * ========================================================== */
;(function ($, window, document, undefined) {
    "use strict";
    return;


    var Plugin = function(){};
    $.extend(Plugin.prototype, {
        name: 'Main',
        options: {},
        // var for internal events, must be reseted when expanding?
        events: {},
        /**
         * Dispatches the specified event name and it's arguments to all listeners.
         *
         * @method trigger
         * @param {String} name Event name to fire.
         * @param {Object..} Multiple arguments to pass along to the listener functions.
         */
        trigger : function(name) {
            var list = this.events[name.toLowerCase()], i, args;

            // Replace name with sender in args
            args = Array.prototype.slice.call(arguments);
            args[0] = this;

            // if event was binded
            if (list) {

                // Dispatch event to all listeners
                for (i = 0; i < list.length; i++) {
                    // Fire event, break chain if false is returned
                    if (list[i].func.apply(list[i].scope, args) === false) {
                        return false;
                    }
                }
            }

            // always trigger target for external binds with zlux. namespace
            if (this.element) this.element.trigger('zlux.' + name, args);

            return true;
        },
        /**
         * Adds an event listener by name.
         *
         * @method bind
         * @param {String} name Event name to listen for.
         * @param {function} func Function to call ones the event gets fired.
         * @param {Object} scope Optional scope to execute the specified function in.
         */
        bind: function(names, func, scope){
            var $this = this;

            names.split(' ').each(function(name){
                var list;

                name = name.toLowerCase();
                list = $this.events[name] || [];
                list.push({func : func, scope : scope || $this});
                $this.events[name] = list;
            });

            // chaining
            return this;
        },
        /**
         * Removes the specified event listener.
         *
         * @method unbind
         * @param {String} name Name of event to remove.
         * @param {function} func Function to remove from listener.
         */
        unbind : function(name) {
            name = name.toLowerCase();

            var list = this.events[name], i, func = arguments[1];

            if (list) {
                if (func !== undefined) {
                    for (i = list.length - 1; i >= 0; i--) {
                        if (list[i].func === func) {
                            list.splice(i, 1);
                                break;
                        }
                    }
                } else {
                    list = [];
                }

                // delete event list if it has become empty
                if (!list.length) {
                    delete this.events[name];
                }
            }
        },
        /**
         * Removes all event listeners.
         *
         * @method unbindAll
         */
        unbindAll : function() {
            var $this = this;
            
            $.each($this.events, function(list, name) {
                $this.unbind(name);
            });
        },
        /**
         * Check whether uploader has any listeners to the specified event.
         *
         * @method hasEventListener
         * @param {String} name Event name to check for.
         */
        hasEventListener : function(name) {
            return !!this.events[name.toLowerCase()];
        },
        /**
         * Log an error message
         *  @param {int} iLevel log error messages, or display them to the user
         *  @param {string} sMesg error message
         */
        _ErrorLog: function(iLevel, sMesg ) {
            var $this = this,
                sAlert = ($this.ID === undefined) ?
                $this.name + ": " + sMesg :
                $this.name + " warning (id = '" + $this.ID + "'): " + sMesg;

            if ( iLevel === 0 )
            {
                alert( sAlert );
                return;
            }
            else if ( window.console && console.log )
            {
                console.log( sAlert );
            }
        },
        /**
         * Shortcut for translate function
         *
         * @param {String} str String to look for.
         * @return {String} Translated string or the input string if it wasn't found.
         */
        _: function(str) {
            return $.zlux.lang.get(str);
        },
        /**
         * Pseudo sprintf implementation - simple way to replace tokens with specified values.
         *
         * @param {String} str String with tokens
         * @return {String} String with replaced tokens
         */
        sprintf: function(str) {
            var args = [].slice.call(arguments, 1), reStr = '';

            str.split(/%[sdf]/).forEach(function(part) {
                reStr += part;
                if (args.length) {
                    reStr += args.shift();
                }
            });
            return reStr;
        }
    });
    // Don't touch
    $.zlux[Plugin.prototype.name] = Plugin;
})(jQuery, window, document);
