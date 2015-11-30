/*
 select改进版
 用法：$('#sel_sort').zySortButton();
 data-width，用来控制下拉框的宽度
<select id="sel_sort" class="item-left">
    <option value="0">默认排序</option>
    <option value="1">使用次数</option>
</select>
 */

(function($) {

  /**
   * Constructor.
   */
  var zySortButton = function(select, options) {
    this.init('zySortButton', select, options);
  };

  /**
   * zySortButton class.
   */
  zySortButton.prototype = {
    constructor: zySortButton,

    init: function(type, select, options) {
      var self = this;

      self.type = type;

      self.$select = $(select);
      self.$select.hide();

      //select 样式
      var sel_class = self.$select.attr("class");

      if(sel_class == '')
      {
         self.$div_group = $('<div class="zy-sortButton"></div>');
      }
      else
      {
          self.$div_group = $('<div class="zy-sortButton'+' '+ sel_class +'"></div>');
      }
      
      var selectText = self.$select.find('> option:selected').text();
        

      // 创建
      // <div class="elk-select-button-group"><span class="group-item current">默认排序<i></i></span><span class="group-item">使用次数<i></i></span></div>
      self.$select.find('> option').each(function() {
        var $option = $(this);
        var data_key = $option.val();
        var data_name = $option.text();

        var isSelected = $option.is(':selected');
    

        var selected = ' ';
        if (isSelected === true) {
          selected = ' class="current"';
        }

        var $span = $('<span data-key="'+data_key+'"'
                         + selected+'>'
                         + data_name
                         +'<i class="sortDown"></i></span>');
        
        self.$div_group.append($span);
        $span.on('click.' + self.type, $.proxy(self.textSpanClicked, self));
        $span.find("i").on('click.' + self.type, $.proxy(self.iconClicked, self));
      });
    
      self.$div_group.insertAfter(self.$select);
    },

    selectTextSpan: function($textSpan) {
      var selVal = $textSpan.attr("data-key");
      if($textSpan.attr("class") == "current")
      {

        this.changeSortIcon($textSpan.find("i"));
      }
      else
      {
        $textSpan.parent().find(".current").removeClass('current');
        $textSpan.addClass('current');
      }
      
      // Change HTML select value
      this.$select.val(selVal);
    },
    changeSortIcon: function($i) {
      if($i.attr("class") == "sortUp")
      {
        $i.removeClass("sortUp");
        $i.addClass("sortDown");
      }
      else
      {
        $i.removeClass("sortDown");
        $i.addClass("sortUp");
      }
    },

    textSpanClicked: function(e) {
      // 选中某个值时，填充
        this.selectTextSpan($(e.target));
        this.$select.trigger('change');
    },
    iconClicked: function(e) {
      // 选中某个值时，填充
        this.selectTextSpan($(e.target).parent());
        this.$select.trigger('change');
        return false;
    }
  };
  /**
   * 获取排序的方式 升序：ASC ;降序：DESC
   * How to use: $('#id').getSortDirection()
   */
  $.fn.getSortDirection=function(){
    var sort = "DESC";
    //获取select对应的控件
    var $sortPanel = $(this).next();

    var className = $sortPanel.find(".current").find("i").attr("class");
    if (className == "sortUp") {
      sort = "ASC";
    }
    else
    {
      sort = "DESC";
    }

    return sort;
  
};
/**
   * 获取排序的字段 升序：ASC ;降序：DESC
   * How to use: $('#id').getSortField()
   */
  $.fn.getSortField=function(){  
    return $(this).val();  
};
  /**
   * Plugin definition.
   * How to use: $('#id').zySortButton()
   */
  $.fn.zySortButton = function(option) {
    var args = $.makeArray(arguments);
    args.shift();

    // For HTML element passed to the plugin
    return this.each(function() {
      var $this = $(this),
        data = $this.data('zySortButton'),
        options = typeof option === 'object' && option;
      if (data === undefined) {
        $this.data('zySortButton', (data = new zySortButton(this, options)));
      }
      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };

})(jQuery);