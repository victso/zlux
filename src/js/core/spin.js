var ZX = require('zlux');
var UI = require('uikit');
    
ZX.component('spin', {

    defaults: {
        class: '',
        affix:  'append' // append, prepend or replace
    },

    init: function() {
        // run default
        this.on();
    },

    on: function() {
        var $this = this;

        $this.icon_class = false;

        // find and existing icon
        $this.icon = $this.element.is('i') ? $this.element : UI.$('i', $this.element).first();

        // use it if found
        if($this.icon.length) {
            // save original class
            $this.icon_class = $this.icon.attr('class');
            // hardcode the width to avoid movement effects
            $this.icon.width($this.icon.width());
            // set new class
            $this.icon.attr('class', 'uk-icon-zx-spinner uk-icon-spin');

        // else, create one
        } else {
            $this.icon = UI.$('<i class="uk-icon-zx-spinner uk-icon-spin"></i>');

            // place the icon
            if($this.options.affix == 'replace') {
                $this.element.html($this.icon);
            } else {
                $this.element[$this.options.affix]($this.icon);
            }
        }

        // add custom class
        $this.icon.addClass($this.options['class']);
    },

    off: function() {
        var $this = this;

        // remove the spin classes but not the icon
        $this.icon.removeClass('uk-icon-zx-spinner uk-icon-spin');

        // recover class, if any
        if($this.icon_class) $this.icon.attr('class', $this.icon_class);

        // remove hardcoded width
        $this.icon.width('');

        // remove spin instance from element
        $this.element.removeData('spin');
    }
});