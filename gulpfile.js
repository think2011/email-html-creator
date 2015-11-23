var gulp    = require('gulp'),
    plugins = require('gulp-load-plugins')();

var paths = {
    src : './src',
    dist: './dist'
};

var files = {
    html: `${paths.src}/*.html`
};

gulp.task('default', function () {
    return gulp.src(files.html)
        .pipe(plugins.inlineCss())
        .pipe(plugins.minifyHtml())
        .pipe(plugins.dom(function () {
            return this.querySelector('body').innerHTML
        }))
        .pipe(gulp.dest(paths.dist));
});