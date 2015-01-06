'use strict';
// generated on 2014-08-28 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

var sourcemaps = require('gulp-sourcemaps');

gulp.task('scss', function() {
	return gulp.src('./src/scss/**/main.scss')
	  //.pipe(sourcemaps.init())
	  .pipe($.sass())
	  //.pipe(sourcemaps.write())
	  .pipe($.size())
	  .pipe(gulp.dest('./build/css'));
});

gulp.task('js', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe($.concat('ziro.js'))
		.pipe($.uglify())
		.pipe($.size())
		.pipe(gulp.dest('./build/js'));
});


// will write the source maps inline in the compiled CSS files

gulp.task('clean', function () {
  return gulp.src(['.tmp', 'build'], { read: false }).pipe($.clean());
});

gulp.task('build', ['scss']);

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('watch', function () {
  var server = $.livereload();

  gulp.watch('./src/scss/**/*.scss', ['scss']);
});
