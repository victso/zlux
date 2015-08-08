var config = require('../config');
var _ = require('./lang');

/**
 * Enable debug utilities. The enableDebug() function and
 * all _.log() & _.warn() calls will be dropped in the
 * minified production build.
 */

/* eslint-disable no-console */

function enableDebug () {

    var hasConsole = !_.isUndefined(console);

    /**
     * Log a message.
     *
     * @param {String} msg
     */

    exports.log = function(msg) {
        if (hasConsole && config.debug) {
            console.log('[ZLUX info]: ' + msg);
        }
    };

    /**
     * We've got a problem here.
     *
     * @param {String} msg
     */

    exports.warn = function(msg) {
        if (hasConsole && (!config.silent || config.debug)) {
            console.warn('[ZLUX warn]: ' + msg);

            if (config.debug) {
                debugger; // eslint-disable-line
            }
        }
    };

}

enableDebug();
