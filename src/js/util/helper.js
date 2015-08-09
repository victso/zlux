var _ = require('../util');

exports.helper = {

    getFulllRoute: function(_route) {

        var route = _.zlux.config.route;

        // split route prefix [0] and method [1], eg: filesManager/fetchResources
        var _route = _route.split('/');

        // check if prefix has been mapped
        if (_.zlux.config.routesMap[_route[0]]) {
            route += '&' + _.zlux.config.routesMap[_route[0]]
        }

        // append method
        route += '&method=' + _route[1];

        return route;
    }

}
