require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var _mm = require('util/mm.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var templateDetail = require('./index.string');

//逻辑部分
var page ={
  data:{
    count: 1
  },
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    this.loadDetail();
  },
  bindEvent: function(){
    var _this = this;
    //点击缩略图
    $(document).on('click', '.sub-img-item', function(event) {
      //切换选中样式
      $('.sub-img-item').removeClass('active');
      $(this).addClass('active');
      //切换选中的图片
      $('.main-img').attr('src',$(this).find('.sub-img').attr('src'));
    });


    $(document).on('click', '.count-btn', function(event) {
      var $this = $(this);
      var countInput = $('#count'); //input框
      var count = parseInt(countInput.val()); //显示的数量
      var maxCount = _this.data.stock; //最大数量
      var minCount = 1; //最小数量
      //切换不可编辑样式
      if($('.count-btn').hasClass('disabled')){
        $('.count-btn').removeClass('disabled');
      }
      //数量+, 上限不能大于库存
      if($this.hasClass('plus')){
        if(count < maxCount){ //小于库存
          count = count+ 1; //更改数据
        }
        if(count == maxCount){
          $this.addClass('disabled');
          return;
        }
      }else{ //数量-, 下限不能小于1
        if(count > minCount){
          count = count- 1; //更改数据
        }
        if(count == minCount){
         $this.addClass('disabled');
         return;
        }
      }
      countInput.val(count) //改变input框显示的数据
    });
    //加入购物车
    $(document).on('click', '#addCart', function(event) {
      _cart.addToCart({
           productId: _this.data.id,
           count: _this.data.count
       }, function(res){
           window.location.href = './result.html?type=cart-add';
       }, function(errMsg){
           _mm.errorTips(errMsg);
       });
    });
  },
  /*请求数据并渲染列表*/
  loadDetail: function(){
    var _this = this;
    var listHtml = "";
    $('.page-wrap').html("<div class='loading'></div>");
    //获取用户信息
    _product.getProductDetail(_mm.getUrlParam('productId'),function(res){
      //渲染商品模块
      userHtml = _mm.renderHtml(templateDetail,{data: _this.filter(res)});
      $('.page-wrap').html(userHtml);
      $('.sub-img-item:first').addClass('active'); //选中商品缩略图的第一个
    },function(error){
      _mm.errorTips(error);
    })
  },
  //对获取的数据进行处理
  filter: function(data){
    $.extend(this.data, data);
    this.data.subImages = data.subImages.split(","); //字符串转换为数组
    return this.data;
  }
}
$(function(){
  page.init();
})
