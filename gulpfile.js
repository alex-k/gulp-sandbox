var gulp = require('gulp');


var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var header = require('gulp-header');
var filter = require('gulp-filter');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

gulp.task('styles', function () {
    var cssFilter = filter("**/*.css", { restore: true });
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

    return gulp.src('app/**/*')
        //.pipe(concat('combined.css'))
        //.pipe(rename('combined.min.css'))
        .pipe(cssFilter)
        .pipe(gulp.dest('dist'))
        .pipe(rev())
        .pipe(minifycss())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
        .pipe(cssFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
        ;
});

gulp.task("index", function() {
    //var jsFilter = filter("**/*.js", { restore: true });
    var cssFilter = filter("**/*.css", { restore: true });
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

    return gulp.src("app/**/*")
        // .pipe(useref())      // Concatenate with gulp-useref
        // .pipe(jsFilter)
        // .pipe(uglify())             // Minify any javascript sources
        // .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(minifycss())               // Minify any CSS sources
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())                // Rename the concatenated files (but not index.html)
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())         // Substitute in new filenames
        .pipe(gulp.dest('dist'));
});


gulp.task('default', ['index'], function () {
//    gulp.src('app/**/*')
//        .pipe(gulp.dest('dist'));

});