import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design';
import axios from './libs/api.request';
import qs from 'qs';
import Cookies from 'js-cookie';

import 'view-design/dist/styles/iview.css';
import './index.styl';



Vue.prototype.$cookieStore = Cookies;
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;


Vue.use(iView);





/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
