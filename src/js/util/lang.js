var _ = this;

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.extend = function (target) {

    var array = [], args = array.slice.call(arguments, 1), deep;

    if (typeof target === 'boolean') {
        deep = target;
        target = args.shift();
    }

    args.forEach(function (arg) {
        extend(target, arg, deep); // eslint-disable-line
    });

    return target;
};

function extend (target, source, deep) {
    for (var key in source) {
        if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
            if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
                target[key] = {};
            }
            if (_.isArray(source[key]) && !_.isArray(target[key])) {
                target[key] = [];
            }
            extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Type of object check
 *
 * @param {*} obj
 * @return {String}
 */

exports.typeOf = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

/**
 * Check if Object is a function
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isFunction = function (obj) {
    return obj && this.typeOf(obj) === 'function';
};

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isArray = function (obj) {
    return Array.isArray(obj);
};

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString; // eslint-disable-line
exports.isPlainObject = function (obj) {
    return toString.call(obj) === '[object Object]';
};
