var _  = require('../util')
var http = require('./http')()

var vueZlux = {

    install: function (Vue) {

        Object.defineProperty(Vue.prototype, '$http', {

            get: function () {
                return _.extend(http.bind(this), http)
            }

        })

        Vue.filter('trans', function(id) {

            return _.zlux.config.locales[id] ? _.zlux.config.locales[id] : id

        })

    }

}

if (window.Vue) Vue.use(vueZlux)