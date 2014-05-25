;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.component('manager', {

        id: 0,
        type: '',

        init: function() {
            var $this = this;

            // save the mananger type
            this.type = this.element.attr('data-zx-manager-type');

            // make sure type is set
            if (!this.type) return;
           
            // save nav node ref
            this.nav = ZX.ManagerNav($('.zx-manager-nav', this.element));

            this.nav.addChild();

            // delete resource event
            this.element.on('click', '.zx-manager-resource .zx-x-remove', function(e){
                e.preventDefault();
                var resource = $this.getResource($(this).closest('.zx-manager-resource'));

                // prompt confirmation
                ZX.notify.confirm(ZX.lang._('DELETE_THIS_RESOURCE')).done(function(){
                    $this.deleteResource(resource);
                });
            });
        },

        DTsettings: {
            dom: 't',
            language: {
                emptyTable: ZX.lang._('EMPTY_FOLDER'),
                infoEmpty: ''
            },
            paging: false,
            columns: [
                { 
                    title: "", "data": "type", "searchable": false, "width": "14px", "class": "zx-manager-resource-icon",
                    render: function ( data, type ) {
                        if (type === 'display') {
                            return '<i class="uk-icon-' + (data === 'folder' ? 'folder' : 'file-o') + '"></i>';
                        } else {
                            return data;
                        }
                    }
                },
                { 
                    title: ZX.lang._('NAME'), "data": "name", "class": "zx-manager-resource-name",
                    render: function ( data, type ) {
                        return type === 'display' ? '' : data;
                    },
                    createdCell: function ( cell, cellData, rowData ) {
                        // store path in data
                        $(cell).parent('tr').attr('data-id', ZX.utils.cleanURI( rowData.name ));
                    }
                }
            ],
            columnDefs: {
                visible: false, "targets": [ 2 ]
            },
            sorting: [ [0,'desc'], [1,'asc'] ], // init sort
            serverSide: true,
            ajax: {
                url: ZX.url.ajax('zlux')
            },
            rowCallback: function(row, data) {
                var rsc_data = data;
                    rsc_data.details = [];

                // set resource details
                if (data.type === 'folder') {
                    rsc_data.details.push({name: ZX.lang._('NAME'), value: data.basename});

                } else { // file
                    rsc_data.details.push({name: ZX.lang._('NAME'), value: data.basename});
                    rsc_data.details.push({name: ZX.lang._('TYPE'), value: data.content_type});
                    rsc_data.details.push({name: ZX.lang._('SIZE'), value: data.size.display});
                }

                var $resource = ZX.ManagerResource(row, rsc_data);
                $resource.pushData(rsc_data);

                // set resource dom properties
                $resource.element.attr('data-type', data.type).addClass('zx-manager-resource');

                // reset and append the resource data
                $('.zx-manager-resource-name', $resource.element).html('').append(
                    // render the resource content
                   $resource.render()
                );

                // append the resource edit feature to the name
                $('.zx-x-name', $resource.element).append(
                    '<i class="zx-x-name-edit uk-icon-pencil-square" title="' + ZX.lang._('RENAME') + '" />'
                );
            },
            initComplete: function() {
                // var input_filter = $('.zlux-x-filter-input_wrapper', wrapper)
                
                // .append(
                //     // set search icon
                //     $('<i class="icon-search" />'),
                //     // and the cancel button
                //     $('<i class="icon-remove zlux-ui-dropdown-unselect" />').hide().on('click', function(){
                //         $('input', input_filter).val('');
                //         $(this).hide();
                //         // reset the filter
                //         $this.oTable.fnFilter('');
                //     })
                // );

                // // set search events
                // $('input', input_filter).on('keyup', function(){
                //     if ($(this).val() === '') {
                //         $('.zlux-ui-dropdown-unselect', input_filter).hide();
                //     } else {
                //         $('.zlux-ui-dropdown-unselect', input_filter).show();
                //     }
                // });

                // trigger table init event 50ms after as a workaround if the first ajax call is canceled
                // setTimeout(function() {
                //     this.trigger("InitComplete");
                // }, 50);
            },
            preDrawCallback: function() {
                // show processing
                // $this.zluxdialog.spinner('show');
            },
            drawCallback: function(settings) {
                // pagination hide/show
                // var oPaging = $this.table.fnPagingInfo(),
                //     pagination = $('.dataTables_paginate', $(settings.tableWrapper)).closest('.row-fluid');
                
                // if (oPaging.totalPages <= 1) pagination.hide(); else pagination.show();

                // trigger event
                this.trigger("DrawCallback");

                // // update dialog scrollbar
                // $this.zluxdialog.scrollbar('refresh');

                // // hide spinner
                // $this.zluxdialog.spinner('hide');
            }
        },

        initManager: function() {
            // init table
            this.initResources();
        },

        getResource: function(resource) {
            // if already a resource object return directly, else retrieve from node
            return resource instanceof jQuery ? resource.data('ManagerResource') : resource;
        },

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


            // pre action event, allow changing request data
            this.element.trigger('preResourceDelete', request);


            // make the request and return a promise
            ZX.ajax.request(request).done(function(json) {

                // remove the resource node
                resource.element.fadeOut('slow', function(){
                    $(this).remove();

                    // remove the object from cache
                    // var aaData = $.zlux.filesManager.aAjaxDataCache[$this.sCurrentPath].aaData;
                    // $.each(aaData, function(i, value){
                    //     if ($object.dom.data('id') === value.name && $object.dom.data('type') === value.type) {
                    //         // found, remove
                    //         aaData.splice(i, 1);

                    //         // stop iteration
                    //         return false;
                    //     }
                    // });

                    // redraw the other instances
                    // $this.redrawInstances();
                });
                
                // trigger event
                $this.element.trigger('resourceDeleted', resource);

            }).fail(function(response){
                console.log('failed L2');
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
    });


    ZX.component('ManagerResource', {

        data: {},

        defaults: {
            template      : '<div class="zx-manager-resource-tools">\
                                <i class="zx-x-details-btn uk-icon-angle-down" />\
                                <i class="zx-x-remove uk-icon-minus-circle" data-uk-tooltip title="' + ZX.lang._('DELETE') + '" />\
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
                                        {{/items}}\
                                        </ul>\
                                </div>\
                            </div>\
                            {{/end}}',
        },

        init: function() {
        },

        /* renders the resource content */
        render: function() {
            
            return $.UIkit.Utils.template(this.defaults.template, this.data);
        },

        /* push new resource data into the current one */
        pushData: function(data) {
            this.data = $.extend({}, this.data, data);
        }

    });

    
    ZX.component('ManagerNav', {

        defaults: {
            template      : '<ul class="uk-navbar-nav">\
                <li class="uk-active"><a href="#"><i class="uk-icon-filter"></i>Active</a></li>\
                <li class=""><a href="#"><i class="uk-icon-filter"></i>other</a></li>\
                </ul>'
        },

        init: function() {
            this.element.append(this.options.template);
        },

        addChild: function() {
            $('ul', this.element).append('<li class=""><a href="#"><i class="uk-icon-filter"></i>other</a></li>');
        }
    });

    // init code
    $(document).on("uk-domready", function(e) {

        $("[data-zx-manager]").each(function() {
            var manager = $(this);

            if (!manager.data("manager")) {
                var obj = ZX.manager(manager, $.UIkit.Utils.options(manager.attr("data-zx-manager")));
            }
        });
    });

})(jQuery, jQuery.zlux, window, document);