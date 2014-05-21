;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.plugin("manager", "filesManager", {

        init: function(manager) {
            var $this = this;

            // make sure is file manager
            if (!manager.type && manager.type !== 'files') return;

            // init table
            manager.initTable();
           


            // resource selected event
            manager.resources.on('click', '.zx-manager-resource .zx-x-name a', function () {
                var $resource = manager.getResource($(this).closest('.zx-manager-resource'));

                if ($resource.element.attr('data-zx-status') !== 'true') {
                    $resource.element.attr('data-zx-status', 'true');

                    // remove selected status from siblings
                    $resource.element.siblings().removeAttr('data-zx-status');

                    // if folder
                    if ($resource.element.data('type') === 'folder') {

                        // update go to path
                        $this.goToPath = $resource.element.data('id');

                        // reload with new path
                        // manager.reloadAjax();
                    }

                    // trigger event
                    manager.resources.trigger('manager-resource-selected', $resource);
                }

                // prevent default
                return false;
            });


            // Trigger Object Removed event
            manager.resources.on('click', '.zx-manager-resource .zx-x-remove', function(){
                var $resource = manager.getResource($(this).closest('.zx-manager-resource')),
                    msg = ZX.lang._($resource.type === 'folder' ? 'DELETE_THIS_FOLDER' : 'DELETE_THIS_FILE');

                ZX.notify.confirm(msg).done(function(){
                    manager.deleteResource($resource);
                });

                return;

                // if allready message displayed, abort
                // if ($('.zlux-x-details-message-actions')[0]) return;

               


               


                // // if open, the remove action will delete the file, with confirmation
                // if (TD.hasClass('zlux-ui-open')) {
                //     $this.trigger("BeforeDeleteFile", $object);
                // }
                
                // prevent default
                return false;
            });



        },

        /**
         * Delete the object from the server
         */
        deleteObject: function($object) {
            var $this = this,
                aoData = [],

            // save object path
            path = $this.getFullPath($object.name);

            // push the storage related data
            aoData = $this.pushStorageData(aoData);

            // if S3 storage
            if($this.options.storage === 's3') {

                // add a slash if folder
                if($object.type === 'folder') {
                    path = path + '/';
                }
            }

            // set path
            aoData.push({ "name": "path", "value": path });

            //
            $this.manager.deleteObject().done(function(json) {

                // remove the object from cache
                var aaData = $.zlux.filesManager.aAjaxDataCache[$this.sCurrentPath].aaData;
            })


            aoData.push({ "name": "key", "value": $this.options.storage_params.secretkey });
        },

        /**
         * Perform the actions related to rename the Object
         */
        renameResource: function($object) {
            var $this = this,
                name = $('.zlux-x-name a', $object.dom),
                ext = name.html().match(/\.+[a-zA-Z]+$/g),
                raw_name = name.html().replace(/\.+[a-zA-Z]+$/g, '');

            // if is folder ignore the extension
            ext = ext !== null ? ext : '';

            // prepare and display the confirm message
            var msg = $('<div>' + ZX.lang._('INPUT_THE_NEW_NAME') + '<br /><input class="zlux-x-input" type="text" value="' + raw_name + '" /> ' + ext + '<br /><span class="label label-success label-link">' + ZX.lang._('CONFIRM').toLowerCase() + '</span></div>')

            // confirm action
            .on('click', '.label-link', function(){
                // only allowed to be submited once
                if ($(this).data('submited')) return; $(this).data('submited', true);

                // set spinner
                $('.column-icon i', $object.dom).addClass('uk-icon-spinner uk-icon-spin');

                // change the object name
                ZX.lang._changeObjectName($object, $('input', msg).val() + ext)
                
                // if succesfull
                .done(function(new_name)
                {
                    // update the dom name
                    name.html(new_name);
                    // in details also
                    $('.zlux-x-details-content ul li:first span', $object.dom).html(new_name);

                    // and path data
                    $object.dom.attr('data-id', new_name);

                    // update the object data, and as it's a reference to DataTables data it will be also updated :)
                    $object.name = new_name;
                    $object.basename = new_name.replace(/\.+[a-zA-Z]+$/g, '');
                    $object.path = $object.path.replace(/(\w|[-.])+$/, new_name);

                    // update the cache
                    $.zlux.filesManager.aAjaxDataCache[$this.sCurrentPath].aaData = $this.oTable.fnGetData();

                    // redraw the other instances
                    $this.redrawInstances();

                    // remove selected status as the object has changed
                    $object.dom.removeAttr('data-zlux-object-status');

                    // remove msg
                    $('.zlux-x-msg', $object.dom).remove();
                })

                // if fails
                .fail(function(message) {
                    $this.pushMessageToObject($object, message);
                })

                // on result
                .always(function() {
                    // remove spinner
                    $('.column-icon i', $object.dom).removeClass('uk-icon-spinner uk-icon-spin');
                });
            })

            .on('keypress', 'input', function(e){
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13) {
                    // Enter key was pressed, emulate click event
                    $('.label-link', msg).trigger('click');
                }
            });

            $this.pushMessageToObject($object, msg);
        },
        
        /**
         * Requests the Object name change
         */
        _changeObjectName: function($object, name) {
            var $this = this,
                aoData = [],
                src = $this.getFullPath($object.name),
                dest = $this.getFullPath(name);

            // push the storage related data
            aoData = $this.pushStorageData(aoData);

            // if S3 storage
            if($this.options.storage === 's3') {

                // add a slash if folder
                if($object.type === 'folder') {
                    src = src + '/';
                    dest = dest + '/';
                }
            }

            // set paths
            aoData.push({ "name": "src", "value": src });
            aoData.push({ "name": "dest", "value": dest });

            // make the request and return a promise
            return $.Deferred(function( defer )
            {
                $.ajax({
                    "url": $.zlux.url.ajax('zlux', 'moveObject'),
                    "data": aoData,
                    "dataType": "json",
                    "type": "post"
                })
                
                .done(function(json) {
                    if (json.result) {

                        defer.resolve(json.name);
                    } else {
                        // failed with reported error
                        defer.reject(json.errors);
                    }
                })

                .fail(function(){
                    // some unreported error
                    defer.reject(ZX.lang._('SOMETHING_WENT_WRONG'));
                });

            }).promise();
        },

        /**
         * Push the necesary storage DATA
         */
        pushStorageData: function(aoData) {
            var $this = this;

            // if S3 storage
            if($this.options.storage === 's3') {
                aoData.push({ "name": "storage", "value": "s3" });
                aoData.push({ "name": "accesskey", "value": $this.options.storage_params.accesskey });
                aoData.push({ "name": "key", "value": $this.options.storage_params.secretkey });
                aoData.push({ "name": "bucket", "value": $this.options.storage_params.bucket });
            }

            return aoData;
        },

        /**
         * Returns the full path prepended to the passed relative path
         */
        getFullPath: function(path) {
            var cp = this.sCurrentPath;
            return cp ? cp + '/' + path : path;
        }
    });

})(jQuery, jQuery.zlux, window, document);