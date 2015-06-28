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

	var UI = __webpack_require__(2);
	var _ = __webpack_require__(5);

	UI.component('zx-items-manager', {

	    boot: function() {

	        if (!window.Vue) {
	            _.warn('Vue not loaded but required by Items Manager');
	            return;
	        }

	        // save component for programatic usage
	        Vue.component('items-manager', __webpack_require__(16));

	    }

	});


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lang = __webpack_require__(6);
	var extend = lang.extend;

	extend(exports, lang);
	extend(exports, __webpack_require__(7));


/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(8);

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
/* 8 */
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
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<div class=\"zx-items-manager\">\n\n        <nav class=\"uk-navbar\" v-el=\"nav\">\n\n            <form class=\"uk-form uk-margin-remove uk-display-inline-block uk-width-1-1\" v-on=\"submit: search\">\n\n                <div class=\"uk-form-icon uk-width-1-1\">\n                    <i v-class=\"nav.search ? 'uk-icon-times' : 'uk-icon-search'\" v-on=\"click: clearSearch\"></i>\n                    <input v-model=\"nav.search\" class=\"uk-form-blank uk-width-1-1\" debounce=\"500\" type=\"search\">\n                </div>\n\n            </form>\n\n        </nav>\n\n        <items v-ref=\"items\"></items>\n\n        <pagination v-if=\"total > itemsPerPage\" items=\"{{ total }}\" items-on-page=\"{{ itemsPerPage }}\" on-select-page=\"{{ changePage }}\"></pagination>\n\n    </div>";
	var _ = __webpack_require__(5);

	    module.exports = {

	        replace: true,

	        props: ['on-select-item', 'on-load-page', 'filters'],

	        data: function() {

	            return {

	                nav: {
	                    search: ''
	                },

	                items       : [],
	                columns     : [],
	                itemsPerPage: 10,
	                currentPage : 1,
	                total       : 0,
	                count       : 0,
	                offset      : 0,
	                orderKey    : '_itemname',
	                reversed    : {},

	                filters: {
	                    name      : '',
	                    apps      : [],
	                    types     : [],
	                    categories: [],
	                    tags      : [],
	                    authors   : []
	                }

	            };

	        },

	        compiled: function() {

	            this.$watch('nav.search', function(value, oldValue) {

	                if (oldValue === '') {

	                    // on first time search reset pagination
	                    this.$set('currentPage', 0);

	                }

	                this.search();

	            });

	            this.$set('currentPage', this.currentPage - 1);

	        },

	        computed: {

	            order: function() {

	                var order = [this.orderKey];

	                if (this.reversed[this.orderKey]) {
	                    order.push('_reversed');
	                }

	                return order;

	            },

	            filter: function() {

	                return _.extend({}, this.filters, {
	                    name: this.nav.search
	                });

	            }

	        },

	        methods: {

	            fetchData: function(params) {

	                params = _.extend({

	                    offset: this.currentPage * this.itemsPerPage,
	                    limit : this.itemsPerPage,
	                    order : this.order,
	                    filter: this.filter

	                }, (params || {}));

	                this.$http.get('/items', params).done(function(response) {

	                    this.columns = response.columns;
	                    this.items = response.items;
	                    this.total = response.total;
	                    this.count = response.count;
	                    this.offset = response.offset;

	                    // execute callback
	                    if (_.isFunction(this.onLoadPage)) {
	                        this.onLoadPage();
	                    }

	                });

	            },

	            sortBy: function (key) {

	                if (key) {

	                    this.reversed[key] = !this.reversed[key];
	                    this.fetchData();

	                }

	            },

	            search: function(e) {

	                if (e) {
	                    e.preventDefault();
	                }

	                this.fetchData();
	                this.searching = false;

	            },

	            clearSearch: function() {

	                this.nav.$set('search', '');
	                this.fetchData();
	                this.searching = false;

	            },

	            changePage: function(index) {

	                this.currentPage = index;
	                this.fetchData();

	            }

	        },

	        components: {

	            items: __webpack_require__(17)

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<table class=\"uk-table\">\n\n        <thead>\n            <tr>\n                <th v-repeat=\"col: columns\">\n\n                    <span v-class=\"zx-sortable: col.orderKey\" v-on=\"click: sortBy(col.orderKey)\">\n\n                        {{ col.name | capitalize }}\n\n                        <i v-show=\"orderKey == col.orderKey\" v-class=\"reversed[col.orderKey] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'\">\n                        </i>\n\n                    </span>\n\n                </th>\n            </tr><tr>\n        </tr></thead>\n\n        <tbody>\n\n            <tr v-component=\"item\" v-repeat=\"items\" track-by=\"id\" on-select=\"{{ onSelectItem }}\" columns=\"{{ columns }}\"></tr>\n\n        </tbody>\n\n    </table>";
	module.exports = {

	        inherit: true,
	        replace: true,

	        components: {

	            item: __webpack_require__(18)

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<tr v-on=\"click: selectItem\" v-class=\"uk-active: active\">\n\n        <td v-repeat=\"col: columns\">\n\n            {{ $key | property }}\n\n        </td>\n\n    </tr>";
	var _ = __webpack_require__(5);

	    module.exports = {

	        replace: true,

	        props: ['on-select', 'columns'],

	        data: function() {

	            return {
	                id     : '',
	                name   : '',
	                type   : '',
	                access : '',
	                active : -1,
	                created: '',

	                application: {
	                    id  : '',
	                    name: ''
	                },
	                author: {
	                    id  : '',
	                    name: ''
	                }
	            };

	        },

	        filters: {

	            property: function(key) {

	                return this.$parent.$data[key];

	            }

	        },

	        methods: {

	            selectItem: function() {

	                if (_.isFunction(this.onSelect)) {
	                    this.onSelect(this);
	                }

	            }

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ }
/******/ ]);