/*
 select改进版
 用法：$('select[name="colorSel"]').zyDropdown();
 data-width，用来控制下拉框的宽度
 <select name="colorSel" data-width="400">
  <option value="0">所有颜色</option>
  <option value="1">Bold blue</option>
</select>
 */

(function($) {

    /**
     * Constructor.
     */
    var zyDropdown = function(select, options) {
        this.init('zyDropdown', select, options);
    };

    /**
     * zyDropdown class.
     */
    zyDropdown.prototype = {
        constructor: zyDropdown,

        init: function(type, select, options) {
            var self = this;

            self.type = type;

            self.$select = $(select);
            self.$select.hide();

            //清除浮动
            self.$clear_div = $('<div class="clear"></div>');

            self.$dropdown = $('<div class="zy-dropdown"></div>');
            var selectText = self.$select.find('> option:selected').text();
            self.$dropdownTrigger = $('<span class="dropdown-trigger"><span class="dropdown-trigger-txt">' + selectText + '</span><span class="dropdown-trigger-arrow"><b></b></span></span>');

            self.$dropdown.on('mouseenter.' + self.type, $.proxy(self.showPicker, self));
            self.$dropdown.on('mouseleave.' + self.type, $.proxy(self.hidePicker, self));

            // 创建
            // <div style="width: 225px;"class="dropdown-menu"><ul><li class="current"><span data-id="">所有颜色</span></li><li><span data-id="绿色">绿色</span></li><li><span data-id="蓝色">蓝色</span></li></ul></div>
            var sel_width = self.$select.attr("data-width");

            if (sel_width == undefined)
                sel_width = 200;
            self.$dropdownMenu = $('<div style="width: ' + sel_width + 'px;" class="dropdown-menu"><ul></ul></div>');

            self.$select.find('> option').each(function() {
                var $option = $(this);
                var data_key = $option.val();
                var data_name = $option.text();

                var isSelected = $option.is(':selected');


                var selected = '';
                if (isSelected === true) {
                    selected = ' class="current"';
                }

                var $menuLi = $('<li data-key="' + data_key + '"' + selected + '><span>' + data_name + '</span></li>');

                self.$dropdownMenu.find("ul").append($menuLi);
                $menuLi.on('click.' + self.type, $.proxy(self.textSpanClicked, self));

            });



            self.$dropdown.append(self.$dropdownTrigger);
            self.$dropdown.append(self.$dropdownMenu);
            self.$dropdown.append(self.$clear_div);
            self.$dropdown.insertAfter(self.$select);
        },

        selectTextSpan: function($textSpan) {
            var selVal = $textSpan.parent().attr("data-key");

            $textSpan.parent().parent().find(".current").removeClass('current');
            $textSpan.parent().addClass('current');
            $(".dropdown-trigger-txt", this.$dropdownTrigger).text($textSpan.text());

            $textSpan.parent().removeClass('open');

            this.hidePicker();
            // Change HTML select value
            this.$select.val(selVal);

        },

        textSpanClicked: function(e) {
            // 选中某个值时，填充
            this.selectTextSpan($(e.target));
            this.$select.trigger('change');

        },

        showPicker: function(evt) {
            this.$dropdown.addClass('open');
            this.$dropdownMenu.show();
        },

        hidePicker: function(evt) {
            this.$dropdown.removeClass('open');
            this.$dropdownMenu.hide();
        }

    };
    /**
     * Plugin definition.
     * How to use: $('#id').setDropdownVal('750')
     */
    $.fn.setDropdownVal = function(selVal, trigger) {
        //设置select的值
        $(this).val(selVal);
        if (trigger) {
            $(this).trigger('change');
        }
        //获取select对应的控件
        var $dropdown = $(this).next();

        var selectText = "";
        $(this).find('> option').each(function() {
            if ($(this).val() == selVal) {
                selectText = $(this).text();
            }
        });

        $dropdown.find(".dropdown-trigger-txt").text(selectText);
        $dropdown.find(".current").removeClass('current');

        $dropdown.find("li").each(function() {
            if ($(this).attr("data-key") == selVal) {
                $(this).addClass('current');
            }
        });

    };
    $.fn.removeDropdown = function() {

        //获取select对应的控件
        var $dropdown = $(this).next();

        if ($dropdown.attr("class") == 'zy-dropdown') {
            $dropdown.remove();
            $(this).removeData('zyDropdown');
        }

    };
    /**
     * Plugin definition.
     * How to use: $('#id').zyDropdown()
     */
    $.fn.zyDropdown = function(option) {
        var args = $.makeArray(arguments);
        args.shift();

        // For HTML element passed to the plugin
        return this.each(function() {
            var $this = $(this),
                data = $this.data('zyDropdown'),
                options = typeof option === 'object' && option;
            if (data === undefined) {
                $this.data('zyDropdown', (data = new zyDropdown(this, options)));
            }
            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

})(jQuery);
