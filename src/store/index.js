import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		software: ''
	},
	getter: {

	},
	mutations: {
		softwareChange (state, payload) {
			state.software = payload
		}
	},
	actions: {
	},
	modules: {
		app
	}
})
