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

	var Vue = __webpack_require__(2);
	var UI  = __webpack_require__(3);

	UI.component('zx-manager-items', {

	    boot: function() {

	        // auto init
	        UI.ready(function(context) {

	            UI.$('[data-zx-manager-items]', context).each(function(){

	                if ( ! this.__vue__) {

	                    new Vue(__webpack_require__(5)).$mount(this);

	                }

	            });

	        });
	        
	    }

	});


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = UIkit;

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<nav class=\"uk-navbar\">\n        <ul class=\"uk-navbar-nav\">\n\n            <li class=\"uk-parent uk-active\" v-repeat=\"item: nav\">\n                <a href=\"#\"> {{ item.title }}</a>\n            </li>\n\n        </ul>\n    </nav>\n\n    <div v-component=\"items\"></div>";
	var UI = __webpack_require__(3);

	    module.exports = {

	        data:  {

	            nav: [
	                {title: 'Filter'}
	            ]

	        },

	        ready: function() {

	            UI.$('a[href="#"]', this.$el).on('click', function(e) {

	                e.preventDefault();

	            });

	        },

	        methods: {

	        },

	        components: {

	            items: __webpack_require__(9),

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<table class=\"uk-table\">\n        <thead>\n            <tr>\n                <th>Name</th>\n                <th>Type</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr v-repeat=\"item: items\">\n                <td>\n                    {{ item.name }}\n                </td>\n\n                <td>\n                    {{ item.type.name }}\n                </td>\n            </tr>\n        </tbody>\n    </table>\n\n    <ul class=\"uk-pagination\">\n        <li><a href=\"\">...</a></li>\n        <li class=\"uk-active\"><span>...</span></li>\n        <li class=\"uk-disabled\"><span>...</span></li>\n        <li><span>...</span></li>\n    </ul>";
	module.exports = {

	        inherit: true,

	        data: function() {

	            return {
	                
	                items: []
	                
	            }

	        },

	        created: function() {

	            this.fetchData('root');

	        },

	        methods: {

	            fetchData: function(path) {

	                this.$http.get('/items', {path:path}, function(response) {

	                    this.items = response.data;

	                }).error(function(e) {

	                    console.log(e);

	                });

	            }

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ }
/******/ ]);