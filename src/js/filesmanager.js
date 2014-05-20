;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.component('filesmanager', {

        defaults: {
            "toggle": ">li.uk-parent > a[href='#']",
            "lists": ">li.uk-parent > ul",
            "multiple": false
        },

        init: function() {
            var $this = this;
            
            // // set navbar
            // $this.element.append(
            //     '<nav class="uk-navbar">' +
            //         '<ul class="uk-navbar-nav">' +
            //             '<li class="uk-active"><a href="#">...</a></li>' +
            //            '<li><a href="#">...</a></li>' +
            //            '<li class="uk-parent"><a href="#">...</a></li>' +
            //         '</ul>' +
            //     '</nav>');

// console.log($.UIkit.Utils.template('{{~items}}\
//                                           <li data-url="{{!$item.url}}">\
//                                               <a href="{{!$item.url}}">\
//                                                   {{{$item.title}}}\
//                                                   {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}\
//                                               </a>\
//                                           </li>\
//                                           {{/items}}', {'items':[{'url':'mi url 1'}, {'url':'url2'}]}));


            // init dataTable
            $this.table = $('.zx-manager-list', $this.element).addClass('uk-table-striped').dataTable({
                "dom": "F<'row-fluid'<'span12't>>",
                "language": {
                    "emptyTable": ZX.lang._('EMPTY_FOLDER'),
                    "infoEmpty": ""
                },
                "paging": false,
                "columns": [
                    { 
                        "title": "", "data": "type", "searchable": false, "width": "14px", "class": "zx-manager-resource-icon",
                        "render": function ( data, type ) {
                            if (type === 'display') {
                                return '<i class="uk-icon-' + (data === 'folder' ? 'folder' : 'file') + '"></i>';
                            } else {
                                return data;
                            }
                        }
                    },
                    { 
                        "title": ZX.lang._('NAME'), "data": "name", "class": "zx-manager-resource-name",
                        "render": function ( data, type ) {
                            return type === 'display' ? '' : data;
                        },
                        "createdCell": function ( cell, cellData, rowData ) {
                            // store path in data
                            $(cell).parent('tr').attr('data-id', ZX.utils.cleanPath( rowData.name ));
                        }
                    }
                ],
                "columnDefs": {
                    "visible": false, "targets": [ 2 ]
                },
                "sorting": [ [0,'desc'], [1,'asc'] ], // init sort
                // "ajax": function ( data, callback, settings ) {
                //     ZX.lang._fnServerData(data, callback, settings);
                // },
                // "sAjaxUrl": $.zlux.url.ajax('zlux'),
                // "sAjaxSource": $.zlux.url.ajax('zlux', 'getFilesManagerData'),
                "ajax": {
                    "url": "data/folder_tree.json",
                },
                "rowCallback": function(row, data) {
                    var $resource = data;
                    
                    // save resource dom
                    $resource.dom = $(row);

                    // set resource dom properties
                    $resource.dom.attr('data-type', data.type).addClass('zx-manager-resource');

                    // reset and append the resource data
                    $('.zx-manager-resource-name', $resource.dom).html('').append(
                        // render the resource content
                        $this.renderResource($resource)
                    );

                    // append the resource edit feature to the name
                    $('.zlux-x-name', $resource.dom).append(
                        '<i class="zlux-x-name-edit uk-icon-pencil-square" title="' + ZX.lang._('RENAME') + '" />'
                    );
                },
                "initComplete": function() {
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
                    setTimeout(function() {
                        $this.trigger("InitComplete");
                    }, 50);
                },
                "preDrawCallback": function() {
                    // show processing
                    // $this.zluxdialog.spinner('show');
                },
                "drawCallback": function(settings) {
                    // pagination hide/show
                    // var oPaging = $this.table.fnPagingInfo(),
                    //     pagination = $('.dataTables_paginate', $(settings.tableWrapper)).closest('.row-fluid');
                    
                    // if (oPaging.totalPages <= 1) pagination.hide(); else pagination.show();

                    // trigger event
                    $this.trigger("DrawCallback");

                    // // update dialog scrollbar
                    // $this.zluxdialog.scrollbar('refresh');

                    // // hide spinner
                    // $this.zluxdialog.spinner('hide');
                }
            })

            // set Object details Open event
            .on('click', '.zlux-x-details-btn', function(){
                var toggle = $(this),
                    $resource = toggle.closest('.zx-manager-resource'),
                    details = $('.zlux-x-details', $resource);

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
        },

        /**
         * Render the Resource content
         */
        renderResource: function($object) {
            var $this = this,
                aDetails;

            // set the details
            // if ($object.type === 'folder') {

            //     aDetails = [
            //         {name: ZX.lang._('NAME'), value: $object.basename}
            //     ];

            // } else { // file

            //     aDetails = [
            //         {name: ZX.lang._('NAME'), value: $object.basename},
            //         {name: ZX.lang._('TYPE'), value: $object.content_type},
            //         {name: ZX.lang._('SIZE'), value: $object.size.display}
            //     ];
            // }

            // // prepare the details
            // var sDetails = '';
            // $.each(aDetails, function(i, detail){
            //     sDetails += '<li><strong>' + detail.name + '</strong>: <span>' + detail.value + '</span></li>';
            // });

            // // set entry details
            // var content = $(

               
            // );

            // return content;
            return '';
        }
    });


    ZX.component('ManagerResource', {

        defaults: {
            template      : '<div class="zx-manager-resource-tools">\
                                <i class="zlux-x-details-btn uk-icon-angle-down" />\
                                <i class="zlux-x-remove uk-icon-minus-circle" title="{title.delete}" />\
                            </div>\
                            <div class="zlux-x-name"><a href="#" class="zlux-x-name-link">{{name}}</a></div>\
                            <div class="zlux-x-details">\
                                <div class="zlux-x-messages" />\
                                <div class="zlux-x-details-content">\
                                    <ul class="uk-list">{{~products}}  {{ products[$i]==$item }}  {{/products}}</ul>\
                                </div>\
                            </div>',

            // example
            renderer: function(data) {

                var $this = this, opts = this.options;

                this.dropdown.append(this.template({"items":data.results || [], "msgResultsHeader":opts.msgResultsHeader, "msgMoreResults": opts.msgMoreResults, "msgNoResults": opts.msgNoResults}));
                this.show();
            }
        },

        init: function() {
            var $this = this;

           
        }

    });

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-zx-filesmanager]").each(function() {
            var filesmanager = $(this);

            if (!filesmanager.data("filesmanager")) {
                var obj = ZX.filesmanager(filesmanager, $.UIkit.Utils.options(filesmanager.attr("data-uk-filesmanager")));
            }
        });
    });

})(jQuery, jQuery.zlux, window, document);