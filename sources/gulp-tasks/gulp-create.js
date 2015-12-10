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

var splitFloat = function (num) {
    return [
        num.split('.')[0],
        num.split('.')[1]
    ];
};

var createGoodsObj = function (goodsObj) {
    var temp = Object.assign({}, goodsObj, {
        title       : goodsObj.title.slice(0, rand(5, goodsObj.title.length)),
        picUrl      : imgs.shift(),
        url         : 'http://taobao.com',
        price       : rand(1, 5000, true),
        promoPrice  : rand(1, 5000, true),
        soldQuantity: rand(1, 5000)
    });

    // 增加整数和小数部分
    temp.price_a      = splitFloat(temp.price)[0];
    temp.price_b      = splitFloat(temp.price)[1];
    temp.promoPrice_a = splitFloat(temp.promoPrice)[0];
    temp.promoPrice_b = splitFloat(temp.promoPrice)[1];

    imgs.push(temp.picUrl);

    return temp;
};

var createJsonForm = function (formDefine, skipTags) {
    var form   = {
            schema: {},
            form  : []
        },
        simple = {};

    Object.keys(formDefine).forEach(v => {
        // 跳过忽略字段
        if (skipTags && skipTags.indexOf(v) !== -1) return;

        var formValue = formDefine[v];

        // 生成form
        form.schema[v] = {
            type   : formValue.type,
            title  : formValue.desc,
            default: formValue.default
        };

        // 针对类型不同作处理
        if (Array.isArray(formValue.default)) {
            form.schema[v].enum    = formValue.default;
            form.schema[v].default = form.schema[v].enum[0];
        }

        form.form.push({
            key : v,
            type: formValue.fn
        });

        // 生成模板
        simple[v] = Array.isArray(formValue.default) ? formValue.default[0] : formValue.default;
    });

    return [form, simple];
};

var processJson = function (template, form, goods) {
    var json       = {
            size : {},
            form: {
                schema: {},
                form  : []
            },
            tpl : {},
            items: []
        },
        _goodsTemp = {};

    // 生成size
    json.size = template;

    // 生成宝贝
    Object.keys(goods).forEach(v => _goodsTemp[v] = goods[v].default);

    switch (template.type) {
        case 'flow':
            var tds = [];

            for (var i = 0; i < template.maxTd; i++) {
                tds[i] = createGoodsObj(_goodsTemp);
            }

            json.items.push(tds);
            json.items.push(tds);
            break;

        case 'fixed':
        default:
            for (var i = 0; i < template.maxTd; i++) {
                json.items.push(createGoodsObj(_goodsTemp));
            }
    }

    var formObj = createJsonForm(form);

    json.form = formObj[0];
    json.tpl  = formObj[1];

    var goodsObj = createJsonForm(goods, [
        'price_a',
        'price_b',
        'promoPrice_a',
        'promoPrice_b'
    ]);

    json.itemForm = goodsObj[0];
    json.item     = goodsObj[1];

    return json;
};

module.exports = function () {
    return through.obj(function (file, enc, cb) {
        var content   = JSON.parse(file.contents.toString()),
            tempaltes = content['模板定义'],
            form      = content['表单定义'],
            goods     = content['宝贝定义'],
            tpls      = {};

        Object.keys(tempaltes).forEach(function (v) {
            tpls[v] = processJson(this[v], form, goods);
        }, tempaltes);

        file.contents = new Buffer(JSON.stringify(tpls, null, 2));
        cb(null, file);
    })
};