import Main from '@/components/main';
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
新闻系统
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
			path: '/admin_model',
			name: 'adminModel',
			component: Admin,
			children: [
				{
					path: ':page?',
					name: 'admin_model',
					meta: {
						title: '应用型号',
						icon: 'md-home'
					},
					component: () => import('@/views/admin-component/app_model.vue')
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
		}
	],
	main: [{
		path: '/home',
		name: '_home',
		component: Main,
		meta: {
			notCache: true,
		},
		children: [
			{
				path: ':page?',
				name: 'home',
				meta: {
					title: '首页',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/views/home/home.vue')
			},
		]
	},
	{
		path: '/shop',
		name: 'shop-page',
		component: Main,
		meta: {
			icon: 'md-cart',
			title: '电商管理'
		},
		children: [
			// 商品列表
			{
				path: ':page?',
				name: 'shop',
				meta: {
					title: '商品列表',
				},
				component: () => import('@/views/shop/shop')
			},
			{
				path: ':page/:shoptype',
				name: 'shop-page-type',
				meta: {
					title: '商品列表',
					hideInMenu: true
				},
				component: () => import('@/views/shop/shop')
			},
			{
				path: ':page/shopedit/:id',
				name: 'shop-edit',
				meta: {
					title: '普通商品设置',
					hideInMenu: true
				},
				component: () => import('@/views/shop/shopedit')
			},
			{
				path: ':page/waimaiedit/:id',
				name: 'jifen-edit',
				meta: {
					title: '外卖商品设置',
					hideInMenu: true
				},
				component: () => import('@/views/shop/jifenedit')
			},
			{
				path: ':page/:shoptype/classlist',
				name: 'classlist',
				meta: {
					title: '分类管理',
					hideInMenu: true
				},
				component: () => import('@/views/shop/classlist')
			},
			// 订单管理
			{
				path: '/shoporder/:page?',
				name: 'shoporder',
				meta: {
					title: '订单管理',
				},
				component: () => import('@/views/shoporder/shoporder')
			},
			{
				path: '/shoporder/:page/:shoptype',
				name: "shoporder_page",
				meta: {
					title: '订单管理',
					hideInMenu: true
				},
				component: () => import('@/views/shoporder/shoporder')
			},
			// 支付设置
			{
				path: '/shoppay',
				name: 'shoppay',
				meta: {
					title: '微信参数',
				},
				component: () => import('@/views/shoppay/shoppay')
			},
			// 配送管理
			{
				path: '/shoppost/:page?',
				name: 'shoppost',
				meta: {
					title: '配送管理',
				},
				component: () => import('@/views/shoppost/shoppost')
			},
			{
				path: '/shoppost/:page/edit',
				name: 'shoppost_edit',
				meta: {
					title: '添加配送方式',
					hideInMenu: true
				},
				component: () => import('@/views/shoppost/shoppostedit')
			},
			{
				path: '/shoppost/:page/edit/:id',
				name: 'shoppost_edit_id',
				meta: {
					title: '设置配送设置',
					hideInMenu: true
				},
				component: () => import('@/views/shoppost/shoppostedit')
			},

			// 店铺设置
			{
				path: '/shopinfo',
				name: 'shopinfo',
				meta: {
					title: '餐饮管理',
				},
				redirect: '/shopinfo/shopinfo',
				component: () => import('@/views/shopinfo/management.vue'),
				children: [{
					path: '/shopinfo/shopinfo',
					meta: {
						title: '店铺设置',
						hideInMenu: true
					},
					name: 'shopinfo_setting',
					component: () => import('@/views/shopinfo/shopinfo.vue')
				},
				{
					path: '/shopinfo/location',
					meta: {
						title: '座位管理',
						hideInMenu: true
					},
					name: 'location_setting',
					component: () => import('@/views/shopinfo/location.vue')
				},
				{
					path: '/shopinfo/ticket',
					meta: {
						title: '小票机',
						hideInMenu: true
					},
					name: 'smallticket',
					component: () => import('@/views/shopinfo/ticket.vue')
				},
				{
					path: '/shopinfo/ticketList',
					meta: {
						title: '小票机列表',
						hideInMenu: true
					},
					name: 'smallticketList',
					component: () => import('@/views/shopinfo/ticketlist.vue')
				}]
			},
		]
	},
	{
		path: "/marketing",
		name: "marketing",
		component: Main,
		meta: {
			icon: 'ios-cube-outline',
			title: "营销推广"
		},
		children: [
			{
				path: '/recv',
				name: 'recv',
				meta: {
					title: "优惠券"
				},
				component: () => import('@/views/coupon/recv.vue')
			},
			{
				path: '/recv/addrecv',
				meta: {
					title: "添加优惠券",
					hideInMenu: true
				},
				name: 'addrecv',
				component: () => import('@/views/coupon/addrecv.vue')
			},
			{
				path: '/recv/editrecv',
				meta: {
					title: "修改优惠券",
					hideInMenu: true
				},
				name: 'editrecv',
				component: () => import('@/views/coupon/editrecv.vue')
			},

			// 储值
			{
				path: '/stored/:page?',
				meta: {
					title: "储值",
				},
				name: 'stored',
				component: () => import('@/views/stored/stored.vue')
			},
			{
				path: '/stored/:page?/addStored',
				meta: {
					title: "新建储值项目",
					hideInMenu: true
				},
				name: 'addStored',
				component: () => import('@/views/stored/addStored.vue')
			},
			{
				path: '/stored/:page?/editStored',
				meta: {
					title: "编制储值项目",
					hideInMenu: true
				},
				name: 'editStored',
				component: () => import('@/views/stored/editStored.vue')
			},
			{
				path: '/stored/:page?/customStored',
				meta: {
					title: "自定义储值设置",
					hideInMenu: true
				},
				name: 'customStored',
				component: () => import('@/views/stored/customStored.vue')
			},

			// 拼团
			{
				path: '/activity/:page?',
				name: 'activity',
				meta: {
					title: '拼团活动'
				},
				component: () => import('@/views/activity/manager_group_activity.vue')
			},
			{
				path: '/activity/:page?/addActivity',
				name: 'addActivity',
				meta: {
					title: '添加拼团活动',
					hideInMenu: true
				},
				component: () => import('@/views/activity/manager_group_addActivity.vue')
			},
			{
				path: '/activity/:page?/activityGoods',
				name: 'activityGoods',
				meta: {
					title: '拼团商品列表',
					hideInMenu: true
				},
				component: () => import('@/views/activity/manager_group_activityGoods.vue')
			},
			{
				path: '/activity/:goodsID?/addGoodsList',
				name: 'addGoodsList',
				meta: {
					title: '添加商品列表',
					hideInMenu: true
				},
				component: () => import('@/views/activity/manager_group_addGoodsList.vue')
			},
			{
				path: '/activity/:group_buy_id?/addGoods',
				name: 'addGoods',
				meta: {
					title: '设置商品价格',
					hideInMenu: true
				},
				component: () => import('@/views/activity/manager_group_addGoods.vue')
			},
			{
				path: '/activity/:group_buy_id?/goodsInfo',
				name: 'goodsInfo',
				meta: {
					title: '拼团商品信息',
					hideInMenu: true
				},
				component: () => import('@/views/activity/manager_group_goodsInfo.vue')
			},

			// 智能名片
			{
				path: '/card',
				name: '_card',
				meta: {
					title: '智能名片',
				},
				component: () => import('@/views/card/card.vue'),
				children: [
					{
						path: '/card/card_controller',
						name: 'card',
						meta: {
							title: '名片管理',
						},
						component: () => import('@/views/card/card_controller.vue')
					},
					{
						path: '/card/card_setting',
						title: '名片设置',
						name: 'card_setting',
						meta: {
							title: '名片设置',
							hideInMenu: true
						},
						component: () => import('@/views/card/card_setting.vue')
					},

					{
						path: '/card/card_company',
						name: 'card_company',
						meta: {
							title: '公司名片代表名片',
							hideInMenu: true
						},
						component: () => import('@/views/card/card_company.vue')
					},
					{
						path: '/card/message_push',
						name: 'message_push',
						meta: {
							title: '消息推送',
							hideInMenu: true
						},
						component: () => import('@/views/card/message_push.vue')
					}
				]
			},
			// 秒杀
			{
				path: '/seckill/:page?',
				meta: {
					title: '秒杀商品',
				},
				name: 'seckill',
				component: () => import('@/views/seckill/seckill.vue')
			},
			{
				path: '/seckill/:page/add',
				meta: {
					title: '添加秒杀',
					hideInMenu: true
				},
				name: 'seckilladd',
				component: () => import('@/views/seckill/add.vue')
			},
			{
				path: '/seckill/:page/goods-setting/:type/:id',
				meta: {
					title: '秒杀商品设置',
					hideInMenu: true
				},
				name: 'seckillgid',
				component: () => import('@/views/seckill/goodsSetting.vue')
			},

			// 分销
			{
				path: '/distribution',
				meta: {
					title: '分销',
				},
				name: '_distribution',
				component: () => import('@/views/distribution/distribution.vue'),
				children: [{
					path: '/distribution/distribution_edit',
					meta: {
						title: '分销设置',
					},
					name: 'distribution',
					component: () => import('@/views/distribution/distribution_edit.vue')
				},
				{
					path: '/distribution/present_list/:page',
					meta: {
						title: '提现管理',
						hideInMenu: true
					},
					name: 'present_list',
					component: () => import('@/views/distribution/present_list.vue')
				},
				{
					path: '/distribution/distribution_management/:page',
					meta: {
						title: '分销员管理',
						hideInMenu: true
					},
					name: 'distribution_management',
					component: () => import('@/views/distribution/distribution_management.vue')
				},
				]
			},
		]
	},
	{
		path: '/info',
		component: Main,
		name: "_news",
		meta: {
			title: "资讯管理",
			icon: 'ios-globe-outline'
		},
		children: [
			{
				path: "/news/:pageid?",
				name: "news",
				meta: {
					title: "新闻系统",
				},
				component: () => import('@/views/news/news.vue')
			},
			{
				path: "/news/:pageid?/addNews/:newid",
				name: "addnews",
				meta: {
					title: "添加新闻",
					hideInMenu: true
				},
				component: () => import('@/views/news/addNews.vue')
			},
			{
				path: "/message/:pageid?",
				name: "message",
				meta: {
					title: "留言管理",
				},
				component: () => import('@/views/message/message.vue')
			},
			{
				path: "/message/:pageid?/addMessage/:mid",
				name: "addMessage",
				meta: {
					title: "添加留言",
					hideInMenu: true
				},
				component: () => import('@/views/message/addMessage.vue')
			},
			{
				path: "/product/:pageid?",
				name: "product",
				meta: {
					title: "产品系统",
				},
				component: () => import('@/views/product/product_list.vue')
			},
			{
				path: "/product/:pageid?/addProduct/:pid",
				name: "addProduct",
				meta: {
					title: "添加产品",
					hideInMenu: true
				},
				component: () => import('@/views/product/product_add.vue')
			},
			{
				path: "/job/:pageid?",
				name: "job",
				meta: {
					title: "招聘系统",
				},
				component: () => import('@/views/job/job_list.vue')
			},
			{
				path: "/job/:pageid?/addJob/:jobid?",
				name: "addJob",
				meta: {
					title: "添加招聘信息",
					hideInMenu: true
				},
				component: () => import('@/views/job/job_add.vue')
			},
			{
				path: "/job/:pageid?/resume/:jobid",
				name: "resume",
				meta: {
					title: "简历列表",
					hideInMenu: true
				},
				component: () => import('@/views/job/resume_list.vue')
			},
			{
				path: "/job/:pageid?/resume/:jobid/:resumeid",
				name: "resume_show",
				meta: {
					title: "简历详情",
					hideInMenu: true
				},
				component: () => import('@/views/job/resume_show.vue')
			},
			{
				path: "/album/:pageid?",
				name: "album",
				meta: {
					title: "相册",
				},
				component: () => import('@/views/album/album_list.vue')
			},
			{
				path: "/album/:pageid?/addAlbum/:aid?",
				name: "album_add",
				meta: {
					title: "添加相册",
					hideInMenu: true
				},
				component: () => import('@/views/album/album_add.vue')
			},
			{
				path: "/textpic/:pageid?",
				name: "textpic",
				meta: {
					title: "图文网页",
				},
				component: () => import('@/views/textpics/textpic_list.vue')
			},
			{
				path: "/textpic/:pageid/addTextpic/:textid?",
				name: "textpicAdd",
				meta: {
					title: "添加图文网页",
					hideInMenu: true
				},
				component: () => import('@/views/textpics/textpic_add.vue')
			},

			{
				path: "/weblink/:pageid?",
				name: "weblink",
				meta: {
					title: "友情链接",
				},
				component: () => import('@/views/weblink/weblink_list.vue')
			},
			{
				path: "/weblink/:pageid/addWeblink/:wid?",
				name: "addWeblink",
				meta: {
					title: "添加友情链接",
					hideInMenu: true
				},
				component: () => import('@/views/weblink/weblink_add.vue')
			},
			{
				path: "/survey/:pageid?",
				name: "survey",
				meta: {
					title: "投票调查",
				},
				component: () => import('@/views/survey/survey_list.vue')
			},
			{
				path: "/survey/:pageid/addSurvey/:sid?",
				name: "addSurvey",
				meta: {
					title: "添加投票调查",
					hideInMenu: true
				},
				component: () => import('@/views/survey/survey_add.vue')
			},

		]
	},



	/*************************************
		/dataManager/1 #列出第一页数据表
		/dataManager/1/editField #添加数据表
		/dataManager/1/editField/123 #编辑数据表123
		/dataManager/1/listData/123 #列出数据库123的所有记录
		/dataManager/1/addData/123 #给数据库123添加记录
		/dataManager/1/editData/123/456 #编辑数据库123的记录456
	*************************************/
	{
		path: '/datamanager',
		//  /action/:id
		component: Main,
		name: "datamanager_",
		meta: {
			title: '数据',

		},
		children: [{
			path: ':page?',
			name: "datamanager",
			meta: {
				title: '数据表单',
				icon: "md-repeat"
			},
			component: resolve => require(['@/views/datamanager/datamanagerlisttable'], resolve)
		},
		//列出所有数据表
		{
			path: ':page/editTable',
			name: 'editTable',
			meta: {
				title: '数据列表',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanageredittable'], resolve)
		},
		//添加数据表
		{
			path: ':page/editTable/:table',
			name: 'editTable_table',
			meta: {
				title: '添加数据表',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanageredittable'], resolve)
		},
		//编辑数据表结构
		{
			path: ':page/listData/:table',
			name: 'listData_table',
			meta: {
				title: '编辑数据表结构',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanagerlistdata'], resolve)
		},
		//列出指定数据库table的数据
		{
			path: ':page/listData/:table/:datapage',
			name: 'listData/:table/:datapage',
			meta: {
				title: '列出指定数据库table的数据',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanagerlistdata'], resolve)
		},
		//列出指定数据库table的数据
		{
			path: ':page/editData/:table',
			name: 'editData_table',
			meta: {
				title: '列出指定数据库table的数据',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanagereditdata'], resolve)
		},
		//添加指定数据库table的数据
		{
			path: ':page/editData/:table/:line',
			name: 'editData_table_line',
			meta: {
				title: '添加指定数据库table的数据',
				hideInMenu: true
			},
			component: resolve => require(['@/views/datamanager/datamanagereditdata'], resolve)
		} //编辑指定数据库table的数据line

		]
	},

	{
		path: '/member',
		component: Main,
		name: "_member",
		children: [
			{
				path: ":page?",
				meta: {
					title: '用户管理',
					icon: 'md-people'
				},
				name: 'member',
				component: () => import('@/views/member/member.vue')
			}
		]
	},

	{
		path: '/file',
		name: "file_ex",
		component: Main,
		children: [
			{
				path: ':page?',
				name: 'file',
				meta: {
					title: '文件管理',
					icon: 'ios-folder-outline'
				},
				component: () => import('@/views/file/file')
			},
		]
	},

	{
		path: '/sqlfile',
		name: "sqlFile",
		component: Main,
		children: [
			{
				path: ':page?',
				name: 'sql_file',
				meta: {
					title: '数据库管理',
					icon: 'ios-folder-outline'
				},
				component: () => import('@/views/sqlFile/sql_list')
			},
		]
	},



	{
		path: '/wxxcx',
		name: '_wxxcx',
		component: Main,
		meta: {
			notCache: true,
			hideInMenu: true,
		},
		children: [
			{
				path: ':page?',
				name: 'wxxcx',
				meta: {
					title: '小程序设置',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/views/setPage/wxxcx.vue'),
			},
			{
				path: '/sharezip',
				name: 'sharezip',
				meta: {
					title: '打包发布',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/views/setPage/components/sharezip.vue')
			}

		]
	},

	{
		path: '/responsive',
		name: '_responsive',
		component: Main,
		meta: {
			notCache: true,
			hideInMenu: true,
		},
		children: [
			{
				path: ':page?',
				name: 'responsive',
				meta: {
					title: '响应式设置',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/views/setPage/responsive.vue')
			},
			{
				path: '/public_site',
				name: 'public_site',
				meta: {
					title: '生成静态页面',
					notCache: true,
					icon: 'md-home'
				},
				component: () => import('@/views/setPage/components/public_site.vue')
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
	}],
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
						icon: 'md-home'
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
						icon: 'md-home'
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
						icon: 'md-home'
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
						icon: 'md-home'
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
						icon: 'md-home'
					},
					component: () => import('@/views/agent-component/price.vue')
				},
			]
		},


	]


}
