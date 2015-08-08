var UI = require('uikit');
var _ = require('./util');
var assign = _.assign;

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
    _.merge(ZX.config, window.$zlux.config);

});

assign(ZX, require('./core/extensions'));
assign(ZX, require('./core/locale'));
assign(ZX, require('./core/modal'));

ZX.http = require('./core/http')(ZX);

require('./core/animate')(ZX);
require('./core/spin')(ZX);
require('./core/vue');

UI.$.fn.zx = ZX.fn;

window.Zlux = UI.$zlux = _.zlux = ZX;
