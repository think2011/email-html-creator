var through = require('through2'),
    gutil   = require('gulp-util'),
    fs      = require('fs'),
    path    = require('path'),
    iconv   = require('iconv-lite'),
    rimraf  = require('rimraf');


module.exports = function (dist) {
    return through.obj(function (file, enc, cb) {
        var content = file.contents.toString();

        file.contents = new Buffer(JSON.stringify(content));
        cb(null, file);
    })
};