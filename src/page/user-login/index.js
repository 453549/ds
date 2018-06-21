require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');

//表单里的错误提示
var formError = {
  show: function(errMsg){
    $('.error-item').show().find('.err-msg').text(errMsg);
  },
  hide: function(){
    $('.error-item').hide().find('.err-msg').text();
  }
}
//逻辑部分
var page ={
  init: function(){
    this.bindEvent();
  },
  bindEvent: function(){
    var _this = this;
    //登陆按钮的点击
    $('#submit').click(function(){
        _this.submit();
    });
    //如果按下回车也要进行提交
    $('user-content').keyup(function(e){
      if(e.keyCode ===13){
        _this.submit();
      }
    })
  },
  //提交表单
  submit: function(){
    var formData ={
      username: $.trim($('#username').val()),
      password: $.trim($('#password').val())
    }
      //表单验证结果
    var validateResult = this.formValidate(formData);
    if(validateResult.status){
        _user.login(formData, function(res){
            window.location.href = _mm.getUrlParam('redirect') || './index.html';
        }, function(errMsg){
            formError.show(errMsg);
        });
    }else{ //验证失败
      formError.show(validateResult.msg);
    }
  },
  //表单字段的验证
  formValidate: function(formData){
    var result = {
      status: false,
      msg: '',
    };
    if(_mm.validate(formData.username, "require")){
      result.msg = "用户名不能为空!";
      return result;
    }
    if(_mm.validate(formData.password, "require")){
      result.msg = "密码不能为空!";
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
