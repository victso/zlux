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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var vueZlux = {

	    install: function (Vue) {

	        Vue.component('pagination', __webpack_require__(40));

	    }

	};

	if (window.Vue) {
	    Vue.use(vueZlux);
	}


/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(41)
	module.exports.template = __webpack_require__(45)

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	        props: {
	            'currentPage': {
	                type: Number,
	                default: 1
	            },
	            'items': {
	                type: Number,
	                required: true
	            },
	            'itemsOnPage': {
	                type: Number,
	                required: true
	            },
	            'onSelectPage': {
	                type: Function
	            }
	        },

	        data: function() {

	            return {
	                items: 1,
	                itemsOnPage: 1,
	                displayedPages: 3,
	                edges: 3,
	                lblPrev: 'uk-icon-angle-double-left',
	                lblNext: 'uk-icon-angle-double-right'
	            };

	        },

	        computed: {

	            totalPages: function() {

	                return Math.ceil(this.items / this.itemsOnPage)
	                    ? Math.ceil(this.items / this.itemsOnPage)
	                    : 1;

	            },

	            currentIndex: function() {
	                return this.currentPage - 1;
	            }

	        },

	        methods: {

	            selectPage: function(page) {
	                // execute callback
	                if (this.onSelectPage) {
	                    this.onSelectPage(page);
	                }
	            },

	            getInterval: function() {

	                var pages = this.totalPages, halfDisplayed = this.displayedPages / 2;

	                return {
	                    start: Math.ceil(this.currentIndex > halfDisplayed
	                        ? Math.max(Math.min(this.currentIndex - halfDisplayed, (pages - this.displayedPages)), 0)
	                        : 0),

	                    end: Math.ceil(this.currentIndex > halfDisplayed
	                        ? Math.min(this.currentIndex + halfDisplayed, pages)
	                        : Math.min(this.displayedPages, pages))

	                };

	            },

	            getPages: function() {

	                var pages = [], totalPages = this.totalPages, interval = this.getInterval(), i;

	                if (this.lblPrev) {
	                    pages.push({index: this.currentIndex - 1, icon: this.lblPrev});
	                }

	                if (interval.start > 0 && this.edges > 0) {

	                    var end = Math.min(this.edges, interval.start);

	                    for (i = 0; i < end; i++) {
	                        pages.push({index: i});
	                    }

	                    if (this.edges < interval.start && (interval.start - this.edges != 1)) {
	                        pages.push({text: '...'});
	                    } else if (interval.start - this.edges == 1) {
	                        pages.push({index: this.edges});
	                    }

	                }

	                for (i = interval.start; i < interval.end; i++) {
	                    pages.push({index: i});
	                }

	                if (interval.end < totalPages && this.edges > 0) {

	                    if (totalPages - this.edges > interval.end && (totalPages - this.edges - interval.end != 1)) {
	                        pages.push({text: '...'});
	                    } else if (totalPages - this.edges - interval.end == 1) {
	                        pages.push({index: interval.end++});
	                    }

	                    var begin = Math.max(totalPages - this.edges, interval.end);

	                    for (i = begin; i < totalPages; i++) {
	                        pages.push({index: i});
	                    }

	                }

	                if (this.lblNext) {
	                    pages.push({index: this.currentIndex + 1, icon: this.lblNext});
	                }

	                return pages;

	            }

	        },

	        components: {
	            'page': __webpack_require__(42)
	        }

	    }

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(43)
	module.exports.template = __webpack_require__(44)

/***/ },

/***/ 43:
/***/ function(module, exports) {

	module.exports = {

	        inherit: true,

	        data: function() {

	            return {
	                index: null,
	                text:  '',
	                icon:  ''
	            };

	        },

	        computed: {

	            isCurrent: function() {
	                return this.index === this.currentIndex;
	            },

	            page: function() {
	                return this.index + 1;
	            },

	            content: function() {
	                return this.icon ? '' : (this.text || this.page);
	            },

	            href: function() {
	                return this.index !== null ? '#page-' + this.page : '';
	            }

	        },

	        created: function() {
	            this.$set('index', this.index < 0 ? 0 : (this.index < this.totalPages ? this.index : this.totalPages - 1));
	        },

	        methods: {

	            select: function(e) {
	                e.preventDefault();
	                this.selectPage(this.page);
	            }

	        }

	    };

/***/ },

/***/ 44:
/***/ function(module, exports) {

	module.exports = "<li v-class=\"uk-active: isCurrent\">\n\n        <span v-if=\"isCurrent || index === null\">\n            <i v-if=\"icon\" v-class=\"icon\"></i>{{ content }}\n        </span>\n\n        <a href=\"#\" v-if=\"!isCurrent && index !== null\" v-on=\"click: select\">\n            <i v-if=\"icon\" v-class=\"icon\"></i>{{ content }}\n        </a>\n\n    </li>";

/***/ },

/***/ 45:
/***/ function(module, exports) {

	module.exports = "<ul class=\"uk-pagination\">\n        <page v-repeat=\"getPages()\"></page>\n    </ul>";

/***/ }

/******/ });