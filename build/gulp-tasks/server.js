var gulp = require('gulp');
var bsync = require('browser-sync');

/**
 * Run build, starts the server with BrowserSync and watch for changes
 */
gulp.task('serve', ['server-init'], function() {

    return gulp.watch([
        'tests/**/*',
        'dist/**/*'
    ], ['server-rebuild']);

});

gulp.task('server-init', function(cb) {

    bsync({
        server: {
            baseDir: './'
        },
        startPath: 'tests',
        port     : 9999,
        notify   : false
    });

    cb();

});

gulp.task('server-rebuild', function(cb) {

    bsync.notify('Compiling');

    bsync.reload();
    bsync.notify('Compiled');
    cb();

});
