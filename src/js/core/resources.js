module.urls = {
    ajax: '',
    root: '',
    root_path: '',
    zlux: ''
}

/**
 * Push urls to the list
 * @param Object urls List of urls in JSON format
 */
module.push = function (urls) {
    UI.$.extend(ZX.url.urls, urls);
}

/**
 * Retrieves the specified url
 * @param String url || url:path The url to be retrieved
 * @param Object params List of params tu attach to the url
 * @return String The full url
 */
module.get = function (url, params) {
    url = url.split(':');
    params = params === undefined ? {} : params;
    var result;

    if(url.length === 2 && url[1] !== '') {

        var root_path = ZX.url.urls.root_path.replace(/^\//, '');

        result = ZX.url._get(url[0]) + '/' + url[1]

        // make sure the joomla root path is not present
        .replace(new RegExp('^'+root_path, 'g'), '')
        .replace(new RegExp('^\/'+root_path, 'g'), '');

    } else {
        result = ZX.url._get(url[0]) + (UI.$.isEmptyObject(params) ? '' : '&' + UI.$.param(params));
    }

    return ZX.url.clean(result);
}

module._get = function (url) {
    return ZX.url.urls[url] !== undefined ? ZX.url.urls[url] : url;
}

/**
 * Clean an URL from double slash and others
 * @param String url The url to be cleaned
 */
module.clean = function(url) {
    if (!url) return '';

    // return url and
    return url

    // replace \ with /
    .replace(/\\/g, '/')

    // replace double or more slashes
    .replace(/\/\/+/g, '/')

    // remove undefined
    .replace(/undefined/g, '')

    // remove / from end
    .replace(/\/$/g, '')

    // recover the http:// if set
    .replace(/:\//g, ':\/\/');
}