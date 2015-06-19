var _  = require('./util')
var UI = require('uikit')
var extend = _.extend

var ZX = {
    version: '2.0.3',
    config: require('./config')
}

UI.ready(function() {

    // style workaround wrapping root elements with zlux
    UI.$('[data-uk-nestable]').on('nestable-start', function() {
        UI.$('.uk-nestable-list-dragged').wrap('<div class="zx" />')
    })

    // extend config
    ZX.config = extend(ZX.config, window.$zlux_config)

})

extend(ZX, require('./core/extensions'))
extend(ZX, require('./core/locale'))
extend(ZX, require('./core/modal'))

ZX.http = require('./core/http')(ZX)

require('./core/animate')(ZX)
require('./core/spin')(ZX)
require('./core/vue')

UI.$.fn.zx = ZX.fn;

window.zlux = UI.$zlux = _.zlux = ZX