"use strict";

var UI = require('uikit');

UI.component('zx-manager-items', {

    boot: function() {

        if (!window.Vue) {
            UI.$zlux.warn('Vue not loaded but required by Items Manager');
            return;
        }

        Vue.component('zx-manager-items', require('./manager.vue'));

        // auto init
        UI.ready(function(context) {

            UI.$('[data-zx-manager-items]', context).each(function(){

                if ( ! this.__vue__) {

                    new Vue.component('zx-manager-items').$mount(this);

                }

            });

        });

    }

});
