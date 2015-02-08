;(function ($, ZX, window, document, undefined) {
    "use strict";

    var nestable = function(){},

    // load Uikit Nestable
    loadAssets = function() {
        return $.zx.assets.load(ZX.url.get('zlux:vendor/uikit/js/components/nestable.min.js'));
    };

    ZX.nestable             = nestable;
    ZX.nestable.loadAssets  = loadAssets;


    $.when(ZX.ready()).done(function(){
        ZX.nestable.loadAssets();
    });

    $(document).ready(function($){
        // style workaround, when sortable item is dragged wrap it with zlux
        $('[data-uk-nestable]').on('nestable-start', function() {
            $('.uk-nestable-list-dragged').wrap('<div class="zx" />');
        });
    });

})(jQuery, jQuery.zx, window, document);