var UI = require('uikit')

module.exports = function(ZX) {

    ZX.plugin('animate', {

        init: function(options) {
            var $this = this,

            // set animation class
            animation = 'zx-animate-' + UI.$.trim(options[0]),

            // set callback
            callback = options[1] ? options[1] : null

            // animate
            $this.animate(animation).done(function(){

                // execute any callback passing the element as scope
                if (callback) callback.apply($this.element)

            });
        },

        animate: function(animation) {
            var $this = this;

            return UI.$.Deferred(function(defer) {

                // animate the element with CSS3
                $this.element.addClass(animation)

                // when done
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {

                    // remove the class to allow further animation
                    $this.element.removeClass(animation)
                    defer.resolve()

                });

            }).promise()
        }
    })

}