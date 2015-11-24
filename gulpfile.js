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
            directory: true,
            baseDir  : './'
        }
    });
});

gulp.task('dev', function () {
    return gulp.src(files.html)
        .pipe(plugins.dom(function () {
            // 抽离出HTML进行inLineCss
            var tplContainer = this.createElement('div');

            tplContainer.id = 'tpl-container';
            tplContainer.innerHTML = this.querySelector('#entry-template').innerHTML;
            this.querySelector('body').appendChild(tplContainer);

            return this;
        }))
        .pipe(plugins.inlineCss())
        // 恢复
        .pipe(plugins.dom(function () {
            var tplContainer = this.querySelector('#tpl-container');

            this.querySelector('#entry-template').innerHTML = tplContainer.innerHTML;
            tplContainer.parentNode.removeChild(tplContainer);

            return this;
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['dev'], function () {
    return gulp.src(`${paths.dist}/*.html`)
        .pipe(plugins.minifyHtml())
        .pipe(plugins.dom(function () {
            return this.querySelector('#entry-template').innerHTML
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['dev', 'server'], function () {
    plugins.watch(files.src, () => {
        gulp.start(['dev']);
    });
});
