"use strict";

var UI = require('uikit')
var _ = require('../../util')

UI.component('zx-items-manager', {

    boot: function() {

        if (!window.Vue) {
            _.warn('Vue not loaded but required by Items Manager')
            return
        }

        // save component for programatic usage
        Vue.component('items-manager', require('./index.vue'))

    }

})
