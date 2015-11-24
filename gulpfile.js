var gulp        = require('gulp'),
    path        = require('path'),
    plugins     = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();

var paths = {
    src : './src',
    dist: './dist'
};

var files = {
    src : `${paths.src}/*.*`,
    html: `${paths.src}/*.html`
};

gulp.task('server', function () {
    browserSync.init({
        files : `${paths.dist}/*.*`,
        server: {
            baseDir: paths.dist
        }
    });
});

gulp.task('dev', function () {
    return gulp.src(files.html)
        .pipe(plugins.inlineCss())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', function () {
    return gulp.src(files.html)
        .pipe(plugins.inlineCss())
        .pipe(plugins.minifyHtml())
        .pipe(plugins.dom(function () {
            return this.querySelector('body').innerHTML
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['dev', 'server'], function () {
    plugins.watch(files.src, () => {
        gulp.start(['dev']);
    });
});
