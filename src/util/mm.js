//工具类
var Hogan = require('hogan.js');
var conf = {
	serverHost: ''
}
var _mm ={
	request: function(param){
		var _this = this;
		$.ajax({
			type: param.method || 'get',
			url: param.url || "",
			async:true,
			dataType: param.type || 'json',
			data: param.data || '',
			success: function(res){
				if(res.status === 0){ //请求成功
					typeof param.success === 'function' && param.success(res.data, res.msg);
				}else if(res.status === 10){ //没有登录状态, 需要强制登录
					_this.doLogin();
				}else if(res.status === 1){ //请求数据错误
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			error: function(error){
				typeof param.error === 'function' && param.error(error.statusText);
			}
		});
	},
	//获取服务器地址
	getServerUrl: function(path){
		return conf.serverHost + path;
	},
	//获取url参数
	getUrlParam : function(name){
    var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var result  = window.location.search.substr(1).match(reg);
		if(result){
			return result ? decodeURIComponent(result[2]) : null;
		}
  },
	//渲染html模板
	renderHtml: function(htmlTemplate,data){
	 	var template = Hogan.compile(htmlTemplate);
   	var result = template.render(data);
    return result;
	},
	//成功提示
	successTips: function(msg){
		alert(msg || "操作成功!");
	},
	//错误提示
	errorTips: function(msg){
		alert(msg || "操作失败!找下原因吧!");
	},
	//字段的验证, 支持非空判断、手机、邮箱
	validate : function(value, type){
		 var value = $.trim(value);
		 // 非空验证
		 if('require' === type){
				 return !value;
		 }
		 // 手机号验证
		 if('phone' === type){
				 return /^1\d{10}$/.test(value);
		 }
		 // 邮箱格式验证
		 if('email' === type){
				 return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		 }
 },
	//统一登录处理
	doLogin: function(){
		window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	//统一回到首页
	goHome: function(){
		window.location.href = './index.html'
	}

};
module.exports =_mm;
