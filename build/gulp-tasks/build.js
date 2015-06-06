var
pkg     = require('../../package.json'),
date    = require('date-utils'),
del     = require('del'),
gulp    = require('gulp'),
less    = require('gulp-less'),
minify  = require('gulp-minify-css'),
rename  = require('gulp-rename'),
replace = require('gulp-replace'),
concat  = require('gulp-concat'),
util    = require('gulp-util'),
uglify  = require('gulp-uglify'),
header  = require('gulp-header'),
merge   = require('merge-stream'),
runSeq  = require('run-sequence'),
run     = require('gulp-run'),

banner = ['/**',
          ' * @package     '+pkg.name,
          ' * @version     '+pkg.version,
          ' * @author      '+pkg.authors[0].name+' - '+pkg.authors[0].homepage,
          ' * @license     '+pkg.license,
          ' */',
          ''].join('\n').replace(/\n$/g, ''),

output = util.env.output || util.env.o || 'dist';

gulp.task('build', function(cb) {
    runSeq('build-clean', 'build-copy', 'build-concat', 'build-minify', 'build-headers', cb);
});

gulp.task('build-clean', function(cb) {
    del(output, cb);
});

gulp.task('build-copy', function(cb) {

    runSeq('build-compile-less', 'build-compile-js', 'build-copy-js', cb);
    
});

gulp.task('build-copy-js', function(cb) {

    return merge(
        gulp.src(['src/js/components/*.js']).pipe(gulp.dest(output+'/js/components')),
        gulp.src(['src/svg/**']).pipe(gulp.dest(output+'/svg'))
    );

});

gulp.task('build-compile-js', function(cb) {

    run('webpack --config build/webpack-dev-config.js').exec('', cb);

});

gulp.task('build-compile-less', function() {
    return gulp.src(['src/less/zlux.less', 'src/less/zlux-uikit.less']).pipe(less()).pipe(gulp.dest(output+'/css'));
});

gulp.task('build-concat', function() {
    return gulp.src(['src/js/core/index.js', 'src/js/core/extensions.js', 'src/js/core/*.js']).pipe(concat('zlux.js')).pipe(gulp.dest(output+'/js'));
});

gulp.task('build-minify', function() {
    return merge(
        gulp.src(['dist/css/**/*.css']).pipe(rename({ suffix: '.min' })).pipe(minify()).pipe(gulp.dest('dist/css')),
        gulp.src(['dist/js/**/*.js']).pipe(rename({ suffix: '.min' })).pipe(uglify()).pipe(gulp.dest('dist/js'))  
    );
});

gulp.task('build-headers', function() {
    return gulp.src(['dist/**/*.*(js|css)', '!dist/vendor/**']).pipe(header(banner+'\n\n')).pipe(gulp.dest('dist'));
});


/* helper */

function tagHelper(stream) {
    return stream
        .pipe(replace('{{VERSION}}',      pkg.version))
        .pipe(replace('{{NAME}}',         pkg.name))
        .pipe(replace('{{DESCRIPTION}}',  pkg.description))
        .pipe(replace('{{DATE}}',         date.today().toFormat('MMMM YYYY')))
        .pipe(replace('{{COPYRIGHT}}',    pkg.copyright))
        .pipe(replace('{{LICENSE}}',      pkg.license))
        .pipe(replace('{{AUTHOR}}',       pkg.authors[0].name))
        .pipe(replace('{{AUTHOREMAIL}}',  pkg.authors[0].email))
        .pipe(replace('{{AUTHORURL}}',    pkg.authors[0].homepage));
}
