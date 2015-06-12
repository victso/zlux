var vueZlux = {};

vueZlux.install = function (Vue) {

    Vue.prototype.$zlux = require('zlux');

};

if (window.Vue) Vue.use(vueZlux);