var ZX = require('zlux');
var UI = require('uikit');

ZX.extensions = {};

/** COMPONENT **/
ZX.component = function(name, def) {

    var fn = function(element, options) {
        var $this = this;

        this.element = element ? UI.$(element) : null;
        this.options = UI.$.extend(true, {}, this.defaults, options);
        this.plugins = {};

        if (this.element) {
            this.element.data(name, this);
        }

        this.init();

        (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

            if (fn.plugins[plugin].init) {
                fn.plugins[plugin].init($this);
                $this.plugins[plugin] = true;
            }

        });

        this.trigger('init', [this]);
    };

    fn.plugins = {};
    fn.instances = [];

    UI.$.extend(true, fn.prototype, {

        type: 'component',

        defaults: {plugins: []},

        boot: function(){},
        init: function(){},

        on: function(){
            return UI.$(this.element || this).on.apply(this.element || this, arguments);
        },

        one: function(){
            return UI.$(this.element || this).one.apply(this.element || this, arguments);
        },

        off: function(evt){
            return UI.$(this.element || this).off(evt);
        },

        trigger: function(evt, params) {
            return UI.$(this.element || this).trigger(evt, params);
        },

        find: function(selector) {
            return this.element ? this.element.find(selector) : $([]);
        },

        proxy: function(obj, methods) {
            var $this = this;

            methods.split(' ').forEach(function(method) {
                if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
            });
        },

        mixin: function(obj, methods) {
            var $this = this;

            methods.split(' ').forEach(function(method) {
                if (!$this[method]) $this[method] = obj[method].bind($this);
            });
        }

    }, def);

    // save the component
    this.extensions[name] = fn;

    // declare the component init function and save it into ZX root
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

        if (element && element.data(name)) {
            return element.data(name);
        }

        return (new ZX.extensions[name](element, options));
    };

    // Component plugin declaration
    this[name].plugin = function(plugin, def) {
        ZX.extensions[name].plugins[plugin] = def;
    };

    if (UI.domready) {
        UI.component.boot(name);
    }

    return fn;
};

ZX.component.boot = function(name) {

    if (ZX.extensions[name].prototype && ZX.extensions[name].prototype.boot && !ZX.extensions[name].booted) {
        ZX.extensions[name].prototype.boot.apply(ZX, []);
        ZX.extensions[name].booted = true;
    }
};

ZX.component.bootComponents = function() {

    for (var component in ZX.extensions) {
        ZX.component.boot(component);
    }

}

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
