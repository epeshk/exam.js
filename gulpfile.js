var gulp = require('gulp'),
	coffee = require('gulp-coffee'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

gulp.task('default', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('../dist/exam.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('exam.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});