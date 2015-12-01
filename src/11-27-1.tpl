{
  "模板定义": {
    "750": {
      "type": "flow",
      "maxTr": 12,
      "maxTd": 3,
      "picSize": "240x240"
    },
    "790": {
      "type": "flow",
      "maxTr": 12,
      "maxTd": 4,
      "picSize": "240x240"
    }
  },
  "表单定义": {
    "title": {
      "type": "string",
      "fn": "text",
      "desc": "标题",
      "default": "周末促销"
    },
    "subTitle": {
      "type": "string",
      "fn": "text",
      "desc": "子标题",
      "default": "周末各种特色大促销"
    },
    "color": {
      "type": "string",
      "fn": "zyColorSelector",
      "desc": "颜色",
      "default": [
        "#ff6b1b",
        "#ff93a7",
        "#a9856d",
        "#3ebba3",
        "#fd0d62",
        "#4bbc2c",
        "#3385ff"
      ]
    }
  },
  "宝贝定义": {
    "title": {
      "desc": "标题",
      "default": "SHERRY小玉酱2015秋冬麻花流苏披肩围巾女士百搭款围脖秋"
    },
    "label": {
      "desc": "标签",
      "default": "促销"
    },
    "price": {
      "desc": "原价",
      "default": 0
    },
    "price_a": {
      "desc": "原价_整数部分",
      "default": 0
    },
    "price_b": {
      "desc": "原价_小数部分",
      "default": 0
    },
    "promoPrice": {
      "desc": "促销价",
      "default": 0
    },
    "promoPrice_a": {
      "desc": "促销价_整数部分",
      "default": 0
    },
    "promoPrice_b": {
      "desc": "促销价_小数部分",
      "default": 0
    },
    "soldQuantity": {
      "desc": "销量",
      "default": 0
    }
  }
}