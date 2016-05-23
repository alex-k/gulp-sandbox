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

var s3 = require('gulp-s3-upload')({
    accessKeyId: "AKIAJ6KNQ3U4WHPDCQVQ",
    secretAccessKey: "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"
});


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
        ;
});

gulp.task("build:nginx", function () {
    var jsFilter = filter("**/*.js", {restore: true});
    var cssFilter = filter("**/*.css", {restore: true});

    return gulp.src(conf.app + "/**/*")
        .pipe(useref({searchPath: ['app', '.tmp']}))      // Concatenate with gulp-useref
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


gulp.task("upload", function () {
    gulp.src(conf.dist_nginx + "/assets/**")
        .pipe(s3({
            Bucket: 'bonusway-dev', //  Required
            ACL: 'public-read'       //  Needs to be user-defined
        }, {
            // S3 Construcor Options, ie:
            maxRetries: 5
        }))
    ;
});

gulp.task('default', ['clean:tmp', 'clean:dist'], function () {
    runSequence(['useref', 'build:nginx']);
});