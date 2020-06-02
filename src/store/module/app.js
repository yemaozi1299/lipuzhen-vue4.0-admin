import {
	getMenuByRouter
} from '@/libs/util'

import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

export default {
	getters: {
		menuList: (state, getters, rootState) => getMenuByRouter(routers, [])
	}
}