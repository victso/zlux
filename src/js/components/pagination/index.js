var vueZlux = {

    install: function (Vue) {

        Vue.component('pagination', require('./index.vue'));

    }

};

if (window.Vue) {
    Vue.use(vueZlux);
}
