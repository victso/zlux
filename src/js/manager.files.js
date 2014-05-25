;(function ($, ZX, window, document, undefined) {
    "use strict";

    var instance_id = 0,
        cache = {};

    ZX.plugin("manager", "filesManager", {

        options: {
            root: '', // relative path to the root folder
            extensions: '', // array or comma separated values of allowed extensions
            storage: 'local',
            storage_params: {},
            max_file_size: '',
            resize: {}
        },

        init: function(manager) {
            var $this = this;

            // if manager is not of of files type, abort
            if (!manager.type || manager.type !== 'files') return;

            // extend manager options
            $.extend(manager.options, $this.options);
            
            // set instance id
            manager.id = instance_id++;

            // save manager reference
            $this.manager = manager;

            // clean settings
            $this.options.max_file_size = parseSize($this.options.max_file_size);
            $this.options.extensions = $this.options.extensions.replace(/\|/g, ',');
            $this.options.root = ZX.utils.cleanURI($this.options.root);

            // check storage param
            if ($this.options.storage === '' || $this.options.storage === undefined || $this.options.storage === null) {
                // ZX._ErrorLog(0, ZX.lang._('STORAGE_PARAM_MISSING'));
                $this.options.storage = 'local';
            }

            // set initial path
            $this.currentPath = $this.options.root;

            // EVENT resource selected
            manager.on('click', '.zx-manager-resource .zx-x-name a', function () {
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
                    manager.element.trigger('manager-resource-selected', $resource);
                }

                // prevent default
                return false;
            });

            // extend with new functions
            manager._ajax = $this._ajax;
            manager.redrawInstances = $this.redrawInstances;

            // override the ajax function
            manager.DTsettings.ajax = function (data, callback, settings) {
                manager._ajax(data, callback, settings);
            };

            // manager.DTsettings.ajax = $this._ajax;

            

            // all set, init manager
            manager.initManager();
        },

        _ajax: function (data, callback, settings) {
            var $this = this,
                root;

            console.log(this);

            // push values to the data request
            data.extensions = $this.options.extensions;

            // if S3 storage
            if($this.options.storage === 's3') {
                data.storage = s3;
                data.accesskey = $this.options.storage_params.accesskey;
                data.key = $this.options.storage_params.secretkey;
                data.bucket = $this.options.storage_params.bucket;
            }



            /* the Cache Data is stored in the main plugin so it can be shared by all instances */

            // set the root
            root = ZX.utils.cleanURI($this.currentPath + '/' + $this.goToPath);

            // reset vars
            $this.goToPath = '';

            // send root with post data
            data.root = root;

            // set ajax object
            settings.jqXHR = ZX.ajax.requestAndNotify({
                url: ZX.url.ajax('zlux', 'getFilesManagerData'),
                data: data,
                beforeSend: function(){
                    // check if the data is cached
                    var cached = false;

                    // if not reloading
                    if (!$this.reloading || $this.redrawing){

                        // check if already cached
                        var json = cache[root]; /// CHECK THIS
                        if (json) {

                            // if first time, save real root path, as it can be changed for security reasons by the server
                            if (!$this.cacheInited) $this.startRoot = json.root;

                            // save root
                            $this.currentPath = root;

                            // set cache status
                            $this.cacheInited = true;

                            // emulate the xhr events
                            $($this.manager.resources).trigger('xhr', [settings, json]);
                            callback( json );

                            // avoid ajax call
                            cached = true;
                        }

                        // if redrawing
                        if ($this.redrawing) {
                            // reset the param
                            $this.redrawing = false;

                            // save root
                            $this.currentPath = root;

                            // avoid the ajax call
                            return false;
                        }
                    }

                    // if cached abort ajax
                    if (cached) return false;

                    // else, the ajax proceeds, show the spinner
                    // $this.zluxdialog.spinner('show');
                }
            })

            .fail(function (response) {
                // console.log(response);

            })

            .done(function ( json ) {

                // if first time, save real root path, as it can be changed for security reasons by the server
                if (!$this.cacheInited) $this.startRoot = json.root;

                // save new path
                $this.currentPath = json.root;

                // empty cache if reloading, so the content is retrieved again
                if ($this.reloading) cache = {};

                // cache the data
                cache[json.root] = json;

                // redraw the other instances
                $this.redrawInstances();

                // set reloading to false
                $this.reloading = false;

                // set cache status
                $this.cacheInited = true;

                // trigger events
                $($this.resources).trigger('xhr', [settings, json]);
                callback( json );
            })

            .always(function() {
                // console.log($.mockjax.mockedAjaxCalls());
            });
        },

        /**
         * Redraw all other instances
         */
        redrawInstances: function() {
            var $this = this;

            // redraw instances
            $('[data-zx-manager-type="files"]').each(function(index, instance){

                console.log($this.id);
                
                // skip current instance
                if (parseInt(index) === $this.id) return true;


                // if table inited
                if (instance.oTable) {

                    // redraw
                    instance.bRedrawing = true;
                    instance.oTable.fnReloadAjax();
                }
            });
        },

        /**
         * Delete the object from the server // TO CHECK
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
                var aaData = cache[$this.sCurrentPath].data;
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


    /* Helper functions
       ---------------------------------------------- */

    /**
        Parses the specified size string into a byte value. For example 10kb becomes 10240

        @param  String/Number size String to parse or number to just pass through
        @return Number Size in bytes
    */
    function parseSize(size){
        if (typeof(size) !== 'string' || size === '') return size;

        var muls = {
                t: 1099511627776,
                g: 1073741824,
                m: 1048576,
                k: 1024
            },
            mul;

        size = /^([0-9]+)([mgk]?)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
        mul = size[2];
        size = +size[1];
        
        if (muls.hasOwnProperty(mul)) {
            size *= muls[mul];
        }
        return size;
    };

})(jQuery, jQuery.zlux, window, document);