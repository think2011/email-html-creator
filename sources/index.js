var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
var json     = (location.pathname.split('/').pop()).split('.').shift() + '.json';

$.getJSON('/src/' + json).then(function (rst) {
    var deepShuffle = function (arr) {
        arr.forEach(function (v) {
            $.isArray(v) && deepShuffle(v);
        });

        arr.sort(function () {
            return 0.5 - Math.random();
        });
    };
    deepShuffle(rst.items);

    $('body').append(template(rst));
});