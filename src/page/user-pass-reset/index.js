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
  data:{
    username: '',
    question: '',
    token: ''
  },
  init: function(){
    this.load();
    this.bindEvent();
  },
  load: function(){
    this.loadStapUsername(); // 显示输入用户名模块, 其他模块为隐藏状态
  },
  bindEvent: function(){
    var _this = this;
    //用户名模块点击下一步
    $('#submit-username').click(function(){
      var username = $.trim($('#username').val());
      if(username){ //如果用户名有值
        //获取用户名是否存在
        _user.checkUsername(username, function(res){ //如果用户名不存在
          formError.show("用户名不存在"); //显示错误信息
        }, function(errMsg){ //如果用户名存在, 进行下一步操作
          //获取密码提示问题
          _user.getQuestion(username,function(res){  //成功
            _this.data.username = username; //储存信息
            _this.data.question = res;
            _this.loadStapQuestion(); //显示密码提示模块
          },function(){ //失败

          })
        });
      }else{ //如果用户名为空
        formError.show("请输入用户名!");
      }
    });
    //密码提示模块点击下一步
    $('#submit-question').click(function(){
      var answer = $.trim($('#answer').val());
      if(answer){ //如果密码提示答案有值
        //提交密码提示答案
        _user.checkAnswer({
          username: _this.data.username,
          question: _this.data.question,
          answer: answer
        },function(res){ //成功
          _this.data.token = res; //储存信息
          _this.loadStapPassword(); //显示修改密码页面
        },function(error){ //失败
          formError.show(error);
        })
      }else{ //如果密码提示答案为空
        formError.show("请输入密码提示答案!");
      }
    });
    //修改密码模块点击提交
    $('#submit-password').click(function(){
      var password = $.trim($('#password').val());
      if(password){ //如果新密码有值
        if(password.length< 6){
          formError.show("请输入不少于6位的新密码!");
          return;
        }
        _user.resetPassword({
          username: _this.data.username,
          passwordNew: password,
          forgetToken: _this.data.token
        },function(res){ //成功
          window.location.href = "./result.html?type=pass-reset";
        },function(error){ //失败
          formError.show(error);
        })
      }else{ //如果新密码为空
        formError.show("请输入新密码!");
      }
    });
  },
  //提交表单
  submit: function(){

  },
  //显示输入用户名模块
  loadStapUsername: function(){
    $('.step-username').show();
  },
  //显示密码提示模块
  loadStapQuestion: function(){
    formError.hide(); //隐藏错误提示
    $('.step-username').hide(); //隐藏输入用户名模块
    $('.step-question').show().find('.question-text').text(this.data.question); //显示当前模块与密码提示文字
  },
  //显示修改密码模块
  loadStapPassword: function(){
    formError.hide(); //隐藏错误提示
    $('.step-question').hide(); //隐藏密码提示模块
    $('.step-password').show(); //显示当前模块
  }
}
$(function(){
  page.init();
})
