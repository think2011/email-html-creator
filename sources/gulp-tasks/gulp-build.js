var through    = require('through2'),
    gutil      = require('gulp-util'),
    fs         = require('fs'),
    path       = require('path'),
    jsdom      = require("jsdom"),
    handlebars = require('handlebars'),
    iconv      = require('iconv-lite'),
    rimraf     = require('rimraf');


/**
 * 常用的handlebars扩展helper
 *
 * 1. eq
 * 用法: {{#eq left right}} block {{else}} inverse {{/eq}} else为可选
 * 含义: 如果left严格等于right, 渲染block, 否则渲染inverse
 *
 * 2. noteq
 * 用法: {{#noteq left right}} block {{else}} inverse {{/noteq}} else为可选
 * 含义: 如果left不严格等于right, 渲染block, 否则渲染inverse
 *
 * 3. gt
 * 用法: {{#gt left right}} block {{else}} inverse {{/gt}} else为可选
 * 含义: 如果left大于right, 渲染block, 否则渲染inverse
 *
 * 4. gte
 * 用法: {{#gte left right}} block {{else}} inverse {{/gte}} else为可选
 * 含义: 如果left大于等于right, 渲染block, 否则渲染inverse
 *
 * 5. lt
 * 用法: {{#lt left right}} block {{else}} inverse {{/lt}} else为可选
 * 含义: 如果left小于right, 渲染block, 否则渲染inverse
 *
 * 6. lte
 * 用法: {{#lte left right}} block {{else}} inverse {{/lte}} else为可选
 * 含义: 如果left小于等于right, 渲染block, 否则渲染inverse
 *
 * 7. even
 * 用法: {{#even num}} block {{else}} inverse {{/even}} else为可选
 * 含义: 如果num为偶数, 渲染block, 否则渲染inverse
 *
 * 8. odd
 * 用法: {{#odd num}} block {{else}} inverse {{/odd}} else为可选
 * 含义: 如果num为奇数, 渲染block, 否则渲染inverse
 *
 * 9. multiple
 * 用法: {{#multiple num base}} block {{else}} inverse {{/multiple}} else为可选
 * 含义: 如果num为base的倍数, 渲染block, 否则渲染inverse
 *
 * 10. and
 * 用法: {{#and item1 item2 ...}} block {{else}} inverse {{/and}} else为可选
 * 含义: 多个值求并 &&, 参数可变长,如果结果true渲染block, 否则渲染inverse
 *
 * 11. or
 * 用法: {{#or item1 item2 ...}} block {{else}} inverse {{/or}} else为可选
 * 含义: 多个值求或 ||, 参数可变长,如果结果true渲染block, 否则渲染inverse
 *
 * 12. stringify
 * 用法: {{stringify obj}}
 * 含义: 将obj序列号为字符串,并执行HTML特殊字符转换, 如", <, >, &这样就可以直接
 *      将对象设置到DOM属性上,或者输出对象
 *
 * 13. encode
 * 用法: {{encode str}}
 * 含义: 将str字符串使用encodeURIComponent转义
 *
 **/

// 比较两个变量是否相等
handlebars.registerHelper('eq', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "eq" needs 2 arguments');
    }
    if (left === right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 比较两个变量是否相等
handlebars.registerHelper('noteq', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "eq" needs 2 arguments');
    }
    if (left !== right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 比较第一个变量是否大于第二个
handlebars.registerHelper('gt', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "gt" needs 2 arguments');
    }
    if (left > right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 比较第一个变量是否大于等于第二个
handlebars.registerHelper('gte', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "gte" needs 2 arguments');
    }
    if (left >= right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


// 比较第一个变量是否小于第二个
handlebars.registerHelper('lt', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "lt" needs 2 arguments');
    }
    if (left < right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 比较第一个变量是否小于等于第二个
handlebars.registerHelper('lte', function (left, right, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "lte" needs 2 arguments');
    }
    if (left <= right) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 判断一个整数是否为偶数
handlebars.registerHelper('even', function (num, options) {
    if (arguments.length !== 2) {
        throw new Error('helper "even" needs 1 argument');
    }
    if (num % 2 === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


// 判断一个整数是否为奇数
handlebars.registerHelper('odd', function (num, options) {
    if (arguments.length !== 2) {
        throw new Error('helper "odd" needs 1 argument');
    }
    if (num % 2 === 1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


/**
 * 判断一个整数是否为制定数字的整数倍
 * @param num {number} 需要判断的数字
 * @param base {number} 被比较的因子
 **/
handlebars.registerHelper('multiple', function (num, base, options) {
    if (arguments.length !== 3) {
        throw new Error('helper "multiple" needs 2 arguments');
    }
    if (num % base === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


// 多个变量求并&&, 可变长参数
handlebars.registerHelper('and', function () {
    if (arguments.length <= 2) {
        throw new Error('helper "and" need at least 2 arguments');
    }
    var options = arguments[arguments.length - 1];
    var items   = [].slice.call(arguments, 0, arguments.length - 1);
    var result  = items.reduce(function (memo, item) {
        return memo && item;
    });
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 多个变量求或||, 可变长参数
handlebars.registerHelper('or', function () {
    if (arguments.length <= 2) {
        throw new Error('helper "or" need at least 2 arguments');
    }

    var options = arguments[arguments.length - 1];
    var items   = [].slice.call(arguments, 0, arguments.length - 1);
    var result  = items.reduce(function (memo, item) {
        return memo || item;
    });
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 将对象序列号为字符串,调用JSON.stringify()
handlebars.registerHelper('stringify', function (obj) {
    return JSON.stringify(obj);
});

// 使用encodeURIComponent转义字符串
handlebars.registerHelper('encode', function (str) {
    return encodeURIComponent(str);
});

/**
 * 把根据参数返回数字的整数和小数部分
 * @example
 * price = 10010.20
 * {{toFixed price 0}} => 10010
 * {{toFixed price 1}} => 20
 */
handlebars.registerHelper("toFixed", function (number, params) {
    if (isNaN(+number)) {
        throw new Error('arguments must be a number');
    }

    var rst = ((+number).toFixed(2)).split('.');

    switch (params) {
        case 0:
            return rst[0];
            break;

        case 1:
            return rst[1];
            break;

        default:
            return +number;
    }
});


module.exports = function (srcDir, jsonDir, dist) {
    return through.obj(function (file, enc, cb) {
        var content  = file.contents.toString(),
            fileName = file.relative.split('.')[0],
            json     = path.join(process.cwd(), jsonDir, `${fileName}.json`),
            jsonFile = JSON.parse(fs.readFileSync(json).toString());

        // 创建文件夹
        var newTplDir       = path.join(process.cwd(), dist, `${fileName}`),
            newCodeDir      = `${newTplDir}/src`,
            srcCodeFileName = path.join(process.cwd(), srcDir, `${fileName}`);

        if (!fs.existsSync(newTplDir)) {
            fs.mkdirSync(newTplDir);
            fs.mkdirSync(newCodeDir);
        }

        // 拷贝源代码
        fs.writeFileSync(`${newCodeDir}/${fileName}.html`, fs.readFileSync(`${srcCodeFileName}.html`));
        fs.writeFileSync(`${newCodeDir}/${fileName}.json`, fs.readFileSync(`${srcCodeFileName}.json`));
        fs.writeFileSync(`${newCodeDir}/${fileName}.scss`, fs.readFileSync(`${srcCodeFileName}.scss`));

        Object.keys(jsonFile).forEach(v => {
            var document   = jsdom.jsdom(content),
                newHbsFile = path.join(newTplDir, `${fileName}-${v}.hbs`),
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
                newJsonFile = path.join(newTplDir, `${fileName}-${v}.json`);

            json.tplDefultVal   = jsonTpl.tpl;
            json.tplform        = jsonTpl.form;
            json.itemDefaultVal = jsonTpl.item;
            json.itemForm       = jsonTpl.itemForm;

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
            var newHtmlFile = path.join(newTplDir, `${fileName}-${v}.html`);

            // 创建html预览
            fs.writeFileSync(newHtmlFile, handlebars.compile(html)(jsonTpl));
        });

        cb(null, file);
    })
};