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
    //验证用户名是否存在
    $('#username').blur(function(event) {
      var username = $.trim($(this).val());
      if(username){
        _user.checkUsername(username,function(res){
          formError.hide();
        },function(err){
          formError.show(err);
        })
      }
    });
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
      password: $.trim($('#password').val()),
      passwordConfirm:  $.trim($('#password-confirm').val()),
      email: $.trim($('#email').val()),
      phone: $.trim($('#phone').val()),
      question: $.trim($('#question').val()),
      answer: $.trim($('#answer').val()),
    }
      //表单验证结果
    var validateResult = this.formValidate(formData);
    if(validateResult.status){
        _user.register(formData, function(res){
            window.location.href = './result.html?type=register';
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
    if(formData.password.length<6){
      result.msg = "密码长度不能少于6位!";
      return result;
    }
    if(_mm.validate(formData.passwordConfirm, "require")){
      result.msg = "重复密码不能为空!";
      return result;
    }
    if(formData.passwordConfirm.length<6){
      result.msg = "重复密码长度不能少于6位!";
      return result;
    }
    if(formData.passwordConfirm != formData.password){
      result.msg = "重复输入密码不一致!";
      return result;
    }
    if(_mm.validate(formData.phone, "require")){
      result.msg = "手机号码不能为空!";
      return result;
    }
    console.log("手机格式"+_mm.validate(formData.phone, "phone"));
    if(!_mm.validate(formData.phone, "phone")){
      result.msg = "手机号码格式不正确!";
      return result;
    }
    if(_mm.validate(formData.email, "require")){
      result.msg = "邮箱不能为空!";
      return result;
    }
      console.log("邮箱格式"+_mm.validate(formData.email, "email"));
    if(!_mm.validate(formData.email, "email")){
      result.msg = "邮箱格式不正确!";
      return result;
    }
    if(_mm.validate(formData.question, "require")){
      result.msg = "密码提示不能为空!";
      return result;
    }
    if(_mm.validate(formData.answer, "require")){
      result.msg = "密码答案不能为空!";
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
