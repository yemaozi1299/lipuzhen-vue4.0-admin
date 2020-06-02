import Main from '@/components/main'

export default [
	{
	    path: '/',
	    name: '_home',
	    redirect: '/home',
	    component: Main,
	    meta: {
	      	hideInMenu: true,
	      	notCache: true
	    },
	    children: [
	      	{
		        path: '/home',
		        name: 'home',
		        meta: {
		          	hideInMenu: true,
		          	title: '首页',
		          	notCache: true,
		          	icon: 'md-home'
		        },
		        component: () => import('@/views/home/home')
	      	},
	      	{
	      	  	path: '/shop',
	      	  	redirect: '/shop/1' 
	      	},
	      	{
		        path: '/shop/:page',
		        name: 'shop',
		        meta: {
		          	hideInMenu: true,
		          	title: '商品管理',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/shop/shop')
	      	},
	      	{
		        path: '/shop/shopedit/:id',
		        name: 'shop_edit',
		        meta: {
		          	hideInMenu: true,
		          	title: '普通商品设置',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/shop/shopedit')
	      	},
	      	{
		        path: '/shop/jifenedit/:id',
		        name: 'shop_edit',
		        meta: {
		          	hideInMenu: true,
		          	title: '普通商品设置',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/shop/jifenedit')
	      	},
	      	{
		        path: '/shoporder',
		        name: 'shoporder',
		        meta: {
		          	hideInMenu: true,
		          	title: '订单管理',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/shoporder/shoporder')
	      	},
      	  	{
      	        path: '/file',
      	        name: 'file_images',
      	        meta: {
      	          	hideInMenu: true,
      	          	title: '订单管理',
      	          	notCache: true,
      	          	icon: 'md-cart'
      	        },
      	        component: () => import('@/views/file/images')
      	  	},
	      	{
		        path: '/shoppost',
		        name: 'shoppost',
		        meta: {
		          	hideInMenu: true,
		          	title: '配送方式',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/shoppost/shoppost')
	      	},
	      	{
		        path: '/seckill',
		        name: 'seckill',
		        meta: {
		          	hideInMenu: true,
		          	title: '秒杀',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/seckill/seckill')
	      	},{
	      		path: '/tables',
		        name: 'tables',
		        meta: {
		          	hideInMenu: true,
		          	title: '表单',
		          	notCache: true,
		          	icon: 'md-cart'
		        },
		        component: () => import('@/views/components/tables/tables.vue')
	      	}
	    ]
	},
]












