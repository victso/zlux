var UI = require('uikit');
var $ = require('jquery');
var _ = require('./util');

if (!UI) {
    throw new Error('UIkit library is missing');
}

var ZX = {
    version: '2.1.0',
    config: require('./config'),
    util: require('./util'),
    http: require('./core/http')(ZX)
};

_.assign(ZX, require('./core/extensions'));
_.assign(ZX, require('./core/locale'));

require('./core/vue');

UI.ready(function() {

    // style workaround, wrapp dragging elements with zx class
    $('body').on('start.uk.nestable, start.uk.sortable', function() {
        $('.uk-nestable-list-dragged, .uk-sortable-dragged').wrap('<div class="zx" />');
    });

    // extend config
    _.merge(ZX.config, window.$zlux.config);

});

$.fn.zx = ZX.fn;
window.Zlux = UI.$zlux = _.zlux = ZX;
