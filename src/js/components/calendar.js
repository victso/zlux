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
                templateUI =
                  "<div class='clndr-controls'>" +
                    "<div class='clndr-control-button'><span class='clndr-previous-button'>previous</span></div><div class='month'>{{ month }} {{ year }}</div><div class='clndr-control-button rightalign'><span class='clndr-next-button'>next</span></div>" +
                  "</div>" +
                  "<table class='zx-calendar-table' border='0' cellspacing='0' cellpadding='0'>" +
                    "<thead>" +
                    "<tr class='header-days'>" +
                    "{{~daysOfTheWeek}}" +
                      "<td class='header-day'>{{$item}}</td>" +
                    "{{/daysOfTheWeek}}" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<% for(var i = 0; i < numberOfRows; i++){ %>" +
                      "<tr>" +
                      "<% for(var j = 0; j < 7; j++){ %>" +
                      "<% var d = j + i * 7; %>" +
                      "<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>" +
                      "</div></td>" +
                      "<% } %>" +
                      "</tr>" +
                    "<% } %>" +
                    "</tbody>" +
                  "</table>",

                underscoreJStmpl =
                "<div class='clndr-controls'>" +
                    "<div class='clndr-control-button'><span class='clndr-previous-button'>previous</span></div><div class='month'><%= month %> <%= year %></div><div class='clndr-control-button rightalign'><span class='clndr-next-button'>next</span></div>" +
                    "</div>" +
                  "<table class='zx-calendar-table' border='0' cellspacing='0' cellpadding='0'>" +
                    "<thead>" +
                    "<tr class='header-days'>" +
                    "<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
                      "<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
                    "<% } %>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<% for(var i = 0; i < numberOfRows; i++){ %>" +
                      "<tr>" +
                      "<% for(var j = 0; j < 7; j++){ %>" +
                      "<% var d = j + i * 7; %>" +
                      "<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>" +
                      "</div></td>" +
                      "<% } %>" +
                      "</tr>" +
                    "<% } %>" +
                    "</tbody>" +
                "</table>";

            this.element.clndr({
                
                // override default classes
                classes: {
                    today: 'zx-calendar-today',
                    event: 'zx-calendar-event',
                    past: 'zx-calendar-past',
                    lastMonth: 'zx-calendar-last-month',
                    nextMonth: 'zx-calendar-next-month',
                    adjacentMonth: 'zx-calendar-adjacent-month',
                    inactive: 'zx-calendar-inactive'
                },

                // override defaults targets
                targets: {
                    day: 'clndr-day',
                    empty: 'clndr-empty'
                },

                template: $('[type="text/template"]').html()

                // render: function(data){
                //     console.log(data);
                    
                //     return UI.Utils.template(templateUI, data);
                // }

            });
        }

    });

})(jQuery, zlux, UIkit);