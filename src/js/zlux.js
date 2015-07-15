var UI = require('uikit');
var _ = require('./util');
var extend = _.extend;

if (!UI) {
    throw new Error('UIkit library is missing');
}

var $ = UI.$;

var ZX = {
    version: '2.1.0',
    config: require('./config')
};

UI.ready(function() {

    // style workaround, wrapp dragging elements with zx class
    $('body').on('start.uk.nestable, start.uk.sortable', function() {
        UI.$('.uk-nestable-list-dragged, .uk-sortable-dragged').wrap('<div class="zx" />');
    });

    // extend config
    ZX.config = extend(ZX.config, window.$zlux.config);

});

extend(ZX, require('./core/extensions'));
extend(ZX, require('./core/locale'));
extend(ZX, require('./core/modal'));

ZX.http = require('./core/http')(ZX);

require('./core/animate')(ZX);
require('./core/spin')(ZX);
require('./core/vue');

UI.$.fn.zx = ZX.fn;

window.zlux = UI.$zlux = _.zlux = ZX;
