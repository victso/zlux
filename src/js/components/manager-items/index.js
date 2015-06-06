"use strict";

var Vue = require('vue');
var UI  = require('uikit');

UI.component('zx-manager-items', {

    boot: function() {

        // auto init
        UI.ready(function(context) {

            UI.$('[data-zx-manager-items]', context).each(function(){

                if ( ! this.__vue__) {

                    new Vue(require('./manager.vue')).$mount(this);

                }

            });

        });
        
    }

});
