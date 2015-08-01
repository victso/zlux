
// http://phpjs.org/functions/basename
exports.basename = function(path, suffix) {

    var b = path;
    var lastChar = b.charAt(b.length - 1);

    if (lastChar === '/' || lastChar === '\\') {
        b = b.slice(0, -1);
    }

    b = b.replace(/^.*[\/\\]/g, '');

    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
        b = b.substr(0, b.length - suffix.length);
    }

    return b;
};

// cleans the provided path
exports.cleanPath = function(path) {
    return path === '/' ? path : path
        .replace(/\/\/+/g, '/')   // replace double or more slashes
        .replace(/^\/|\/$/g, ''); // remove / from ends
}

// parses the specified size string into a byte value
exports.parseSize = function(size){

    if (typeof (size) !== 'string' || size === '') {
        return size;
    }

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

/**
  * https://github.com/avoidwork/filesize.js - v3.1.2
  * Copyright (c) 2015, Jason Mulligan
  *
  * @param  {Mixed}   arg        String, Int or Float to transform
  * @param  {Object}  descriptor [Optional] Flags
  * @return {String}             Readable file size String
*/
exports.filesize = function(arg) {

    var bit = /b$/;
    var si = {
        bits : ['B', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
        bytes: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    };

    var descriptor = arguments[1] === undefined ? {} : arguments[1];

    var result = [];
    var skip = false;
    var val = 0;
    var e, base, bits, ceil, neg, num, output, round, unix, spacer, suffixes;

    if (isNaN(arg)) {
        throw new Error('Invalid arguments');
    }

    bits = descriptor.bits === true;
    unix = descriptor.unix === true;
    base = descriptor.base !== undefined ? descriptor.base : 2;
    round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
    spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
    suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
    output = descriptor.output !== undefined ? descriptor.output : 'string';
    e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
    num = Number(arg);
    neg = num < 0;
    ceil = base > 2 ? 1000 : 1024;

    // Flipping a negative number to determine the size
    if (neg) {
        num = -num;
    }

    // Zero is now a special case because bytes divide by 1
    if (num === 0) {
        result[0] = 0;

        if (unix) {
            result[1] = '';
        } else {
            result[1] = 'B';
        }
    } else {
        // Determining the exponent
        if (e === -1 || isNaN(e)) {
            e = Math.floor(Math.log(num) / Math.log(ceil));
        }

        // Exceeding supported length, time to reduce & multiply
        if (e > 8) {
            val = val * (1000 * (e - 8));
            e = 8;
        }

        if (base === 2) {
            val = num / Math.pow(2, e * 10);
        } else {
            val = num / Math.pow(1000, e);
        }

        if (bits) {
            val = val * 8;

            if (val > ceil) {
                val = val / ceil;
                e++;
            }
        }

        result[0] = Number(val.toFixed(e > 0 ? round : 0));
        result[1] = si[bits ? 'bits' : 'bytes'][e];

        if (!skip && unix) {
            if (bits && bit.test(result[1])) {
                result[1] = result[1].toLowerCase();
            }

            result[1] = result[1].charAt(0);

            if (result[1] === 'B') {
                result[0] = Math.floor(result[0]);
                result[1] = '';
            } else if (!bits && result[1] === 'k') {
                result[1] = 'K';
            }
        }
    }

    // Decorating a 'diff'
    if (neg) {
        result[0] = -result[0];
    }

    // Applying custom suffix
    result[1] = suffixes[result[1]] || result[1];

    // Returning Array, Object, or String (default)
    if (output === 'array') {
        return result;
    }

    if (output === 'exponent') {
        return e;
    }

    if (output === 'object') {
        return { value: result[0], suffix: result[1] };
    }

    return result.join(spacer);
};
