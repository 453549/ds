require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var _mm = require('util/mm.js');
var _product = require('service/product-service.js');
var templateList = require('./index.string');
var pagination = require('util/pagination/index.js');

//逻辑部分
var page ={
  data:{
    listParam:{
      keyword: _mm.getUrlParam('keyword')|| '',
      categoryId: _mm.getUrlParam('categoryId')|| '',
      pageNum: 1,
      pageSize: 10,
      orderBy: "" //排序参数：price_desc(降序)，price_asc(升序)
    }
  },
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    this.loadList();
  },
  bindEvent: function(){
    var _this = this;
    // 点击排序按钮
    $('.sort-item').click(function(e) {
      var $this = $(e.currentTarget);
      //如果点击的是默认排序按钮
      if($this.hasClass('default')){
        if($this.hasClass('active')){ //选中状态
          return;
        }else{ // 非选中状态
          //设置默认排序为选中样式,并设置价格排序为初始样式
          $this.addClass('active');
          $('.price').removeClass('active price_asc price_desc');
          //初始化数据并请求
          _this.data.listParam.orderBy = "";
          _this.loadList();
        }
      }
      //如果点击的是价格排序
      if($this.hasClass('price')){
        //设置价格排序为选中样式, 并取消默认排序的选中样式
        $('.default').removeClass('active');
        $this.addClass('active');
        //如果第一次点击到价格标签或当前状态为降序下的点击, 切换为升序
        if(!$this.hasClass('price_asc')||$this.hasClass('price_desc')){
          $this.removeClass('price_desc').addClass('price_asc'); //切换为升序样式
          // 修改数据并请求渲染
          _this.data.listParam.orderBy = "price_asc";
        }else{ //切换为降序
          $this.removeClass('price_asc').addClass('price_desc'); //切换为降序样式
           //修改数据并请求渲染
           _this.data.listParam.orderBy = "price_desc";
        }
        _this.loadList();
      }
    });

    // 点击页码切换
    $('.pagination').on('click', '.item', function(e) {
      _this.data.listParam.pageNum = $(this).attr('data-pageNum');
      _this.loadList();
    });
    //点击上一页
    $('.pagination').on('click', '.prev', function(event) {
      if($(this).hasClass('disabled')){ //不可点击状态
        return
      }else{ //可点击状态
        _this.data.listParam.pageNum = _this.data.listParam.pageNum-1;
        _this.loadList();
      }
    });
    //点击下一页
    $('.pagination').on('click', '.next', function(event) {
      if($(this).hasClass('disabled')){ //不可点击状态
        return
      }else{ //可点击状态
        _this.data.listParam.pageNum = _this.data.listParam.pageNum+1;
        _this.loadList();
      }
    });
  },
  /*请求数据并渲染列表*/
  loadList: function(){
    var _this = this;
    var listHtml = "";
    $('.p-list-con').html("<div class='loading'></div>");
    //获取用户信息
    _product.getProductList(this.data.listParam,function(res){
      //渲染商品模块
      userHtml = _mm.renderHtml(templateList,{data:res.list});
      $('.p-list-con').html(userHtml);
      $('.pagination').html(pagination.init(res));
    },function(error){
      _mm.errorTips(error);
    })
  }
}
$(function(){
  page.init();
})
