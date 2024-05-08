var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function(){
 gulp.src('src/app.jsx')
  .pipe(browserify({transform: 'reactify'}))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify'])

gulp.task('watch', function(){
  gulp.watch('src/**/*.*', ['default']);
});