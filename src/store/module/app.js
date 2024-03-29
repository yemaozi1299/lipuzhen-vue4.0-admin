import {
	getMenuByRouter
} from '@/libs/util'

import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

export default {
	getters: {
		agentList: (state, getters, rootState) => getMenuByRouter(routers.agent, []),
		adminList: (state, getters, rootState) => getMenuByRouter(routers.admin, [])
	}
}