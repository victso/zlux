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

	var Vue = __webpack_require__(1);
	var UI  = __webpack_require__(2);

	UI.component('zx-manager-files', {

	    boot: function() {

	        // auto init
	        UI.ready(function(context) {

	            UI.$('[data-zx-manager-files]', context).each(function(){

	                if ( ! this.__vue__) {

	                    new Vue(__webpack_require__(5)).$mount(this);

	                }

	            });

	        });
	        
	    }

	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Vue;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<nav class=\"uk-navbar\">\n        <ul class=\"uk-navbar-nav\">\n\n            <li class=\"uk-parent uk-active\" v-repeat=\"item: nav\">\n\n                <a href=\"#\" v-on=\"click: this.changeView(item.view)\"> {{ item.title }}</a>\n\n            </li>\n\n        </ul>\n    </nav>\n\n    <component is=\"{{ currentView }}\"></component>";
	var UI = __webpack_require__(2);

	    module.exports = {

	        data:  {

	            currentView: 'files',

	            nav: [
	                {title: 'Files', view: 'files'},
	                {title: 'Uploader', view: 'uploader'}
	            ]

	        },

	        ready: function() {

	            UI.$('a[href="#"]', this.$el).on('click', function(e) {

	                e.preventDefault();

	            });

	        },

	        methods: {

	            changeView: function(view) {

	                this.currentView = view;

	            }

	        },

	        components: {

	            files: __webpack_require__(6),
	            uploader: __webpack_require__(10)

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<div v-if=\"files.length\">\n\n        <breadcrumb path=\"{{ root }}\"></breadcrumb>\n\n        <file v-repeat=\"files\"></file><table class=\"uk-table\">\n            <thead>\n                <tr>\n                    <th>File</th>\n                    <th>Size</th>\n                </tr>\n            </thead>\n            <tbody>\n                \n            </tbody>\n        </table>\n\n    </div>";
	module.exports = {

	        inherit: true,

	        data: function() {

	            return {

	                root: '',
	                files: [],
	                cache: {}

	            }

	        },

	        created: function() {

	            if (!this.$http) {
	                console.warn('vue-resource plugin not loaded');
	                return;
	            }

	            this.fetchData('root');

	        },

	        methods: {

	            goTo: function(path) {

	                this.fetchData(path);

	            },

	            fetchData: function(path) {

	                if (this.cache[path]) {

	                    this.root  = path;
	                    this.files = this.cache[path];
	                    return;

	                }

	                this.$http.get('/files', {path:path}, function(response) {

	                    this.root  = response.root;
	                    this.files = response.data;
	                    this.cache[path] = response;

	                }).error(function(e) {

	                    console.log(e);

	                });

	            }

	        },

	        components: {

	            file: __webpack_require__(7),
	            breadcrumb: __webpack_require__(9)

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_template__ = "<tr>\n\n        <td v-set-type=\"{{ type }}\">\n\n            <a href=\"#\" v-on=\"click: $parent.goTo(path)\">{{ path | basename }}</a>\n\n        </td>\n\n        <td>\n\n            {{ size | parseSize }}\n\n        </td>\n\n    </tr>";
	var helper = __webpack_require__(8);

	    module.exports = {

	        data: function() {

	            return {

	                type: '',
	                path: '',
	                size: null

	            }

	        },

	        created: function() {

	            // set object type
	            this.type = this.path.match(/\/$/) ? 'folder' : 'file';

	        },

	        filters: {

	            basename: function(path) {

	                return helper.basename(path)

	                    // remove extension
	                    .replace(/(\.\w+$)/g, '')

	                    // remove dash/underscore
	                    .replace(/(-|_)/g, ' ')

	            },

	            parseSize: function(size) {

	                if ( ! size) return size;

	                return helper.filesize( helper.parseSize(size) );

	            }

	        },

	        directives: {

	            'set-type': {

	                isLiteral: true,

	                bind: function () {

	                    if (this.expression == 'file') {

	                        $(this.el).find('a').remove();
	                        $(this.el).append(this.vm.$options.filters.basename(this.vm.path));

	                    }

	                }

	            }

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 8 */
/***/ function(module, exports) {

	
	// http://phpjs.org/functions/basename
	exports.basename = function(path, suffix) {

	    var b = path;
	    var lastChar = b.charAt(b.length - 1);

	    if (lastChar === '/' || lastChar === '\\') {
	        b = b.slice(0, -1);
	    }

	    b = b.replace(/^.*[\/\\]/g, '');

	    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
	        b = b.substr(0, b.length - suffix.length);
	    }

	    return b;
	}

	// parses the specified size string into a byte value
	exports.parseSize = function(size){

	    if (typeof(size) !== 'string' || size === '') return size;

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
	}

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
	        bits: ["B", "kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
	        bytes: ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
	    };

	    var descriptor = arguments[1] === undefined ? {} : arguments[1];

	    var result = [];
	    var skip = false;
	    var val = 0;
	    var e = undefined,
	        base = undefined,
	        bits = undefined,
	        ceil = undefined,
	        neg = undefined,
	        num = undefined,
	        output = undefined,
	        round = undefined,
	        unix = undefined,
	        spacer = undefined,
	        suffixes = undefined;

	    if (isNaN(arg)) {
	        throw new Error("Invalid arguments");
	    }

	    bits = descriptor.bits === true;
	    unix = descriptor.unix === true;
	    base = descriptor.base !== undefined ? descriptor.base : 2;
	    round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
	    spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
	    suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
	    output = descriptor.output !== undefined ? descriptor.output : "string";
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
	            result[1] = "";
	        } else {
	            result[1] = "B";
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
	        result[1] = si[bits ? "bits" : "bytes"][e];

	        if (!skip && unix) {
	            if (bits && bit.test(result[1])) {
	                result[1] = result[1].toLowerCase();
	            }

	            result[1] = result[1].charAt(0);

	            if (result[1] === "B") {
	                result[0] = Math.floor(result[0]);
	                result[1] = "";
	            } else if (!bits && result[1] === "k") {
	                result[1] = "K";
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
	    if (output === "array") {
	        return result;
	    }

	    if (output === "exponent") {
	        return e;
	    }

	    if (output === "object") {
	        return { value: result[0], suffix: result[1] };
	    }

	    return result.join(spacer);
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	var __vue_template__ = "<ul class=\"uk-breadcrumb\">\n\n        <li v-repeat=\"crumbs\" v-ifactive=\"{{ path == $parent.path }}\">\n\n            <a href=\"#\" v-on=\"click: $parent.$parent.goTo(path)\">{{ name }}</a>\n\n        </li>\n\n    </ul>";
	module.exports = {

	        paramAttributes: ['path'],

	        data: function() {

	            return {

	                path: ''

	            }

	        },

	        computed: {

	            crumbs: function() {

	                var parts = this.path.replace(/^[\/]|[\/]$/gm, ''), crumbs = [];

	                if (parts.length > 1) {

	                    var path = '/';

	                    parts.split('/').forEach(function(part) {

	                        crumbs.push({
	                            'name': part,
	                            'path': path += part + '/'
	                        });

	                    });

	                }

	                crumbs.unshift({
	                    'name': 'root',
	                    'path': '/'
	                });

	                return crumbs;

	            }
	        },

	        directives: {

	            'ifactive': {

	                isLiteral: true,

	                update: function () {

	                    if (this.expression === true) {

	                        $(this.el).addClass('uk-active').find('a').remove();
	                        $(this.el).append($('<span />').html(this.vm.name));

	                    }

	                }

	            }

	        }

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ },
/* 10 */
/***/ function(module, exports) {

	var __vue_template__ = "this is the uploader\n    <div class=\"uk-placeholder-large\">...</div>";
	module.exports = {

	        

	    };
	;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;


/***/ }
/******/ ]);