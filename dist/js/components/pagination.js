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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var vueZlux = {

	    install: function (Vue) {

	        Vue.component('zx-pagination', __webpack_require__(17))

	    }

	}

	if (window.Vue) Vue.use(vueZlux)

/***/ },

/***/ 2:
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },

/***/ 17:
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

/***/ 18:
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

/******/ });