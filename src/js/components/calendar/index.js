var Vue = require('vue');
var UI = require('uikit');

UI.component('zx-calendar', {

    boot: function() {

        // auto init
        UI.ready(function(context) {

            UI.$('[data-zx-calendar]', context).each(function(){

                if (!this.__vue__) {

                    new Vue(require('./calendar.vue')).$mount(this);

                }

            });

        });

    }

});
