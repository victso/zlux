;(function ($, ZX, window, document, undefined) {
    "use strict";

    var instance_id = 0, active = false, cache = {}, dropdown,
    
    // extend the main manager
    itemsManager = $.extend(true, {}, ZX.components['manager'], {

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
            pagingType: 'uikit_simple',
            pageLength: 5,
            columns:
            [
                {
                    title: '', data: '_itemname', class: 'zx-manager-resource-name uk-width-1-1',
                    render: function (data, type) {
                        return type === 'display' ? '' : data;
                    }
                }
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
                // $('thead tr th:last', settings.nTable).prependTo($('thead tr', settings.nTable));

                // // trigger table init event
                // $this.trigger("InitComplete");
            },
            rowCallback: function(row, data) {
                var rsc_data = data;
                    rsc_data.details = [];

                // set resource details
                rsc_data.details.push( data.application.name + ' / ' + data.type.name + ' / ' + data.id );
                rsc_data.details.push( data.created );

                // add Author if known
                if (data.author.name) rsc_data.details.push({name: $this._('AUTHOR'), value: data.author.name});
            
                var resource = ZX.managerResource(row, rsc_data);
                resource.pushData(rsc_data);

                // set resource dom properties
                resource.element.addClass('zx-manager-resource');

                // fix the column order
                // $('td:last', resource.element).prependTo(resource.element);

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

            // specify zlux version
            data.zlux2 = true;

            
            // hash the request data
            var hash = String($.param(data)).hashCode();

            // if request cached, use instead and abort ajax
            if (cache[hash]) {
                callback( cache[hash] );
                return;
            }

            // request
            ZX.ajax.requestAndNotify({
                url: ZX.url.get('ajax:', {controller: 'zlux', task: 'getItemsManagerData'}),
                data: data,
                queue: 'itemsmanager'
            })

            .done(function (json) {

                // cache the retrieved data
                cache[hash] = json;

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
    });


    /* Itempicker
       ---------------------------------------------- */

    // extends itemsManager
    ZX.component('itempicker', $.extend(true, {}, itemsManager, {

        defaults: {
            offsettop: 5,
            template: function(data, opts) {

                var content = '';

                content += '<div class="zx-manager-nav">';
                    content += '<div class="uk-search">';
                        content += '<input class="uk-search-field" type="search" placeholder="search...">';
                        content += '<button class="uk-search-close" type="reset"></button>';
                    content += '</div>';
                content += '</div>';
                content += '<table class="uk-table zx-manager-resources"></table>';

                return content;
            }
        },

        init: function() {
            var $this = this;

            // init main manager
            ZX.components.manager.init.apply(this);
            
            // set instance id
            this.id = instance_id++;

            // set the filter param
            $this.filter = {};

            // override the ajax function
            this.DTsettings.ajax = function (data, callback, settings) {
                $this.ajax(data, callback, settings);
            };

            this.current  = this.element.val();

            this.on("click", function(){
               if(active!==$this) $this.pick(this.value);
            }).on("change", function(){

               // if($this.element.val() && !moment($this.element.val(), $this.options.format).isValid()) {
               //    $this.element.val(moment().format($this.options.format));
               // }

            });

            // init dropdown
            if (!dropdown) {

                dropdown = $('<div class="uk-dropdown zx-itempicker zx-manager"></div>');
                
                // dropdown.on("click", ".uk-datepicker-next, .uk-datepicker-previous, [data-date]", function(e){
                //     e.stopPropagation();
                //     e.preventDefault();

                //     var ele = $(this);

                //     if (ele.hasClass('uk-datepicker-date-disabled')) return false;

                //     if(ele.is('[data-date]')) {
                //         active.element.val(moment(ele.data("date")).format(active.options.format)).trigger("change");
                //         dropdown.hide();
                //         active = false;
                //     } else {
                //        active.add("months", 1 * (ele.hasClass("uk-datepicker-next") ? 1:-1));
                //     }
                // });

                dropdown.appendTo("body");

                // wrap it for style fix
                dropdown.wrap('<div class="zlux" />');

                // init searh feature
                dropdown.on('change', '.uk-search-field', function(e, input){
                    var value = $(input).val();

                    // filter and redraw
                    $this.resources.DataTable().search(value);
                    $this.resources.DataTable().draw();

                    // close button
                    if (value === '') {
                        $('.uk-search-close', dropdown).hide();
                    } else {
                        $('.uk-search-close', dropdown).show();
                    }
                });

                // reset search action
                dropdown.on('click', '.uk-search-close', function(e){
                    // reset table
                    $this.resources.DataTable().search('');
                    $this.resources.DataTable().draw();

                    // reset form
                    $('.uk-search-field', dropdown).val('');
                    $(this).hide();
                });
            }
       },

       pick: function(inititem) {
           var offset = this.element.offset(),
               css    = {"top": offset.top + this.element.outerHeight() + this.options.offsettop, "left": offset.left, "right":""};

           this.current  = inititem ? inititem:null;
           this.inititem = this.current;

           this.update();

           if ($.UIkit.langdirection == 'right') {
               css.right = window.innerWidth - (css.left + this.element.outerWidth());
               css.left  = "";
           }

           dropdown.css(css).show();

           active = this;
       },

       update: function() {
           var data = {},
               tpl  = this.options.template(data, this.options);

           dropdown.html(tpl);

           // init resources
           this.initResources($('.zx-manager-resources', dropdown));
       },


       DTsettings: {
           columns:
           [
               {
                   title: '', data: '_itemname', class: 'zx-x-main-column uk-width-1-1',
                   render: function (data, type) {
                       return type === 'display' ? '' : data;
                   }
               }
           ],
           rowCallback: function(row, data) {
               var rsc_data = data;
                   rsc_data.details = [];

               // set resource details
               rsc_data.details.push( data.application.name + ' / ' + data.type.name + ' / ' + data.id );
           
               var resource = ZX.managerResource(row, rsc_data);
               resource.pushData(rsc_data);

               // set resource dom properties
               resource.element.addClass('zx-manager-resource');


               // append the resource data
               $('.zx-x-main-column', resource.element).append(
                   resource.render()
               );
           },
           ordering: false
        }

    }));

    // init code
    $(document).on("focus.itempicker.zlux", "[data-zx-itempicker]", function(e) {
        var ele = $(this);

        if (!ele.data("itempicker")) {
            e.preventDefault();
            var obj = ZX.itempicker(ele, $.UIkit.Utils.options(ele.attr("data-zx-itempicker")));
            ele.trigger("focus");
        }
    });

    $(document).on("click.itempicker.zlux", function(e) {
        var target = $(e.target);

        if (active && target[0] != dropdown[0] && !target.data("itempicker") && !target.parents(".zx-itempicker:first").length) {
            dropdown.hide();
            active = false;
        }
    });


    /* Helper functions
       ---------------------------------------------- */

    /**
    * @see http://stackoverflow.com/q/7616461/940217
    * @return {number}
    */
    String.prototype.hashCode = function(){
       if (Array.prototype.reduce){
           return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
       } 
       var hash = 0;
       if (this.length === 0) return hash;
       for (var i = 0; i < this.length; i++) {
           var character  = this.charCodeAt(i);
           hash  = ((hash<<5)-hash)+character;
           hash = hash & hash; // Convert to 32bit integer
       }
       return hash;
    }

    // // init code
    // $(document).on("uk-domready", function(e) {

    //     $("[data-zx-manager-items], input[data-zx-itempicker]").each(function() {
    //         var manager = $(this);

    //         if (!manager.data("itemsManager")) {
    //             var obj = ZX.itemsManager(manager, $.UIkit.Utils.options(manager.attr("data-zx-manager-items")));
    //         }
    //     });
    // });

})(jQuery, jQuery.zlux, window, document);