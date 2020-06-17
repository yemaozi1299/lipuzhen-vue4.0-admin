import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
const { title, cookieExpires, useI18n } = config

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
	Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
	const token = Cookies.get(TOKEN_KEY)
	if (token) return token
	else return false
}
export const hasChild = (item) => {
	return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
	if (item.meta && item.meta.access && item.meta.access.length) {
		if (hasOneOf(item.meta.access, access)) return true
		else return false
	} else return true
}

export const getMenuByRouter = (list, access) => {
	let res = []
	forEach(list, item => {
		if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
			let obj = {
				icon: (item.meta && item.meta.icon) || '',
				name: item.name,
				meta: item.meta
			}
			if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
				obj.children = getMenuByRouter(item.children, access)
			}
			if (item.meta && item.meta.href) obj.href = item.meta.href
			if (showThisMenuEle(item, access)) res.push(obj)
		}
	})
	return res
}

export const showTitle = (item, vm) => {
	let { title, __titleIsFunction__ } = item.meta
	if (!title) return
	title = (item.meta && item.meta.title) || item.name
	return title
}
export const findNodeUpperByClasses = (ele, classes) => {
	let parentNode = ele.parentNode
	if (parentNode) {
		let classList = parentNode.classList
		if (classList && classes.every(className => classList.contains(className))) {
			return parentNode
		} else {
			return findNodeUpperByClasses(parentNode, classes)
		}
	}
}






