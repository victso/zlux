;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.components['manager'] = {

        id: 0,

        init: function() {
            var $this = this;
           
            // save nav node ref
            // this.nav = ZX.managerNav($('.zx-manager-nav', this.element));

            // this.nav.addChild({icon: 'filter'});
            // this.nav.addChild({icon: 'user'});

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
            dom: 'tp',
            language: {
                emptyTable: ZX.lang._('EMPTY_FOLDER'),
                infoEmpty: ''
            },
            stripeClasses: [] // uikit doesn't need stipe class on each row
        },

        DT_uikit_pagination: {
            fnInit: function( oSettings, nPaging, fnCallbackDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnCallbackDraw( oSettings );
                    }
                };

                $(nPaging).addClass('pagination').append(
                    '<ul class="uk-pagination">'+
                        '<li class="zx-x-first uk-disabled"><a href="#"><i class="uk-icon-angle-double-left"></i></a></li>'+
                        '<li class="zx-x-prev uk-disabled"><a href="#"><i class="uk-icon-angle-left"></i></a></li>'+
                        '<li class="zx-x-next uk-disabled"><a href="#"><i class="uk-icon-angle-right"></i></a></li>'+
                        '<li class="zx-x-last uk-disabled"><a href="#"><i class="uk-icon-angle-double-right"></i></a></li>'+
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: 'first' }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: 'previous' }, fnClickHandler );
                $(els[2]).bind( 'click.DT', { action: 'next' }, fnClickHandler );
                $(els[3]).bind( 'click.DT', { action: 'last' }, fnClickHandler );
            },

            fnUpdate: function ( oSettings, fnCallbackDraw ) {
                var iListLength = 4;
                var paging = oSettings.oInstance.DataTable().page.info();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( paging.pages < iListLength) {
                    iStart = 1;
                    iEnd = paging.pages;
                }
                else if ( paging.page <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( paging.page >= (paging.pages-iHalf) ) {
                    iStart = paging.pages - iListLength + 1;
                    iEnd = paging.pages;
                } else {
                    iStart = paging.page - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, ien=an.length ; i<ien ; i++ ) {
                    // Remove the middle elements
                    $('li:gt(1)', an[i]).filter(':not(:last)').not('.zx-x-next').remove();

                    // Add the new list items and their event handlers
                    for ( j=iStart ; j<=iEnd ; j++ ) {
                        var active = (j==paging.page+1);
                        sClass = active ? 'class="uk-active"' : '';
                        $('<li '+sClass+'>'+(active ? '<span>' : '<a href="#">')+j+(active ? '</span>' : '</a>')+'</li>')

                            .insertBefore( $('li.zx-x-next, li.zx-x-last', an[i])[0] )
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * paging.length;
                                fnCallbackDraw( oSettings );
                            });
                    }

                    // Add / remove disabled classes from the static elements
                    if ( paging.page === 0 ) {
                        $('li.zx-x-first, li.zx-x-prev', an[i]).addClass('uk-disabled');
                    } else {
                        $('li.zx-x-first, li.zx-x-prev', an[i]).removeClass('uk-disabled');
                    }

                    if ( paging.page === paging.pages-1 || paging.pages === 0 ) {
                        $('li.zx-x-next, li.zx-x-last', an[i]).addClass('uk-disabled');
                    } else {
                        $('li.zx-x-next, li.zx-x-last', an[i]).removeClass('uk-disabled');
                    }
                }
            }
        },

        DT_uikit_pagination_simple: {
            fnInit: function( oSettings, nPaging, fnCallbackDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    console.log(oSettings.oApi._fnPageChange(oSettings, e.data.action));
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnCallbackDraw( oSettings );
                    }
                };

                $(nPaging).addClass('pagination').append(
                    '<ul class="uk-list zx-manager-pagination">'+
                        '<li class="zx-manager-pagination-prev uk-disabled"><a href=""></a></li>'+
                        '<li class="zx-manager-pagination-next uk-disabled"><a href=""></a></li>'+
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: 'previous' }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: 'next' }, fnClickHandler );
            },

            fnUpdate: function ( oSettings, fnCallbackDraw ) {
                var iListLength = 4;
                var paging = oSettings.oInstance.DataTable().page.info();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( paging.pages < iListLength) {
                    iStart = 1;
                    iEnd = paging.pages;
                }
                else if ( paging.page <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( paging.page >= (paging.pages-iHalf) ) {
                    iStart = paging.pages - iListLength + 1;
                    iEnd = paging.pages;
                } else {
                    iStart = paging.page - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, ien=an.length ; i<ien ; i++ ) {
                    // Remove the middle elements
                    // $('li:gt(1)', an[i]).filter(':not(:last)').not('.zx-x-next').remove();

                    // Add / remove disabled classes from the static elements
                    if ( paging.page === 0 ) {
                        $('li.zx-x-prev', an[i]).addClass('uk-disabled');
                    } else {
                        $('li.zx-x-prev', an[i]).removeClass('uk-disabled');
                    }

                    if ( paging.page === paging.pages-1 || paging.pages === 0 ) {
                        $('li.zx-x-next', an[i]).addClass('uk-disabled');
                    } else {
                        $('li.zx-x-next', an[i]).removeClass('uk-disabled');
                    }
                }
            }
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

        initResources: function(resources_dom) {
            var $this = this;

            // load DataTables
            ZX.assets.load(ZX.url.get('zlux:js/dataTables.min.js')).done(function(){

                // set uikit pagination option
                $.fn.dataTableExt.pager.uikit = $this.DT_uikit_pagination;
                $.fn.dataTableExt.pager.uikit_simple = $this.DT_uikit_pagination_simple;

                // init DataTables
                $this.resources = resources_dom.dataTable($this.DTsettings)

                // set Object details Open event
                .on('click', '.zx-x-details-btn', function(){
                    var toggle = $(this),
                        resource = toggle.closest('.zx-manager-resource'),
                        details = $('.zx-x-details', resource);

                    // open the details
                    if (!resource.hasClass('zx-open')) {
                        resource.addClass('zx-open');
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
                        resource.removeClass('zx-open');
                        details.slideUp('fast', function(){
                            // $this.zluxdialog.scrollbar('refresh');
                        });
                    }
                });
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
            template      : '<div class="zx-x-tools">\
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
                                        <li>{{$item}}</li>\
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