;(function ($, ZX, window, document, undefined) {
    "use strict";

    ZX.ajax = {};

    /**
     * Ajax request
     * @param Object settings The request settings
     * @return Promise The ajax promise
     */
    ZX.ajax.request = function(settings)
    {
        // set defaults
        var response = {success:false, errors:[], notices:[]},
            queue = settings.queue ? settings.queue : null,
            request = null;

        // delete custom params, just in case
        delete settings.queue;

        // set request defaults
        settings = $.extend({
            dataType: 'json',
            type: 'POST'
        }, settings);

        // return a promise
        return $.Deferred(function( defer )
        {
            // perform the request
            if (queue) {
                request = ZX.ajax.queue(queue, settings);
            } else {
                request = $.ajax(settings);
            }
            
            // if response recieved
            request.done(function(result, a, b)
            {
                // json response is assumed
                if (ZX.utils.typeOf(result) !== 'object')
                {
                    try {
                        // parse response detecting if there was some server side error
                        json = $.parseJSON(result);

                    // handle exception
                    } catch(e) {
                        response.errors.push(String(result));
                        response.errors.push('An server-side error occurred. ' + String(e));
                        defer.reject(response);
                    }
                }

                else if (result.success)
                    defer.resolve(result);
                else
                    defer.reject(result);
            })
            
            // if something went wrong
            .fail(function(jqxhr, status, error)
            {
                // handle errors
                switch (jqxhr.status) {
                    case 0: // if request canceled no error is logged
                        break;
                    case 403:
                        response.errors.push('The session has expired.');
                        break;
                    case 404:
                        response.errors.push('The requested URL is not accesible.');
                        break;
                    case 500:
                        response.errors.push('A server-side error has occurred.');
                        break;

                    default:
                        response.errors.push('An error occurred: ' + status + '\n Error: ' + error);
                        break;
                }

                // set response status
                response.status = jqxhr.status;

                // reject
                defer.reject(response);
            });

        }).promise();
    };
    /**
     * Ajax request and notify the answer
     * @param Object request The ajax request
     * @param Object notify The notify settings
     * @return Promise The ajax promise
     */
    ZX.ajax.requestAndNotify = function(request, notify)
    {
        // set defaults
        notify = notify === undefined ? {} : notify;

        // request
        return ZX.ajax.request(request)
        .done(function(response){

            if(notify.group) ZX.notify.closeAll(notify.group);

            // display message
            if(response.message) ZX.notify(response.message, $.extend({
                status: 'success'
            }, notify));
            
        }).fail(function(response){

            if(notify.group) $.UIkit.notify.closeAll(notify.group);

            // display errors
            if(response.errors && response.errors.length) $.each(response.errors, function(){
                ZX.notify(this, $.extend({
                    status: 'danger'
                }, notify));
            });
            // display notices
            if(response.notices && response.notices.length) $.each(response.notices, function(){
                ZX.notify(this, $.extend({
                    status: 'warning'
                }, notify));
            });
        });
    };


    // Original code from AjaxQ jQuery Plugin
    // Copyright (c) 2012 Foliotek Inc.
    // MIT License
    // https://github.com/Foliotek/ajaxq
    var queues = {};

    // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
    ZX.ajax.queue = function(qname, opts) {

        if (typeof opts === "undefined") {
            throw ("AjaxQ: queue name is not provided");
        }

        // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
        var deferred = $.Deferred(),
            promise = deferred.promise();

        promise.success = promise.done;
        promise.error = promise.fail;
        promise.complete = promise.always;

        // Create a deep copy of the arguments, and enqueue this request.
        var clonedOptions = $.extend(true, {}, opts);
        enqueue(function() {

            // Send off the ajax request now that the item has been removed from the queue
            var jqXHR = $.ajax.apply(window, [clonedOptions]).always(dequeue);

            // Notify the returned deferred object with the correct context when the jqXHR is done or fails
            // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
            jqXHR.done(function() {
                deferred.resolve.apply(this, arguments);
            });
            jqXHR.fail(function() {
                deferred.reject.apply(this, arguments);
            });
        });

        return promise;

        // If there is no queue, create an empty one and instantly process this item.
        // Otherwise, just add this item onto it for later processing.
        function enqueue(cb) {
            if (!queues[qname]) {
                queues[qname] = [];
                cb();
            }
            else {
                queues[qname].push(cb);
            }
        }

        // Remove the next callback from the queue and fire it off.
        // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
        function dequeue() {
            if (!queues[qname]) {
                return;
            }
            var nextCallback = queues[qname].shift();
            if (nextCallback) {
                nextCallback();
            }
            else {
                delete queues[qname];
            }
        }
    };

    // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
    // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
    $.each( [ "getq", "postq" ], function( i, method ) {
        $[ method ] = function( qname, url, data, callback, type ) {

            if ( $.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return ZX.ajax.queue(qname, {
                type: method === "postq" ? "post" : "get",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    var isQueueRunning = function(qname) {
        return queues.hasOwnProperty(qname);
    };

    var isAnyQueueRunning = function() {
        for (var i in queues) {
            if (isQueueRunning(i)) return true;
        }
        return false;
    };

    ZX.ajax.queue.isRunning = function(qname) {
        if (qname) return isQueueRunning(qname);
        else return isAnyQueueRunning();
    };
    
    ZX.ajax.queue.clear = function(qname) {
        if (!qname) {
            for (var i in queues) {
                if (queues.hasOwnProperty(i)) {
                    delete queues[i];
                }
            }
        }
        else {
            if (queues[qname]) {
                delete queues[qname];
            }
        }
    };

})(jQuery, jQuery.zlux, window, document);