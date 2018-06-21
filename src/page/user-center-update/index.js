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
    navSide.init({name: 'user-center'}); //初始化左侧菜单
    this.loadUserInfo(); //加载用户信息
  },
  bindEvent: function(){
    var _this = this;
    $(document).on('click', '#submit', function(event) {
      var userInfo = { //获取数据
        phone: $.trim($('#phone').val()),
        email: $.trim($('#email').val()),
        question: $.trim($('#question').val()),
        answer: $.trim($('#answer').val())
      }

      var validateResult = _this.formValidate(userInfo); //对数据进行判断
      if(validateResult.status){ // 如果验证合格
        //提交修改的数据
        _user.updateUserInfo(userInfo,function(res,msg){ //成功
          _mm.successTips(msg);
          window.location.href = './user-center.html';
        },function(error){ //失败
          _mm.errorTips(error);
        })
      }else{ //验证失败
        _mm.errorTips(validateResult.msg);
      }
    });
  },
  loadUserInfo: function(){
    var userHtml = "";
    //获取用户信息
    _user.getUserInfo(function(res){ //成功
      userHtml = _mm.renderHtml(templateIndex,{data:res}); //获取到数据进行模板渲染
      $('.panel-body').html(userHtml);
    },function(error){ // 失败
      _mm.errorTips(error);
    })
  },
  //表单字段的验证
  formValidate: function(formData){
    var result = {
      status: false,
      msg: '',
    };

    if(_mm.validate(formData.phone, "require")){
      result.msg = "手机号码不能为空!";
      return result;
    }
    if(!_mm.validate(formData.phone, "phone")){
      result.msg = "手机号码格式不正确!";
      return result;
    }
    if(_mm.validate(formData.email, "require")){
      result.msg = "邮箱不能为空!";
      return result;
    }
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
