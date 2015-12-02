var jsonSrc = '/dist/' + (location.pathname.split('/').pop()).split('.').shift() + '.json';
/*
 var source   = $("#entry-template").html();
 var template = Handlebars.compile(source);

 */

$.getJSON(jsonSrc).then(function (rst) {
    var formJson = null;

    Object.keys(rst).forEach(function (v) {
        render(v, rst[v]);

        formJson = rst[v].form;
    });

    var $form = $('<form></form>');
    $form.jsonForm(formJson);
    $form.on('click', renderForm).find('input').on('keyup', renderForm);
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

function renderForm (rst) {
    var newRst = $('form').jsonFormValue();


    Object.keys(rst).forEach(function (v) {
        render(v, newRst);
    });
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