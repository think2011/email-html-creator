/*
 select改进版，显示为方块选择
 用法：$('select[name="sizeSel"]').boxpicker();
 <select name="sizeSel">
 <option value="950">950</option>
 <option value="750">750</option>
 </select>
 */

(function ($) {

    /**
     * Constructor.
     */
    var BoxPicker = function (select, options) {
        this.init('boxpicker', select, options);
    };

    /**
     * BoxPicker class.
     */
    BoxPicker.prototype = {
        constructor: BoxPicker,

        init: function (type, select, options) {
            var self = this;

            self.type = type;

            self.$select = $(select);
            self.$select.hide();

            //清除浮动
            self.$clear_div = $('<div class="clear"></div>');

            self.$box_ul = $('<ul class="boxpicker"></ul>');


            var selectText = self.$select.find('> option:selected').text();


            // 创建
            // <ul class="sys_spec_text"><li><a href="javascript:;">S</a><i></i></li><li><a href="javascript:;">M</a><i></i></li></ul>

            self.$select.find('> option').each(function () {
                var $option   = $(this);
                var data_key  = $option.val();
                var data_name = $option.text();

                var isSelected = $option.is(':selected');

                var selected = '';
                if (isSelected === true) {
                    selected = ' class="selected"';
                }

                var $box_li = $('<li data-key="' + data_key + '"' + selected + '><a href="javascript:;">' + data_name + '</a><i></i></li>');

                self.$box_ul.append($box_li);
                $box_li.on('click.' + self.type, $.proxy(self.textSpanClicked, self));

            });
            self.$box_ul.append(self.$clear_div);
            self.$box_ul.insertAfter(self.$select);
        },

        selectTextSpan: function ($textSpan) {
            var selVal = $textSpan.parent().attr("data-key");

            $textSpan.parent().parent().find(".selected").removeClass('selected');
            $textSpan.parent().addClass('selected');

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
     * How to use: $('#id').setBoxpickerVal('750')
     */
    $.fn.setBoxpickerVal = function (selVal) {
        //设置select的值
        $(this).val(selVal);
        $(this).trigger('change');

        //获取select对应的控件
        var $box_ul = $(this).next();

        $box_ul.find(".selected").removeClass('selected');

        $box_ul.find("li").each(function () {
            if ($(this).attr("data-key") == selVal) {
                $(this).addClass('selected');
            }
        });

    };
    /**
     * Plugin definition.
     * How to use: $('#id').boxpicker()
     */
    $.fn.boxpicker       = function (option) {
        var args = $.makeArray(arguments);
        args.shift();

        // For HTML element passed to the plugin
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('boxpicker'),
                options = typeof option === 'object' && option;
            if (data === undefined) {
                $this.data('boxpicker', (data = new BoxPicker(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };


    $.fn.removeBoxpicker = function () {
        var $box_ul = $(this).next();
        if ($box_ul.attr("class") == 'zy-boxpicker') {
            $box_ul.remove();
            $(this).removeData('boxpicker');
        }
    };

})(jQuery);
