var gulp        = require('gulp');
var webserver   = require('gulp-webserver');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var nib         = require('nib');
var minify      = require('gulp-minify-css');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');

gulp.task('templates', function() {
  gulp.src('./src/htdocs/*.html')
    .pipe(swig())
    .pipe(gulp.dest('./build/'))
});

gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('server', function() {
  gulp.src('./build')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 3000,
      fallback: 'index.html',
      livereload: true
    }));
});

gulp.task('build', function() {
  browserify({
    entries: './src/javascript/app.js',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  gulp.watch('./src/javascript/components/**/*.jsx', ['build']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./src/htdocs/**/*.html', ['templates']);
});

gulp.task('default', ['server', 'watch']);