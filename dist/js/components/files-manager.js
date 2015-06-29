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

	'use strict';

	var UI = __webpack_require__(13);
	var _ = __webpack_require__(18);

	UI.component('zx-files-manager', {

	    boot: function() {

	        if (!window.Vue) {
	            _.warn('Vue not loaded but required by Files Manager');
	            return;
	        }

	        // save component for programatic usage
	        Vue.component('files-manager', __webpack_require__(22));

	    }

	});


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lang = __webpack_require__(19);
	var extend = lang.extend;

	extend(exports, lang);
	extend(exports, __webpack_require__(20));


/***/ },
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(21);

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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23)
	module.exports.template = __webpack_require__(38)

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(18);
	    var $ = __webpack_require__(24);

	    module.exports = {

	        replace: true,
	        props: ['root'],

	        data: function() {

	            return {
	                root: '',
	                location: '',
	                cache: {},
	                resources: [],
	                currentView: 'resources',

	                nav: [
	                    {title: 'Files', view: 'files'},
	                    {title: 'Uploader', view: 'uploader'}
	                ]
	            };

	        },

	        ready: function() {

	            $('a[href="#"]', this.$el).on('click', function(e) {

	                e.preventDefault();

	            });

	        },

	        methods: {

	            changeView: function(view) {

	                this.currentView = view;

	            },

	            goTo: function(path) {

	                if (path === '/') {
	                    path = this.root;
	                }

	                this.fetch({path: path});

	            },

	            fetch: function(params) {

	                // if (this.cache[this.currentPath]) {

	                //     this.root  = path;
	                //     this.files = this.cache[path];
	                //     return;

	                // }

	                params = _.extend({

	                    path: this.location ? this.root + '/' + this.location : this.root

	                }, (params || {}));

	                this.$http.get('/files', params).done(function(response) {

	                    this.$set('location', response.location);
	                    this.$set('resources', response.resources);

	                    this.cache[this.location] = response;

	                    // execute callback
	                    if (_.isFunction(this.onLoadPage)) {
	                        this.onLoadPage();
	                    }

	                });

	            },

	            init: function() {

	                if (!this.resources.length) {
	                    this.fetch();
	                }

	            }

	        },

	        components: {

	            resources: __webpack_require__(25),
	            uploader : __webpack_require__(35)

	        }

	    };

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = UIkit.$;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(26)
	module.exports.template = __webpack_require__(34)

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	        replace: true,
	        inherit: true,

	        components: {

	            resource  : __webpack_require__(27),
	            breadcrumb: __webpack_require__(31)

	        }

	    };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28)
	module.exports.template = __webpack_require__(30)

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var helper = __webpack_require__(29);

	    module.exports = {

	        props: ['root', 'on-select-page'],

	        data: function() {

	            return {
	                basename    : '',
	                content_type: '',
	                ext         : '',
	                name        : '',
	                size        : ''
	            }

	        },

	        computed: {

	            path: function() {
	                return this.root + '/' + this.basename;
	            },

	            type: function() {
	                return this.basename.match(/\/$/) ? 'folder' : 'file';
	            }

	        },

	        filters: {

	            title: function(value) {

	                return value

	                    // remove extension
	                    .replace(/(\/|\.\w+$)/g, '')

	                    // remove dash/underscore
	                    .replace(/(-|_)/g, ' ');

	            },

	            parseSize: function(size) {

	                if ( ! size) {
	                    return size;
	                }

	                return helper.filesize( helper.parseSize(size) );

	            }

	        },

	        methods: {

	            selectPage: function(e) {

	                e.preventDefault();
	                this.onSelectPage(this.path);

	            }

	        }

	    }

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';


	// http://phpjs.org/functions/basename
	exports.basename = function(path, suffix) {

	    var b = path;
	    var lastChar = b.charAt(b.length - 1);

	    if (lastChar === '/' || lastChar === '\\') {
	        b = b.slice(0, -1);
	    }

	    b = b.replace(/^.*[\/\\]/g, '');

	    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
	        b = b.substr(0, b.length - suffix.length);
	    }

	    return b;
	};

	// parses the specified size string into a byte value
	exports.parseSize = function(size){

	    if (typeof (size) !== 'string' || size === '') {
	        return size;
	    }

	    var muls = {
	            t: 1099511627776,
	            g: 1073741824,
	            m: 1048576,
	            k: 1024
	        },
	        mul;

	    size = /^([0-9]+)([mgk]?)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
	    mul = size[2];
	    size = +size[1];

	    if (muls.hasOwnProperty(mul)) {
	        size *= muls[mul];
	    }

	    return size;
	};

	/**
	  * https://github.com/avoidwork/filesize.js - v3.1.2
	  * Copyright (c) 2015, Jason Mulligan
	  *
	  * @param  {Mixed}   arg        String, Int or Float to transform
	  * @param  {Object}  descriptor [Optional] Flags
	  * @return {String}             Readable file size String
	*/
	exports.filesize = function(arg) {

	    var bit = /b$/;
	    var si = {
	        bits : ['B', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
	        bytes: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	    };

	    var descriptor = arguments[1] === undefined ? {} : arguments[1];

	    var result = [];
	    var skip = false;
	    var val = 0;
	    var e, base, bits, ceil, neg, num, output, round, unix, spacer, suffixes;

	    if (isNaN(arg)) {
	        throw new Error('Invalid arguments');
	    }

	    bits = descriptor.bits === true;
	    unix = descriptor.unix === true;
	    base = descriptor.base !== undefined ? descriptor.base : 2;
	    round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
	    spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
	    suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
	    output = descriptor.output !== undefined ? descriptor.output : 'string';
	    e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
	    num = Number(arg);
	    neg = num < 0;
	    ceil = base > 2 ? 1000 : 1024;

	    // Flipping a negative number to determine the size
	    if (neg) {
	        num = -num;
	    }

	    // Zero is now a special case because bytes divide by 1
	    if (num === 0) {
	        result[0] = 0;

	        if (unix) {
	            result[1] = '';
	        } else {
	            result[1] = 'B';
	        }
	    } else {
	        // Determining the exponent
	        if (e === -1 || isNaN(e)) {
	            e = Math.floor(Math.log(num) / Math.log(ceil));
	        }

	        // Exceeding supported length, time to reduce & multiply
	        if (e > 8) {
	            val = val * (1000 * (e - 8));
	            e = 8;
	        }

	        if (base === 2) {
	            val = num / Math.pow(2, e * 10);
	        } else {
	            val = num / Math.pow(1000, e);
	        }

	        if (bits) {
	            val = val * 8;

	            if (val > ceil) {
	                val = val / ceil;
	                e++;
	            }
	        }

	        result[0] = Number(val.toFixed(e > 0 ? round : 0));
	        result[1] = si[bits ? 'bits' : 'bytes'][e];

	        if (!skip && unix) {
	            if (bits && bit.test(result[1])) {
	                result[1] = result[1].toLowerCase();
	            }

	            result[1] = result[1].charAt(0);

	            if (result[1] === 'B') {
	                result[0] = Math.floor(result[0]);
	                result[1] = '';
	            } else if (!bits && result[1] === 'k') {
	                result[1] = 'K';
	            }
	        }
	    }

	    // Decorating a 'diff'
	    if (neg) {
	        result[0] = -result[0];
	    }

	    // Applying custom suffix
	    result[1] = suffixes[result[1]] || result[1];

	    // Returning Array, Object, or String (default)
	    if (output === 'array') {
	        return result;
	    }

	    if (output === 'exponent') {
	        return e;
	    }

	    if (output === 'object') {
	        return { value: result[0], suffix: result[1] };
	    }

	    return result.join(spacer);
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<td v-if=\"type == 'folder'\">\n\n        <a href=\"#\" v-on=\"click: selectPage\">{{ basename | title }}</a>\n\n    </td>\n\n    <td v-if=\"type == 'file'\">\n\n        {{ basename | title }}\n\n    </td>\n\n    <td>\n\n        {{ size | parseSize }}\n\n    </td>";

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32)
	module.exports.template = __webpack_require__(33)

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = {

	        replace: true,
	        props: ['location', 'go-to'],

	        computed: {

	            parts: function() {

	                return this.location.replace(/^[\/]|[\/]$/gm, '').split('/');

	            },

	            crumbs: function() {

	                var crumbs = [], path = '/';

	                this.parts.forEach(function(part) {

	                    if (part === '') {
	                        return true;
	                    }

	                    crumbs.push({
	                        'name': part,
	                        'path': path += part + '/'
	                    });

	                });

	                crumbs.pop();

	                return crumbs;

	            },

	            active: function() {

	                return this.parts.pop();

	            }

	        }

	    };

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "<ul class=\"uk-breadcrumb\">\n\n        <li><a href=\"#\" v-on=\"click: goTo('/')\">{{ 'root' | trans }}</a></li>\n        <li v-repeat=\"crumbs\"><a href=\"#\" v-on=\"click: goTo(path)\">{{ name }}</a></li>\n        <li v-if=\"active\" class=\"uk-active\"><span>{{ active }}</span></li>\n\n    </ul>";

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = "<breadcrumb location=\"{{ location }}\" go-to=\"{{ goTo }}\"></breadcrumb>\n\n    <table class=\"uk-table\">\n        <thead>\n            <tr>\n                <th>File</th>\n                <th>Size</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr v-component=\"resource\" v-repeat=\"resources\" root=\"{{ root }}\" on-select-page=\"{{ goTo }}\"></tr>\n        </tbody>\n    </table>";

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(36)
	module.exports.template = __webpack_require__(37)

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = {

	    };

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "this is the uploader\n    <div class=\"uk-placeholder-large\">...</div>";

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<div class=\"zx-files-manager\">\n\n        <nav class=\"uk-navbar\">\n            <ul class=\"uk-navbar-nav\">\n\n                <li class=\"uk-parent uk-active\" v-repeat=\"item: nav\">\n\n                    <a href=\"#\" v-on=\"click: changeView(item.view)\"> {{ item.title }}</a>\n\n                </li>\n\n            </ul>\n        </nav>\n\n        <component is=\"{{ currentView }}\"></component>\n\n    </div>";

/***/ }
/******/ ]);