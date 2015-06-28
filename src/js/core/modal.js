var _ = require('../util');
var UI = require('uikit');
var ZX = _.zlux;

exports.modal = {

    dialog: function(content, options){

        var modal = UI.$.UIkit.modal.dialog(content, options);

        // extend modal with
        UI.$.extend(modal, {

            // update content
            content: function(html) {
                var container = this.dialog;

                if(!html) {
                    return container.html();
                }

                container.html(html);

                return this;
            }
        });

        // add zlux class for the holding content styling
        modal.element.addClass('zx');

        return modal;
    },

    alert: function(content, options){

        var modal = UI.$.UIkit.modal.dialog(([
            '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary uk-modal-close">' + ZX.lang.get('Ok') + '</button></div>'
        ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

        modal.show();

        return modal;
    },

    confirm: function(content, onconfirm, options){

        onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = UI.$.UIkit.modal.dialog(([
           '<div class="uk-margin uk-modal-content">' + String(content) + '</div>',
           '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary js-modal-confirm">' + ZX.lang.get('Ok') + '</button> <button class="uk-button uk-button-small uk-modal-close">' + ZX.lang.get('Cancel') + '</button></div>'
       ]).join(''), UI.$.extend({bgclose: false, keyboard: false}, options));

        modal.element.find('.js-modal-confirm').on('click', function(){
           onconfirm();
           modal.hide();
        });

        modal.show();

        return modal;
    }

};
