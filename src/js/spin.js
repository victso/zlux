;(function ($, ZX, window, document, undefined) {
    "use strict";
    
    ZX.component('spin', {

        defaults: {
            class: '',
            affix:  'append' // append, prepend or replace
        },

        init: function() {},

        on: function(args) {
            var $this = this;

            $this.icon_class = false;

            // check for icon, use it if found
            if($('i', $this.element)[0]) {
                $this.icon_class = $('i', $this.element).attr('class');
                $('i', $this.element).attr('class', 'uk-icon-zx-spinner uk-icon-spin');

            // create the icon if not
            } else if($this.options.affix == 'replace') {
                $this.element.html($('<i class="uk-icon-zx-spinner uk-icon-spin"></i>').addClass($this.options['class']));
            } else {
                $this.element[$this.options.affix]($('<i class="uk-icon-zx-spinner uk-icon-spin"></i>').addClass($this.options['class']));
            }
        },

        off: function(args) {
            var $this = this;

            // remove the spin classes but not the icon
            $('i', $this.element).removeClass('uk-icon-zx-spinner uk-icon-spin');

            // recover class, if any
            if($this.icon_class) $('i', $this.element).attr('class', $this.icon_class);
        }

    });

})(jQuery, jQuery.zlux, window, document);