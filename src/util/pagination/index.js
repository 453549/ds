require('./index.css');
var _mm = require('util/mm.js');
var templatePagination = require('./index.string');

var pagination = {
  option:{
    hasPreviousPage: false, //是否有上一页
    hasNextPage: false, //是否有下一页
    pages: 0, //页面总数
    pageNum: 0, //当前的页码
    _dot: false //是否有圆点
  },
  init: function(option){
    //合并选项
    $.extend(this.option, option);
    //只有在多于一个页面的情况下显示
    if (this.option.pages>1) {
      this.setOption();
      this.bindEvent();
      // //渲染list数据
      var html = _mm.renderHtml(templatePagination,this.option);
      return html;
    }
  },
  bindEvent: function(){
    $('.pagination').on('click', '.item', function(e) {
      $('.item.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    });
  },
  setOption: function(){
    //设置渲染的数组
    this.option.arr = [];
    for(var i=1;i<this.option.pages+1; i++){
      if(i>5){
        return;
      }
      //如果是当前页面, 加上active属性
      if(i == this.option.pageNum){
        this.option.arr.push({num:i,active:true});
      }else{
        this.option.arr.push({num:i,active:false});
      }
    }
    //如果页面总数大于5显示圆点
    if(this.option.pages>5){
      this.option._dot = true;
    }
  }
}
module.exports = pagination;
