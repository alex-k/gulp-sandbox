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
var useref = require('gulp-useref');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');


var conf = {
    app: 'app',
    dist: 'dist',
    dist_nginx: 'dist/nginx',
};

gulp.task('clean:tmp', function (cb) {
    rimraf('./.tmp', cb);
});

gulp.task('clean:dist', function (cb) {
    rimraf(conf.dist, cb);
})


gulp.task("useref", function () {
    return gulp.src(conf.app + "/index.html")
        .pipe(useref({searchPath: ['app', '.tmp']}))      // Concatenate with gulp-useref
        //.pipe(gulp.dest('useref'));
    ;
});

gulp.task("build:nginx", function () {
    var jsFilter = filter("**/*.js", { restore: true });
    var cssFilter = filter("**/*.css", {restore: true});

    return gulp.src(conf.app + "/**/*")
        .pipe(useref({searchPath: ['app', '.tmp']}))      // Concatenate with gulp-useref
        //.pipe(concat('combined.css'))
        .pipe(jsFilter)
        .pipe(uglify())             // Minify any javascript sources
        .pipe(rev())                // Rename the concatenated files (but not index.html)
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(minifycss())               // Minify any CSS sources
        .pipe(rev())                // Rename the concatenated files (but not index.html)
        .pipe(cssFilter.restore)
        .pipe(revReplace({
            replaceInExtensions: ['.js', '.css', '.html', '.php']
        }))
        .pipe(gulp.dest(conf.dist_nginx));
});


gulp.task('default', ['clean:tmp','clean:dist'], function () {
    runSequence(['useref','build:nginx']);
});