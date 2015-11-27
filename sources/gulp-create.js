var through = require('through2'),
    gutil   = require('gulp-util'),
    fs      = require('fs'),
    path    = require('path'),
    rimraf  = require('rimraf');

var imgs = [
    'https://img.alicdn.com/bao/uploaded/i1/TB1vNSAKpXXXXXkaXXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB19BoKIFXXXXbxXFXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB1tYNUKFXXXXcXXFXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i4/TB1uXoxKXXXXXbcXXXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB1.H9MKpXXXXasXVXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i1/TB10wJkKpXXXXcIaXXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i3/TB1BwiOKpXXXXaMXFXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg',
    'https://img.alicdn.com/bao/uploaded/i3/TB1Ptb0HpXXXXcmXpXXXXXXXXXX_!!0-item_pic.jpg_sum.jpg'
];

var processJson = function (template, form, goods) {
    var json = {
        form : {},
        tpl  : {},
        items: []
    };

    switch (template.type) {
        case 'fixed':
            var _goodsTemp = {};

            // 生成宝贝
            Object.keys(goods).forEach(v => _goodsTemp[v] = goods[v].default);

            // 生成模板

            for (var i = 0; i < _goodsTemplate.maxTd; i++) {
                // 补充宝贝属性
                _goodsTemp.picUrl = imgs.sort(v => 0.5 - Math.random())[0];
                _goodsTemp.url    = '###';
                json.items.push(_goodsTemp);
            }
            break;

        case 'flow':
        default:
        //
    }

    return json;
};

module.exports = function (dist) {
    return through.obj(function (file, enc, cb) {
        var content   = JSON.parse(file.contents.toString()),
            tempaltes = content['模板定义'],
            form      = content['表单定义'],
            goods     = content['宝贝定义'];

        Object.keys(tempaltes).forEach(function (v) {
            var dir      = path.join(process.cwd(), dist),
                json     = processJson(this[v], form, goods),
                css      = `
                    #container {
                      width: ${v}px;
                      overflow: hidden;
                      background-color: #fff;
                      text-align: left;
                      font-size: 12px;
                      font-family: "Microsoft YaHei", serif;
                      margin: 0 auto;

                      table {
                        background: skyblue;
                      }
                    }
                `,
                html     = `<div id="container"></div>`,
                fileName = `${file.relative.split('.')[0]}-${v}`;

            fs.writeFile(`${dir}/${fileName}.html`, html, 'utf8');
            fs.writeFile(`${dir}/${fileName}.scss`, css, 'utf8');
            fs.writeFile(`${dir}/${fileName}.json`, JSON.stringify(json, null, 4), 'utf8');
        }, tempaltes);

        // 删除文件
        /* rimraf(file.path, function (err) {
         this.emit('error', new gutil.PluginError('gulp-create', err));
         });*/

        file.contents = new Buffer(JSON.stringify(content));
        cb(null, file);
    })
};