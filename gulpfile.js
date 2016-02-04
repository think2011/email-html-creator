var gulp             = require('gulp'),
    path             = require('path'),
    fs               = require('fs'),
    jsdom            = require("jsdom"),
    through          = require('through2'),
    create           = require('./sources/gulp-tasks/gulp-create'),
    build            = require('./sources/gulp-tasks/gulp-build'),
    dev              = require('./sources/gulp-tasks/gulp-dev'),
    Entities         = require('html-entities').AllHtmlEntities,
    plugins          = require('gulp-load-plugins')(),
    browserSync      = require('browser-sync').create(),
    htmlAutoprefixer = require("html-autoprefixer");

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

gulp.task('dev', ['dev:json', 'dev:sass'], function () {
    return gulp.src(`${paths.src}/*.html`)
        .pipe(plugins.plumber())

        .pipe(dev(paths.dist))

        // 包裹
        .pipe(plugins.fileWrapper(`${paths.sources}/index.html`))

        // 插入样式
        .pipe(insertLink())

        // 保护style内的变量
        .pipe(ensureVarStyle())

        // decodeHTML
        .pipe(decodeHtml())

        // 样式转内联
        .pipe(plugins.inlineCss())

        // 恢复style内的变量 & 将td中style里的url转到td属性上
        .pipe(recoveryVarStyle())

        // 生成对应script
        .pipe(plugins.dom(function () {
            var document = this;

            [].forEach.call(this.querySelectorAll('textarea'), function (v) {
                var script = document.createElement('script'),
                    size   = v.getAttribute('data-tpl-size');

                script.type = 'text/x-handlebars-template';
                script.setAttribute('data-tpl-size', size);
                script.innerHTML = htmlAutoprefixer.process(v.value);
                document.body.appendChild(script);

                v.parentNode.removeChild(v);
            });

            return this;
        }))

        .pipe(gulp.dest(paths.dist))

        .on('end', browserSync.reload);
});


gulp.task('dev:sass', function () {
    return gulp.src(`${paths.src}/*.scss`)
        .pipe(plugins.plumber())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('dev:json', function () {
    return gulp.src(`${paths.src}/*.json`)
        .pipe(plugins.plumber())
        .pipe(create())
        .pipe(gulp.dest(paths.dist));
});


// 清空内容
gulp.task('dev:clean', function () {
    return gulp.src(`${paths.dist}/*.*`)
        .pipe(plugins.clean());
});


gulp.task('build', function () {
    return gulp.src(`${paths.dist}/*.html`)
        .pipe(plugins.minifyHtml())
        .pipe(build(paths.src, paths.dist, paths.build));
});
gulp.task('default', ['dev', 'server'], function () {
    plugins.watch(`${paths.src}/*.*`, () => {
        gulp.start('dev');
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

function ensureVarStyle () {
    return through.obj(function (file, enc, cb) {
        var content = file.contents.toString();

        content = content.replace(/\{\{(.+?)}}/g, 'VER:$1:VER');

        file.contents = new Buffer(content);
        cb(null, file);
    })
}

function recoveryVarStyle () {
    return through.obj(function (file, enc, cb) {
        var content = file.contents.toString();

        content = content.replace(/VER:/ig, '{{');
        content = content.replace(/:VER/ig, '}}');

        content = content.replace(/<table .*(style=".*?.*url\((.*)\).*".*)>/g, replaceCallBack);
        content = content.replace(/<tr .*(style=".*?.*url\((.*)\).*".*)>/g, replaceCallBack);
        content = content.replace(/<td .*(style=".*?.*url\((.*)\).*".*)>/g, replaceCallBack);

        file.contents = new Buffer(content);
        cb(null, file);

        function replaceCallBack (td, style, url) {
            // 移动url到td background
            td = td.replace(style, `background="${url}" $&`);

            // 清空style中的background
            td = td.replace(/url\(.*?\)/g, '');

            return td;
        }
    })
}
