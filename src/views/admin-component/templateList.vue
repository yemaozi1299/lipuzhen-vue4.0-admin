<template>
	<div class="add-example-dialog">
		<div style="padding-top: 20px;padding-left: 20px;padding-bottom:20px;">
		    <Poptip placement="right" width="300"  v-model="searchPoptip">
		      <Button type="success" shape="circle" icon="ios-search">搜索</Button>
		      <div class="api" slot="content">
		          <Input v-model="keyword" placeholder="搜索,不支持模糊搜索..." style="width: 200px;" @keyup.enter="get"></Input>
		          <Button type="ghost" shape="circle" icon="ios-search" @click="get"></Button>
		      </div>
		    </Poptip>
		    <div style="font-size:16px;font-weight: bold;display:inline-block;float:right;margin-right:20px;" v-if="search">搜索:{{keyword}}  <Button type="primary" size="small" shape="circle"  @click="cancelSearch">返回</Button></div>
		</div>
		
    	<ul class="tpl-container" style="padding-bottom: 72px;" v-if="isrefresh">
			<li v-for="item in appList">
				<img :src="item.coverUrl" height="128" width="128" class="cover"><p class="name">{{item.name}}</p>
				<div class="code-mask">
					<div class="rolename">{{item.rolename}}</div>
					<img class="logo" alt="" :src="item.logo">
					<span class="select-btn js-preview-btn" @click="previewApp(item)">预览</span>
					<span class="select-btn js-delect-btn" @click="jsDelect(item)">删除</span>
				</div>
			</li>
		</ul>
	    <div class="info-page-btn info-example-btn">
	    	<Page :total="total" :current="page" show-total show-elevator @on-change="skippage"></Page>
	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data:function(){
			return{
				isrefresh: true,
				moves: window.vueAppUrl,
				appList:[
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
				],
				keyword:'',
				search: false,
				page: 1,
				total: 0,
				searchPoptip:false
			}
		},
		created:function(){
			this.get();
		},
		methods:{
			get:function(){
				var _this = this;
				this.keyword ? this.page = 1 : '';
				var data = {
				    action: 'example_applist',
				    keyword: this.keyword,
				    page: this.page,
				    pageno: 10
				};
				console.log(data);
				this.keyword ? this.search = true : this.search = false;
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    console.log(response.data);
				    if(response.data.status == 1){
				    	_this.appList = response.data.body;
				    	_this.total = parseInt(response.data.total);
				    }else{
				    	_this.$Message.info(response.data.message);
				    }
				    _this.$Loading.finish();
				}).catch(function(response){       
					console.log(response);           
		            _this.$Notice.error({
		                  title: '错误提示',
		                  desc:  '无法访问服务器,请重试'
		              });
		            _this.$Loading.error();
		        });
			},
			skippage:function(page){
				this.page = page;
				this.appList = [
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
					{coverUrl: '/images/loading-animate.gif',logo: '//a.richapps.cn/images/loading.gif'},
				];
				this.get();
			},
			cancelSearch:function(){
				this.keyword = '';
				this.get();
			},
			jsDelect:function(item){
				var _this = this;
				var params = {
					action:'example_appdel',
					id: item.id
				};
				// this.isrefresh = false;
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(params)).then(function(response){
				    console.log(response.data);
				    if(response.data.status == 1){
				    	_this.appList.splice(item._index,1);
				    }else{
				    	_this.$Message.info(response.data.message);
				    }
				    // _this.isrefresh = true;
				    _this.$Loading.finish();
				}).catch(function(response){       
					console.log(response);           
		            _this.$Notice.error({
		                  title: '错误提示',
		                  desc:  '无法访问服务器,请重试'
		              });
		            _this.$Loading.error();
		        });
			},
			previewApp:function(params){
				window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.fromappid);
			}
		}
	}
</script>

<style type="text/css">
	
	
	
</style>





