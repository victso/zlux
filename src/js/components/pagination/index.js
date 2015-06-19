var _  = require('../../util')
var UI = require('uikit')

var vueZlux = {

    install: function (Vue) {

        Vue.component('zx-pagination', require('./pagination.vue'))

    }

}

if (window.Vue) Vue.use(vueZlux)