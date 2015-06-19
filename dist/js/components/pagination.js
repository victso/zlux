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

	var _  = __webpack_require__(13)
	var UI = __webpack_require__(2)

	var vueZlux = {

	    install: function (Vue) {

	        Vue.component('zx-pagination', __webpack_require__(17))

	    }

	}

	if (window.Vue) Vue.use(vueZlux)

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
/* 11 */,
/* 12 */,
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

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<ul class=\"uk-pagination\">\n        <page v-repeat=\"getPages()\" on-select-page=\"{{ selectPage }}\"></page>\n    </ul>";
	var UI = __webpack_require__(2);

	    module.exports = {

	        replace: true,

	        props: ['items', 'items-on-page', 'on-select-page'],

	        data:  function() {

	            return {
	                items          : 1,
	                itemsOnPage    : 1,
	                currentPage    : 1,
	                displayedPages : 3,
	                edges          : 3,
	                lblPrev        : 'uk-icon-angle-double-left',
	                lblNext        : 'uk-icon-angle-double-right'
	            }

	        },

	        computed: {

	            totalPages: function() {

	                return Math.ceil(this.items / this.itemsOnPage) ? Math.ceil(this.items / this.itemsOnPage) : 1

	            }

	        },

	        created: function() {

	            this.$set('currentPage', this.currentPage - 1)

	            this.$watch('items', function() {

	                // if totalPages changes update currentPage
	                if ((this.currentPage + 1) > this.totalPages){

	                    this.$set('currentPage', this.totalPages - 1)

	                }

	            })

	        },

	        compiled: function() {

	            UI.$('a[href="#"]', this.$el).on('click', function(e) {
	                e.preventDefault();
	            })

	        },

	        methods: {

	            selectPage: function(index) {

	                this.$set('currentPage', index)

	                this.onSelectPage(index)

	            },

	            getInterval: function() {

	                var pages = this.totalPages, halfDisplayed = this.displayedPages / 2

	                return {
	                    start: Math.ceil(this.currentPage > halfDisplayed ? Math.max(Math.min(this.currentPage - halfDisplayed, (pages - this.displayedPages)), 0) : 0),

	                    end: Math.ceil(this.currentPage > halfDisplayed ? Math.min(this.currentPage + halfDisplayed, pages) : Math.min(this.displayedPages, pages))

	                }

	            },

	            getPages: function() {

	                var pages = [], totalPages = this.totalPages, interval = this.getInterval(), i

	                // Generate Prev link
	                if (this.lblPrev) {
	                    pages.push({index: this.currentPage - 1, icon: this.lblPrev})
	                }

	                if (interval.start > 0 && this.edges > 0) {

	                    var end = Math.min(this.edges, interval.start)

	                    for (i = 0; i < end; i++) {
	                        pages.push({index: i})
	                    }

	                    if (this.edges < interval.start && (interval.start - this.edges != 1)) {
	                        pages.push({text: '...'})
	                    } else if (interval.start - this.edges == 1) {
	                        pages.push({index: this.edges})
	                    }

	                }

	                for (i = interval.start; i < interval.end; i++) {
	                    pages.push({index: i})
	                }

	                if (interval.end < totalPages && this.edges > 0) {

	                    if (totalPages - this.edges > interval.end && (totalPages - this.edges - interval.end != 1)) {
	                        pages.push({text: '...'})
	                    } else if (totalPages - this.edges - interval.end == 1) {
	                        pages.push({index: interval.end++})
	                    }

	                    var begin = Math.max(totalPages - this.edges, interval.end);

	                    for (i = begin; i < totalPages; i++) {
	                        pages.push({index: i})
	                    }

	                }

	                // Generate Next link (unless option is set for at front)
	                if (this.lblNext) {
	                    pages.push({index: this.currentPage + 1, icon: this.lblNext})
	                }

	                return pages

	            }

	        },

	        components: {

	            'page': __webpack_require__(18)

	        }

	    }
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 18 */
/***/ function(module, exports) {

	var __vue_template__ = "<li v-class=\"uk-active: isCurrent\">\n\n        <span v-if=\"isCurrent || index === null\">\n            <i v-if=\"icon\" v-class=\"icon\"></i>{{ content }}\n        </span>\n\n        <a href=\"{{ href }}\" v-if=\"!isCurrent &amp;&amp; href\" v-on=\"click: onSelectPage(index)\">\n            <i v-if=\"icon\" v-class=\"icon\"></i>{{ content }}\n        </a>\n\n    </li>";
	module.exports = {

	        replace: true,
	        inherit: true,
	        props: ['on-select-page'],

	        data: function() {

	            return {
	                index: null,
	                text: '',
	                icon: ''
	            }

	        },

	        computed: {

	            isCurrent: function() {

	                return this.index == this.currentPage

	            },

	            page: function() {

	                return this.index + 1

	            },

	            content: function() {

	                return this.icon ? '' : (this.text || this.page)

	            },

	            href: function() {

	                return this.index !== null ? '#page-' + this.page : ''
	            }

	        },

	        created: function() {

	            this.$set('index', this.index < 0 ? 0 : (this.index < this.totalPages ? this.index : this.totalPages - 1))

	        }

	    }
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ }
/******/ ]);