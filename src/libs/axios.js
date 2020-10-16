import axios from 'axios'
import store from '@/store'
import { Notice, LoadingBar } from 'view-design'
import qs from 'qs';
import Cookies from 'js-cookie';
import { parse, getParam } from '@/libs/tools'
const addErrorLog = errorInfo => {
	const { statusText, status, request: { responseURL } } = errorInfo
	let info = {
		type: 'ajax',
		code: status,
		mes: statusText,
		url: responseURL
	}
	console.log(info);
	// if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}



class HttpRequest {
	// 对象会传入一个baseURL和url
	constructor(baseUrl = baseURL) {
		this.baseUrl = baseUrl
		this.queue = {}
	}
	// 获取传入的baseURL
	getInsideConfig () {
		const config = {
			baseURL: this.baseUrl,
			headers: {
				//
			}
		}
		return config
	}
	// 删除url
	destroy (url) {
		delete this.queue[url]
		if (!Object.keys(this.queue).length) {
			// Spin.hide()
			LoadingBar.finish();
		}
	}
	interceptors (instance, url) {
		// 请求拦截
		instance.interceptors.request.use(config => {
			// 添加全局的loading...
			if (!Object.keys(this.queue).length) {
				LoadingBar.start();
				// Spin.show() // 不建议开启，因为界面不友好
			}
			//记录url
			this.queue[url] = true
			return config
		}, error => {
			LoadingBar.error();
			Notice.error({
				title: '错误提示',
				desc: response
			});
			return Promise.reject(error)
		})
		// 响应拦截
		instance.interceptors.response.use(res => {
			//删除url
			this.destroy(url)
			const { data, status } = res
			if (data && (data.status == 1 || data.message == "查无记录" || data.message == "查无此外卖商家" || data.message == "未设置") && status == 200) {
				return { data, status }
			} else {
				console.log(data, url, res.config, status);
				var message = typeof data == "object" ? data.message : data;
				return Promise.reject(message)
			}
		}, error => {
			console.log(error, url);
			LoadingBar.error();
			Notice.error({
				title: '错误提示',
				desc: '无法连接数据库，请重试'
			});
			this.destroy(url)
			let errorInfo = error.response
			if (!errorInfo) {
				const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
				errorInfo = {
					statusText,
					status,
					request: { responseURL: config.url }
				}
			}
			addErrorLog(errorInfo)
			return Promise.reject(error)
		})
	}
	request (options) {
		const instance = axios.create()
		// options.params = Object.assign(options.params, {
		// 	appid: Cookies.get("CookVueAppid")
		// });
		if (options.params && !options.params.appid) {
			options.url = parse(options.url, {
				appid: Cookies.get("CookVueAppid")
			});
		}
		options = Object.assign(this.getInsideConfig(), options);
		this.interceptors(instance, options.url)
		return instance(options)
	}
	get (url, data) {
		const instance = axios.create();
		if (!data.appid) {
			url = parse(url, {
				appid: Cookies.get("CookVueAppid")
			});
		}
		var options = {
			method: "GET",
			url: url,
			params: data
		}

		options = Object.assign(this.getInsideConfig(), options)
		this.interceptors(instance, options.url)
		return instance(options)
	}
	post (url, data) {
		const instance = axios.create();
		if (!data.appid) {
			url = parse(url, {
				appid: Cookies.get("CookVueAppid")
			});
		}
		data = typeof data === "string" ? data : qs.stringify(data);
		var options = {
			method: "POST",
			url: url,
			data: data
		}


		options = Object.assign(this.getInsideConfig(), options)

		this.interceptors(instance, options.url)
		return instance(options)
	}
}
export default HttpRequest
