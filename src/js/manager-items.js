;(function ($, ZX, window, document, undefined) {
    "use strict";

    var instance_id = 0,
        cache = {};
    
    // declare new component extending the manager one
    ZX.component('itemsManager', $.extend(true, {}, ZX.components['manager'], {

        defaults: {
            apps: '', // Array or comma separated values
            types: '', // idem
            categories: '', // idem
            tags: '', // idem
            authors: '' // idem
        },

        init: function() {
            var $this = this;

            // init main manager
            ZX.components['manager'].init.apply(this);
            
            // set instance id
            this.id = instance_id++;

            // set the filter param
            $this.filter = {};

            // // EVENT resource selected
            // this.on('resourceSelected', function (e, resource)
            // {
                
            // });

            // // EVENT resource deleted
            // this.on('resourceDeleted', function (e, resource)
            // {
               
            // });

            // override the ajax function
            this.DTsettings.ajax = function (data, callback, settings) {
                $this.ajax(data, callback, settings);
            };

            // all set, init resources
            this.initResources();
        },

        DTsettings: {
            language: {
                emptyTable: ZX.lang._('IM_NO_ITEMS_FOUND'),
                info: ZX.lang._('IM_PAGINATION_INFO')
            },
            serverSide: true,
            displayLength: 20,
            columns:
            [
                {
                    title: ZX.lang._('NAME'), data: '_itemname', class: 'zx-manager-resource-name uk-width-1-1',
                    render: function (data, type) {
                        return type === 'display' ? '' : data;
                    },
                    createdCell: function (cell, cellData, rowData) {
                        $(cell).parent('tr').attr('data-id', rowData.id);
                    }
                },
                { 
                    title: 'App', data: 'application', sortable: false,
                    render: function (data, type) {
                        return type === 'display' ? data.name : data.id;
                    }
                },
                { 
                    title: 'Type', data: 'type', sortable: false,
                    render: function (data, type) {
                        return type === 'display' ? data.name : data.id;
                    }
                },
                { title: 'Access', data: 'access', searchable: false, sortable: false },
                { title: 'Author', data: 'author', searchable: false, sortable: false,
                    render: function (data, type) {
                        return type === 'display' ? data.name : data.id;
                    }
                },
                {
                    title: 'ID', data: 'id', searchable: false, sortable: false
                },
                {
                    title: '', data: 'type', sortable: false, searchable: false, class: 'zx-manager-resource-icon',
                    render: function (data, type) {
                        if (type === 'display') {
                            return '<i class="uk-icon-file-o"></i>';
                        } else {
                            return data;
                        }
                    }
                }
            ],
            columnDefs: [
                { visible: false, targets: [ 1, 2, 3, 4, 5 ] }
            ],
            initComplete: function(settings) {
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

                // // fix the header column order
                $('thead tr th:last', settings.nTable).prependTo($('thead tr', settings.nTable));

                // // trigger table init event
                // $this.trigger("InitComplete");
            },
            rowCallback: function(row, data) {
                var rsc_data = data;
                    rsc_data.details = [];

                // set resource details
                rsc_data.details.push({name: ZX.lang._('ROUTE'), value: data.application.name + ' / ' + data.type.name + ' / ID ' + data.id});
                rsc_data.details.push({name: ZX.lang._('ACCESS'), value: data.access});
                rsc_data.details.push({name: ZX.lang._('CREATED'), value: data.created});

                // add Author if known
                if (data.author.name) rsc_data.details.push({name: $this._('AUTHOR'), value: data.author.name});
            
                var resource = ZX.managerResource(row, rsc_data);
                resource.pushData(rsc_data);

                // set resource dom properties
                resource.element.addClass('zx-manager-resource');

                // fix the column order
                $('td:last', resource.element).prependTo(resource.element);

                // reset and append the resource data
                $('.zx-manager-resource-name', resource.element).html('').append(
                    // render the resource content
                    resource.render()
                );
            },
            preDrawCallback: function(settings) {
                // show processing
                // $this.zluxdialog.spinner('show');

                // trigger event
                // $this.trigger("DTPreDrawCallback", oSettings);
            },
            drawCallback: function(settings) {
                // pagination hide/show
                // var oPaging = oSettings.oInstance.fnPagingInfo(),
                //     pagination = $('.dataTables_paginate', $(oSettings.nTableWrapper)).closest('.row-fluid');
                
                // // hide/show the pagination
                // if (oPaging.iTotalPages <= 1) pagination.hide(); else pagination.show();

                // // update dialog scrollbar
                // $this.zluxdialog.scrollbar('refresh');

                // // hide processing
                // $this.zluxdialog.spinner('hide');

                // // trigger event
                // $this.trigger("TableDrawCallback", oSettings);
            }
        },

        ajax: function (data, callback, settings) {
            var $this = this,

            // determine what filter values to use
            apps = $this.filter.apps ? $this.filter.apps : $this.options.apps,
            types = $this.filter.types ? $this.filter.types : $this.options.types,
            cats = $this.filter.cats ? $this.filter.cats : $this.options.categories,
            tags = $this.filter.tags ? $this.filter.tags : $this.options.tags,
            authors = $this.filter.authors ? $this.filter.authors : $this.options.authors;

            // push the preset filter values
            data.apps = $this.options.apps;
            data.types = $this.options.types;
            data.categories = $this.options.categories;
            data.tags = $this.options.tags;
            data.authors = $this.options.authors;

            // push the new filter values
            data.filter_apps = apps;
            data.filter_types = types;
            data.filter_cats = cats;
            data.filter_tags = tags;


            // request
            ZX.ajax.requestAndNotify({
                url: ZX.url.ajax('zlux', 'getItemsManagerData'),
                data: data,
                queue: 'itemsmanager'
            })

            .done(function (json) {

                // redraw
                callback(json);
            });
        },

        /**
         * Reload the data from source and redraw
         */
        reload: function() {
            var $this = this;

            // reload
            $this.resources.DataTable().ajax.reload();
        },

        preResourceDelete: function(resource, request) {
            var $this = this;

            // adapt request
        }
    }));


    /* Helper functions
       ---------------------------------------------- */



    // init code
    $(document).on("uk-domready", function(e) {

        $("[data-zx-manager-items]").each(function() {
            var manager = $(this);

            if (!manager.data("itemsManager")) {
                var obj = ZX.itemsManager(manager, $.UIkit.Utils.options(manager.attr("data-zx-manager-items")));
            }
        });
    });

})(jQuery, jQuery.zlux, window, document);