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

	UI.component('zx-files-manager', {

	    boot: function() {

	        if (!window.Vue) {
	            _.warn('Vue not loaded but required by Files Manager');
	            return;
	        }

	        // save component for programatic usage
	        Vue.component('files-manager', __webpack_require__(17));

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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(18)
	module.exports.template = __webpack_require__(27)

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(20);
	    var UI = __webpack_require__(11);
	    var ZX = __webpack_require__(16);
	    var _ = ZX.util;
	    var helper = __webpack_require__(19);

	    module.exports = {

	        props: {
	            routeMap: {
	                type: String,
	                required: true,
	                default: 'filesManager'
	            },
	            extensions: {
	                type: String,
	                default: ''
	            },
	            maxFileSize: {
	                type: String
	            }
	        },

	        data: function() {
	            return {
	                location: '/',
	                cache: {},
	                resources: [],
	                fetching: false,
	                filter: '',

	                // upload
	                uploadProgress: 0,

	                // pagination
	                itemsPerPage: 10,
	                currentPage:  1,
	                offset: 0,
	                count:  0,
	                total:  0
	            };
	        },

	        computed: {

	            notice: function() {
	                return this.notices.length ? this.notices.join('\n') : false;
	            },

	            selected: function () {
	                return this.resources.filter(function (resource) {
	                    return resource.selected;
	                });
	            }

	        },

	        created: function() {

	            this.$watch('filter', function(value, oldValue) {

	                if (oldValue === '') {
	                    // on first time search reset pagination
	                    this.$set('currentPage', 1);
	                }

	                this.cache = {};
	                this.search();
	            });

	            this.$watch('resources', function(value, oldValue) {

	                // reinit gridMargin
	                $('[data-uk-grid-margin]', this.$el).each(function() {
	                    var grid = $(this);

	                    grid.data('gridMargin', null);
	                    grid.data('stackMargin', null);

	                    UI.gridMargin(grid, UI.Utils.options(grid.attr('data-uk-grid-margin')));
	                });

	                // reinit gridMatchHeight
	                $('[data-uk-grid-match]', this.$el).each(function() {
	                    var grid = $(this);

	                    grid.data('gridMatchHeight', null);

	                    UI.gridMatchHeight(grid, UI.Utils.options(grid.attr('data-uk-grid-match')));
	                });

	            });

	        },

	        ready: function () {
	            this.initPlupload();
	        },

	        methods: {

	            changePage: function(page) {
	                this.fetch(null, page);
	            },

	            goTo: function(location) {
	                this.fetch(helper.cleanPath(location));
	            },

	            reload: function(e) {
	                if (e) e.preventDefault();
	                this.cache = {};
	                this.fetch(this.location, this.currentPage);
	            },

	            search: function(e) {
	                if (e) e.preventDefault();
	                this.fetch();
	            },

	            clearSearch: function() {
	                this.$set('filter', '');
	                this.fetch();
	            },

	            setPageData: function(data) {
	                this.$set('location', data.location);
	                this.$set('currentPage', data.page);
	                this.$set('resources', data.resources);
	                this.$set('count', data.count);
	                this.$set('total', data.total);

	                this.cache[data.location + data.page] = data;
	            },

	            createDir: function() {
	                var name = prompt('Choose name'),
	                    path = helper.cleanPath(this.location + '/' + name);

	                if (!name) return;

	                this.$http.get(this.routeMap + '/createDir', {path: path}).done(function(response) {

	                    this.reload();

	                }).always(function(response) {
	                    this.riseWarnings(response);
	                });

	            },

	            renameResource: function() {
	                var resource = this.selected[0],
	                    rpath = helper.cleanPath(this.location + '/' + resource.basename),
	                    name = prompt('Choose new name for ' + resource.basename);

	                if (!name) return;

	                this.$http.get(this.routeMap + '/renameResource', {resource: rpath, new_name: name}).done(function(response) {

	                    this.reload();

	                }).always(function(response) {
	                    this.riseWarnings(response);
	                });

	            },

	            deleteSelected: function() {

	                var resources = this.selected.map(function(resource) {
	                    return helper.cleanPath(this.location + '/' + resource.basename);
	                }, this);

	                this.$http.get(this.routeMap + '/deleteResources', {resources: resources}).done(function(response) {

	                    this.reload();

	                }).always(function(response) {
	                    this.riseWarnings(response);
	                });

	            },

	            fetch: function(location, page) {
	                location = location || this.location;
	                page = page || 1;

	                if (this.cache[location + page]) {
	                    return this.setPageData(this.cache[location + page])
	                }

	                var params = _.merge({
	                    location: location,
	                    limit: this.itemsPerPage,
	                    page: page,
	                    filter: this.filter
	                }, (params || {}));

	                this.$set('fetching', true);

	                this.$http.get(this.routeMap + '/fetchResources', params).done(function(response) {

	                    this.setPageData(response);

	                    // execute callback
	                    if (_.isFunction(this.onLoadPage)) {
	                        this.onLoadPage();
	                    }

	                }).always(function(response) {
	                    this.riseWarnings(response);
	                    this.$set('fetching', false);
	                });

	            },

	            riseWarnings: function (response) {

	                if (response.errors.length) {
	                    UI.notify(response.errors.join('\n'), {pos: 'top-right', status: 'danger'});
	                }

	                if (response.notices.length) {
	                    UI.notify(response.notices.join('\n'), {pos: 'top-right', status: 'warning'});
	                }

	            },

	            initPlupload: function () {
	                var vm = this;

	                var uploader = new plupload.Uploader({
	                    runtimes: 'html5',
	                    browse_button: this.$$.browse,
	                    drop_element: this.$$.dropzone,
	                    max_file_size: this.maxFileSize,
	                    url: _.helper.getFulllRoute(this.routeMap + '/upload'),
	                    headers: {
	                        'X-XSRF-TOKEN': ZX.config.csrf
	                    },
	                    filters: [
	                        {title: 'Files', extensions: this.extensions}
	                    ],
	                    init: {
	                        FileUploaded: function(up, file, response) {
	                            vm.$set('uploadProgress', 0);
	                            vm.riseWarnings(JSON.parse(response.response));
	                        },
	                        FilesAdded: function(up, files) {
	                            up.start();
	                        },
	                        UploadProgress: function(up, file) {
	                            vm.uploadProgress = isNaN(file.percent) ? 0 : file.percent;
	                        },
	                        UploadComplete: function(up, file) {
	                            vm.reload();
	                        },
	                        BeforeUpload: function(up, file) {
	                            up.settings.url += '&location=' + vm.location;
	                        }
	                    }
	                });

	                uploader.init();
	            }
	        },

	        components: {
	            resource: __webpack_require__(21),
	            breadcrumb: __webpack_require__(24)
	        }

	    };

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(16).util;

	// http://phpjs.org/functions/basename
	exports.basename = function(path, suffix) {

	    var b = path;
	    var lastChar = b.charAt(b.length - 1);

	    if (lastChar === '/' || lastChar === '\\') {
	        b = b.slice(0, -1);
	    }

	    b = b.replace(/^.*[\/\\]/g, '');

	    if (_.isString(suffix) && b.substr(b.length - suffix.length) === suffix) {
	        b = b.substr(0, b.length - suffix.length);
	    }

	    return b;
	};

	// cleans the provided path
	exports.cleanPath = function(path) {
	    return path === '/' ? path : path
	        .replace(/\/\/+/g, '/')   // replace double or more slashes
	        .replace(/^\/|\/$/g, ''); // remove / from ends
	}

	// parses the specified size string into a byte value
	exports.parseSize = function(size){

	    if (!_.isString(size) || _.isEmpty(size)) {
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
/* 20 */
/***/ function(module, exports) {

	module.exports = UIkit.$;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(22)
	module.exports.template = __webpack_require__(23)

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var helper = __webpack_require__(19);

	    module.exports = {

	        name: 'resource',

	        data: function() {

	            return {
	                basename: '',
	                content_type: '',
	                size: '',
	                selected: false
	            };

	        },

	        computed: {

	            type: function() {
	                return this.basename.match(/\/$/) ? 'folder' : 'file';
	            },

	            isFolder: function () {
	                return this.type === 'folder';
	            },

	            isFile: function () {
	                return !this.isFolder;
	            },

	            isImage: function () {
	                return this.isFile && this.content_type.match('image');
	            },

	            path: function () {
	                return helper.cleanPath(this.$parent.location + '/' + this.basename);
	            }

	        },

	        filters: {

	            title: function(value) {
	                return value
	                    .replace(/\/$/g, '')     // remove slash
	                    .replace(/(-|_)/g, ' '); // replace dash/underscore
	            },

	            parseSize: function(size) {

	                if ( ! size) {
	                    return size;
	                }

	                return helper.filesize( helper.parseSize(size) );

	            }

	        },

	        methods: {

	            selectItem: function () {
	                this.$set('selected', !this.selected);
	            },

	            goTo: function(e) {
	                e.preventDefault();
	                this.$parent.goTo(this.path);
	            }

	        }

	    }

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<li class=\"zx-files-manager-resource\" draggable=\"true\">\n        <div v-on=\"click: selectItem\" class=\"uk-panel uk-panel-box uk-panel-space uk-text-center\" v-class=\"uk-active: selected\">\n            <span class=\"uk-panel-title\">\n                <i class=\"uk-icon-large uk-icon-justify\" v-class=\"\n                    uk-icon-folder-o: isFolder,\n                    uk-icon-file-image-o: isImage,\n                    uk-icon-file-o: isFile && !isImage\n                \"></i>\n            </span>\n            <div class=\"uk-text-break uk-margin-top\">\n                <i class=\"uk-icon-{{ selected ? 'check-square-o' : 'square-o' }} uk-icon-justify\"></i>\n                <a v-if=\"type == 'folder'\" href=\"#\" v-on=\"click: goTo\">{{ basename | title || '..' }}</a>\n                <template v-if=\"type == 'file'\">{{ basename | title || '..' }}</template>\n            </div>\n        </div>\n    </li>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(25)
	module.exports.template = __webpack_require__(26)

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = {

	        props: ['location', 'goTo'],

	        data: function () {

	            return {
	                active: null
	            };

	        },

	        computed: {

	            crumbs: function() {

	                var crumbs = [], location = '';

	                this.location.replace(/^[\/]|[\/]$/gm, '').split('/').forEach(function(crumb) {

	                    if (crumb === '') {
	                        return true;
	                    }

	                    crumbs.push({
	                        name: crumb,
	                        location: location += '/' + crumb
	                    });

	                });

	                this.$set('active', crumbs.pop());

	                if (crumbs.length > 1) {
	                    crumbs.splice(0, crumbs.length - 1, {
	                        name: '...',
	                        location: null
	                    });
	                }

	                return crumbs;

	            }

	        },

	        methods: {

	            select: function(crumb, location) {
	                crumb.$event.preventDefault();
	                this.goTo(location);
	            }

	        }

	    };

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "<ul class=\"uk-breadcrumb uk-margin\">\n        <li>\n            <a href=\"\" v-if=\"active\" v-on=\"click: select(this, '/')\">{{ 'home' | trans }}</a>\n            <span v-if=\"!active\">{{ 'home' | trans }}</span>\n        </li>\n\n        <template v-repeat=\"crumbs\">\n        <li v-if=\"location\"><a href=\"\" v-on=\"click: select(this, location)\">{{ name }}</a></li>\n        <li v-if=\"!location\"><span>{{ name }}</span></li>\n        </template>\n\n        <li v-if=\"active\" class=\"uk-active\"><span>{{ active.name }}</span></li>\n    </ul>";

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div class=\"zx-files-manager\">\n\n        <div v-if=\"fetching && !resources.length\" class=\"uk-text-center\">\n            <i class=\"uk-icon-spinner uk-icon-spin uk-icon-small\"></i>\n        </div>\n\n        <!-- main nav -->\n        <nav class=\"uk-navbar\" v-el=\"nav\">\n\n            <form class=\"uk-form uk-margin-remove uk-display-inline-block uk-width-1-1\" v-on=\"submit: search\">\n\n                <div class=\"uk-form-icon uk-width-1-1\">\n                    <i v-class=\"filter ? 'uk-icon-times' : 'uk-icon-search'\" v-on=\"click: clearSearch\"></i>\n                    <input v-model=\"filter\" class=\"uk-form-blank uk-width-1-1\" debounce=\"500\" type=\"search\">\n                </div>\n\n            </form>\n\n        </nav>\n\n        <!-- buttons -->\n        <div class=\"uk-margin\">\n            <button v-el=\"browse\" type=\"button\" class=\"uk-button uk-button-small uk-button-primary uk-form-file\">{{ 'Upload' | trans }}</button>\n            <button type=\"button\" v-on=\"click: createDir\" class=\"uk-button uk-button-small\">{{ 'Add Folder' | trans }}</button>\n            <button type=\"button\" v-on=\"click: reload\" class=\"uk-button uk-button-small\">{{ 'Reload' | trans }}</button>\n            <button v-if=\"selected.length\" type=\"button\" v-on=\"click: renameResource\" class=\"uk-button uk-button-small\" v-attr=\"disabled: selected.length > 1\">{{ 'Rename' | trans }}</button>\n            <button v-if=\"selected.length\" type=\"button\" v-on=\"click: deleteSelected\" class=\"uk-button uk-button-small uk-button-danger\">{{ 'Delete' | trans }}</button>\n        </div>\n\n        <!-- breadcrumb -->\n        <breadcrumb location=\"{{ location }}\" go-to=\"{{ goTo }}\"></breadcrumb>\n\n        <!-- resources -->\n        <div class=\"uk-overflow-container\">\n            <ul class=\"uk-grid uk-grid-width-small-1-2 uk-grid-width-medium-1-3 uk-grid-width-xlarge-1-4\" data-uk-grid-margin data-uk-grid-match=\"{target:'.uk-panel'}\">\n                <component is=\"resource\" v-repeat=\"resources\"></component>\n            </ul>\n        </div>\n\n        <!-- drop files -->\n        <div v-if=\"uploadProgress\" class=\"uk-progress\">\n            <div class=\"uk-progress-bar\" v-style=\"width: uploadProgress + '%'\"></div>\n        </div>\n\n        <div v-el=\"dropzone\" class=\"uk-placeholder uk-text-center uk-margin-bottom-remove\">\n            <i class=\"uk-icon-cloud-upload uk-icon-medium uk-text-muted uk-margin-small-right\"></i> {{ 'Drop files here' | trans }}\n        </div>\n\n        <!-- pagination -->\n        <pagination v-if=\"total > itemsPerPage\" items=\"{{ total }}\" current-page=\"{{@ currentPage }}\" items-on-page=\"{{ itemsPerPage }}\" on-select-page=\"{{ changePage }}\"></pagination>\n\n    </div>";

/***/ }
/******/ ]);