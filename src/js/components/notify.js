var _ = require('../util');
var UI = require('uikit');
var ZX = _.zlux;
var $ = require('jquery');

var notify = function(msg, options){
    // display message
    var notify = UI.notify(msg, options);

    // add zlux class for the holding content styling
    notify.element.parent().addClass('zx');

    return notify;
},

confirm = function(msg, options){

    options = $.extend(options, {
        timeout: false // confirmation must wait user interaction
    });

    return $.Deferred(function( defer )
    {
        ZX.notify(msg +
            '<div class="uk-text-center uk-margin-top">' +
                '<a class="zx-x-confirm uk-margin-right"><i class="uk-icon-check uk-icon-small"></i></a>' +
                '<a class="zx-x-cancel uk-margin-left"><i class="uk-icon-times uk-icon-small"></i></a>' +
            '</div>',
        options);

        notify.element.on('click', '.zx-x-confirm', function(){
            defer.resolve();
        });

        notify.element.on('click', function(){
            defer.reject();
        });

    }).promise();
},

closeAll = function(group, instantly){
    UI.notify.closeAll(group, instantly);
    return this;
};

ZX.notify = notify;
ZX.notify.confirm = confirm;
ZX.notify.closeAll = closeAll;
