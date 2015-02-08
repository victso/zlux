;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.nestable = nestable;

    $(document).ready(function($){
        // style workaround, when sortable item is dragged wrap it with zlux
        $('[data-uk-nestable]').on('nestable-start', function() {
            $('.uk-nestable-list-dragged').wrap('<div class="zx" />');
        });
    });

})(jQuery, jQuery.zx, window, document);