var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
var json     = (location.pathname.split('/').pop()).split('.').shift() + '.json';

var link = '/sources/libs/colorselector/colorselector.css';

var createLink = function (link) {
    var dom = document.createElement('link');

    dom.rel  = 'stylesheet';
    dom.href = link;
    document.head.appendChild(dom);
};


$.getJSON('/src/' + json).then(function (rst) {
    // 随机图片
    var deepShuffle = function (arr) {
        arr.forEach(function (v) {
            $.isArray(v) && deepShuffle(v);
        });

        arr.sort(function () {
            return 0.5 - Math.random();
        });
    };
    deepShuffle(rst.items);

    // 生成并实时渲染jsform
    var $form = $('<form style="margin: 30px;padding: 20px; border-top: 1px solid #eee;"></form>');

    $form.jsonForm(rst.form);
    $form.on('click', render).find('input').on('keyup', render);
    function render () {
        setTimeout(function () {
            rst.tpl = $form.jsonFormValue();
            $('#template').html(template(rst));
        });
    }

    // 置入
    $('body')
        .append(`<div id="template" style="margin: 20px;">${template(rst)}</div>`)
        .append($form);
    createLink(link);
});

