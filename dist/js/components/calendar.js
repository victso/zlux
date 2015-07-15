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

	var Vue = __webpack_require__(12);
	var UI = __webpack_require__(13);

	UI.component('zx-calendar', {

	    boot: function() {

	        // auto init
	        UI.ready(function(context) {

	            UI.$('[data-zx-calendar]', context).each(function(){

	                if (!this.__vue__) {

	                    new Vue(__webpack_require__(14)).$mount(this);

	                }

	            });

	        });

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
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	module.exports = Vue;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = UIkit;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15)
	module.exports.template = __webpack_require__(17)

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var moment = __webpack_require__(16);

	    module.exports = {

	        data:  {
	            currentYear: 2014,
	            currentMonth: 11,

	            options: {
	                mobile: false,
	                weekstart: 1,
	                i18n: {
	                    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
	                    weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	                },
	                format: "DD.MM.YYYY",
	                offsettop: 5,
	                maxDate: false,
	                minDate: false,
	                pos: 'auto'
	            }

	        },

	        ready: function() {

	            U$('a[href="#"]', this.$el).on('click', function(e) {
	                e.preventDefault();
	            });

	        },

	        computed: {

	            rows: function() {
	                return this.getRows(this.currentYear, this.currentMonth);
	            },

	            maxDate: function() {

	                if (this.options.maxDate !== false) {

	                    if (isNaN(this.options.maxDate)) {

	                        return moment(this.options.maxDate, this.options.format);

	                    } else {

	                        return moment().add(this.options.maxDate, 'days');

	                    }

	                } else {
	                    return this.options.maxDate;
	                }

	            },

	            minDate: function() {

	                if (this.options.minDate !== false) {

	                    if (isNaN(this.options.minDate)) {
	                        return moment(this.options.minDate, this.options.format);
	                    } else {
	                        return moment().add(this.options.minDate-1, 'days');
	                    }

	                } else {
	                    return this.options.minDate;
	                }

	            }

	        },

	        methods: {

	            getRows: function(year, month) {

	                var opts   = this.options,
	                    now    = moment().format('YYYY-MM-DD'),
	                    days   = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month],
	                    before = new Date(year, month, 1).getDay(),
	                    data   = {"month":month, "year":year,"weekdays":[],"days":[]},
	                    row    = [];

	                data.weekdays = (function(){

	                    for (var i=0, arr=[]; i < 7; i++) {

	                        var day = i + (opts.weekstart || 0);

	                        while (day >= 7) {
	                            day -= 7;
	                        }

	                        arr.push(opts.i18n.weekdays[day]);
	                    }

	                    return arr;
	                })();

	                if (opts.weekstart && opts.weekstart > 0) {
	                    before -= opts.weekstart;
	                    if (before < 0) {
	                        before += 7;
	                    }
	                }

	                var cells = days + before, after = cells;

	                while(after > 7) { after -= 7; }

	                cells += 7 - after;

	                var day, isDisabled, isSelected, isToday, isInMonth;

	                for (var i = 0, r = 0; i < cells; i++) {

	                    day        = new Date(year, month, 1 + (i - before));
	                    isDisabled = (opts.mindate && day < opts.mindate) || (opts.maxdate && day > opts.maxdate);
	                    isInMonth  = !(i < before || i >= (days + before));

	                    day = moment(day);

	                    isSelected = this.initdate == day.format("YYYY-MM-DD");
	                    isToday    = now == day.format("YYYY-MM-DD");

	                    row.push({"selected": isSelected, "today": isToday, "disabled": isDisabled, "day":day, "inmonth":isInMonth});

	                    if (++r === 7) {
	                        data.days.push(row);
	                        row = [];
	                        r = 0;
	                    }
	                }

	                return data;
	            }

	        }

	    };

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<table class=\"uk-datepicker-table\">\n        <thead>\n            <th v-repeat=\"rows.weekdays\">{{ $value }}</th>\n        </thead>\n        <tbody>\n            <tr v-repeat=\"week: rows.days\">\n                <td v-repeat=\"day: week\">\n\n                    <a href=\"#\" v-class=\"\n                        uk-active: day.selected,\n                        zx-calendar-table-muted: ! day.inmonth,\n                        zx-calendar-inactive: maxDate && day.day > maxDate,\n                        zx-calendar-inactive: minDate && minDate > day.day\n                    \">\n                        {{ day.day.format(\"D\") }}\n                    </a>\n\n                </td>\n            </tr>\n        </tbody>\n    </table>";

/***/ }
/******/ ]);