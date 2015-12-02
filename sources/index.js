var jsonSrc = '/dist/' + (location.pathname.split('/').pop()).split('.').shift() + '.json';


// 触发渲染模板
$(document).on('renderTpl', function (event, rst) {
    var $form  = $('form'),
        newRst = $form.jsonFormValue && $form.jsonFormValue();

    Object.keys(rst).forEach(function (v) {
        rst[v].tpl = newRst || rst[v].tpl;

        render(v, rst[v]);
    });
});

$.getJSON(jsonSrc).then(function (rst) {
    $(document).trigger('renderTpl', rst);

    var $form    = $('<form></form>'),
        formJson = rst[Object.keys(rst)[0]].form;

    $form.jsonForm(formJson);

    $form.on('click', function () {
        $(document).trigger('renderTpl', rst)
    }).find('input').on('keyup', function () {
        $(document).trigger('renderTpl', rst)
    });

    $('body').append($form);
});

function render (size, json) {
    var html     = $('[data-tpl-size="' + size + '"]').val(),
        template = Handlebars.compile(html)(json),
        $tpl     = $('#tpl-' + size);


    if ($tpl.length !== 0) {
        $tpl.html(template);
    } else {
        var $el = $('<div id="tpl-' + size + '"></div>');
        $('body').append($el);

        render(size, json);
    }
}

var createLink = function (link) {
    var dom = document.createElement('link');

    dom.rel  = 'stylesheet';
    dom.href = link;
    document.head.appendChild(dom);
};

// 初始化
var link = '/sources/libs/colorselector/colorselector.css';
createLink(link);

var baseStyle = '<style>textarea{display:none;}; #[id^="tpl-"] {margin:20px;}; form{margin: 30px;padding: 20px; border-top: 1px solid #eee;}</style>';
$('head').append(baseStyle);