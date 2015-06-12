module.exports = {
    entry: {
        './dist/js/zlux': './src/js/zlux',
        './dist/js/components/manager-files': './src/js/components/manager-files',
        './dist/js/components/manager-items': './src/js/components/manager-items',
        './dist/js/components/calendar': './src/js/components/calendar',
        './dist/js/components/notify': './src/js/components/notify'
    },
    output: {
        filename: "./[name].js"
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
}