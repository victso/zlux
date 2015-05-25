var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('./build/gulp-tasks', {recurse: true});

gulp.task('default', ['serve']);
gulp.task('compile', ['less']);