'use strict';

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
 *  14. xIf TODO:目前仅支持满减模板使用
 *  用法: {{xIf lvalue operator rvalue}}
 *  含义: 支持字符串数组的判断
 *
 *  14. addOne
 *  含义: 数字加1,用于@index
 *
 *  15. match
 *  用法: {{math A '+' B}}
 *  含义: 加减乘除等
 **/

if (typeof require !== 'undefined') {
    var Handlebars = require('handlebars')
}


// 比较两个变量是否相等
Handlebars.registerHelper('eq', function (left, right, options) {
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
Handlebars.registerHelper('noteq', function (left, right, options) {
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
Handlebars.registerHelper('gt', function (left, right, options) {
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
Handlebars.registerHelper('gte', function (left, right, options) {
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
Handlebars.registerHelper('lt', function (left, right, options) {
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
Handlebars.registerHelper('lte', function (left, right, options) {
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
Handlebars.registerHelper('even', function (num, options) {
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
Handlebars.registerHelper('odd', function (num, options) {
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
Handlebars.registerHelper('multiple', function (num, base, options) {
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
Handlebars.registerHelper('and', function () {
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
Handlebars.registerHelper('or', function () {
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
Handlebars.registerHelper('stringify', function (obj) {
    return JSON.stringify(obj);
});

// 使用encodeURIComponent转义字符串
Handlebars.registerHelper('encode', function (str) {
    return encodeURIComponent(str);
});


/**
 * 把根据参数返回数字的整数和小数部分
 * @example
 * price = 10010.20
 * {{toFixed price 0}} => 10010
 * {{toFixed price 1}} => 20
 */
Handlebars.registerHelper("toFixed", function (number, params) {
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

/**
 * 根据传入的地区信息转换出符合规则的内容
 *
 * 注意:传入的字符串地址需要是根据id排序好的
 */
Handlebars.registerHelper('decodeExpress', function (str, options) {
    var address = [
        {
            "id"  : 100000,
            "name": "华北"
        },
        {
            "id"      : 110000,
            "name"    : "北京",
            "parentId": 100000
        },
        {
            "id"      : 120000,
            "name"    : "天津",
            "parentId": 100000
        },
        {
            "id"      : 130000,
            "name"    : "河北",
            "parentId": 100000
        },
        {
            "id"      : 140000,
            "name"    : "山西",
            "parentId": 100000
        },
        {
            "id"      : 150000,
            "name"    : "内蒙古",
            "parentId": 100000
        },
        {
            "id"  : 200000,
            "name": "东北"
        },
        {
            "id"      : 210000,
            "name"    : "辽宁",
            "parentId": 200000
        },
        {
            "id"      : 220000,
            "name"    : "吉林",
            "parentId": 200000
        },
        {
            "id"      : 230000,
            "name"    : "黑龙江",
            "parentId": 200000
        },
        {
            "id"  : 300000,
            "name": "华东"
        },
        {
            "id"      : 310000,
            "name"    : "上海",
            "parentId": 300000
        },
        {
            "id"      : 320000,
            "name"    : "江苏",
            "parentId": 300000
        },
        {
            "id"      : 330000,
            "name"    : "浙江",
            "parentId": 300000
        },
        {
            "id"      : 340000,
            "name"    : "安徽",
            "parentId": 300000
        },
        {
            "id"      : 350000,
            "name"    : "福建",
            "parentId": 300000
        },
        {
            "id"      : 360000,
            "name"    : "江西",
            "parentId": 300000
        },
        {
            "id"      : 370000,
            "name"    : "山东",
            "parentId": 300000
        },
        {
            "id"  : 400001,
            "name": "华中"
        },
        {
            "id"  : 400002,
            "name": "华南"
        },
        {
            "id"      : 410000,
            "name"    : "河南",
            "parentId": 400001
        },
        {
            "id"      : 420000,
            "name"    : "湖北",
            "parentId": 400001
        },
        {
            "id"      : 430000,
            "name"    : "湖南",
            "parentId": 400001
        },
        {
            "id"      : 440000,
            "name"    : "广东",
            "parentId": 400002
        },
        {
            "id"      : 450000,
            "name"    : "广西",
            "parentId": 400002
        },
        {
            "id"      : 460000,
            "name"    : "海南",
            "parentId": 400002
        },
        {
            "id"      : 500000,
            "name"    : "重庆",
            "parentId": 500001
        },
        {
            "id"  : 500001,
            "name": "西南"
        },
        {
            "id"      : 510000,
            "name"    : "四川",
            "parentId": 500001
        },
        {
            "id"      : 520000,
            "name"    : "贵州",
            "parentId": 500001
        },
        {
            "id"      : 530000,
            "name"    : "云南",
            "parentId": 500001
        },
        {
            "id"      : 540000,
            "name"    : "西藏",
            "parentId": 500001
        },
        {
            "id"  : 600000,
            "name": "西北"
        },
        {
            "id"      : 610000,
            "name"    : "陕西",
            "parentId": 600000
        },
        {
            "id"      : 620000,
            "name"    : "甘肃",
            "parentId": 600000
        },
        {
            "id"      : 630000,
            "name"    : "青海",
            "parentId": 600000
        },
        {
            "id"      : 640000,
            "name"    : "宁夏",
            "parentId": 600000
        },
        {
            "id"      : 650000,
            "name"    : "新疆",
            "parentId": 600000
        },
        {
            "id"  : 700000,
            "name": "常用不免邮地区"
        },
        {
            "id"      : 710000,
            "name"    : "台湾",
            "parentId": 700000
        },
        {
            "id"      : 810000,
            "name"    : "香港",
            "parentId": 700000
        },
        {
            "id"      : 820000,
            "name"    : "澳门",
            "parentId": 700000
        },
        {
            "id"      : 990000,
            "name"    : "海外",
            "parentId": 700000
        }
    ]

    var normalized = function (arr) {
        return arr.filter((v) => v.parentId).sort((a, b) => a.id > b.id ? 1 : -1).map(v => v.name).join(',')
    }
    var filterFn   = {
        all      : normalized(address),
        inland   : normalized(address.filter((v) => {
            var excludes = ['台湾', '香港', '澳门', '海外', '新疆', '西藏']

            return excludes.indexOf(v.name) === -1
        })),
        getAll   : function () {
            if (str === this.all) {
                options.data.content = '全球免邮'

                return str
            } else {
                return false
            }
        },
        getInland: function () {
            if (str === this.inland) {
                options.data.content = '全国免邮（不免邮地区：港澳台，西藏，新疆，海外）'

                return str
            } else {
                return false
            }
        },
        getHalf  : function () {
            if (str.length < this.all.length / 2) {
                options.data.content = `免邮地区：${str}`
            } else {
                var input = str.split(',')
                var all   = this.all.split(',')
                var _str  = all.filter((v) => input.indexOf(v) === -1).join(',')

                options.data.content = `不免邮地区：${_str}`
            }

            return str
        }
    }

    return options.fn(filterFn.getAll() || filterFn.getInland() || filterFn.getHalf())
});


/**
 * 数字+1
 */
Handlebars.registerHelper("addOne", function (index) {
    return index + 1;
});


/**
 * 加减乘除
 */
Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    let result = {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator]

    return result.toFixed(2);
});

Handlebars.registerHelper('xIf', function (lvalue, operator, rvalue, options) {
    var operators, result;

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
        options  = rvalue;
        rvalue   = operator;
        operator = "===";
    }

    operators = {
        '=='    : function (l, r) {
            return l == r;
        },
        '==='   : function (l, r) {
            return l === r;
        },
        '!='    : function (l, r) {
            return l != r;
        },
        '!=='   : function (l, r) {
            return l !== r;
        },
        '<'     : function (l, r) {
            return l < r;
        },
        '>'     : function (l, r) {
            return l > r;
        },
        '<='    : function (l, r) {
            return l <= r;
        },
        '>='    : function (l, r) {
            return l >= r;
        },
        'typeof': function (l, r) {
            return typeof l == r;
        }
    };

    if (!operators[operator]) {
        throw new Error("'xIf' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});