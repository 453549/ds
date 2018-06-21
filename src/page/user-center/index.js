require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');

var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');

//逻辑部分
var page ={
  init: function(){
    this.onLoad();
  },
  onLoad: function(){
    navSide.init({name: 'user-center'}); //初始化左侧菜单
    this.loadUserInfo(); //加载用户信息
  },
  loadUserInfo: function(){
    var userHtml = "";
    //获取用户信息
    _user.getUserInfo(function(res){
      userHtml = _mm.renderHtml(templateIndex,{data:res});
      $('.panel-body').html(userHtml);
    },function(error){
      _mm.errorTips(error);
    })
  }
}
$(function(){
  page.init();
})
