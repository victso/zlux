var vueZlux = {

    install: function (Vue) {

        Vue.component('pagination', require('./pagination.vue'))

    }

}

if (window.Vue) Vue.use(vueZlux)