import axios from 'axios'
import store from '@/store'
import { Notice, LoadingBar } from 'view-design'
import qs from 'qs';
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
				desc: '无法访问服务器,请重试'
			});
			return Promise.reject(error)
		})
		// 响应拦截
		instance.interceptors.response.use(res => {
			//删除url
			this.destroy(url)
			const { data, status } = res
			if (data.status == 0) {
				console.log(data, url, res.config);
			}
			return { data, status }
		}, error => {
			console.log(error, url);
			LoadingBar.error();
			Notice.error({
				title: '错误提示',
				desc: '无法访问服务器,请重试'
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
		options = Object.assign(this.getInsideConfig(), options)
		this.interceptors(instance, options.url)
		return instance(options)
	}
	get (url, data) {
		const instance = axios.create()
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
		const instance = axios.create()
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
