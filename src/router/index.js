import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'   //调用routers文件
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config


Vue.use(Router)

var routesArr = [...routes.agent, ...routes.admin];
const router = new Router({
	routes: routesArr,
	// mode: 'history',       //history模式，路径上面不会出现/#/，打包后在本地无法预览，需要上传到服务器上
	base: process.env.BASE_URL,
	'linkActiveClass': 'active',
});
const LOGIN_PAGE_NAME = 'login';
router.afterEach(to => {
	setTitle(to, router.app)
	window.scrollTo(0, 0)
})

export default router