var through = require('through2'),
    gutil   = require('gulp-util'),
    fs      = require('fs'),
    path    = require('path'),
    iconv   = require('iconv-lite'),
    rimraf  = require('rimraf');

var imgs = [
    'https://img.alicdn.com/bao/uploaded/i1/TB1vNSAKpXXXXXkaXXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB19BoKIFXXXXbxXFXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB1tYNUKFXXXXcXXFXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i4/TB1uXoxKXXXXXbcXXXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i2/TB1.H9MKpXXXXasXVXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i1/TB10wJkKpXXXXcIaXXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i3/TB1BwiOKpXXXXaMXFXXXXXXXXXX_!!0-item_pic.jpg',
    'https://img.alicdn.com/bao/uploaded/i3/TB1Ptb0HpXXXXcmXpXXXXXXXXXX_!!0-item_pic.jpg'
];


function rand (begin, end, floor) {
    return floor
        ? ((Math.random() * (end - begin)) + begin).toFixed(2)
        : Math.ceil(Math.random() * (end - begin)) + begin;
}

var createGoodsObj = function (goodsObj) {
    var temp = Object.assign({}, goodsObj, {
        title       : goodsObj.title.slice(0, rand(5, goodsObj.title.length)),
        picUrl      : imgs.shift(),
        url         : '###',
        price       : rand(1, 5000, true),
        promoPrice  : rand(1, 5000, true),
        soldQuantity: rand(1, 5000)
    });

    imgs.push(temp.picUrl);

    return temp;
}

var processJson = function (template, form, goods) {
    var json       = {
            form : {
                schema: {},
                form  : []
            },
            tpl : {},
            items: []
        },
        _goodsTemp = {};

    // 生成宝贝
    Object.keys(goods).forEach(v => _goodsTemp[v] = goods[v].default);

    switch (template.type) {
        case 'fixed':
            var tds = [];

            for (var i = 0; i < template.maxTd; i++) {
                tds[i] = createGoodsObj(_goodsTemp);
            }

            json.items.push(tds);
            break;

        case 'flow':
        default:
            for (var i = 0; i < template.maxTd; i++) {
                json.items.push(createGoodsObj(_goodsTemp));
            }
    }

    Object.keys(form).forEach(v => {
        var formValue = form[v];

        // 生成form
        json.form.schema[v] = {
            type   : formValue.type,
            title  : formValue.desc,
            default: formValue.default
        };

        if (Array.isArray(formValue.default)) {
            json.form.schema[v].enum    = formValue.default;
            json.form.schema[v].default = json.form.schema[v].enum[0];
        }

        json.form.form.push({
            key : v,
            type: formValue.fn
        });

        // 生成模板
        json.tpl[v] = Array.isArray(formValue.default) ? formValue.default[0] : formValue.default;
    });

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
                    }
                `,
                html     = `<div id="container"></div>`,
                fileName = `${file.relative.split('.')[0]}-${v}`;
            fs.writeFile(`${dir}/${fileName}.html`, iconv.encode(html, 'utf-8'), null);
            fs.writeFile(`${dir}/${fileName}.scss`, iconv.encode(css, 'utf-8'), null);
            fs.writeFile(`${dir}/${fileName}.json`, iconv.encode(JSON.stringify(json, null, 2), 'utf-8'), null);
        }, tempaltes);

        // 删除文件
        rimraf(file.path, function (err) {
            err && this.emit('error', new gutil.PluginError('gulp-create', err));

            file.contents = new Buffer(JSON.stringify(content));
            cb(null, file);
        });
    })
};