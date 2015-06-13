var _  = require('../util')

var vueZlux = {

    install: function (Vue) {

        Object.defineProperty(Vue.prototype, '$http', {

            get: function () {
                console.log(this);
                // return _.extend(Http.bind(this), Http);
            }

        })

        // Vue.$http = function(url, params) {

        //     console.log(url)
        //     console.log(this)

        //     // return ZX.$http.apply(this, url, params)

        // }

    }

}

if (window.Vue) Vue.use(vueZlux)