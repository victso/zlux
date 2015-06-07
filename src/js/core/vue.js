var ZX = require('zlux');
    
ZX.vue = {};
ZX.vue.mixins = [{

    created: function() {

    	var config = window.$zlux_config;

        Vue.url.options.root = config.url;

        Vue.http.headers.common['X-XSRF-TOKEN'] = config.csrf;
        Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        Vue.http.options.emulateHTTP = true;

        Vue.http.options.beforeSend = function (request, options) {

        	var url = options.url.split('/');
        	url[0] = 'controller=' + url[0];
        	url[1] = 'task=' + url[1];

            options.url = config.route + '&' + url.join('&');

        };

    }

}];