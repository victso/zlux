var _  = require('../util')
var UI = require('uikit')
var http = require('./http')()

var vueZlux = {

    install: function (Vue) {

        // Vue.options.replace = true

        Object.defineProperty(Vue.prototype, '$http', {

            get: function () {
                return _.extend(http.bind(this), http)
            }

        })

        Vue.directive('uk-pagination', function(params) {

            var self = this, ele = UI.$(this.el)

            if (!ele.data('pagination')) {

                UI.pagination(ele, params)

                .on('select.uk.pagination', function(e, page){
                    self.vm.changePage(page)
                })

            }

        })

    }

}

if (window.Vue) Vue.use(vueZlux)