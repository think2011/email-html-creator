$(function () {
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

    function render(size, json) {
        var html     = $('[data-tpl-size="' + size + '"]').html(),
            template = Handlebars.compile(html)(json),
            $tpl     = $('#___' + size + '___');


        if ($tpl.length !== 0) {
            $tpl.html(template);
        } else {
            var $el = $('<div id="___' + size + '___"></div>');
            $('body').append('<div class="hr-desc"><span>' + size + '</span></div>').append($el);

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
    createLink('/sources/index.css');
    createLink('/sources/libs/colorselector/colorselector.css');
});