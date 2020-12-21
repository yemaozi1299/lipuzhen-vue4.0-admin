import Agent from '@/components/agent';
import Admin from '@/components/admin';

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * 
 * 商品:改成电商管理
支付设置改成微信参数
店铺信息改成餐饮管理
信息发布改成资讯管理
文章系统
留言系统
产品系统
招聘系统
 * }
 */
export default {
	admin: [
		{
			path: '/',
			redirect: '/welcome',
			meta: {
				hideInMenu: true
			},
		}, {
			path: '/welcome',
			name: 'welcome',
			meta: {
				title: '管理中心',
				icon: 'md-home',
				hideInMenu: true
			},
			component: () => import('@/views/welcome/welcome.vue'),

		}, {
			path: '/welcome/addAdmin',
			name: 'welcomeAdmin',
			meta: {
				title: '管理员添加',
				icon: 'md-home',
				hideInMenu: true
			},
			component: () => import('@/views/welcome/home_manager/home_add.vue'),

		},
		{
			path: '/admin_info',
			name: 'adminInfo',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_info',
					meta: {
						title: '统计信息',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/statistical.vue')
				},
			]
		},
		{
			path: '/admin_user',
			name: 'admin_user',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_user',
					meta: {
						title: '企业管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_user.vue')
				},
				{
					path: '/admin_user/:page/admin_add',
					name: 'admin_add',
					meta: {
						title: '管理员添加',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/admin_manager/admin_add.vue')
				},

			]
		},



		{
			path: '/admin_apps',
			name: 'adminApps',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_apps',
					meta: {
						title: '应用管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_apps.vue')
				},
				{
					path: ':page/:user',
					name: 'admin_apps_2',
					meta: {
						title: '应用管理-查询',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/admin_apps.vue')
				},
				{
					path: ':page/admin_apps/example_appadd/',
					name: 'example_appadd',
					meta: {
						title: '添加应用样板',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/example_appadd.vue')
				},
			]
		},
		{
			path: '/agentlistof',
			name: 'agentListof',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'agentlistof',
					meta: {
						title: '代理商管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/agentlistof.vue')
				},
			]
		},
		{
			path: '/admin_agentPrice',
			name: 'adminAgentPrice',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_agentPrice',
					meta: {
						title: '代理商财务明细',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_agentPrice.vue')
				},
			]
		},

		{
			path: '/admin_manager',
			name: 'adminManager',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_manager',
					meta: {
						title: '超级管理员设置',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_manager.vue')
				},
			]
		},
		{
			path: '/templateList',
			name: 'TemplateList',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'templateList',
					meta: {
						title: '样板列表',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/template_list.vue')
				},
			]
		},
		{
			path: '/page_manager',
			name: 'pageManager',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'page_manager',
					meta: {
						title: '模板管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/page_manager.vue')
				},
			]
		},
		{
			path: '/admin_soft',
			name: 'adminSoft',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_soft',
					meta: {
						title: '软件管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_soft/admin_soft.vue')
				},
				{
					path: '/admin_soft/admin_privilege/:softID',
					name: 'admin_privilege',
					meta: {
						title: '功能管理',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/admin_soft/admin_privilege.vue')
				},
				{
					path: '/admin_soft/admin_role/:softID',
					name: 'admin_role',
					meta: {
						title: '型号管理',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/admin_soft/admin_role.vue')
				}
			]
		},

		{
			path: '/admin_block_template',
			name: 'blockTemplate',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'block_template',
					meta: {
						title: '模块样式管理',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/block_template/block_list.vue')
				},
				{
					path: '/admin_block_template/template_list/:blockname/:pageid',
					name: 'block_template_list',
					meta: {
						title: '模块样式列表',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/block_template/template_list.vue')
				},
			]
		},
		{
			path: "/admin_agent_level",
			name: "adminAgentLevel",
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'level_list',
					meta: {
						title: '代理商等级列表',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/admin_agent_level/level_list.vue')
				},
				{
					path: '/admin_agent_level/:page/level_add',
					name: 'level_add',
					meta: {
						title: '代理商等级添加',
						icon: 'md-home',
						hideInMenu: true
					},
					component: () => import('@/views/admin-component/admin_agent_level/level_add.vue')
				},
			]
		},
		{
			path: '/401',
			name: 'error_401',
			meta: {
				hideInMenu: true
			},
			component: () => import('@/views/error-page/401.vue')
		},
		{
			path: '/500',
			name: 'error_500',
			meta: {
				hideInMenu: true
			},
			component: () => import('@/views/error-page/500.vue')
		},
		{
			path: '*',
			name: 'error_404',
			meta: {
				hideInMenu: true
			},
			component: () => import('@/views/error-page/404.vue')
		}
	],

	agent: [
		{
			path: '/agent_info',
			name: "agent_index",
			component: Agent,
			children: [
				{
					path: ':page?',
					name: 'agent_info',
					meta: {
						title: '统计信息',
						notCache: true,
						icon: 'ios-podium'
					},
					component: () => import('@/views/agent-component/info.vue')
				},
			]
		},
		{
			path: '/user',
			name: 'agent_user',
			component: Agent,
			children: [
				{
					path: ':page?',
					name: 'user',
					meta: {
						title: '企业列表',
						icon: 'ios-contacts'
					},
					component: () => import('@/views/agent-component/user.vue')
				},
				{
					path: '/agent_user/:page/agent_add',
					name: 'agent_add',
					meta: {
						title: '管理员添加',
						hideInMenu: true
					},
					component: () => import('@/views/agent-component/agent_manager/agent_add.vue')
				},
			]
		},
		{
			path: '/agent_details',
			name: 'agentDetails',
			component: Agent,
			children: [
				{
					path: ':page?',
					name: 'agent_details',
					meta: {
						title: '应用管理',
						icon: 'ios-apps'
					},
					component: () => import('@/views/agent-component/details.vue')
				},
			]
		},
		{
			path: '/agent_financial',
			name: 'agentFinancial',
			component: Agent,
			children: [
				{
					path: ':page?',
					name: 'agent_financial',
					meta: {
						title: '代理商财务明细',
						icon: 'md-calculator'
					},
					component: () => import('@/views/agent-component/financial.vue')
				},
			]
		},
		{
			path: '/agent_price',
			name: 'agentPrice',
			component: Agent,
			children: [
				{
					path: ':page?',
					name: 'agent_price',
					meta: {
						title: '代理商价格',
						icon: 'ios-clipboard'
					},
					component: () => import('@/views/agent-component/price.vue')
				},
			]
		},


	]
}
