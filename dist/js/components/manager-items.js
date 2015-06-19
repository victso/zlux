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

	"use strict";

	var UI = __webpack_require__(2);

	UI.component('zx-manager-items', {

	    boot: function() {

	        if (!window.Vue) {
	            UI.$zlux.warn('Vue not loaded but required by Items Manager')
	            return
	        }

	        // save component for programatic usage
	        Vue.component('manager-items', __webpack_require__(11))

	        // auto init
	        UI.ready(function(context) {

	            UI.$('[data-zx-manager-items]', context).each(function(){

	                if ( ! this.__vue__) {

	                    new Vue(__webpack_require__(11)).$mount(this)

	                }

	            })

	        })

	    }

	})

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<nav class=\"uk-navbar\">\n        <div class=\"uk-navbar-flip\">\n            <div class=\"uk-navbar-content\">\n                <form class=\"uk-form uk-margin-remove uk-display-inline-block\">\n                    <input class=\"uk-search-field\" type=\"search\" placeholder=\"filter...\">\n                </form>\n            </div>\n        </div>\n    </nav>\n\n    <items></items>";
	var UI = __webpack_require__(2);

	    module.exports = {

	        replace: true,

	        data:  function() {

	            return {

	                nav: [
	                    {title: 'Filter'}
	                ]

	            }

	        },

	        ready: function() {

	            UI.$('a[href="#"]', this.$el).on('click', function(e) {

	                e.preventDefault();

	            })

	        },

	        methods: {

	        },

	        components: {

	            items: __webpack_require__(12),

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<table class=\"uk-table\">\n        <thead>\n\n            <tr>\n                <th v-repeat=\"col: columns\" v-on=\"click: sortBy(col.name)\">\n\n                    {{ col.title | capitalize }}\n\n                    <i v-show=\"sortKey == col.name\" class=\"uk-icon\" v-class=\"reversed[col.name] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'\">\n                    </i>\n\n                </th>\n            </tr><tr>\n\n        </tr></thead>\n        <tbody>\n\n            <tr v-repeat=\"entry: items\">\n\n                <td v-repeat=\"col: columns\">\n\n                    {{ entry[col.name] }}\n\n                </td>\n\n            </tr>\n\n        </tbody>\n    </table>\n\n    <zx-pagination v-if=\"items.length > 1\" items=\"{{ total }}\" items-on-page=\"{{ itemsPerPage }}\" on-select-page=\"{{ changePage }}\"></zx-pagination>";
	var UI = __webpack_require__(2)
	    var _ = __webpack_require__(13)

	    module.exports = {

	        inherit: true,
	        replace: true,

	        data: function() {

	            return {
	                items: [],
	                itemsPerPage: 10,
	                currentPage: 1,
	                total: 0,
	                count: 0,
	                offset: 0,
	                columns: [],
	                order: ['_itemname'],
	                // filterKey: '',
	                reversed: {}
	            }

	        },

	        created: function() {

	            this.$set('currentPage', this.currentPage - 1)
	            this.fetchData()

	        },

	        methods: {

	            fetchData: function(params) {

	                params = _.extend({

	                    offset: this.currentPage * this.itemsPerPage,
	                    limit:  this.itemsPerPage,
	                    order:  this.order

	                }, (params || {}))

	                this.$http.get('/items', params).done(function(response) {

	                    this.columns = response.columns
	                    this.items   = response.items
	                    this.total   = response.total
	                    this.count   = response.count
	                    this.offset  = response.offset

	                    // initialize reverse ordering state
	                    this.columns.forEach(function (col) {
	                        this.reversed.$add(col.name, false)
	                    }, this)

	                })

	            },

	            changePage: function(index) {

	                this.currentPage = index
	                this.fetchData()

	            },

	            sortBy: function (key) {

	                this.order = []
	                this.reversed[key] = !this.reversed[key]

	                this.order.push(key)

	                if (this.reversed[key]) {
	                    this.order.push('_reversed')
	                }

	                this.fetchData()

	            }

	        }

	    }
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var lang   = __webpack_require__(14)
	var extend = lang.extend

	extend(exports, lang)
	extend(exports, __webpack_require__(15))

/***/ },
/* 14 */
/***/ function(module, exports) {

	var _ = this

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	exports.extend = function (target) {

	    var array = [], args = array.slice.call(arguments, 1), deep

	    if (typeof target == 'boolean') {
	        deep = target
	        target = args.shift()
	    }

	    args.forEach(function (arg) {
	        extend(target, arg, deep)
	    })

	    return target
	}

	function extend (target, source, deep) {
	    for (var key in source) {
	        if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
	            if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
	                target[key] = {}
	            }
	            if (_.isArray(source[key]) && !_.isArray(target[key])) {
	                target[key] = [];
	            }
	            extend(target[key], source[key], deep)
	        } else if (source[key] !== undefined) {
	            target[key] = source[key]
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
	    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
	}

	/**
	 * Check if Object is a function
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isFunction = function (obj) {
	    return obj && this.typeOf(obj) === 'function'
	}

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isArray = function (obj) {
	    return Array.isArray(obj)
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString
	exports.isPlainObject = function (obj) {
	    return toString.call(obj) === '[object Object]'
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(16)

	/**
	 * Enable debug utilities. The enableDebug() function and
	 * all _.log() & _.warn() calls will be dropped in the
	 * minified production build.
	 */

	enableDebug()

	function enableDebug () {

	    var hasConsole = typeof console !== 'undefined'

	    /**
	     * Log a message.
	     *
	     * @param {String} msg
	     */

	    exports.log = function(msg) {
	        if (hasConsole && config.debug) {
	            console.log('[ZLUX info]: ' + msg)
	        }
	    }

	    /**
	     * We've got a problem here.
	     *
	     * @param {String} msg
	     */

	    exports.warn = function(msg) {
	        if (hasConsole && (!config.silent || config.debug)) {
	            console.warn('[ZLUX warn]: ' + msg)
	                /* istanbul ignore if */
	            if (config.debug) {
	                /* jshint debug: true */
	                debugger
	            }
	        }
	    }

	}

/***/ },
/* 16 */
/***/ function(module, exports) {

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

	    routes_map: {},

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

	}

/***/ }
/******/ ]);