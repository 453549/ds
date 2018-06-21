require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var _mm = require('util/mm.js');
var _cart = require('service/cart-service.js');
var templateCart = require('./index.string');

//逻辑部分
var page ={
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    this.loadCart();
  },
  bindEvent: function(){
    var _this = this;
    /*点击全选按钮*/
    $(document).on('click', '.checkAll', function(event) {
      if($(this).is(':checked')){
        //全选
        _cart.selectAllProduct(function(res){
          _this.render(res);
        },function(error){
          _mm.errorTips(error);
        })
      }else{
        //取消全选
        _cart.unselectAllProduct(function(res){
          _this.render(res);
        },function(error){
          _mm.errorTips(error);
        })
      }
    });

    /*点击商品数量加减*/
    $(document).on('click', '.cell-count-btn', function(event) {
      var $this = $(this);
      var countInput = $('.count');
      var count = parseInt(countInput.val());
      var minCount = 1;
      var maxCount = parseInt(countInput.attr('data-maxCount'));
      if($('.cell-count-btn').hasClass('disabled')){
        $('.cell-count-btn').removeClass('disabled');
      }
      if($this.hasClass('minus')){ //点击-号
        //下限不能小于1
        if(count>minCount){
          count = count - 1;
        }
        if(count == minCount){
          $this.addClass('disabled');
          return;
        }
      }else{ //点击+号
        //上限不能大于库存
        if(count<maxCount){
          count = count + 1;
        }
        if(count == maxCount){
          $this.addClass('disabled');
          return;
        }
      }
      /*请求更新购物车数量*/
      _cart.updateProduct({
        productId: $this.parents('.cell').attr('data-id'),
        count: count
      },function(res){
        _this.render(res);
      },function(error){
        _mm.errorTips(error);
      });
    });

    /*删除单个订单*/
    $(document).on('click', '.cell-remove', function(event) {
      if(window.confirm('确认要删除该商品？')){
        var thisId = $(this).parents('.cell').attr('data-id');
        _cart.deleteProduct(thisId,function(res){
          _this.render(res);
        },function(error){
          _mm.errorTips(error);
        })
      }
    });

    /*删除多个订单*/
    $(document).on('click', '.delete-checked', function(event) {
      if(window.confirm('确认要删除选中商品？')){
        var checkItem = $('.cell-check:checked');
        var idArr = [];
        for(var i =0;i< checkItem.length; i++){
          idArr.push($(checkItem[i]).parents('.cell').attr('data-id'));
        }
        _cart.deleteProduct(idArr.join(','),function(res){
          console.log(res);
          _this.render(res);
        },function(error){
          _mm.errorTips(error);
        })
      }
    });

    /*提交购物车订单*/
    $(document).on('click', '#submit', function(event) {
      //获取购物车数量, 购物车数量大于且不等于零时才可以提交
      _cart.getCartCount(function(res){
        if(res >0){
           window.location.href = './order-confirm.html';
        }
      },function(error){
        _mm.errorTips(error);
      })
    });
  },
  /*请求数据并渲染购物车*/
  loadCart: function(){
    var _this = this;
    _cart.getCartList(function(res){
      _this.render(res);
    },function(error){
      _mm.errorTips(error);
    })
  },
  render: function(data){ //渲染页面
    $('.page-wrap').html('<div class="loading"></div>'); //每次请求时添加loding
    //如果购物车列表为空, 将data置空, 显示购物车为空模块
    if(!data.cartProductVoList.length){
      data = null;
    }
    var cartHtml = _mm.renderHtml(templateCart,{data:data});
    $('.page-wrap').html(cartHtml);
  }
}
$(function(){
  page.init();
})
