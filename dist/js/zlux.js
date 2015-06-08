/**
 * @package     zlux
 * @version     2.0.3
 * @author      ZOOlanders - http://zoolanders.com
 * @license     GNU General Public License v2 or later
 */

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var UI = __webpack_require__(2);

	/**
	 * The main ZX object
	 */
	var ZX = {version: '2.0.3'};

	/**
	 * URI
	 */
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
	    UI.$.extend(ZX.url.urls, urls);
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
	        result = ZX.url._get(url[0]) + (UI.$.isEmptyObject(params) ? '' : '&' + UI.$.param(params));
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
	    UI.$.extend(ZX.lang.strings, strings);
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
	    if (UI.$.isPlainObject(string)) return string;

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
	UI.$.zx     = ZX;


	UI.ready(function() {

	    // style workaround wrapping root elements with zlux    
	    UI.$('[data-uk-nestable]').on('nestable-start', function() {
	        UI.$('.uk-nestable-list-dragged').wrap('<div class="zx" />');
	    });

	    // ZX.component.bootComponents();
	    
	});

	// include core extensions
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(1);
	__webpack_require__(9);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	var UI = __webpack_require__(2);
	    
	ZX.component('spin', {

	    defaults: {
	        class: '',
	        affix:  'append' // append, prepend or replace
	    },

	    init: function() {
	        // run default
	        this.on();
	    },

	    on: function() {
	        var $this = this;

	        $this.icon_class = false;

	        // find and existing icon
	        $this.icon = $this.element.is('i') ? $this.element : UI.$('i', $this.element).first();

	        // use it if found
	        if($this.icon.length) {
	            // save original class
	            $this.icon_class = $this.icon.attr('class');
	            // hardcode the width to avoid movement effects
	            $this.icon.width($this.icon.width());
	            // set new class
	            $this.icon.attr('class', 'uk-icon-zx-spinner uk-icon-spin');

	        // else, create one
	        } else {
	            $this.icon = UI.$('<i class="uk-icon-zx-spinner uk-icon-spin"></i>');

	            // place the icon
	            if($this.options.affix == 'replace') {
	                $this.element.html($this.icon);
	            } else {
	                $this.element[$this.options.affix]($this.icon);
	            }
	        }

	        // add custom class
	        $this.icon.addClass($this.options['class']);
	    },

	    off: function() {
	        var $this = this;

	        // remove the spin classes but not the icon
	        $this.icon.removeClass('uk-icon-zx-spinner uk-icon-spin');

	        // recover class, if any
	        if($this.icon_class) $this.icon.attr('class', $this.icon_class);

	        // remove hardcoded width
	        $this.icon.width('');

	        // remove spin instance from element
	        $this.element.removeData('spin');
	    }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = UIkit;

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = zlux;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	var UI = __webpack_require__(2);

	ZX.extensions = {};

	/** COMPONENT **/
	ZX.component = function(name, def) {

	    var fn = function(element, options) {
	        var $this = this;

	        this.element = element ? UI.$(element) : null;
	        this.options = UI.$.extend(true, {}, this.defaults, options);
	        this.plugins = {};

	        if (this.element) {
	            this.element.data(name, this);
	        }

	        this.init();

	        (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

	            if (fn.plugins[plugin].init) {
	                fn.plugins[plugin].init($this);
	                $this.plugins[plugin] = true;
	            }

	        });

	        this.trigger('init', [this]);
	    };

	    fn.plugins = {};
	    fn.instances = [];

	    UI.$.extend(true, fn.prototype, {

	        type: 'component',

	        defaults: {plugins: []},

	        boot: function(){},
	        init: function(){},

	        on: function(){
	            return UI.$(this.element || this).on.apply(this.element || this, arguments);
	        },

	        one: function(){
	            return UI.$(this.element || this).one.apply(this.element || this, arguments);
	        },

	        off: function(evt){
	            return UI.$(this.element || this).off(evt);
	        },

	        trigger: function(evt, params) {
	            return UI.$(this.element || this).trigger(evt, params);
	        },

	        find: function(selector) {
	            return this.element ? this.element.find(selector) : $([]);
	        },

	        proxy: function(obj, methods) {
	            var $this = this;

	            methods.split(' ').forEach(function(method) {
	                if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
	            });
	        },

	        mixin: function(obj, methods) {
	            var $this = this;

	            methods.split(' ').forEach(function(method) {
	                if (!$this[method]) $this[method] = obj[method].bind($this);
	            });
	        }

	    }, def);

	    // save the component
	    this.extensions[name] = fn;

	    // declare the component init function and save it into ZX root
	    this[name] = function() {

	        var element, options;

	        if(arguments.length) {
	            switch(arguments.length) {
	                case 1:

	                    if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
	                        element = UI.$(arguments[0]);
	                    } else {
	                        options = arguments[0];
	                    }

	                    break;
	                case 2:

	                    element = UI.$(arguments[0]);
	                    options = arguments[1];
	                    break;
	            }
	        }

	        if (element && element.data(name)) {
	            return element.data(name);
	        }

	        return (new ZX.extensions[name](element, options));
	    };

	    // Component plugin declaration
	    this[name].plugin = function(plugin, def) {
	        ZX.extensions[name].plugins[plugin] = def;
	    };

	    if (UI.domready) {
	        UI.component.boot(name);
	    }

	    return fn;
	};

	ZX.component.boot = function(name) {

	    if (ZX.extensions[name].prototype && ZX.extensions[name].prototype.boot && !ZX.extensions[name].booted) {
	        ZX.extensions[name].prototype.boot.apply(ZX, []);
	        ZX.extensions[name].booted = true;
	    }
	};

	ZX.component.bootComponents = function() {

	    for (var component in ZX.extensions) {
	        ZX.component.boot(component);
	    }

	}

	/** PLUGIN **/
	ZX.plugin = function(name, def) {

	    var fn = function(element, options) {
	        this.element = element ? UI.$(element) : null;
	        this.init(options);
	    };

	    UI.$.extend(true, fn.prototype, {

	        type: 'plugin',

	        init: function(){}

	    }, def);


	    // save the plugin
	    this.extensions[name] = fn;

	    // declare the plugin init function and save it into ZX root
	    this[name] = function() {

	        var element, options;

	        if(arguments.length) {
	            switch(arguments.length) {
	                case 1:

	                    if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
	                        element = UI.$(arguments[0]);
	                    } else {
	                        options = arguments[0];
	                    }

	                    break;
	                case 2:

	                    element = UI.$(arguments[0]);
	                    options = arguments[1];
	                    break;
	            }
	        }

	        return (new ZX.extensions[name](element, options));
	    };

	    return fn;
	};


	/** FN **/
	ZX.fn = function(command, options) {

	    var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), extension = cmd[1], method = cmd[2];

	    if (!ZX[extension]) {
	        UI.$.error("ZLUX extension [" + extension + "] does not exist.");
	        return this;
	    }

	    // component
	    if(ZX.extensions[extension].prototype.type === 'component') {

	        return this.each(function() {
	            // the element
	            var $this = UI.$(this),

	            // get the saved instance
	            data = $this.data(extension);

	            // if no instance, init it
	            if (!data) {
	                $this.data(extension, (data = ZX[extension](this, method ? undefined : options)));
	                ZX.extensions[extension].instances.push(data);
	            }

	            // if method provided, execute it
	            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
	        });
	    }

	    // plugin
	    else if(ZX.extensions[extension].prototype.type === 'plugin') {

	        return this.each(function() {
	            ZX[extension](this, Array.prototype.slice.call(args, 1));
	        });
	    }
	};

	UI.$.fn.zx = ZX.fn;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	var UI = __webpack_require__(2);

	ZX.ajax = {};

	/**
	 * Ajax request
	 * @param Object settings The request settings
	 * @return Promise The ajax promise
	 */
	ZX.ajax.request = function(settings)
	{
	    // set defaults
	    var response = {success:false, errors:[], notices:[]},
	        queue = settings.queue ? settings.queue : null,
	        request = null;

	    // delete custom params, just in case
	    delete settings.queue;

	    // set request defaults
	    settings = UI.$.extend(true, {
	        dataType: 'json',
	        type: 'POST'
	    }, settings);

	    // return a promise
	    return UI.$.Deferred(function( defer )
	    {
	        // perform the request
	        if (queue) {
	            request = ZX.ajax.queue(queue, settings);
	        } else {
	            request = UI.$.ajax(settings);
	        }
	        
	        // if response recieved
	        request.done(function(result, a, b)
	        {
	            // if dataType is json
	            if (settings.dataType === 'json')
	            {
	                // check if object returned
	                if(ZX.utils.typeOf(result) !== 'object')
	                {
	                    try {
	                        // parse response detecting if there was some server side error
	                        json = UI.$.parseJSON(result);

	                    // handle exception
	                    } catch(e) {
	                        response.errors.push(String(result));
	                        response.errors.push('An server-side error occurred. ' + String(e));
	                        defer.reject(response);
	                    }
	                }

	                // check if status set
	                else if (result.success === undefined) {
	                    result.errors = ['Response format error: status not specified'];
	                    defer.reject(result);
	                } else if (result.success)
	                    defer.resolve(result);
	                else
	                    defer.reject(result);

	            // else just send the result over
	            } else {
	                defer.resolve(result);
	            }
	        })
	        
	        // if something went wrong
	        .fail(function(jqxhr, status, error)
	        {
	            // handle errors
	            switch (jqxhr.status) {
	                case 0: // if request canceled no error is logged
	                    break;
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
	                    response.errors.push('An ' + status + ' occurred<br />' + error + '<br /><br />Returned' + jqxhr.responseText);
	                    break;
	            }

	            // set response status
	            response.status = jqxhr.status;

	            // reject
	            defer.reject(response);
	        });

	    }).promise();
	};
	/**
	 * Ajax request and notify the answer
	 * @param Object request The ajax request
	 * @param Object notify The notify settings
	 * @return Promise The ajax promise
	 */
	ZX.ajax.requestAndNotify = function(request, notify)
	{
	    // set defaults
	    notify = notify === undefined ? {} : notify;

	    // request
	    return ZX.ajax.request(request)
	    .done(function(response){

	        // close others, then notify
	        if(notify.group) ZX.notify.closeAll(notify.group);

	        // display message
	        if(response.message) ZX.notify(response.message, UI.$.extend(true, {
	            status: 'success'
	        }, notify));
	        
	    }).fail(function(response){

	        // close others, then notify
	        if(notify.group) ZX.notify.closeAll(notify.group);

	        // display errors
	        if(response.errors && response.errors.length) UI.$.each(response.errors, function(){
	            ZX.notify(this, UI.$.extend(true, {
	                status: 'danger'
	            }, notify));
	        });
	       
	    }).always(function(response){

	        // display notices
	        if(response.notices && response.notices.length) UI.$.each(response.notices, function(){
	            ZX.notify(this, UI.$.extend(true, {
	                status: 'warning'
	            }, notify));
	        });
	    });
	};


	// Original code from AjaxQ jQuery Plugin
	// Copyright (c) 2012 Foliotek Inc.
	// MIT License
	// https://github.com/Foliotek/ajaxq
	var queues = {};

	// Register an UI.$.ajaxq function, which follows the UI.$.ajax interface, but allows a queue name which will force only one request per queue to fire.
	ZX.ajax.queue = function(qname, opts) {

	    if (typeof opts === "undefined") {
	        throw ("AjaxQ: queue name is not provided");
	    }

	    // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of UI.$.ajax
	    var deferred = UI.$.Deferred(),
	        promise = deferred.promise();

	    promise.success = promise.done;
	    promise.error = promise.fail;
	    promise.complete = promise.always;

	    // Create a deep copy of the arguments, and enqueue this request.
	    var clonedOptions = UI.$.extend(true, {}, opts);
	    enqueue(function() {

	        // Send off the ajax request now that the item has been removed from the queue
	        var jqXHR = UI.$.ajax.apply(window, [clonedOptions]).always(dequeue);

	        // Notify the returned deferred object with the correct context when the jqXHR is done or fails
	        // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
	        jqXHR.done(function() {
	            deferred.resolve.apply(this, arguments);
	        });
	        jqXHR.fail(function() {
	            deferred.reject.apply(this, arguments);
	        });
	    });

	    return promise;

	    // If there is no queue, create an empty one and instantly process this item.
	    // Otherwise, just add this item onto it for later processing.
	    function enqueue(cb) {
	        if (!queues[qname]) {
	            queues[qname] = [];
	            cb();
	        }
	        else {
	            queues[qname].push(cb);
	        }
	    }

	    // Remove the next callback from the queue and fire it off.
	    // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
	    function dequeue() {
	        if (!queues[qname]) {
	            return;
	        }
	        var nextCallback = queues[qname].shift();
	        if (nextCallback) {
	            nextCallback();
	        }
	        else {
	            delete queues[qname];
	        }
	    }
	};

	// Register a UI.$.postq and UI.$.getq method to provide shortcuts for UI.$.get and UI.$.post
	// Copied from jQuery source to make sure the functions share the same defaults as UI.$.get and UI.$.post.
	UI.$.each( [ "getq", "postq" ], function( i, method ) {
	    UI.$[ method ] = function( qname, url, data, callback, type ) {

	        if ( UI.$.isFunction( data ) ) {
	            type = type || callback;
	            callback = data;
	            data = undefined;
	        }

	        return ZX.ajax.queue(qname, {
	            type: method === "postq" ? "post" : "get",
	            url: url,
	            data: data,
	            success: callback,
	            dataType: type
	        });
	    };
	});

	var isQueueRunning = function(qname) {
	    return queues.hasOwnProperty(qname);
	};

	var isAnyQueueRunning = function() {
	    for (var i in queues) {
	        if (isQueueRunning(i)) return true;
	    }
	    return false;
	};

	ZX.ajax.queue.isRunning = function(qname) {
	    if (qname) return isQueueRunning(qname);
	    else return isAnyQueueRunning();
	};

	ZX.ajax.queue.clear = function(qname) {
	    if (!qname) {
	        for (var i in queues) {
	            if (queues.hasOwnProperty(i)) {
	                delete queues[i];
	            }
	        }
	    }
	    else {
	        if (queues[qname]) {
	            delete queues[qname];
	        }
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	var UI = __webpack_require__(2);

	ZX.plugin('animate', {

	    init: function(options) {
	        var $this = this,

	        // set animation class
	        animation = 'zx-animate-' + UI.$.trim(options[0]),

	        // set callback
	        callback = options[1] ? options[1] : null;
	            
	        // animate
	        $this.animate(animation).done(function(){

	            // execute any callback passing the element as scope
	            if (callback) callback.apply($this.element);
	        });
	    },

	    animate: function(animation) {
	        var $this = this;

	        return UI.$.Deferred(function(defer) {

	            // animate the element with CSS3
	            $this.element.addClass(animation)

	            // when done
	            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {

	                // remove the class to allow further animation
	                $this.element.removeClass(animation);

	                defer.resolve();
	            });

	        }).promise();
	    }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	var UI = __webpack_require__(2);

	var modal = function(){},

	dialog = function(content, options){

	    var modal = UI.$.UIkit.modal.dialog(content, options);

	    // extend modal with
	    UI.$.extend(modal, {

	        // update content
	        content: function(html) {
	            var container = this.dialog;

	            if(!html) {
	                return container.html();
	            }

	            container.html(html);

	            return this;
	        }
	    });

	    // add zlux class for the holding content styling
	    modal.element.addClass('zx');

	    return modal;
	},

	alert = function(content, options){

	    var modal = UI.$.UIkit.modal.dialog(([
	        '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
	        '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary uk-modal-close">'+ZX.lang.get('Ok')+'</button></div>'
	    ]).join(""), UI.$.extend({bgclose:false, keyboard:false}, options));

	    modal.show();

	    return modal;
	},

	confirm = function(content, onconfirm, options){

	    onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};

	    var modal = UI.$.UIkit.modal.dialog(([
	       '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
	       '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary js-modal-confirm">'+ZX.lang.get('Ok')+'</button> <button class="uk-button uk-button-small uk-modal-close">'+ZX.lang.get('Cancel')+'</button></div>'
	    ]).join(""), UI.$.extend({bgclose:false, keyboard:false}, options));

	    modal.element.find(".js-modal-confirm").on("click", function(){
	       onconfirm();
	       modal.hide();
	    });

	    modal.show();

	    return modal;
	};


	ZX.modal          = modal;
	ZX.modal.dialog   = dialog;
	ZX.modal.alert    = alert;
	ZX.modal.confirm  = confirm;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var ZX = __webpack_require__(4);
	    
	ZX.vue = {};
	ZX.vue.mixins = [{

	    created: function() {

	    	var config = window.$zlux_config;

	        Vue.url.options.root = config.url;

	        Vue.http.headers.common['X-XSRF-TOKEN'] = config.csrf;
	        Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	        Vue.http.options.emulateHTTP = true;

	        Vue.http.options.beforeSend = function (request, options) {

	        	var url = options.url.split('/');
	        	url[0] = 'controller=' + url[0];
	        	url[1] = 'task=' + url[1];

	            options.url = config.route + '&' + url.join('&');

	        };

	    }

	}];

/***/ }
/******/ ]);