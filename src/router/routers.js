import Main from '@/components/main'
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
 * }
 */
export default [
	{
		path: '/',
		name: '_home',
		redirect: '/home',
		component: Main,
		meta: {
			notCache: true,
		},
		children: [
			{
				path: '/home',
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
			title: '商品'
		},
		children: [
			// 商品列表
			{
				path: ':page?',
				name: 'shop',
				meta: {
					title: '商品列表',
					icon: 'md-cart'
				},
				component: () => import('@/views/shop/shop')
			},
			{
				path: ':page/:shoptype',
				name: 'shop-page-type',
				meta: {
					title: '商品列表',
					icon: 'md-home',
					hideInMenu: true
				},
				component: () => import('@/views/shop/shop')
			},
			{
				path: ':page/shopedit/:id',
				name: 'shop-edit',
				meta: {
					title: '普通商品设置',
					icon: 'md-cart',
					hideInMenu: true
				},
				component: () => import('@/views/shop/shopedit')
			},
			{
				path: ':page/waimaiedit/:id',
				name: 'jifen-edit',
				meta: {
					title: '外卖商品设置',
					icon: 'md-cart',
					hideInMenu: true
				},
				component: () => import('@/views/shop/jifenedit')
			},
			// 订单管理
			{
				path: '/shoporder/:page?',
				name: 'shoporder',
				meta: {
					title: '订单管理',
					icon: 'md-home'
				},
				component: () => import('@/views/shoporder/shoporder')
			},
			{
				path: '/shoporder/:page/:shoptype',
				name: "shoporder_page",
				meta: {
					title: '订单管理',
					icon: 'md-home',
					hideInMenu: true
				},
				component: () => import('@/views/shoporder/shoporder')
			},

			// 配送管理
			{
				path: '/shoppost/:page?',
				name: 'shoppost',
				meta: {
					title: '配送管理',
					icon: 'md-cart'
				},
				component: () => import('@/views/shoppost/shoppost')
			},
			{
				path: '/shoppost/:page/edit',
				name: 'shoppost_edit',
				meta: {
					title: '添加配送方式',
					icon: 'md-home',
					hideInMenu: true
				},
				component: () => import('@/views/shoppost/shoppostedit')
			},
			{
				path: '/shoppost/:page/edit/:id',
				name: 'shoppost_edit_id',
				meta: {
					title: '设置配送设置',
					icon: 'md-home',
					hideInMenu: true
				},
				component: () => import('@/views/shoppost/shoppostedit')
			},





		]
	},

	{
		path: '/file',
		component: Main,
		children: [
			{
				path: '',
				name: 'file_images',
				meta: {
					title: '文件管理',
					icon: 'md-cart'
				},
				component: () => import('@/views/file/images')
			},
		]

	},


]


