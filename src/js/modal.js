;(function ($, ZX, window, document, undefined) {
    "use strict";

    var modal = function(){},

    dialog = function(content, options){

        var modal = $.UIkit.modal.dialog(content, options);

        // wrapp for styling
        $(modal.element).wrap($('<div class="zlux" />'));

        // extend modal with
        $.extend(modal, {

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

        return modal;
    },

    alert = function(content, options){

        var modal = $.UIkit.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary uk-modal-close">'+ZX.lang.get('Ok')+'</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options));

        // wrapp for styling
        $(modal.element).wrap($('<div class="zlux" />'));

        modal.show();

        return modal;
    },

    confirm = function(content, onconfirm, options){

        onconfirm = $.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = $.UIkit.modal.dialog(([
           '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
           '<div class="uk-modal-buttons"><button class="uk-button uk-button-small uk-button-primary js-modal-confirm">'+ZX.lang.get('Ok')+'</button> <button class="uk-button uk-button-small uk-modal-close">'+ZX.lang.get('Cancel')+'</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options));

        // wrapp for styling
        $(modal.element).wrap($('<div class="zlux" />'));

        modal.element.find(".js-modal-confirm").on("click", function(){
           onconfirm();
           modal.hide();
        });

        modal.show();

        return modal;
    };


    ZX.modal          = modal;
    ZX.modal.dialog   = dialog;
    ZX.modal.alert    = alert;
    ZX.modal.confirm  = confirm;

})(jQuery, jQuery.zlux, window, document);