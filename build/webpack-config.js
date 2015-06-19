module.exports = [{
    entry: {
        './dist/js/zlux': './src/js/zlux'
    },
    output: {
        filename: './[name].js',
        library: 'zlux',
        libraryTarget: 'umd'
    },
    externals: {
        'jquery': 'jQuery',
        'vue'   : 'Vue',
        'uikit' : 'UIkit'
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }]
    }
},{
    entry: {
        './dist/js/components/files-manager': './src/js/components/files-manager',
        './dist/js/components/items-manager': './src/js/components/items-manager',
        './dist/js/components/pagination': './src/js/components/pagination',
        './dist/js/components/calendar': './src/js/components/calendar',
        './dist/js/components/notify': './src/js/components/notify'
    },
    output: {
        filename: './[name].js'
    },
    externals: {
        'jquery': 'jQuery',
        'vue'   : 'Vue',
        'uikit' : 'UIkit',
        'zlux'  : 'zlux',
        'moment': 'moment'
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }]
    }
}]