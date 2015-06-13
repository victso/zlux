var UI = require('uikit')
var _  = require('./util')
var extend = _.extend

var ZX = {
    version: '2.0.3',
    config: require('./config'),
    warn: _.warn,
}

UI.ready(function() {

    // style workaround wrapping root elements with zlux
    UI.$('[data-uk-nestable]').on('nestable-start', function() {
        UI.$('.uk-nestable-list-dragged').wrap('<div class="zx" />')
    })

    // extend config
    ZX.config = _.extend(ZX.config, window.$zlux_config)

})

extend(ZX, require('./core/extensions'))
extend(ZX, require('./core/resource'))
extend(ZX, require('./core/locale'))
extend(ZX, require('./core/modal'))

require('./core/animate')(ZX)
require('./core/spin')(ZX)
require('./core/vue')

UI.$.fn.zx = ZX.fn;

module.exports = UI.$zlux = _.zlux = ZX

/**
* @see http://stackoverflow.com/q/7616461/940217
* @return number The hash number
*/
// String.prototype.hashCode = function(){
//    if (Array.prototype.reduce){
//        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
//    }
//    var hash = 0;
//    if (this.length === 0) return hash;
//    for (var i = 0; i < this.length; i++) {
//        var character  = this.charCodeAt(i);
//        hash  = ((hash<<5)-hash)+character;
//        hash = hash & hash; // Convert to 32bit integer
//    }
//    return hash;
// };