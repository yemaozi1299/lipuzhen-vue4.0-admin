<template>
	<div>
		<div class="page-content">
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
			<ul class="page-example-ul">
				<li v-for="item in list">
					<img :src="moves + item.cover" alt="">
					<p>{{item.name}}</p>
					<span class="delete-tpl" v-on:click="del(item.id)">✖</span>
				</li>
			</ul>
			<div class="info-page-btn info-example-btn">
				<Page :total="total" :current="page" show-total show-elevator @on-change="skippage" page-size='20'></Page>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default{
		data:function(){
			return{
				list: [],
				moves: window.vueAppUrl + '/data/example/page/',
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
				var params = {
					action: "example_pagelist",
					keyword: this.keyword,
				    page: this.page,
				    pageno: 20
				};
				this.keyword ? this.search = true : this.search = false;
				this.$http.post("/move/api_admin.php", _this.$qs.stringify(params)).then(function(response){
					_this.list = response.data.body;
					_this.total = response.data.total;
					console.log(response);
				}).catch(function(response){
	        		_this.$Loading.error(); 
	        	    _this.$Notice.error({
	        	          title: '错误提示',
	        	          desc:  '无法访问服务器,请重试'
	        	      });
	        	    _this.loading = false;
	        	});
			},
			cancelSearch:function(){
				this.keyword = '';
				this.get();
			},
			skippage:function(page){
				this.page = page;
				
				this.get();
			},
			del: function(id){
				var _this = this;
				var params = {
					action: "example_pagedel",
					id: id
				};
				console.log(params);
				this.$http.post("/move/api_admin.php", _this.$qs.stringify(params)).then(function(response){
					_this.get();
					console.log(response);
				}).catch(function(response){
	        		_this.$Loading.error(); 
	        	    _this.$Notice.error({
	        	          title: '错误提示',
	        	          desc:  '无法访问服务器,请重试'
	        	      });
	        	    _this.loading = false;
	        	});
			}
		}
	}
</script>

<style type="text/css">
	.page-content{
		/*padding: 20px 0px 0px 20px;*/
		overflow: hidden;
		height: 100%;
	}
	.page-content ul.page-example-ul{
		margin-left: 20px;
	}
	.page-content ul.page-example-ul > li{
		position: relative;
		display: inline-block;
		margin-bottom: 20px;
		margin-right: 20px;
		overflow: hidden;
		width: 120px;
		height: 184px;
		font-size: 16px;
		background-color: #fff;
		cursor: pointer;
	}
	.page-content ul.page-example-ul>li>img{
		width: 100%;
		height: auto;
	}
	.page-content ul.page-example-ul>li>p{
		position: absolute;
	    left: 0;
	    bottom: 0;
		width: 100%;
		background-color: #585858;
		color: #fff;
		line-height: 32px;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
	.page-content ul.page-example-ul li .delete-tpl {
	    display: none;
	    position: absolute;
	    right: 5px;
	    top: 5px;
	    width: 20px;
	    height: 20px;
	    line-height: 18px;
	    border: 1px solid #b2b2b2;
	    background-color: #fff;
	    color: #b2b2b2;
	    cursor: pointer;
	    text-align: center;
	    z-index: 999;
	    border-radius: 50%;
	    font-size: 12px;
	}
	.page-content ul.page-example-ul li:hover{
		outline: 2px solid #2c91fb;
	}
	.page-content ul.page-example-ul li:hover .delete-tpl{
		display: inline-block;
	}
</style>

