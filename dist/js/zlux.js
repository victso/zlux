/**
 * @package     zlux
 * @version     2.1.0
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

	'use strict';

	var UI = __webpack_require__(6);
	var _ = __webpack_require__(2);
	var extend = _.extend;

	if (!UI) {
	    throw new Error('UIkit library is missing');
	}

	var $ = UI.$;

	var ZX = {
	    version: '2.1.0',
	    config: __webpack_require__(5)
	};

	UI.ready(function() {

	    // style workaround, wrapp dragging elements with zx class
	    $('body').on('start.uk.nestable, start.uk.sortable', function() {
	        UI.$('.uk-nestable-list-dragged, .uk-sortable-dragged').wrap('<div class="zx" />');
	    });

	    // extend config
	    ZX.config = extend(ZX.config, window.$zlux.config);

	});

	extend(ZX, __webpack_require__(7));
	extend(ZX, __webpack_require__(8));
	extend(ZX, __webpack_require__(1));

	ZX.http = __webpack_require__(9)(ZX);

	__webpack_require__(11)(ZX);
	__webpack_require__(12)(ZX);
	__webpack_require__(13);

	UI.$.fn.zx = ZX.fn;

	window.Zlux = UI.$zlux = _.zlux = ZX;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);
	var UI = __webpack_require__(6);
	var ZX = _.zlux;

	exports.modal = {

	    dialog: function(content, options){

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

	    alert: function(content, options){

	        var modal = UI.$.UIkit.modal.dialog(([
	            '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
	            '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary uk-modal-close">' + ZX.lang.get('Ok') + '</button></div>'
	        ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

	        modal.show();

	        return modal;
	    },

	    confirm: function(content, onconfirm, options){

	        onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};

	        var modal = UI.$.UIkit.modal.dialog(([
	           '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
	           '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary js-modal-confirm">' + ZX.lang.get('Ok') + '</button> <button class="uk-button uk-button-small uk-modal-close">' + ZX.lang.get('Cancel') + '</button></div>'
	       ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

	        modal.element.find('.js-modal-confirm').on('click', function(){
	           onconfirm();
	           modal.hide();
	        });

	        modal.show();

	        return modal;
	    }

	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lang = __webpack_require__(3);
	var extend = lang.extend;

	extend(exports, lang);
	extend(exports, __webpack_require__(4));


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _ = this;

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	exports.extend = function (target) {

	    var array = [], args = array.slice.call(arguments, 1), deep;

	    if (typeof target === 'boolean') {
	        deep = target;
	        target = args.shift();
	    }

	    args.forEach(function (arg) {
	        extend(target, arg, deep); // eslint-disable-line
	    });

	    return target;
	};

	function extend (target, source, deep) {
	    for (var key in source) {
	        if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
	            if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
	                target[key] = {};
	            }
	            if (_.isArray(source[key]) && !_.isArray(target[key])) {
	                target[key] = [];
	            }
	            extend(target[key], source[key], deep);
	        } else if (source[key] !== undefined) {
	            target[key] = source[key];
	        }
	    }
	}

	/**
	 * Type of object check
	 *
	 * @param {*} obj
	 * @return {String}
	 */

	exports.typeOf = function(obj) {
	    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	};

	/**
	 * Check if Object is a function
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isFunction = function (obj) {
	    return obj && this.typeOf(obj) === 'function';
	};

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isArray = function (obj) {
	    return Array.isArray(obj);
	};

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString; // eslint-disable-line
	exports.isPlainObject = function (obj) {
	    return toString.call(obj) === '[object Object]';
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(5);

	/**
	 * Enable debug utilities. The enableDebug() function and
	 * all _.log() & _.warn() calls will be dropped in the
	 * minified production build.
	 */

	/* eslint-disable no-console */

	function enableDebug () {

	    var hasConsole = typeof console !== 'undefined';

	    /**
	     * Log a message.
	     *
	     * @param {String} msg
	     */

	    exports.log = function(msg) {
	        if (hasConsole && config.debug) {
	            console.log('[ZLUX info]: ' + msg);
	        }
	    };

	    /**
	     * We've got a problem here.
	     *
	     * @param {String} msg
	     */

	    exports.warn = function(msg) {
	        if (hasConsole && (!config.silent || config.debug)) {
	            console.warn('[ZLUX warn]: ' + msg);

	            if (config.debug) {
	                debugger; // eslint-disable-line
	            }
	        }
	    };

	}

	enableDebug();


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

	    /**
	     * The current url.
	     *
	     * @type {String}
	     */

	    url: '',

	    /**
	     * The system ajax route.
	     *
	     * @type {String}
	     */

	    route: '',

	    /**
	     * The routes mapping.
	     *
	     * @type {Object}
	     */

	    routesMap: {},

	    /**
	     * The token number.
	     *
	     * @type {String}
	     */

	    crsf: '',

	    /**
	     * The translation strings.
	     *
	     * @type {Object}
	     */

	    locales: {},

	    /**
	     * Whether to print debug messages.
	     *
	     * @type {Boolean}
	     */

	    debug: false,

	    /**
	     * Whether to suppress warnings.
	     *
	     * @type {Boolean}
	     */

	    silent: false

	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);
	var UI = __webpack_require__(6);
	var ZX = _.zlux;

	exports.extensions = {};

	/** COMPONENT **/
	exports.component = function(name, def) {

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

	exports.component.boot = function(name) {

	    if (ZX.extensions[name].prototype && ZX.extensions[name].prototype.boot && !ZX.extensions[name].booted) {
	        ZX.extensions[name].prototype.boot.apply(ZX, []);
	        ZX.extensions[name].booted = true;
	    }
	}

	exports.component.bootComponents = function() {

	    for (var component in ZX.extensions) {
	        ZX.component.boot(component);
	    }

	}

	/** PLUGIN **/
	exports.plugin = function(name, def) {

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
	exports.fn = function(command, options) {

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
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);

	exports.lang = {

	    strings: {},

	    /**
	     * Push language strings to the list
	     * @param Object strings Translated string in JSON format.
	     */

	    push: function (strings) {
	        UI.$.extend(this.strings, strings);
	    },

	    /**
	     * Retrieves the specified language string
	     * @param String string String to look for.
	     * @return String Translated string or the input string if it wasn't found.
	     */

	    get: function (string) {
	        return this.strings[string] || string;
	    },

	    /**
	     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
	     * @param String str String with tokens
	     * @return String String with replaced tokens
	     */

	    sprintf: function (str) {
	        var args = [].slice.call(arguments, 1);

	        str = this.get(str);

	        return str.replace(/%[a-z]/g, function () {
	            var value = args.shift();
	            return _.typeOf(value) !== 'undefined' ? value : '';
	        });
	    }

	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function () {

	    var _ = __webpack_require__(2);
	    var $ = __webpack_require__(10);
	    var config = __webpack_require__(5);

	    /**
	     * Http request as jQuery ajax wrapper
	     *
	     * @param {Object} settings
	     *
	     * @return {Promise}
	     */
	    function Http(url, settings) {

	        var self = this, deferred = $.Deferred(), response = {success: true, errors: [], notices: []};

	        settings = settings || {};

	        // queue = settings.queue ? settings.queue : null,
	        // delete settings.queue

	        if (config.routesMap[url]) {
	            url = config.routesMap[url];
	        }

	        settings = _.extend(true, {url: [config.route, url].join('&p=')}, Http.settings, settings);

	        // var request  = queue ? this.queue(queue, settings) : $.ajax(settings)

	        $.ajax(settings)

	        .done(function(data, status, jqxhr) {
	            if (settings.dataType === 'json') {
	                parseReq(_.extend(response, data), status, jqxhr);
	            }
	        })

	        .fail(function(jqxhr, status, error) {
	            parseReq(response, status, jqxhr);
	            _.log(error);
	            _.log(response.errors);
	        })

	        .always(function() {
	            if (response.success) {
	                deferred.resolveWith(self, [response]);
	            } else {
	                deferred.rejectWith(self, [response]);
	            }
	        });

	        return deferred.promise();
	    }

	    function parseReq(response, status, jqxhr) {

	        if (status === 'error') {

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
	                    response.errors.push('An ' + status + ' occurred.');
	                    break;
	            }

	            response.success = false;
	        }

	        if (status === 'parsererror') {
	            response.errors.push('Response format error: JSON parse error');
	            response.success = false;
	        }

	        // status state check
	        if (response.success === undefined) {
	            response.errors.push('Response format error: status not specified');
	            response.success = false;
	        }

	    }

	    Http.settings = {
	        type       : 'get',
	        dataType   : 'json',
	        contentType: 'application/json; charset=UTF-8'
	    };

	    ['get', 'put', 'post', 'delete'].forEach(function (method) {

	        Http[method] = function (url, data, settings) {
	            return this(url, _.extend({type: method, data: data}, settings));
	        };

	    });

	    // /**
	    //  * Ajax request and notify the answer
	    //  * @param Object request The ajax request
	    //  * @param Object notify The notify settings
	    //  * @return Promise The ajax promise
	    //  */
	    // exports.requestAndNotify = function(request, notify) {

	    //     // set defaults
	    //     notify = notify === undefined ? {} : notify

	    //     // request
	    //     return this.request(request)
	    //     .done(function(response){

	    //         // close others, then notify
	    //         if(notify.group) ZX.notify.closeAll(notify.group);

	    //         // display message
	    //         if(response.message) ZX.notify(response.message, $.extend(true, {
	    //             status: 'success'
	    //         }, notify));

	    //     }).fail(function(response){

	    //         // close others, then notify
	    //         if(notify.group) ZX.notify.closeAll(notify.group);

	    //         // display errors
	    //         if(response.errors && response.errors.length) $.each(response.errors, function(){
	    //             ZX.notify(this, $.extend(true, {
	    //                 status: 'danger'
	    //             }, notify));
	    //         });

	    //     }).always(function(response){

	    //         // display notices
	    //         if(response.notices && response.notices.length) $.each(response.notices, function(){
	    //             ZX.notify(this, $.extend(true, {
	    //                 status: 'warning'
	    //             }, notify));
	    //         });
	    //     });
	    // }

	    // // Original code from AjaxQ jQuery Plugin
	    // // Copyright (c) 2012 Foliotek Inc.
	    // // MIT License
	    // // https://github.com/Foliotek/ajaxq
	    // var queues = {}

	    // // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
	    // exports.queue = function(qname, opts) {

	    //     if (typeof opts === "undefined") {
	    //         throw ("AjaxQ: queue name is not provided");
	    //     }

	    //     // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
	    //     var deferred = $.Deferred(),
	    //         promise = deferred.promise();

	    //     promise.success = promise.done;
	    //     promise.error = promise.fail;
	    //     promise.complete = promise.always;

	    //     // Create a deep copy of the arguments, and enqueue this request.
	    //     var clonedOptions = $.extend(true, {}, opts);
	    //     enqueue(function() {

	    //         // Send off the ajax request now that the item has been removed from the queue
	    //         var jqXHR = $.ajax.apply(window, [clonedOptions]).always(dequeue);

	    //         // Notify the returned deferred object with the correct context when the jqXHR is done or fails
	    //         // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
	    //         jqXHR.done(function() {
	    //             deferred.resolve.apply(this, arguments);
	    //         });
	    //         jqXHR.fail(function() {
	    //             deferred.reject.apply(this, arguments);
	    //         });
	    //     });

	    //     return promise;

	    //     // If there is no queue, create an empty one and instantly process this item.
	    //     // Otherwise, just add this item onto it for later processing.
	    //     function enqueue(cb) {
	    //         if (!queues[qname]) {
	    //             queues[qname] = [];
	    //             cb();
	    //         }
	    //         else {
	    //             queues[qname].push(cb);
	    //         }
	    //     }

	    //     // Remove the next callback from the queue and fire it off.
	    //     // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
	    //     function dequeue() {
	    //         if (!queues[qname]) {
	    //             return;
	    //         }
	    //         var nextCallback = queues[qname].shift();
	    //         if (nextCallback) {
	    //             nextCallback();
	    //         }
	    //         else {
	    //             delete queues[qname];
	    //         }
	    //     }

	    // }

	    // // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
	    // // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
	    // $.each( [ "getq", "postq" ], function( i, method ) {
	    //     $[ method ] = function( qname, url, data, callback, type ) {

	    //         if ( $.isFunction( data ) ) {
	    //             type = type || callback;
	    //             callback = data;
	    //             data = undefined;
	    //         }

	    //         return $zlux.http.queue(qname, {
	    //             type: method === "postq" ? "post" : "get",
	    //             url: url,
	    //             data: data,
	    //             success: callback,
	    //             dataType: type
	    //         });
	    //     };
	    // });

	    // var isQueueRunning = function(qname) {
	    //     return queues.hasOwnProperty(qname);
	    // }

	    // var isAnyQueueRunning = function() {
	    //     for (var i in queues) {
	    //         if (isQueueRunning(i)) return true;
	    //     }
	    //     return false;
	    // }

	    // exports.queue.isRunning = function(qname) {
	    //     if (qname) return isQueueRunning(qname);
	    //     else return isAnyQueueRunning();
	    // }

	    // exports.queue.clear = function(qname) {
	    //     if (!qname) {
	    //         for (var i in queues) {
	    //             if (queues.hasOwnProperty(i)) {
	    //                 delete queues[i];
	    //             }
	    //         }
	    //     }
	    //     else {
	    //         if (queues[qname]) {
	    //             delete queues[qname]
	    //         }
	    //     }
	    // }

	    return Http;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = UIkit.$;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UI = __webpack_require__(6);

	module.exports = function(ZX) {

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
	                if (callback) {
	                    callback.apply($this.element);
	                }

	            });
	        },

	        animate: function(animation) {
	            var $this = this;

	            return UI.$.Deferred(function(defer) {

	                // animate the element with CSS3
	                $this.element.addClass(animation)

	                // when done
	                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {

	                    // remove the class to allow further animation
	                    $this.element.removeClass(animation);
	                    defer.resolve();

	                });

	            }).promise();
	        }
	    });

	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UI = __webpack_require__(6)

	module.exports = function(ZX) {

	    ZX.component('spin', {

	        defaults: {
	            class: '',
	            affix:  'append' // append, prepend or replace
	        },

	        init: function() {
	            // run default
	            this.on()
	        },

	        on: function() {
	            var $this = this

	            $this.icon_class = false

	            // find and existing icon
	            $this.icon = $this.element.is('i') ? $this.element : UI.$('i', $this.element).first()

	            // use it if found
	            if($this.icon.length) {
	                // save original class
	                $this.icon_class = $this.icon.attr('class')
	                // hardcode the width to avoid movement effects
	                $this.icon.width($this.icon.width())
	                // set new class
	                $this.icon.attr('class', 'uk-icon-zx-spinner uk-icon-spin')

	            // else, create one
	            } else {
	                $this.icon = UI.$('<i class="uk-icon-zx-spinner uk-icon-spin"></i>')

	                // place the icon
	                if($this.options.affix == 'replace') {
	                    $this.element.html($this.icon)
	                } else {
	                    $this.element[$this.options.affix]($this.icon)
	                }
	            }

	            // add custom class
	            $this.icon.addClass($this.options['class'])
	        },

	        off: function() {
	            var $this = this;

	            // remove the spin classes but not the icon
	            $this.icon.removeClass('uk-icon-zx-spinner uk-icon-spin')

	            // recover class, if any
	            if($this.icon_class) $this.icon.attr('class', $this.icon_class)

	            // remove hardcoded width
	            $this.icon.width('')

	            // remove spin instance from element
	            $this.element.removeData('spin')
	        }

	    })

	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _  = __webpack_require__(2);
	var http = __webpack_require__(9)();

	var vueZlux = {

	    install: function (Vue) {

	        Object.defineProperty(Vue.prototype, '$http', {

	            get: function () {
	                return _.extend(http.bind(this), http);
	            }

	        });

	        Vue.filter('trans', function(id) {

	            return _.zlux.config.locales[id] ? _.zlux.config.locales[id] : id;

	        });

	    }

	};

	if (window.Vue) {
	    Vue.use(vueZlux);
	}


/***/ }
/******/ ]);