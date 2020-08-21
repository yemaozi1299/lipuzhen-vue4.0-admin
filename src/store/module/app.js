import {
	getMenuByRouter
} from '@/libs/util'

import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

console.log(routers, "111111111111111111111111111111111111111111111");
export default {
	getters: {
		menuList: (state, getters, rootState) => getMenuByRouter(routers.main, []),
		agentList: (state, getters, rootState) => getMenuByRouter(routers.agent, [])
	}
}