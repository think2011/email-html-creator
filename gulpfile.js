var gulp        = require('gulp'),
    path        = require('path'),
    fs          = require('fs'),
    jsdom       = require("jsdom"),
    through     = require('through2'),
    create      = require('./sources/gulp-create'),
    Entities    = require('html-entities').AllHtmlEntities,
    plugins     = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();

var paths = {
    src    : './src',
    dist   : './dist',
    sources: './sources',
    tmp    : './_tmp',
    build  : './build'
};

gulp.task('server', function () {
    browserSync.init({
        server: {
            directory: true,
            baseDir  : './'
        }
    });
});

gulp.task('dev', ['dev:sass'], function () {
    return gulp.src(`${paths.src}/*.html`)
        .pipe(plugins.plumber())

        // 包裹
        .pipe(plugins.fileWrapper(`${paths.sources}/index.html`))

        // 插入样式
        .pipe(insertLink())

        // decodeHTML
        .pipe(decodeHtml())

        // 样式转内联
        .pipe(plugins.inlineCss())

        // 收工
        .pipe(plugins.dom(function () {
            var textarea      = this.querySelector('textarea'),
                entryTemplate = this.querySelector('#entry-template');

            entryTemplate.innerHTML = textarea.value;
            textarea.parentNode.removeChild(textarea);

            return this;
        }))

        .pipe(gulp.dest(paths.dist))

        .on('end', browserSync.reload);
});


gulp.task('dev:sass', function (cb) {
    return gulp.src(`${paths.src}/*.scss`)
        .pipe(plugins.plumber())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(paths.dist));
});


// 生成开发文件
gulp.task('dev:create', function (cb) {
    return gulp.src(`${paths.src}/*.tpl`)
        .pipe(create(paths.src))
        .pipe(gulp.dest(paths.tmp))
});


// 生成开发文件
gulp.task('dev:clean', function () {
    return gulp.src(`${paths.dist}/*.*`)
        .pipe(plugins.clean())
});


gulp.task('build', ['dev'], function () {
    return gulp.src(`${paths.dist}/*.html`)
        .pipe(plugins.minifyHtml())
        .pipe(plugins.dom(function () {
            return this.querySelector('#entry-template').innerHTML
        }))
        .pipe(gulp.dest(paths.build));
});


gulp.task('default', ['dev:clean', 'dev', 'server'], function () {
    plugins.watch(`${paths.src}/*.*`, () => {
        gulp.start(['dev']);
    });
});


function insertLink () {
    return through.obj(function (file, enc, cb) {
        var fileName = file.relative.split('.')[0],
            content  = file.contents.toString();

        jsdom.env(content, function (err, window) {
                var document = window.document,
                    link     = document.createElement('link');

                link.rel  = 'stylesheet';
                link.href = `../dist/${fileName}.css`;
                document.querySelector('head').appendChild(link);

                file.contents = new Buffer(jsdom.serializeDocument(window.document));

                cb(null, file);

                window.close();
            }
        );

    })
}

function decodeHtml () {
    return through.obj(function (file, enc, cb) {
        var entities = new Entities(),
            content  = file.contents.toString();

        file.contents = new Buffer(entities.decode(content));
        cb(null, file);
    })
}