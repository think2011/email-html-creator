var through = require('through2'),
    gutil   = require('gulp-util'),
    fs      = require('fs'),
    path    = require('path'),
    jsdom   = require("jsdom"),
    iconv   = require('iconv-lite'),
    rimraf  = require('rimraf');


module.exports = function (jsonDir, dist) {
    return through.obj(function (file, enc, cb) {
        var content   = file.contents.toString(),
            json      = path.join(process.cwd(), jsonDir, `${file.relative.split('.')[0]}.json`),
            jsonFile  = JSON.parse(fs.readFileSync(json).toString()),
            targetDir = path.join(process.cwd(), dist);

        Object.keys(jsonFile).forEach(v => {
            var document    = jsdom.jsdom(content),
                newHtmlFile = path.join(targetDir, `${file.relative.split('.')[0]}-${v}.html`);

            // 创建html
            fs.writeFileSync(newHtmlFile, document.querySelector(`[data-tpl-size="${v}"]`).innerHTML);

            var json        = {
                    def_val     : {},
                    form_def: {},
                    item_def_val: {},
                    item_form   : {}
                },
                jsonTpl     = jsonFile[v],
                newJsonFile = path.join(targetDir, `${file.relative.split('.')[0]}-${v}.json`);

            json.def_val      = jsonTpl.tpl;
            json.form_def     = jsonTpl.form;
            json.item_def_val = jsonTpl.item;
            json.item_form    = jsonTpl.itemForm;

            // 创建json
            fs.writeFileSync(newJsonFile, JSON.stringify(json, null, 2));
        });

        cb(null, file);
    })
};