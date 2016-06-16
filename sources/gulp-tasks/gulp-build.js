var through    = require('through2'),
    gutil      = require('gulp-util'),
    fs         = require('fs'),
    path       = require('path'),
    jsdom      = require("jsdom"),
    handlebars = require('handlebars'),
    iconv      = require('iconv-lite'),
    rimraf     = require('rimraf');

require('../helpers')


module.exports = function (srcDir, jsonDir, dist) {
    return through.obj(function (file, enc, cb) {
        var content  = file.contents.toString(),
            fileName = file.relative.split('.')[0],
            json     = path.join(process.cwd(), `${jsonDir}/json`, `${fileName}.json`),
            jsonFile = JSON.parse(fs.readFileSync(json).toString());

        // 创建文件夹
        var newTplDir       = path.join(process.cwd(), dist, `${fileName}`),
            newCodeDir      = `${newTplDir}/src`,
            srcCodeFileName = path.join(process.cwd(), srcDir, `${fileName}`);

        if (!fs.existsSync(newTplDir)) {
            try {
                fs.mkdirSync(newTplDir);
                fs.mkdirSync(newCodeDir);
            } catch (err) {
                throw new Error(`没有找到【${tplDir}】文件夹,请手动创建`)
            }
        }

        // 拷贝源代码
        fs.writeFileSync(`${newCodeDir}/${fileName}.html`, fs.readFileSync(`${srcCodeFileName}.html`));
        fs.writeFileSync(`${newCodeDir}/${fileName}.json`, fs.readFileSync(`${srcCodeFileName}.json`));
        fs.writeFileSync(`${newCodeDir}/${fileName}.scss`, fs.readFileSync(`${srcCodeFileName}.scss`));

        Object.keys(jsonFile).forEach(v => {
            var document   = jsdom.jsdom(content),
                newHbsFile = path.join(newTplDir, `${v}.hbs`),
                hbs        = document.querySelector(`[data-tpl-size="${v}"]`).innerHTML;

            // 清除掉class
            hbs = hbs.replace(/\sclass="(.*?)"/g, '');

            // 创建hbs
            fs.writeFileSync(newHbsFile, hbs);

            var json        = {
                    tplDefultVal  : {},
                    tplform       : {},
                    itemDefaultVal: {},
                    itemForm      : {}
                },
                jsonTpl     = jsonFile[v],
                newJsonFile = path.join(newTplDir, `data.json`);

            json.tplDefultVal   = jsonTpl.tpl;
            json.tplform        = jsonTpl.form;
            json.itemDefaultVal = jsonTpl.item;
            json.itemForm       = jsonTpl.itemForm;

            delete  json.tplform.itemId

            // 创建json
            fs.writeFileSync(newJsonFile, JSON.stringify(json, null, 2));

            var tplWidth = jsonTpl.size.isMobile && `
            body {
                width:16rem;
                margin: 0 auto;
            }
            `;

            var html        = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta name="hotcss" content="initial-dpr=1">
	<title>模板预览 ${fileName}-${v}</title>
	<script src="../../sources/libs/hotcss.js"></script>
	<style>
    * {
        margin: 0;
        padding: 0;
    }
    ${tplWidth}

</style>
</head>
    <body>
    ${hbs}
    </body>
</html>`;
            var newHtmlFile = path.join(newTplDir, `${v}.html`);

            // 创建html预览
            fs.writeFileSync(newHtmlFile, handlebars.compile(html)(jsonTpl));
        });

        cb(null, file);
    })
};