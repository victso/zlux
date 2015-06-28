var
pkg = require('../../package.json'),
date = require('date-utils'),
del = require('del'),
gulp = require('gulp'),
less = require('gulp-less'),
minify = require('gulp-minify-css'),
rename = require('gulp-rename'),
replace = require('gulp-replace'),
util = require('gulp-util'),
header = require('gulp-header'),
merge = require('merge-stream'),
runSeq = require('run-sequence'),
run = require('gulp-run'),

banner = ['/**',
          ' * @package     ' + pkg.name,
          ' * @version     ' + pkg.version,
          ' * @author      ' + pkg.authors[0].name + ' - ' + pkg.authors[0].homepage,
          ' * @license     ' + pkg.license,
          ' */',
          ''].join('\n').replace(/\n$/g, ''),

output = util.env.output || util.env.o || 'dist';

gulp.task('build', function(cb) {
    runSeq('build-clean', 'build-copy', 'build-minify', 'build-headers', cb);
});

gulp.task('build-clean', function(cb) {
    del(output, cb);
});

gulp.task('build-copy', function(cb) {
    runSeq('build-compile-less', 'build-compile-js', 'build-copy-assets', cb);
});

gulp.task('build-copy-assets', function() {
    return merge(
        gulp.src(['src/svg/**']).pipe(gulp.dest(output + '/svg')),
        gulp.src(['vendor/uikit/fonts/**']).pipe(gulp.dest(output + '/fonts'))
    );
});

gulp.task('build-compile-js', function(cb) {
    run('webpack && webpack --output-file [name].min.js -p').exec('', cb);
});

gulp.task('build-compile-less', function() {
    return gulp.src(['src/less/zlux.less', 'src/less/zlux-uikit.less']).pipe(less()).pipe(gulp.dest(output + '/css'));
});

gulp.task('build-minify', function() {
    return gulp.src(['dist/css/**/*.css']).pipe(rename({ suffix: '.min' })).pipe(minify()).pipe(gulp.dest('dist/css'));
});

gulp.task('build-headers', function() {
    return gulp.src(['dist/**/*.*(js|css)', '!dist/vendor/**']).pipe(header(banner + '\n\n')).pipe(gulp.dest('dist'));
});


/* helper */

function tagHelper(stream) {
    return stream
        .pipe(replace('{{VERSION}}', pkg.version))
        .pipe(replace('{{NAME}}', pkg.name))
        .pipe(replace('{{DESCRIPTION}}', pkg.description))
        .pipe(replace('{{DATE}}', date.today().toFormat('MMMM YYYY')))
        .pipe(replace('{{COPYRIGHT}}', pkg.copyright))
        .pipe(replace('{{LICENSE}}', pkg.license))
        .pipe(replace('{{AUTHOR}}', pkg.authors[0].name))
        .pipe(replace('{{AUTHOREMAIL}}', pkg.authors[0].email))
        .pipe(replace('{{AUTHORURL}}', pkg.authors[0].homepage));
}
