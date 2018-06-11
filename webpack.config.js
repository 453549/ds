var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//环境变量配置
var WEBPACK_ENV = process.env.WEBPACK_ENV ||'dev';

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name){
	return{
		filename: 'view/'+name+'.html',
		template: './'+name+'.html',
		chunks: ['common', name]
	}
}

module.exports ={
	entry:{
		common: './src/page/common/index.js',
		index: './src/page/index/index.js',
		login: './src/page/login/login.js'
	},
	output:{
		path: path.resolve(__dirname,'./dist'),
		filename: 'js/[name].js',
		publicPath: '/dist/'
	},
	devServer: {
    hot: true,
    inline: true
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
		new HtmlWebpackPlugin(getHtmlConfig('index')),
		new HtmlWebpackPlugin(getHtmlConfig('login'))
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
      }
   	]
  }
}
