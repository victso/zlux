"use strict";

var UI = require('uikit')
var _ = require('../../util')

UI.component('zx-files-manager', {

    boot: function() {

        if (!window.Vue) {
            _.warn('Vue not loaded but required by Files Manager')
            return
        }

        // save component for programatic usage
        Vue.component('files-manager', require('./index.vue'))

    }

})