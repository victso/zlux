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

	var UI = __webpack_require__(74);
	var _ = __webpack_require__(2);
	var assign = _.assign;

	if (!UI) {
	    throw new Error('UIkit library is missing');
	}

	var $ = UI.$;

	var ZX = {
	    version: '2.1.0',
	    config: __webpack_require__(41)
	};

	UI.ready(function() {

	    // style workaround, wrapp dragging elements with zx class
	    $('body').on('start.uk.nestable, start.uk.sortable', function() {
	        UI.$('.uk-nestable-list-dragged, .uk-sortable-dragged').wrap('<div class="zx" />');
	    });

	    // extend config
	    _.merge(ZX.config, window.$zlux.config);

	});

	assign(ZX, __webpack_require__(75));
	assign(ZX, __webpack_require__(76));
	assign(ZX, __webpack_require__(1));

	ZX.http = __webpack_require__(77)(ZX);

	__webpack_require__(79)(ZX);
	__webpack_require__(80)(ZX);
	__webpack_require__(81);

	UI.$.fn.zx = ZX.fn;

	window.Zlux = UI.$zlux = _.zlux = ZX;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);
	var UI = __webpack_require__(74);
	var ZX = _.zlux;

	exports.modal = {

	    dialog: function(content, options){

	        var modal = UI.$.UIkit.modal.dialog(content, options);

	        // extend modal with
	        UI.$.extend(modal, {

	            // update content
	            content: function(html) {
	                var container = this.dialog;

	                if(!html) {
	                    return container.html();
	                }

	                container.html(html);

	                return this;
	            }
	        });

	        // add zlux class for the holding content styling
	        modal.element.addClass('zx');

	        return modal;
	    },

	    alert: function(content, options){

	        var modal = UI.$.UIkit.modal.dialog(([
	            '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
	            '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary uk-modal-close">' + ZX.lang.get('Ok') + '</button></div>'
	        ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

	        modal.show();

	        return modal;
	    },

	    confirm: function(content, onconfirm, options){

	        onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};

	        var modal = UI.$.UIkit.modal.dialog(([
	           '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
	           '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary js-modal-confirm">' + ZX.lang.get('Ok') + '</button> <button class="uk-button uk-button-small uk-modal-close">' + ZX.lang.get('Cancel') + '</button></div>'
	       ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

	        modal.element.find('.js-modal-confirm').on('click', function(){
	           onconfirm();
	           modal.hide();
	        });

	        modal.show();

	        return modal;
	    }

	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var object = __webpack_require__(3);
	var assign = object.assign;

	assign(exports, object);
	assign(exports, __webpack_require__(40));
	assign(exports, __webpack_require__(42));
	assign(exports, __webpack_require__(46));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    assign: __webpack_require__(4),
	    merge: __webpack_require__(28)
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assignWith = __webpack_require__(5),
	    baseAssign = __webpack_require__(21),
	    createAssigner = __webpack_require__(23);

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it's invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});

	module.exports = assign;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(6);

	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var index = -1,
	      props = keys(source),
	      length = props.length;

	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);

	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}

	module.exports = assignWith;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getNative = __webpack_require__(7),
	    isArrayLike = __webpack_require__(12),
	    isObject = __webpack_require__(10),
	    shimKeys = __webpack_require__(16);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isNative = __webpack_require__(8);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(9),
	    isObjectLike = __webpack_require__(11);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(10);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getLength = __webpack_require__(13),
	    isLength = __webpack_require__(15);

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	module.exports = isArrayLike;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseProperty = __webpack_require__(14);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(17),
	    isArray = __webpack_require__(18),
	    isIndex = __webpack_require__(19),
	    isLength = __webpack_require__(15),
	    keysIn = __webpack_require__(20);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArrayLike = __webpack_require__(12),
	    isObjectLike = __webpack_require__(11);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}

	module.exports = isArguments;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getNative = __webpack_require__(7),
	    isLength = __webpack_require__(15),
	    isObjectLike = __webpack_require__(11);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(17),
	    isArray = __webpack_require__(18),
	    isIndex = __webpack_require__(19),
	    isLength = __webpack_require__(15),
	    isObject = __webpack_require__(10);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseCopy = __webpack_require__(22),
	    keys = __webpack_require__(6);

	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, keys(source), object);
	}

	module.exports = baseAssign;


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}

	module.exports = baseCopy;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bindCallback = __webpack_require__(24),
	    isIterateeCall = __webpack_require__(26),
	    restParam = __webpack_require__(27);

	/**
	 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 ? sources[length - 2] : undefined,
	        guard = length > 2 ? sources[2] : undefined,
	        thisArg = length > 1 ? sources[length - 1] : undefined;

	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : undefined;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}

	module.exports = createAssigner;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var identity = __webpack_require__(25);

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	module.exports = bindCallback;


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArrayLike = __webpack_require__(12),
	    isIndex = __webpack_require__(19),
	    isObject = __webpack_require__(10);

	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}

	module.exports = isIterateeCall;


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);

	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}

	module.exports = restParam;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseMerge = __webpack_require__(29),
	    createAssigner = __webpack_require__(23);

	/**
	 * Recursively merges own enumerable properties of the source object(s), that
	 * don't resolve to `undefined` into the destination object. Subsequent sources
	 * overwrite property assignments of previous sources. If `customizer` is
	 * provided it's invoked to produce the merged values of the destination and
	 * source properties. If `customizer` returns `undefined` merging is handled
	 * by the method instead. The `customizer` is bound to `thisArg` and invoked
	 * with five arguments: (objectValue, sourceValue, key, object, source).
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var users = {
	 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	 * };
	 *
	 * var ages = {
	 *   'data': [{ 'age': 36 }, { 'age': 40 }]
	 * };
	 *
	 * _.merge(users, ages);
	 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	 *
	 * // using a customizer callback
	 * var object = {
	 *   'fruits': ['apple'],
	 *   'vegetables': ['beet']
	 * };
	 *
	 * var other = {
	 *   'fruits': ['banana'],
	 *   'vegetables': ['carrot']
	 * };
	 *
	 * _.merge(object, other, function(a, b) {
	 *   if (_.isArray(a)) {
	 *     return a.concat(b);
	 *   }
	 * });
	 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	 */
	var merge = createAssigner(baseMerge);

	module.exports = merge;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayEach = __webpack_require__(30),
	    baseMergeDeep = __webpack_require__(31),
	    isArray = __webpack_require__(18),
	    isArrayLike = __webpack_require__(12),
	    isObject = __webpack_require__(10),
	    isObjectLike = __webpack_require__(11),
	    isTypedArray = __webpack_require__(38),
	    keys = __webpack_require__(6);

	/**
	 * The base implementation of `_.merge` without support for argument juggling,
	 * multiple sources, and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates values with source counterparts.
	 * @returns {Object} Returns `object`.
	 */
	function baseMerge(object, source, customizer, stackA, stackB) {
	  if (!isObject(object)) {
	    return object;
	  }
	  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
	      props = isSrcArr ? undefined : keys(source);

	  arrayEach(props || source, function(srcValue, key) {
	    if (props) {
	      key = srcValue;
	      srcValue = source[key];
	    }
	    if (isObjectLike(srcValue)) {
	      stackA || (stackA = []);
	      stackB || (stackB = []);
	      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
	    }
	    else {
	      var value = object[key],
	          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	          isCommon = result === undefined;

	      if (isCommon) {
	        result = srcValue;
	      }
	      if ((result !== undefined || (isSrcArr && !(key in object))) &&
	          (isCommon || (result === result ? (result !== value) : (value === value)))) {
	        object[key] = result;
	      }
	    }
	  });
	  return object;
	}

	module.exports = baseMerge;


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A specialized version of `_.forEach` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayCopy = __webpack_require__(32),
	    isArguments = __webpack_require__(17),
	    isArray = __webpack_require__(18),
	    isArrayLike = __webpack_require__(12),
	    isPlainObject = __webpack_require__(33),
	    isTypedArray = __webpack_require__(38),
	    toPlainObject = __webpack_require__(39);

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates values with source counterparts.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
	  var length = stackA.length,
	      srcValue = source[key];

	  while (length--) {
	    if (stackA[length] == srcValue) {
	      object[key] = stackB[length];
	      return;
	    }
	  }
	  var value = object[key],
	      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	      isCommon = result === undefined;

	  if (isCommon) {
	    result = srcValue;
	    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
	      result = isArray(value)
	        ? value
	        : (isArrayLike(value) ? arrayCopy(value) : []);
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      result = isArguments(value)
	        ? toPlainObject(value)
	        : (isPlainObject(value) ? value : {});
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  // Add the source value to the stack of traversed objects and associate
	  // it with its merged value.
	  stackA.push(srcValue);
	  stackB.push(result);

	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
	  } else if (result === result ? (result !== value) : (value === value)) {
	    object[key] = result;
	  }
	}

	module.exports = baseMergeDeep;


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function arrayCopy(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	module.exports = arrayCopy;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseForIn = __webpack_require__(34),
	    isArguments = __webpack_require__(17),
	    isObjectLike = __webpack_require__(11);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  var Ctor;

	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}

	module.exports = isPlainObject;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseFor = __webpack_require__(35),
	    keysIn = __webpack_require__(20);

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createBaseFor = __webpack_require__(36);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toObject = __webpack_require__(37);

	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(10);

	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isLength = __webpack_require__(15),
	    isObjectLike = __webpack_require__(11);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseCopy = __webpack_require__(22),
	    keysIn = __webpack_require__(20);

	/**
	 * Converts `value` to a plain object flattening inherited enumerable
	 * properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return baseCopy(value, keysIn(value));
	}

	module.exports = toPlainObject;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(41);
	var _ = __webpack_require__(42);

	/**
	 * Enable debug utilities. The enableDebug() function and
	 * all _.log() & _.warn() calls will be dropped in the
	 * minified production build.
	 */

	/* eslint-disable no-console */

	function enableDebug () {

	    var hasConsole = !_.isUndefined(console);

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
/* 41 */
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    isFunction: __webpack_require__(9),
	    isUndefined: __webpack_require__(43),
	    isString: __webpack_require__(44),
	    isEmpty: __webpack_require__(45)
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 */
	function isUndefined(value) {
	  return value === undefined;
	}

	module.exports = isUndefined;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObjectLike = __webpack_require__(11);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	}

	module.exports = isString;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(17),
	    isArray = __webpack_require__(18),
	    isArrayLike = __webpack_require__(12),
	    isFunction = __webpack_require__(9),
	    isObjectLike = __webpack_require__(11),
	    isString = __webpack_require__(44),
	    keys = __webpack_require__(6);

	/**
	 * Checks if `value` is empty. A value is considered empty unless it's an
	 * `arguments` object, array, string, or jQuery-like collection with a length
	 * greater than `0` or an object with own enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {Array|Object|string} value The value to inspect.
	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 */
	function isEmpty(value) {
	  if (value == null) {
	    return true;
	  }
	  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
	      (isObjectLike(value) && isFunction(value.splice)))) {
	    return !value.length;
	  }
	  return !keys(value).length;
	}

	module.exports = isEmpty;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    filter: __webpack_require__(47)
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayFilter = __webpack_require__(48),
	    baseCallback = __webpack_require__(49),
	    baseFilter = __webpack_require__(70),
	    isArray = __webpack_require__(18);

	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias select
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Array} Returns the new filtered array.
	 * @example
	 *
	 * _.filter([4, 5, 6], function(n) {
	 *   return n % 2 == 0;
	 * });
	 * // => [4, 6]
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * // using the `_.matches` callback shorthand
	 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	 * // => ['barney']
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.pluck(_.filter(users, 'active', false), 'user');
	 * // => ['fred']
	 *
	 * // using the `_.property` callback shorthand
	 * _.pluck(_.filter(users, 'active'), 'user');
	 * // => ['barney']
	 */
	function filter(collection, predicate, thisArg) {
	  var func = isArray(collection) ? arrayFilter : baseFilter;
	  predicate = baseCallback(predicate, thisArg, 3);
	  return func(collection, predicate);
	}

	module.exports = filter;


/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A specialized version of `_.filter` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array.length,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = arrayFilter;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseMatches = __webpack_require__(50),
	    baseMatchesProperty = __webpack_require__(61),
	    bindCallback = __webpack_require__(24),
	    identity = __webpack_require__(25),
	    property = __webpack_require__(68);

	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}

	module.exports = baseCallback;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseIsMatch = __webpack_require__(51),
	    getMatchData = __webpack_require__(58),
	    toObject = __webpack_require__(37);

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];

	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      return object[key] === value && (value !== undefined || (key in toObject(object)));
	    };
	  }
	  return function(object) {
	    return baseIsMatch(object, matchData);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseIsEqual = __webpack_require__(52),
	    toObject = __webpack_require__(37);

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} matchData The propery names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = toObject(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseIsEqualDeep = __webpack_require__(53),
	    isObject = __webpack_require__(10),
	    isObjectLike = __webpack_require__(11);

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}

	module.exports = baseIsEqual;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var equalArrays = __webpack_require__(54),
	    equalByTag = __webpack_require__(56),
	    equalObjects = __webpack_require__(57),
	    isArray = __webpack_require__(18),
	    isTypedArray = __webpack_require__(38);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arraySome = __webpack_require__(55);

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalArrays;


/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A specialized version of `_.some` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(6);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isStrictComparable = __webpack_require__(59),
	    pairs = __webpack_require__(60);

	/**
	 * Gets the propery names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = pairs(object),
	      length = result.length;

	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}

	module.exports = getMatchData;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(10);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(6),
	    toObject = __webpack_require__(37);

	/**
	 * Creates a two dimensional array of the key-value pairs for `object`,
	 * e.g. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	 */
	function pairs(object) {
	  object = toObject(object);

	  var index = -1,
	      props = keys(object),
	      length = props.length,
	      result = Array(length);

	  while (++index < length) {
	    var key = props[index];
	    result[index] = [key, object[key]];
	  }
	  return result;
	}

	module.exports = pairs;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseGet = __webpack_require__(62),
	    baseIsEqual = __webpack_require__(52),
	    baseSlice = __webpack_require__(63),
	    isArray = __webpack_require__(18),
	    isKey = __webpack_require__(64),
	    isStrictComparable = __webpack_require__(59),
	    last = __webpack_require__(65),
	    toObject = __webpack_require__(37),
	    toPath = __webpack_require__(66);

	/**
	 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(srcValue),
	      pathKey = (path + '');

	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === srcValue
	      ? (srcValue !== undefined || (key in object))
	      : baseIsEqual(srcValue, object[key], undefined, true);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toObject = __webpack_require__(37);

	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	module.exports = baseSlice;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(18),
	    toObject = __webpack_require__(37);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}

	module.exports = isKey;


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}

	module.exports = last;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseToString = __webpack_require__(67),
	    isArray = __webpack_require__(18);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}

	module.exports = toPath;


/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseProperty = __webpack_require__(14),
	    basePropertyDeep = __webpack_require__(69),
	    isKey = __webpack_require__(64);

	/**
	 * Creates a function that returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseGet = __webpack_require__(62),
	    toPath = __webpack_require__(66);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseEach = __webpack_require__(71);

	/**
	 * The base implementation of `_.filter` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	module.exports = baseFilter;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseForOwn = __webpack_require__(72),
	    createBaseEach = __webpack_require__(73);

	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var baseFor = __webpack_require__(35),
	    keys = __webpack_require__(6);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getLength = __webpack_require__(13),
	    isLength = __webpack_require__(15),
	    toObject = __webpack_require__(37);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);
	var UI = __webpack_require__(74);
	var ZX = _.zlux;

	exports.extensions = {};

	/** COMPONENT **/
	exports.component = function(name, def) {

	    var fn = function(element, options) {
	        var $this = this;

	        this.element = element ? UI.$(element) : null;
	        this.options = UI.$.extend(true, {}, this.defaults, options);
	        this.plugins = {};

	        if (this.element) {
	            this.element.data(name, this);
	        }

	        this.init();

	        (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

	            if (fn.plugins[plugin].init) {
	                fn.plugins[plugin].init($this);
	                $this.plugins[plugin] = true;
	            }

	        });

	        this.trigger('init', [this]);
	    };

	    fn.plugins = {};
	    fn.instances = [];

	    UI.$.extend(true, fn.prototype, {

	        type: 'component',

	        defaults: {plugins: []},

	        boot: function(){},
	        init: function(){},

	        on: function(){
	            return UI.$(this.element || this).on.apply(this.element || this, arguments);
	        },

	        one: function(){
	            return UI.$(this.element || this).one.apply(this.element || this, arguments);
	        },

	        off: function(evt){
	            return UI.$(this.element || this).off(evt);
	        },

	        trigger: function(evt, params) {
	            return UI.$(this.element || this).trigger(evt, params);
	        },

	        find: function(selector) {
	            return this.element ? this.element.find(selector) : $([]);
	        },

	        proxy: function(obj, methods) {
	            var $this = this;

	            methods.split(' ').forEach(function(method) {
	                if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
	            });
	        },

	        mixin: function(obj, methods) {
	            var $this = this;

	            methods.split(' ').forEach(function(method) {
	                if (!$this[method]) $this[method] = obj[method].bind($this);
	            });
	        }

	    }, def);

	    // save the component
	    this.extensions[name] = fn;

	    // declare the component init function and save it into ZX root
	    this[name] = function() {

	        var element, options;

	        if(arguments.length) {
	            switch(arguments.length) {
	                case 1:

	                    if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
	                        element = UI.$(arguments[0]);
	                    } else {
	                        options = arguments[0];
	                    }

	                    break;
	                case 2:

	                    element = UI.$(arguments[0]);
	                    options = arguments[1];
	                    break;
	            }
	        }

	        if (element && element.data(name)) {
	            return element.data(name);
	        }

	        return (new ZX.extensions[name](element, options));
	    };

	    // Component plugin declaration
	    this[name].plugin = function(plugin, def) {
	        ZX.extensions[name].plugins[plugin] = def;
	    };

	    if (UI.domready) {
	        UI.component.boot(name);
	    }

	    return fn;
	};

	exports.component.boot = function(name) {

	    if (ZX.extensions[name].prototype && ZX.extensions[name].prototype.boot && !ZX.extensions[name].booted) {
	        ZX.extensions[name].prototype.boot.apply(ZX, []);
	        ZX.extensions[name].booted = true;
	    }
	}

	exports.component.bootComponents = function() {

	    for (var component in ZX.extensions) {
	        ZX.component.boot(component);
	    }

	}

	/** PLUGIN **/
	exports.plugin = function(name, def) {

	    var fn = function(element, options) {
	        this.element = element ? UI.$(element) : null;
	        this.init(options);
	    };

	    UI.$.extend(true, fn.prototype, {

	        type: 'plugin',

	        init: function(){}

	    }, def);


	    // save the plugin
	    this.extensions[name] = fn;

	    // declare the plugin init function and save it into ZX root
	    this[name] = function() {

	        var element, options;

	        if(arguments.length) {
	            switch(arguments.length) {
	                case 1:

	                    if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
	                        element = UI.$(arguments[0]);
	                    } else {
	                        options = arguments[0];
	                    }

	                    break;
	                case 2:

	                    element = UI.$(arguments[0]);
	                    options = arguments[1];
	                    break;
	            }
	        }

	        return (new ZX.extensions[name](element, options));
	    };

	    return fn;
	};


	/** FN **/
	exports.fn = function(command, options) {

	    var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), extension = cmd[1], method = cmd[2];

	    if (!ZX[extension]) {
	        UI.$.error("ZLUX extension [" + extension + "] does not exist.");
	        return this;
	    }

	    // component
	    if(ZX.extensions[extension].prototype.type === 'component') {

	        return this.each(function() {
	            // the element
	            var $this = UI.$(this),

	            // get the saved instance
	            data = $this.data(extension);

	            // if no instance, init it
	            if (!data) {
	                $this.data(extension, (data = ZX[extension](this, method ? undefined : options)));
	                ZX.extensions[extension].instances.push(data);
	            }

	            // if method provided, execute it
	            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
	        });
	    }

	    // plugin
	    else if(ZX.extensions[extension].prototype.type === 'plugin') {

	        return this.each(function() {
	            ZX[extension](this, Array.prototype.slice.call(args, 1));
	        });
	    }
	}


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);

	exports.lang = {

	    strings: {},

	    /**
	     * Push language strings to the list
	     * @param Object strings Translated string in JSON format.
	     */

	    push: function (strings) {
	        _.merge(this.strings, strings);
	    },

	    /**
	     * Retrieves the specified language string
	     * @param String string String to look for.
	     * @return String Translated string or the input string if it wasn't found.
	     */

	    get: function (string) {
	        return this.strings[string] || string;
	    },

	    /**
	     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
	     * @param String str String with tokens
	     * @return String String with replaced tokens
	     */

	    sprintf: function (str) {
	        var args = [].slice.call(arguments, 1);

	        str = this.get(str);

	        return str.replace(/%[a-z]/g, function () {
	            var value = args.shift();
	            return !_.isUndefined(value) ? value : '';
	        });
	    }

	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function () {

	    var _ = __webpack_require__(2);
	    var $ = __webpack_require__(78);
	    var config = __webpack_require__(41);

	    /**
	     * Http request as jQuery ajax wrapper
	     *
	     * @param {Object} settings
	     *
	     * @return {Promise}
	     */
	    function Http(route, settings) {

	        var self = this, deferred = $.Deferred(), response = {success: true, errors: [], notices: []}, url = config.route;

	        settings = settings || {};

	        // queue = settings.queue ? settings.queue : null,
	        // delete settings.queue

	        // split route prefix [0] and method [1], eg: filesManager/fetchResources
	        var route = route.split('/');

	        // check if prefix has been mapped
	        if (config.routesMap[route[0]]) {
	            url += '&' + config.routesMap[route[0]]
	        }

	        // append method
	        url += '&method=' + route[1];

	        settings = _.merge({url: url}, Http.settings, settings);

	        // var request  = queue ? this.queue(queue, settings) : $.ajax(settings)

	        $.ajax(settings)

	        .done(function(data, status, jqxhr) {
	            if (settings.dataType === 'json') {
	                parseReq(_.merge(response, data), status, jqxhr);
	            }
	        })

	        .fail(function(jqxhr, status, error) {
	            parseReq(response, status, jqxhr);
	            _.log(error);
	            _.log(response.errors);
	        })

	        .always(function() {
	            if (response.success) {
	                deferred.resolveWith(self, [response]);
	            } else {
	                deferred.rejectWith(self, [response]);
	            }
	        });

	        return deferred.promise();
	    }

	    function parseReq(response, status, jqxhr) {

	        if (status === 'error') {

	            switch (jqxhr.status) {
	                case 0: // if request canceled no error is logged
	                    break;
	                case 403:
	                    response.errors.push('The session has expired.');
	                    break;
	                case 404:
	                    response.errors.push('The requested URL is not accesible.');
	                    break;
	                case 500:
	                    response.errors.push('A server-side error has occurred.');
	                    break;

	                default:
	                    response.errors.push('An ' + status + ' occurred.');
	                    break;
	            }

	            response.success = false;
	        }

	        if (status === 'parsererror') {
	            response.errors.push('Response format error: JSON parse error');
	            response.success = false;
	        }

	        // status state check
	        if (response.success === undefined) {
	            response.errors.push('Response format error: status not specified');
	            response.success = false;
	        }

	    }

	    Http.settings = {
	        type       : 'get',
	        dataType   : 'json',
	        contentType: 'application/json; charset=UTF-8'
	    };

	    ['get', 'put', 'post', 'delete'].forEach(function (method) {

	        Http[method] = function (url, data, settings) {
	            return this(url, _.merge({type: method, data: data}, settings));
	        };

	    });

	    // /**
	    //  * Ajax request and notify the answer
	    //  * @param Object request The ajax request
	    //  * @param Object notify The notify settings
	    //  * @return Promise The ajax promise
	    //  */
	    // exports.requestAndNotify = function(request, notify) {

	    //     // set defaults
	    //     notify = notify === undefined ? {} : notify

	    //     // request
	    //     return this.request(request)
	    //     .done(function(response){

	    //         // close others, then notify
	    //         if(notify.group) ZX.notify.closeAll(notify.group);

	    //         // display message
	    //         if(response.message) ZX.notify(response.message, $.extend(true, {
	    //             status: 'success'
	    //         }, notify));

	    //     }).fail(function(response){

	    //         // close others, then notify
	    //         if(notify.group) ZX.notify.closeAll(notify.group);

	    //         // display errors
	    //         if(response.errors && response.errors.length) $.each(response.errors, function(){
	    //             ZX.notify(this, $.extend(true, {
	    //                 status: 'danger'
	    //             }, notify));
	    //         });

	    //     }).always(function(response){

	    //         // display notices
	    //         if(response.notices && response.notices.length) $.each(response.notices, function(){
	    //             ZX.notify(this, $.extend(true, {
	    //                 status: 'warning'
	    //             }, notify));
	    //         });
	    //     });
	    // }

	    // // Original code from AjaxQ jQuery Plugin
	    // // Copyright (c) 2012 Foliotek Inc.
	    // // MIT License
	    // // https://github.com/Foliotek/ajaxq
	    // var queues = {}

	    // // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
	    // exports.queue = function(qname, opts) {

	    //     if (typeof opts === "undefined") {
	    //         throw ("AjaxQ: queue name is not provided");
	    //     }

	    //     // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
	    //     var deferred = $.Deferred(),
	    //         promise = deferred.promise();

	    //     promise.success = promise.done;
	    //     promise.error = promise.fail;
	    //     promise.complete = promise.always;

	    //     // Create a deep copy of the arguments, and enqueue this request.
	    //     var clonedOptions = $.extend(true, {}, opts);
	    //     enqueue(function() {

	    //         // Send off the ajax request now that the item has been removed from the queue
	    //         var jqXHR = $.ajax.apply(window, [clonedOptions]).always(dequeue);

	    //         // Notify the returned deferred object with the correct context when the jqXHR is done or fails
	    //         // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
	    //         jqXHR.done(function() {
	    //             deferred.resolve.apply(this, arguments);
	    //         });
	    //         jqXHR.fail(function() {
	    //             deferred.reject.apply(this, arguments);
	    //         });
	    //     });

	    //     return promise;

	    //     // If there is no queue, create an empty one and instantly process this item.
	    //     // Otherwise, just add this item onto it for later processing.
	    //     function enqueue(cb) {
	    //         if (!queues[qname]) {
	    //             queues[qname] = [];
	    //             cb();
	    //         }
	    //         else {
	    //             queues[qname].push(cb);
	    //         }
	    //     }

	    //     // Remove the next callback from the queue and fire it off.
	    //     // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
	    //     function dequeue() {
	    //         if (!queues[qname]) {
	    //             return;
	    //         }
	    //         var nextCallback = queues[qname].shift();
	    //         if (nextCallback) {
	    //             nextCallback();
	    //         }
	    //         else {
	    //             delete queues[qname];
	    //         }
	    //     }

	    // }

	    // // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
	    // // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
	    // $.each( [ "getq", "postq" ], function( i, method ) {
	    //     $[ method ] = function( qname, url, data, callback, type ) {

	    //         if ( $.isFunction( data ) ) {
	    //             type = type || callback;
	    //             callback = data;
	    //             data = undefined;
	    //         }

	    //         return $zlux.http.queue(qname, {
	    //             type: method === "postq" ? "post" : "get",
	    //             url: url,
	    //             data: data,
	    //             success: callback,
	    //             dataType: type
	    //         });
	    //     };
	    // });

	    // var isQueueRunning = function(qname) {
	    //     return queues.hasOwnProperty(qname);
	    // }

	    // var isAnyQueueRunning = function() {
	    //     for (var i in queues) {
	    //         if (isQueueRunning(i)) return true;
	    //     }
	    //     return false;
	    // }

	    // exports.queue.isRunning = function(qname) {
	    //     if (qname) return isQueueRunning(qname);
	    //     else return isAnyQueueRunning();
	    // }

	    // exports.queue.clear = function(qname) {
	    //     if (!qname) {
	    //         for (var i in queues) {
	    //             if (queues.hasOwnProperty(i)) {
	    //                 delete queues[i];
	    //             }
	    //         }
	    //     }
	    //     else {
	    //         if (queues[qname]) {
	    //             delete queues[qname]
	    //         }
	    //     }
	    // }

	    return Http;
	};


/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = UIkit.$;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UI = __webpack_require__(74);

	module.exports = function(ZX) {

	    ZX.plugin('animate', {

	        init: function(options) {
	            var $this = this,

	            // set animation class
	            animation = 'zx-animate-' + UI.$.trim(options[0]),

	            // set callback
	            callback = options[1] ? options[1] : null;

	            // animate
	            $this.animate(animation).done(function(){

	                // execute any callback passing the element as scope
	                if (callback) {
	                    callback.apply($this.element);
	                }

	            });
	        },

	        animate: function(animation) {
	            var $this = this;

	            return UI.$.Deferred(function(defer) {

	                // animate the element with CSS3
	                $this.element.addClass(animation)

	                // when done
	                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {

	                    // remove the class to allow further animation
	                    $this.element.removeClass(animation);
	                    defer.resolve();

	                });

	            }).promise();
	        }
	    });

	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UI = __webpack_require__(74)

	module.exports = function(ZX) {

	    ZX.component('spin', {

	        defaults: {
	            class: '',
	            affix:  'append' // append, prepend or replace
	        },

	        init: function() {
	            // run default
	            this.on()
	        },

	        on: function() {
	            var $this = this

	            $this.icon_class = false

	            // find and existing icon
	            $this.icon = $this.element.is('i') ? $this.element : UI.$('i', $this.element).first()

	            // use it if found
	            if($this.icon.length) {
	                // save original class
	                $this.icon_class = $this.icon.attr('class')
	                // hardcode the width to avoid movement effects
	                $this.icon.width($this.icon.width())
	                // set new class
	                $this.icon.attr('class', 'uk-icon-zx-spinner uk-icon-spin')

	            // else, create one
	            } else {
	                $this.icon = UI.$('<i class="uk-icon-zx-spinner uk-icon-spin"></i>')

	                // place the icon
	                if($this.options.affix == 'replace') {
	                    $this.element.html($this.icon)
	                } else {
	                    $this.element[$this.options.affix]($this.icon)
	                }
	            }

	            // add custom class
	            $this.icon.addClass($this.options['class'])
	        },

	        off: function() {
	            var $this = this;

	            // remove the spin classes but not the icon
	            $this.icon.removeClass('uk-icon-zx-spinner uk-icon-spin')

	            // recover class, if any
	            if($this.icon_class) $this.icon.attr('class', $this.icon_class)

	            // remove hardcoded width
	            $this.icon.width('')

	            // remove spin instance from element
	            $this.element.removeData('spin')
	        }

	    })

	}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _  = __webpack_require__(2);
	var http = __webpack_require__(77)();

	var vueZlux = {

	    install: function (Vue) {

	        Object.defineProperty(Vue.prototype, '$http', {

	            get: function () {
	                return _.merge(http.bind(this), http);
	            }

	        });

	        Vue.filter('trans', function(id) {

	            return _.zlux.config.locales[id] ? _.zlux.config.locales[id] : id;

	        });

	    }

	};

	if (window.Vue) {
	    Vue.use(vueZlux);
	}


/***/ }
/******/ ]);