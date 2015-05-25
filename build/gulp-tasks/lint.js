var gulp       = require('gulp');

gulp.task('lint', function() {
  return gulp.src('src/js/**').pipe(jshint()).pipe(jshint.reporter('default'));
});