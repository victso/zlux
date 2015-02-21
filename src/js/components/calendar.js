(function ($, ZX, UI) {

    "use strict";

    ZX.component('calendar', {

        defaults: {},

        boot: function() {

            UI.$("[data-zx-calendar]").each(function(){

                var ele = UI.$(this);

                if(!ele.data("calendar")) {
                    var plugin = ZX.calendar(ele, UI.Utils.options(ele.attr("data-zx-calendar")));
                }
            });
        },

        init: function() {

            var $this   = this,
                element = this.element[0],
                template = 
                "<div class='zx-calendar-nav'>" +
                    "<span class='zx-calendar-previous'></span>" +
                    "<span class='zx-calendar-next'></span>" +
                    "<div class='zx-calendar-heading'>{{ month }} {{ year }}</div>" +
                "</div>" +
                "<table class='zx-calendar-table' border='0' cellspacing='0' cellpadding='0'>" +
                    "<thead>" +
                        "<tr class='header-days'>" +
                        "{{~daysOfTheWeek}}" +
                            "<th class='header-day'>{{ $item }}</th>" +
                        "{{/daysOfTheWeek}}" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "{{:grid}}" +
                        "<tr>" +
                        "{{~$val}}" +
                            "<td>" +
                                "{{#$item.link}}" +
                                "<a href='{{ $item.link }}' {{ $item.attr }}>{{ $item.day }}</span>" +
                                "{{/endif}}" +
                                "{{^$item.link}}" +
                                "<span {{ $item.attr }}>{{ $item.day }}</span>" +
                                "{{/endif}}" +
                            "</td>" +
                        "{{/$val}}" +
                        "</tr>" +
                    "{{/grid}}" +
                    "</tbody>" +
                "</table>";

            this.clndr = this.element.clndr({

                weekOffset: 1,
                
                // override default classes
                classes: {
                    today: 'zx-calendar-today',
                    event: 'zx-calendar-event',
                    past: 'zx-calendar-past',
                    lastMonth: 'zx-calendar-last-month',
                    nextMonth: 'zx-calendar-next-month',
                    adjacentMonth: 'zx-calendar-table-muted',
                    inactive: 'zx-calendar-inactive'
                },

                // override defaults targets
                targets: {
                    previousButton: 'zx-calendar-previous',
                    nextButton: 'zx-calendar-next',
                    day: 'clndr-day',
                    empty: 'clndr-empty'
                },

                // set events data mapping
                multiDayEvents: {
                    startDate: 'start',
                    endDate: 'end',
                    singleDay: 'date'
                },

                // override template rendering
                render: function(data){

                    var grid = [];
                    for (var i = 0; i < data.numberOfRows; i++) {

                        var row = [];                        
                        for (var j = 0; j < 7; j++) {
                            var d = j + i * 7, day = data.days[d], attr = [];

                            if (day.events.length) {
                                day.classes += ' uk-active';

                                attr.push('data-uk-tooltip');
                                attr.push('title=\''+day.events[0].title+'\'');

                                if (day.events[0].link) {
                                    day.link = day.events[0].link;
                                }
                            }

                            attr.push('class=\''+day.classes+'\'');

                            day.attr = attr.join(' ');

                            row.push(day);
                        }

                        grid.push(row);
                    }

                    data.grid = grid;
                    
                    return UI.Utils.template(template, data);
                }
            });
        }
    });

})(jQuery, zlux, UIkit);