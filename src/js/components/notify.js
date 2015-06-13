var UI = require('uikit')

var notify = function(msg, options){
    // display message
    var notify = UI.$.UIkit.notify(msg, options);

    // add zlux class for the holding content styling
    notify.element.parent().addClass('zx');

    return notify;
},

confirm = function(msg, options){

    options = UI.$.extend(options, {
        timeout: false // confirmation must wait user interaction
    });

    return UI.$.Deferred(function( defer )
    {
        var notify = UI.$zlux.notify(msg + '<div class="uk-text-center uk-margin-top">\
                <a class="zx-x-confirm uk-margin-right"><i class="uk-icon-check uk-icon-small"></i></a>\
                <a class="zx-x-cancel uk-margin-left"><i class="uk-icon-times uk-icon-small"></i></a>\
            </div>',
        options);

        notify.element.on('click', '.zx-x-confirm', function(e, b){
            defer.resolve();
        });

        notify.element.on('click', function(e, b){
            defer.reject();
        });

    }).promise();
},

closeAll = function(group, instantly){
    UI.$.UIkit.notify.closeAll(group, instantly);
    return this;
};

UI.$zlux.notify             = notify;
UI.$zlux.notify.confirm     = confirm;
UI.$zlux.notify.closeAll    = closeAll;
