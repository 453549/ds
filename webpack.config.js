var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//环境变量配置
var WEBPACK_ENV = process.env.WEBPACK_ENV ||'dev';

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,title){
	return{
		filename: 'view/'+name+'.html',
		template: './src/view/'+name+'.html',
		title: title,
		chunks: ['common', name],
		inject: true
	}
}

module.exports ={
	entry:{
		common: './src/page/common/index.js',
		index: './src/page/index/index.js',
		'user-login': './src/page/user-login/index.js',
		'user-register': './src/page/user-register/index.js',
		'user-pass-reset': './src/page/user-pass-reset/index.js',
		'user-center': './src/page/user-center/index.js',
		'user-center-update': './src/page/user-center-update/index.js',
		'user-pass-update': './src/page/user-pass-update/index.js',
		list: './src/page/list/index.js',
		detail: './src/page/detail/index.js',
		cart: './src/page/cart/index.js',
		'order-confirm': './src/page/order-confirm/index.js',
		result: './src/page/result/index.js'
	},
	output:{
		path: path.resolve(__dirname,'./dist'),
		filename: 'js/[name].js',
		publicPath: '/dist/'
	},
	devServer: {
    hot: true,
    inline: true,
    watchContentBase: true, // 文件的修改会触发一个重新加载整个页面。
		proxy : {
        '**/*.do' : {
            target: 'http://test.happymmall.com',
            changeOrigin : true
        }
    }
 	},
  resolve: {
  		alias :{
			node_modules: path.resolve(__dirname,'node_modules'),
  			page: path.resolve(__dirname, 'src/page'),
  			util: path.resolve(__dirname, 'src/util'),
  			image: path.resolve(__dirname, 'src/image'),
				service: path.resolve(__dirname, 'src/service')
  		}
  },
	externals:{
		'jquery': 'window.jQuery'
	},
	plugins:[
		new webpack.optimize.CommonsChunkPlugin({
			name:'common', //文件名
			filename: 'js/common.js', //路径
			minChunks:2
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin("css/[name].css"),
		//添加多页面html
		new HtmlWebpackPlugin(getHtmlConfig('index',"首页")),
		new HtmlWebpackPlugin(getHtmlConfig('list',"商品列表")),
		new HtmlWebpackPlugin(getHtmlConfig('detail',"商品详情页")),
		new HtmlWebpackPlugin(getHtmlConfig('cart',"购物车")),
		new HtmlWebpackPlugin(getHtmlConfig('order-confirm',"订单确认")),
		new HtmlWebpackPlugin(getHtmlConfig('user-login',"用户登陆")),
		new HtmlWebpackPlugin(getHtmlConfig('user-register',"用户注册")),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset',"找回密码")),
		new HtmlWebpackPlugin(getHtmlConfig('user-center',"个人中心")),
		new HtmlWebpackPlugin(getHtmlConfig('user-center-update',"修改个人信息")),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-update',"修改密码")),
		new HtmlWebpackPlugin(getHtmlConfig('result',"操作结果"))
	],
	module: {
   	rules: [
     	{
       	test: /\.css$/,
       	use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
     	},
     	{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath:'images'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)\w*/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              outputPath:'fonts'
            }
          }
        ]
      },
      { //处理html文件
			  test: /\.string$/,
			  use: {
			    loader: 'html-loader'
			  }
			}
   	]
  }
}
