var ZX = require('zlux');
var UI = require('uikit');

ZX.extensions = {};

/** PLUGIN **/
ZX.plugin = function(name, def) {

    var fn = function(element, options) {
        this.element = element ? $(element) : null;
        this.init(options);
    };

    UI.$.extend(true, fn.prototype, {

        type: 'plugin',

        init: function(){}

    }, def);


    // save the plugin
    this.extensions[name] = fn;

    // declare the plugin init function and save it into ZX root
    this[name] = function() {

        var element, options;

        if(arguments.length) {
            switch(arguments.length) {
                case 1:

                    if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
                        element = UI.$(arguments[0]);
                    } else {
                        options = arguments[0];
                    }

                    break;
                case 2:

                    element = UI.$(arguments[0]);
                    options = arguments[1];
                    break;
            }
        }

        return (new ZX.extensions[name](element, options));
    };

    return fn;
};


/** FN **/
ZX.fn = function(command, options) {

    var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), extension = cmd[1], method = cmd[2];

    if (!ZX[extension]) {
        UI.$.error("ZLUX extension [" + extension + "] does not exist.");
        return this;
    }

    // component
    if(ZX.extensions[extension].prototype.type === 'component') {

        return this.each(function() {
            // the element
            var $this = UI.$(this),

            // get the saved instance
            data = $this.data(extension);

            // if no instance, init it
            if (!data) {
                $this.data(extension, (data = ZX[extension](this, method ? undefined : options)));
                ZX.extensions[extension].instances.push(data);
            }

            // if method provided, execute it
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    }

    // plugin
    else if(ZX.extensions[extension].prototype.type === 'plugin') {

        return this.each(function() {
            ZX[extension](this, Array.prototype.slice.call(args, 1));
        });
    }
};

UI.$.fn.zx = ZX.fn;
