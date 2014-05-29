;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.components['manager'] = {

        id: 0,

        init: function() {
            var $this = this;
           
            // save nav node ref
            this.nav = ZX.managerNav($('.zx-manager-nav', this.element));

            this.nav.addChild({icon: 'filter'});
            this.nav.addChild({icon: 'user'});

            // delete resource event
            this.on('click', '.zx-manager-resource .zx-x-remove', function(e){
                e.preventDefault();
                var resource = $this.getResource($(this).closest('.zx-manager-resource'));

                // prompt confirmation
                ZX.notify.confirm(ZX.lang._('DELETE_THIS_RESOURCE'), {timeout: false}).done(function(){
                    $this.deleteResource(resource);
                });
            });


            // EVENT trigger resourceSelected
            this.on('click', '.zx-manager-resource .zx-x-name a', function (e) {
                $this.trigger('resourceSelected', $this.getResource($(this).closest('.zx-manager-resource')));
                e.preventDefault();
            });
        },

        DTsettings: {
            dom: 't',
            language: {
                emptyTable: ZX.lang._('EMPTY_FOLDER'),
                infoEmpty: ''
            },
            stripeClasses: [] // uikit doesn't need stipe class on each row
        },

        getResource: function(resource) {
            // if already a resource object return directly, else retrieve from node
            return resource instanceof jQuery ? resource.data('ManagerResource') : resource;
        },

        preResourceDelete: function(resource, request) {},

        deleteResource: function(resource) {
            var $this = this;

            // only allowed to be submited once
            // if ($(this).data('submited')) return; $(this).data('submited', true);

            var request = {
                url: $.zlux.url.ajax('zlux', 'deleteResource'),
                data: {
                    type: $this.type
                }
            };

            // start spinner
            // $('.column-icon i', resource.dom).spin('on');


            // pre action, allow changing request data
            this.preResourceDelete(resource, request);

            // make the request and return a promise
            ZX.ajax.request(request).done(function(json) {

                // remove the resource node
                resource.element.fadeOut('slow', function(){
                    $(this).remove();

                    // trigger event
                    $this.trigger('resourceDeleted', resource);
                });

            }).fail(function(response){
     
                // console.log(response);

                // show the message
                // $this.pushMessageToObject($object, msg);
            })

            // on result
            .always(function(json) {
                // console.log(json);
                // remove spinner
                // $('.column-icon i', $object.dom).removeClass('uk-icon-spinner uk-icon-spin');
            });
        },

        initResources: function() {
            var $this = this;

            // init DataTables
            this.resources = $('.zx-manager-resources', this.element).dataTable($this.DTsettings)

            // set Object details Open event
            .on('click', '.zx-x-details-btn', function(){
                var toggle = $(this),
                    $resource = toggle.closest('.zx-manager-resource'),
                    details = $('.zx-x-details', $resource);

                // open the details
                if (!$resource.hasClass('zx-open')) {
                    $resource.addClass('zx-open');
                    toggle.removeClass('uk-icon-angle-down').addClass('uk-icon-angle-up');

                    // scroll to the Object with animation
                    // $this.zluxdialog.content.stop().animate({
                    //     'scrollTop': $resource.get(0).offsetTop
                    // }, 900, 'swing');

                    // open, when done...
                    details.slideDown('fast', function(){
                        // $this.zluxdialog.scrollbar('refresh');
                    });

                // close them
                } else {
                    toggle.addClass('uk-icon-angle-down').removeClass('uk-icon-angle-up');
                    $resource.removeClass('zx-open');
                    details.slideUp('fast', function(){
                        // $this.zluxdialog.scrollbar('refresh');
                    });
                }
            });
        }
    };


    ZX.component('managerResource', {

        // data defaults
        data: {
            editable: false
        },

        // option defaults
        defaults: {
            template      : '<div class="zx-manager-resource-tools">\
                                <i class="zx-x-details-btn uk-icon-angle-down" />\
                                {{#editable}}\
                                <i class="zx-x-remove uk-icon-minus-circle" data-uk-tooltip title="' + ZX.lang._('DELETE') + '" />\
                                {{/some}}\
                            </div>\
                            <div class="zx-x-name"><a href="#" class="zx-x-name-link">{{name}}</a></div>\
                            {{#details && details.length}}\
                            <div class="zx-x-details">\
                                <div class="zx-x-messages" />\
                                <div class="zx-x-details-content">\
                                    <ul class="uk-list">\
                                        {{~details}}\
                                        <li>\
                                            <strong>{{$item.name}}</strong>: \
                                            <span>{{$item.value}}</span>\
                                        </li>\
                                        {{/details}}\
                                        </ul>\
                                </div>\
                            </div>\
                            {{/end}}',
        },

        init: function() {},

        /* renders the resource content */
        render: function() {
            return $.UIkit.Utils.template(this.options.template, this.data);
        },

        /* push new resource data into the current one */
        pushData: function(data) {
            this.data = $.extend({}, this.data, data);
        }

    });

    
    ZX.component('managerNav', {

        defaults: {
            template:       '<ul class="uk-navbar-nav">\
                                <li class="uk-parent" data-uk-dropdown>\
                                    <a href=""><i class="uk-icon-bars"></i></a>\
                                    <div class="uk-dropdown uk-dropdown-navbar">\
                                        <ul class="uk-nav uk-nav-navbar">\
                                            <li><a href="">Another item</a></li>\
                                        </ul>\
                                    </div>\
                                </li>\
                            </ul>\
                            <div class="uk-navbar-content">\
                                <form class="uk-form uk-margin-remove uk-display-inline-block">\
                                   <input type="text" placeholder="Search">\
                                </form>\
                            </div>',
            option_tmpl    : '<li><a href=""><i class="uk-icon-{{icon}}"></i> Some text </a></li>'
        },

        init: function() {
            this.element.append(this.options.template);
        },

        addChild: function(data) {
            this.find('.uk-dropdown > ul').append($.UIkit.Utils.template(this.options.option_tmpl, data));
        }
    });

})(jQuery, jQuery.zlux, window, document);