var ZX = require('zlux');
var UI = require('uikit');

/**
 * Ajax request
 * @param Object settings The request settings
 * @return Promise The ajax promise
 */
module.request = function(settings)
{
    // set defaults
    var response = {success:false, errors:[], notices:[]},
        queue = settings.queue ? settings.queue : null,
        request = null;

    // delete custom params, just in case
    delete settings.queue;

    // set request defaults
    settings = UI.$.extend(true, {
        dataType: 'json',
        type: 'POST'
    }, settings);

    // return a promise
    return UI.$.Deferred(function( defer )
    {
        // perform the request
        if (queue) {
            request = ZX.ajax.queue(queue, settings);
        } else {
            request = UI.$.ajax(settings);
        }

        // if response recieved
        request.done(function(result, a, b)
        {
            // if dataType is json
            if (settings.dataType === 'json')
            {
                // check if object returned
                if(ZX.utils.typeOf(result) !== 'object')
                {
                    try {
                        // parse response detecting if there was some server side error
                        json = UI.$.parseJSON(result);

                    // handle exception
                    } catch(e) {
                        response.errors.push(String(result));
                        response.errors.push('An server-side error occurred. ' + String(e));
                        defer.reject(response);
                    }
                }

                // check if status set
                else if (result.success === undefined) {
                    result.errors = ['Response format error: status not specified'];
                    defer.reject(result);
                } else if (result.success)
                    defer.resolve(result);
                else
                    defer.reject(result);

            // else just send the result over
            } else {
                defer.resolve(result);
            }
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
                    response.errors.push('An ' + status + ' occurred<br />' + error + '<br /><br />Returned' + jqxhr.responseText);
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
module.requestAndNotify = function(request, notify)
{
    // set defaults
    notify = notify === undefined ? {} : notify;

    // request
    return ZX.ajax.request(request)
    .done(function(response){

        // close others, then notify
        if(notify.group) ZX.notify.closeAll(notify.group);

        // display message
        if(response.message) ZX.notify(response.message, UI.$.extend(true, {
            status: 'success'
        }, notify));

    }).fail(function(response){

        // close others, then notify
        if(notify.group) ZX.notify.closeAll(notify.group);

        // display errors
        if(response.errors && response.errors.length) UI.$.each(response.errors, function(){
            ZX.notify(this, UI.$.extend(true, {
                status: 'danger'
            }, notify));
        });

    }).always(function(response){

        // display notices
        if(response.notices && response.notices.length) UI.$.each(response.notices, function(){
            ZX.notify(this, UI.$.extend(true, {
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

// Register an UI.$.ajaxq function, which follows the UI.$.ajax interface, but allows a queue name which will force only one request per queue to fire.
module.queue = function(qname, opts) {

    if (typeof opts === "undefined") {
        throw ("AjaxQ: queue name is not provided");
    }

    // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of UI.$.ajax
    var deferred = UI.$.Deferred(),
        promise = deferred.promise();

    promise.success = promise.done;
    promise.error = promise.fail;
    promise.complete = promise.always;

    // Create a deep copy of the arguments, and enqueue this request.
    var clonedOptions = UI.$.extend(true, {}, opts);
    enqueue(function() {

        // Send off the ajax request now that the item has been removed from the queue
        var jqXHR = UI.$.ajax.apply(window, [clonedOptions]).always(dequeue);

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

// Register a UI.$.postq and UI.$.getq method to provide shortcuts for UI.$.get and UI.$.post
// Copied from jQuery source to make sure the functions share the same defaults as UI.$.get and UI.$.post.
UI.$.each( [ "getq", "postq" ], function( i, method ) {
    UI.$[ method ] = function( qname, url, data, callback, type ) {

        if ( UI.$.isFunction( data ) ) {
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

module.queue.isRunning = function(qname) {
    if (qname) return isQueueRunning(qname);
    else return isAnyQueueRunning();
};

module.queue.clear = function(qname) {
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