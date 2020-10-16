import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		software: '',
		appid: ''
	},
	getter: {

	},
	mutations: {
		softwareChange (state, payload) {
			state.software = payload.software;
			state.appid = payload.appid;
		}
	},
	actions: {
	},
	modules: {
		app
	}
})
