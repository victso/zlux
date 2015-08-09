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

	var UI = __webpack_require__(11);
	var _ = __webpack_require__(16).util;

	UI.component('zx-items-manager', {

	    boot: function() {

	        if (!window.Vue) {
	            _.warn('Vue not loaded but required by Items Manager');
	            return;
	        }

	        // save component for programatic usage
	        Vue.component('items-manager', __webpack_require__(28));

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
/* 11 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports) {

	module.exports = Zlux;

/***/ },
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(29)
	module.exports.template = __webpack_require__(36)

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(16).util;

	    module.exports = {

	        props: {
	            'onSelectItem': {
	                type: Function
	            },
	            'onLoadPage': {
	                type: Function
	            },
	            'filters': {
	                type: Object
	            }
	        },

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
	                    this.$set('currentPage', 1);
	                }

	                this.search();
	            });

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
	                return _.merge({}, this.filters, {
	                    name: this.nav.search
	                });
	            }

	        },

	        methods: {

	            fetch: function(params) {

	                params = _.merge({
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
	                    this.fetch();

	                }
	            },

	            search: function(e) {

	                if (e) {
	                    e.preventDefault();
	                }

	                this.fetch();
	                this.searching = false;
	            },

	            clearSearch: function() {
	                this.nav.$set('search', '');
	                this.fetch();
	                this.searching = false;
	            },

	            changePage: function(index) {
	                this.currentPage = index;
	                this.fetch();
	            },

	            itemSelected: function(item) {
	                if (_.isFunction(this.onSelectItem)) {
	                    this.onSelectItem(item);
	                }
	            }

	        },

	        components: {
	            items: __webpack_require__(30)
	        }

	    };

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31)
	module.exports.template = __webpack_require__(35)

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	        inherit: true,
	        components: {
	            item: __webpack_require__(32)
	        }

	    };

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(33)
	module.exports.template = __webpack_require__(34)

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {

	        props: {
	            'onSelect': {
	                type: Function
	            },
	            'columns': {
	                type: Array,
	                required: true
	            }
	        },

	        data: function() {

	            return {
	                id     : '',
	                name   : '',
	                type   : '',
	                access : '',
	                active : false,
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
	                if (this.onSelect) {
	                    this.onSelect(this);
	                }
	            }

	        }

	    };

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = "<tr v-on=\"click: selectItem\" v-class=\"uk-active: active\">\n\n        <td v-repeat=\"col: columns\">\n            {{ col.name | property }}\n        </td>\n\n    </tr>";

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "<table class=\"uk-table\">\n        <thead>\n            <tr>\n                <th v-repeat=\"col: columns\">\n\n                    <span v-class=\"zx-sortable: col.orderKey\" v-on=\"click: sortBy(col.orderKey)\">\n\n                        {{ col.title | capitalize }}\n\n                        <i v-show=\"orderKey == col.orderKey\"\n                            v-class=\"reversed[col.orderKey] ? 'uk-icon-caret-up' : 'uk-icon-caret-down'\">\n                        </i>\n\n                    </span>\n\n                </th>\n            <tr>\n        </thead>\n        <tbody>\n\n            <tr v-component=\"item\" v-repeat=\"items\" on-select=\"{{ itemSelected }}\" columns=\"{{ columns }}\"></tr>\n\n        </tbody>\n    </table>";

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "<div class=\"zx-items-manager\">\n\n        <nav class=\"uk-navbar\" v-el=\"nav\">\n\n            <form class=\"uk-form uk-margin-remove uk-display-inline-block uk-width-1-1\" v-on=\"submit: search\">\n\n                <div class=\"uk-form-icon uk-width-1-1\">\n                    <i v-class=\"nav.search ? 'uk-icon-times' : 'uk-icon-search'\" v-on=\"click: clearSearch\"></i>\n                    <input v-model=\"nav.search\" class=\"uk-form-blank uk-width-1-1\" debounce=\"500\" type=\"search\">\n                </div>\n\n            </form>\n\n        </nav>\n\n        <items v-ref=\"items\"></items>\n\n        <pagination v-if=\"total > itemsPerPage\" items=\"{{ total }}\" current-page=\"{{@ currentPage }}\" items-on-page=\"{{ itemsPerPage }}\" on-select-page=\"{{ changePage }}\"></pagination>\n\n    </div>";

/***/ }
/******/ ]);