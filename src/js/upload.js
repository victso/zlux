;(function ($, ZX, window, document, undefined) {
    "use strict";

    var instance_id = 0,
        cache = {};
    
    ZX.component('upload', {

        defaults: {
            root: '', // relative path to the root folder
            extensions: '', // array or comma separated values of allowed extensions
            storage: 'local',
            storage_params: {},
            max_file_size: '',
            resize: {}
        },

        init: function() {
            var $this = this;

            // set the resources list

        }

    });

    // init code
    $(document).on('uk-domready', function(e) {

        $('.zx-manager [data-zx-manager-upload]').each(function() {
            var manager = $(this);

            if (!manager.data('uploadManager')) {
                var obj = ZX.uploadManager(manager, $.UIkit.Utils.options(manager.attr('data-zx-manager-upload')));
            }
        });
    });

})(jQuery, jQuery.zx, window, document);