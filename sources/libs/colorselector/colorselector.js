/*
 select改进版
 用法：$('select[name="colorpicker-picker"]').zyColorSelector();
 data-width，用来控制下拉框的宽度
 <select name="colorpicker-picker">
 <option value="#7bd148">Green</option>
 <option value="#5484ed">Bold blue</option>
 <option value="#a4bdfc">Blue</option>
 <option value="#46d6db">Turquoise</option>
 <option value="#7ae7bf">Light green</option>
 <option value="#51b749">Bold green</option>
 <option value="#fbd75b">Yellow</option>
 <option value="#ffb878">Orange</option>
 <option value="#ff887c">Red</option>
 <option value="#dc2127">Bold red</option>
 <option value="#dbadff">Purple</option>
 <option value="#e1e1e1">Gray</option>
 </select>
 </select>
 */

(function ($) {

    /**
     * Constructor.
     */
    var zyColorSelector = function (select, options) {
        this.init('zyColorSelector', select, options);
    };

    /**
     * zyColorSelector class.
     */
    zyColorSelector.prototype = {
        constructor: zyColorSelector,

        init: function (type, select, options) {
            var self = this;

            self.type = type;

            self.$select = $(select);
            self.$select.hide();

            //清除浮动
            self.$clear_div = $('<div class="clear"></div>');

            self.$box_div = $('<div class="zyColorSelector"></div>');


            var selectText = self.$select.find('> option:selected').text();


            // 创建
            // <div class="zyColorSelector"><span title="#e55b00" style="background: #e55b00;" data-value="#e55b00"></span><span title="#07b4ac" style="background: #07b4ac;" data-value="#07b4ac"></span></div>

            self.$select.find('> option').each(function () {
                var $option   = $(this);
                var data_key  = $option.val();
                var data_name = $option.text();

                var prefix = '';

                // 没有#号，开头带上#号
                if (data_key[0] !== '#') {
                    prefix = '#';
                }

                var isSelected = $option.is(':selected');

                var selected = '';
                if (isSelected === true) {
                    selected = ' class="current"';
                }

                var $box_span = $('<span data-key="' + data_key + '"' + 'style="background:' + prefix + data_key + ';"'
                    + ' title="' + data_name + '"'
                    + selected + '>'
                    + '</span>');

                self.$box_div.append($box_span);
                $box_span.on('click.' + self.type, $.proxy(self.textSpanClicked, self));

            });
            self.$box_div.append(self.$clear_div);

            self.$box_div.insertAfter(self.$select);
        },

        selectTextSpan: function ($textSpan) {
            var selVal = $textSpan.attr("data-key");

            $textSpan.parent().find(".current").removeClass('current');
            $textSpan.addClass('current');

            // Change HTML select value
            this.$select.val(selVal);

        },

        textSpanClicked: function (e) {
            // 选中某个值时，填充
            this.selectTextSpan($(e.target));
            this.$select.trigger('change');

        }
    };

    /**
     * Plugin definition.
     * How to use: $('#id').setColorSelectorVal('750')
     */
    $.fn.setColorSelectorVal = function (selVal) {
        //设置select的值
        $(this).val(selVal);
        $(this).trigger('change');

        //获取select对应的控件
        var $box_div = $(this).next();

        $box_div.find(".current").removeClass('current');

        $box_div.find("span").each(function () {
            if ($(this).attr("data-key") == selVal) {
                $(this).addClass('current');
            }
        });

    };
    /**
     * Plugin definition.
     * How to use: $('#id').zyColorSelector()
     */
    $.fn.zyColorSelector     = function (option) {
        var args = $.makeArray(arguments);
        args.shift();

        // For HTML element passed to the plugin
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('zyColorSelector'),
                options = typeof option === 'object' && option;
            if (data === undefined) {
                $this.data('zyColorSelector', (data = new zyColorSelector(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

})(jQuery);