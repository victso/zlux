(function ($, ZX, UI) {

    "use strict";

    ZX.component('calendar', {

        defaults: {},

        boot: function() {

            UI.$("[data-zx-calendar]").each(function(){

                var ele = UI.$(this);

                if(!ele.data("calendar")) {
                    var plugin = ZX.calendar(ele, UI.Utils.options(ele.attr("data-uk-calendar")));
                }
            });
        },

        init: function() {

            var $this   = this,
                element = this.element[0],
                template = 
                "<div class='zx-calendar-nav'>" +
                    "<span class='zx-calendar-previous clndr-previous-button'></span>" +
                    "<span class='zx-calendar-next clndr-next-button'></span>" +
                    "<div class='uk-datepicker-heading'>{{ month }} {{ year }}</div>" +
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
                                "<span class='{{ $item.classes }}'>{{ $item.day }}</span>" +
                            "</td>" +
                        "{{/$val}}" +
                        "</tr>" +
                    "{{/grid}}" +
                    "</tbody>" +
                "</table>";

            this.element.clndr({

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
                    day: 'clndr-day',
                    empty: 'clndr-empty'
                },

                // override template rendering
                render: function(data){

                    var grid = [];
                    for (var i = 0; i < data.numberOfRows; i++) {

                        var row = [];                        
                        for (var j = 0; j < 7; j++) {
                            var d = j + i * 7;
                            row.push(data.days[d]);
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