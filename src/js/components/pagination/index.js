var vueZlux = {

    install: function (Vue) {

        Vue.component('zx-pagination', require('./pagination.vue'))

    }

}

if (window.Vue) Vue.use(vueZlux)