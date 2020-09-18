import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design';
import iviewArea from 'iview-area';
import axios from './libs/api.request';
import qs from 'qs';
import Cookies from 'js-cookie';
import TreeTable from 'tree-table-vue'

import imgResourceLoaded from '@/components/files/imagesModal.vue';
import 'view-design/dist/styles/iview.css';
import './index.styl';



Vue.prototype.$cookieStore = Cookies;
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;


// Cookies.set("CookVueAppid", 1);
// Cookies.set("CookRolecode", 'vip'); //版本号
Vue.component('Resource', imgResourceLoaded);
Vue.use(iView);
Vue.use(iviewArea);
Vue.use(TreeTable)

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
