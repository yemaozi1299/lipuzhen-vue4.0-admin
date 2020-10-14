const path = require('path')
const webpack = require('webpack')
const resolve = dir => {
	return path.join(__dirname, dir)
}
module.exports = {
	lintOnSave: false, // 关掉eslint
	/**
	 * baseUrl 从 3.3起废用，使用pubilcPath代替
	 * 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
	 * 这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。
	 */
	publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
	// publicPath: "../../",
	// 设为false打包时不生成.map文件
	productionSourceMap: false,

	// 入口设置
	devServer: {
		// 告诉dev-server在服务器启动后打开浏览器，将其设置true为打开默认浏览器
		open: true,
		host: 'www.rich2020.com',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: {
			'/move': {
				target: 'http://www.rich2020.com/move',
				changeOrigin: true,
				pathRewrite: {
					'^/move': '/'
				}
			},
			'/userlist': {
				target: 'http://www.rich2020.com/userlist',
				changeOrigin: true,
				pathRewrite: {
					'^/userlist': '/'
				}
			},
		},
	},
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				jquery: "jquery",
				"window.jQuery": "jquery"
			})
		],
		devtool: "source-map"
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
			.set('_c', resolve('src/components'));
		//开发时用eval， 出现问题时用source-map调试
		// config.devtool('source-map')
	},
}