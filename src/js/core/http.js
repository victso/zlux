module.exports = function () {

    var _ = require('../util');
    var $ = require('jquery');
    var config = require('../config');

    /**
     * Http request as jQuery ajax wrapper
     *
     * @param {Object} settings
     *
     * @return {Promise}
     */
    function Http(route, settings) {

        var self = this, deferred = $.Deferred(), response = {success: true, errors: [], notices: []}, url = config.route;

        settings = settings || {};

        // queue = settings.queue ? settings.queue : null,
        // delete settings.queue

        // split route prefix [0] and method [1], eg: filesManager/fetchResources
        var route = route.split('/');

        // check if prefix has been mapped
        if (config.routesMap[route[0]]) {
            url += '&' + config.routesMap[route[0]]
        }

        // append method
        url += '&method=' + route[1];

        console.log(url);

        settings = _.extend(true, {url: url}, Http.settings, settings);

        // var request  = queue ? this.queue(queue, settings) : $.ajax(settings)

        $.ajax(settings)

        .done(function(data, status, jqxhr) {
            if (settings.dataType === 'json') {
                parseReq(_.extend(response, data), status, jqxhr);
            }
        })

        .fail(function(jqxhr, status, error) {
            parseReq(response, status, jqxhr);
            _.log(error);
            _.log(response.errors);
        })

        .always(function() {
            if (response.success) {
                deferred.resolveWith(self, [response]);
            } else {
                deferred.rejectWith(self, [response]);
            }
        });

        return deferred.promise();
    }

    function parseReq(response, status, jqxhr) {

        if (status === 'error') {

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
                    response.errors.push('An ' + status + ' occurred.');
                    break;
            }

            response.success = false;
        }

        if (status === 'parsererror') {
            response.errors.push('Response format error: JSON parse error');
            response.success = false;
        }

        // status state check
        if (response.success === undefined) {
            response.errors.push('Response format error: status not specified');
            response.success = false;
        }

    }

    Http.settings = {
        type       : 'get',
        dataType   : 'json',
        contentType: 'application/json; charset=UTF-8'
    };

    ['get', 'put', 'post', 'delete'].forEach(function (method) {

        Http[method] = function (url, data, settings) {
            return this(url, _.extend({type: method, data: data}, settings));
        };

    });

    // /**
    //  * Ajax request and notify the answer
    //  * @param Object request The ajax request
    //  * @param Object notify The notify settings
    //  * @return Promise The ajax promise
    //  */
    // exports.requestAndNotify = function(request, notify) {

    //     // set defaults
    //     notify = notify === undefined ? {} : notify

    //     // request
    //     return this.request(request)
    //     .done(function(response){

    //         // close others, then notify
    //         if(notify.group) ZX.notify.closeAll(notify.group);

    //         // display message
    //         if(response.message) ZX.notify(response.message, $.extend(true, {
    //             status: 'success'
    //         }, notify));

    //     }).fail(function(response){

    //         // close others, then notify
    //         if(notify.group) ZX.notify.closeAll(notify.group);

    //         // display errors
    //         if(response.errors && response.errors.length) $.each(response.errors, function(){
    //             ZX.notify(this, $.extend(true, {
    //                 status: 'danger'
    //             }, notify));
    //         });

    //     }).always(function(response){

    //         // display notices
    //         if(response.notices && response.notices.length) $.each(response.notices, function(){
    //             ZX.notify(this, $.extend(true, {
    //                 status: 'warning'
    //             }, notify));
    //         });
    //     });
    // }

    // // Original code from AjaxQ jQuery Plugin
    // // Copyright (c) 2012 Foliotek Inc.
    // // MIT License
    // // https://github.com/Foliotek/ajaxq
    // var queues = {}

    // // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
    // exports.queue = function(qname, opts) {

    //     if (typeof opts === "undefined") {
    //         throw ("AjaxQ: queue name is not provided");
    //     }

    //     // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
    //     var deferred = $.Deferred(),
    //         promise = deferred.promise();

    //     promise.success = promise.done;
    //     promise.error = promise.fail;
    //     promise.complete = promise.always;

    //     // Create a deep copy of the arguments, and enqueue this request.
    //     var clonedOptions = $.extend(true, {}, opts);
    //     enqueue(function() {

    //         // Send off the ajax request now that the item has been removed from the queue
    //         var jqXHR = $.ajax.apply(window, [clonedOptions]).always(dequeue);

    //         // Notify the returned deferred object with the correct context when the jqXHR is done or fails
    //         // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
    //         jqXHR.done(function() {
    //             deferred.resolve.apply(this, arguments);
    //         });
    //         jqXHR.fail(function() {
    //             deferred.reject.apply(this, arguments);
    //         });
    //     });

    //     return promise;

    //     // If there is no queue, create an empty one and instantly process this item.
    //     // Otherwise, just add this item onto it for later processing.
    //     function enqueue(cb) {
    //         if (!queues[qname]) {
    //             queues[qname] = [];
    //             cb();
    //         }
    //         else {
    //             queues[qname].push(cb);
    //         }
    //     }

    //     // Remove the next callback from the queue and fire it off.
    //     // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
    //     function dequeue() {
    //         if (!queues[qname]) {
    //             return;
    //         }
    //         var nextCallback = queues[qname].shift();
    //         if (nextCallback) {
    //             nextCallback();
    //         }
    //         else {
    //             delete queues[qname];
    //         }
    //     }

    // }

    // // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
    // // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
    // $.each( [ "getq", "postq" ], function( i, method ) {
    //     $[ method ] = function( qname, url, data, callback, type ) {

    //         if ( $.isFunction( data ) ) {
    //             type = type || callback;
    //             callback = data;
    //             data = undefined;
    //         }

    //         return $zlux.http.queue(qname, {
    //             type: method === "postq" ? "post" : "get",
    //             url: url,
    //             data: data,
    //             success: callback,
    //             dataType: type
    //         });
    //     };
    // });

    // var isQueueRunning = function(qname) {
    //     return queues.hasOwnProperty(qname);
    // }

    // var isAnyQueueRunning = function() {
    //     for (var i in queues) {
    //         if (isQueueRunning(i)) return true;
    //     }
    //     return false;
    // }

    // exports.queue.isRunning = function(qname) {
    //     if (qname) return isQueueRunning(qname);
    //     else return isAnyQueueRunning();
    // }

    // exports.queue.clear = function(qname) {
    //     if (!qname) {
    //         for (var i in queues) {
    //             if (queues.hasOwnProperty(i)) {
    //                 delete queues[i];
    //             }
    //         }
    //     }
    //     else {
    //         if (queues[qname]) {
    //             delete queues[qname]
    //         }
    //     }
    // }

    return Http;
};
