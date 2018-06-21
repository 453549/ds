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
    this.bindEvent();
  },
  onLoad: function(){
    navSide.init({name: 'pass-update'}); //初始化左侧菜单
    this.loadUserInfo();
  },
  bindEvent: function(){
    var _this = this;
    $(document).on('click', '#submit', function(event) {
      var userInfo = { //获取填入的数据
        passwordOld: $.trim($('#passwordOld').val()),
        passwordNew: $.trim($('#passwordNew').val()),
        passwordConfirm: $.trim($('#passwordConfirm').val())
      }
      var validateResult = _this.formValidate(userInfo);
      if(validateResult.status){ //验证成功, 进行下一步网络请求
        _user.updatePassword(userInfo, function(res,msg){
          _mm.successTips(msg);
          window.location.href = "./user-login.html"; //成功
        },function(error){
          _mm.errorTips(error);
        });
      }else{ //验证失败
        _mm.errorTips(validateResult.msg);
      }
    });
  },
  loadUserInfo: function(){ //渲染表单
    var userHtml = "";
    //获取用户信息
    _user.getUserInfo(function(res){
      userHtml = _mm.renderHtml(templateIndex,{data:res});
      $('.panel-body').html(userHtml);
    },function(error){
      _mm.errorTips(error);
    })
  },
  //表单字段的验证
  formValidate: function(formData){
    var result = {
      status: false,
      msg: '',
    };

    //密码不能为空
    if(_mm.validate(formData.passwordOld, "require")){
      result.msg = "原始密码不能为空!";
      return result;
    }
    if(_mm.validate(formData.passwordNew, "require")){
      result.msg = "原始密码不能为空!";
      return result;
    }
    if(_mm.validate(formData.passwordConfirm, "require")){
      result.msg = "确认密码不能为空!";
      return result;
    }
    //密码不能少于6位
    if(formData.passwordNew.length<6){
      result.msg = "原始密码长度不能少于6位!";
      return result;
    }
    if(formData.passwordConfirm.length<6){
      result.msg = "原始密码长度不能少于6位!";
      return result;
    }
    //新密码与确认密码不一致
    if(formData.passwordConfirm !== formData.passwordNew){
      result.msg = "重复输入密码不一致!";
      return result;
    }
    //通过检验, 返回正确提示
    result.status = true;
    result.msg = "验证通过!";
    return result;
  }
}
$(function(){
  page.init();
})
