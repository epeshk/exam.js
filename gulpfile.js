var gulp = require('gulp'),
	coffee = require('gulp-coffee'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	addsrc = require('gulp-add-src'),
	jasmine = require('gulp-jasmine'),
	notify = require("gulp-notify"),
	karma = require('gulp-karma');

gulp.task('default', function() {
  gulp.src('./src/*.coffee')
	.pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(addsrc('./node_modules/markdown/lib/markdown.js'))
    .pipe(concat('../dist/exam.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(addsrc('./test/*.js'))
    .pipe(karma({
      configFile: 'karma.conf.js',
    }))
    .on('error', function(err) {
      throw err;
    })
    .pipe(notify("Tests passed!"))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('exam.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .pipe(notify("Building completed!"))
});

gulp.task('test', function(){
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(addsrc('./node_modules/markdown/lib/markdown.js'))
    .pipe(concat('../dist/exam.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(addsrc('./test/*.js'))
    .pipe(karma({
      configFile: 'karma.conf.js',
    }))
    .on('error', function(err) {
      throw err;
    })
    .pipe(notify("Tests passed!"))
});