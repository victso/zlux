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

	'use strict';

	var UI = __webpack_require__(2);
	var ZX = __webpack_require__(19);
	var $ = __webpack_require__(10);

	var notify = function(msg, options){
	    // display message
	    var notify = UI.notify(msg, options);

	    // add zlux class for the holding content styling
	    notify.element.parent().addClass('zx');

	    return notify;
	},

	confirm = function(msg, options){

	    options = $.extend(options, {
	        timeout: false // confirmation must wait user interaction
	    });

	    return $.Deferred(function( defer )
	    {
	        var notify = ZX.notify(msg + '<div class="uk-text-center uk-margin-top">\
	                <a class="zx-x-confirm uk-margin-right"><i class="uk-icon-check uk-icon-small"></i></a>\
	                <a class="zx-x-cancel uk-margin-left"><i class="uk-icon-times uk-icon-small"></i></a>\
	            </div>',
	        options);

	        notify.element.on('click', '.zx-x-confirm', function(e, b){
	            defer.resolve();
	        });

	        notify.element.on('click', function(e, b){
	            defer.reject();
	        });

	    }).promise();
	},

	closeAll = function(group, instantly){
	    UI.notify.closeAll(group, instantly);
	    return this;
	};

	ZX.notify             = notify;
	ZX.notify.confirm     = confirm;
	ZX.notify.closeAll    = closeAll;


/***/ },

/***/ 2:
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },

/***/ 10:
/***/ function(module, exports) {

	module.exports = UIkit.$;

/***/ },

/***/ 19:
/***/ function(module, exports) {

	module.exports = zlux;

/***/ }

/******/ });