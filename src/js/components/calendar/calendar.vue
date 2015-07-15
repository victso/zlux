<template>

    <table class="uk-datepicker-table">
        <thead>
            <th v-repeat="rows.weekdays">{{ $value }}</th>
        </thead>
        <tbody>
            <tr v-repeat="week: rows.days">
                <td v-repeat="day: week">

                    <a href="#" v-class="
                        uk-active: day.selected,
                        zx-calendar-table-muted: ! day.inmonth,
                        zx-calendar-inactive: maxDate && day.day > maxDate,
                        zx-calendar-inactive: minDate && minDate > day.day
                    ">
                        {{ day.day.format("D") }}
                    </a>

                </td>
            </tr>
        </tbody>
    </table>

</template>

<script>

    var moment = require('moment');

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

</script>
