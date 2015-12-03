var through = require('through2'),
    gutil   = require('gulp-util'),
    fs      = require('fs'),
    path    = require('path');

module.exports = function (jsonDir) {
    return through.obj(function (file, enc, cb) {
        var content  = file.contents.toString(),
            json     = path.join(process.cwd(), jsonDir, `${file.relative.split('.')[0]}.json`),
            jsonFile = JSON.parse(fs.readFileSync(json).toString()),
            rst      = [];


        Object.keys(jsonFile).forEach(v => {
            var _content = content,
                size     = jsonFile[v].size;

            // 更新对应size
            _content = _content.replace(/\{\{size\._picSize}}/g, size._picSize);

            rst.push(`
            <textarea data-tpl-size="${v}">
                <div style="width: ${v}px;" class="container">
                    ${_content}
                </div>
                </textarea>
            `);
        });

        file.contents = new Buffer(rst.join(''));
        cb(null, file);
    })
};