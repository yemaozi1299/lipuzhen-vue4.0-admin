<template>
	<div>
		<div class="info-title">
			<div class="info-table-add">
				<span class="info-title-span">应用管理</span>
				<span v-if="searching" class="keyword-content">

					<span class="search-title">当前搜索：</span>{{keyword}}
					<Button type="info" size="small" @click="get(keyword='')"> 取消 </Button>	
				</span>
				<Poptip placement="left" width="300"  v-model="searchPoptip">
				    <Button type="info" shape="circle" icon="ios-search">搜索</Button>
				    <div class="api" slot="content">
				        <Input v-model="keyword" placeholder="关键字" style="width: 200px;" @keyup.enter="get(keyword)"></Input>
				        <Button type="ghost" shape="circle" icon="ios-search" @click="get(keyword)"></Button>
				    </div>
				</Poptip>
			</div>
		</div>
		<div class="info-table">
			<Table :columns="infoData.columns" :data="infoData.data" :border="true"></Table>
		</div>
		<div class="info-page-btn info-example-btn">
			<Page :total="pageData.total" :current="pageData.page" show-total show-elevator @on-change="skippage" ></Page>
		</div>
		<Modal
	        v-model="isModal"
	        title="续费"
	        @on-ok="appPrice"
	        @on-cancel="">
	        <label style="display:block;margin-bottom:10px" class="label-price">
	        	<span class="label-span">版本</span>
	        	<span>{{ addAppData.rolename }}</span>
	        </label>
	        <label style="display:block;margin-bottom:10px" class="label-price">
	        	<span class="label-span">开始时间</span>
	        	<span>{{ addAppData.starttime }}</span>
	        </label>
	        <label style="display:block;margin-bottom:10px" class="label-price">
	        	<span class="label-span">结束时间</span>
	        	<span>{{ addAppData.endtime }}</span>
	        </label>
	        <label style="display:block;margin-bottom:10px" class="label-price">
	        	<span class="label-span">续费</span>
	        	<Input type="text" style="width:50px;" v-model="addAppData.year"></Input>
	        	<span>年</span>
	        </label>
	    </Modal>

	    <Modal
	        v-model="editAppData.isModal"
	        title="修改应用"
	        @on-ok="editPriseApp"
	        @on-cancel="">
	        <label style="display:block;margin-bottom:10px">
	        	<span>应用名称：</span>
	        	<Input type="text" style="width:200px;" v-model="editAppData.name"></Input>
	        </label>
	        <label style="display:block;margin-bottom:10px">
	        	<span>到期时间：</span>
	        	<label for=""><Checkbox v-model="editAppData.single">永久</Checkbox></label>
	        	<label for="" v-if="!editAppData.single"><DatePicker type="date" style="width:170px;display:inline-block;margin-right:10px" v-model="editAppData.date"></DatePicker><TimePicker type="time" style="width:170px;display:inline-block" v-model="editAppData.time"></TimePicker></label>
	        	
	        </label>
	        <label style="display:block">
	        	<span>应用型号：</span>
	        	<Select style="width:200px;" v-model="editAppData.rolecode">
	        		<Option :value="item.rolecode" v-for="item in pariceList" :key="item.rolecode">{{item.rolename}}</Option>
	        	</Select>
	        </label>
	    </Modal>
	    <div class="angular-dialog">
	    	<div class="add-collect-dialog rich-dialog" id="add-collect-dialog" v-if="example_data.isModal">
	    		<div class="rich-content">
	    			<header class="rich-title"><span class="rich-title-content">设为样板</span><i class="icon-cross" v-on:click="example_data.isModal = false">×</i></header>
	    			<ul class="collect-page-wrap ">
	    				<li>
	    					<label for="">模版缩略图：</label>
	    					<div class="change-img-wrap cover-wrap">
	    						<input type="file" id="page-cocer" @change="ExampleAdd">
	    						<img :src="example_data.cover" alt="" id="collect-cover">
	    						<p class="text">点击更换缩略图</p>
	    					</div>
	    				</li>
	    				<li>
	    					<label for="">模版标题：</label>
	    					<input type="text" class="add-collect-title" v-model="example_data.name">
	    				</li>
	    			</ul>
	    			<span class="rich-submit-btn" @click="addAppExample">确定</span>
	    		</div>
	    	</div>
	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data:function(){
			return{
				example_data:{
					isModal: false,
					cover: '',
					name: '',
					fromappid: '',
					
				},//logo: ''
				isModal: false,
				searching:false,
				keyword: '',
				searchPoptip: false,
				moves: '',
				vueAppid: this.$cookieStore.get("CookVueAppid"),
				pariceList:{},
				pageData:{
					total: 0,
					page: 1,
				},
				editAppData:{
					isModal: false,
					name: '',
					date: '',
					single:false,
					rolecode:[]
				},
				addAppData:{
					rolecode: '',
					rolename: '',
					starttime: '',
					endtime: '',
					time: '',
					year: 1,
					id:''
				},
				versionArr:{},
				infoData:{
					columns: [
						
						{
							title: '应用图标',
                        	render: (h, params) => {
	                            return h('div', [
	                                h('img', {
	                                	attrs:{
	                                		src: params.row.logo ? ('/userlist/'+params.row.user+'/'+params.row.id+'/userpic/' + params.row.logo) : '/images/noimage.gif',
	                                	},
	                                    style: {
	                                        margin: '10px 0px',
	                                        width:'50px',
	                                        height:'50px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.row.id);
	                                            console.log(params.row.id);
	                                        }
	                                    }
	                                },'设置')
	                            ]);
	                        },
	                        width:'90px'
                        	
						},
						{
							title: '应用名称',
                        	render: (h, params) => {
	                            return h('a', {
	                            	on: {
	                            	    click: () => {
	                            	    	window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.row.id);
	                            	        console.log(params.row.id);
	                            	    }
	                            	}
	                            },params.row.name);
	                        }
						},
						{
							title: '版本',
                        	key: 'rolename',
	                        width: '90px'
                        	
						},
						{
							title: '到期时间',
                        	key: 'endtime',
                        	width: '170px'
                        	
						},
						{
							title: '访问量',
                        	key: 'count',
	                        width: '90px'
                        	
						},
						{
							title: '所属代理商',
                        	key: 'agentname',
						},
						{
							title: '所属企业',
                        	key: 'companyname',
						},
						{
							title: '状态',
                        	render: (h, params) => {
	                            return h('div', [
	                                h('Button', {
	                                	props: {
	                                        type: (params.row.status == 1 ? 'info' : 'error'),
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.companyStatus(params.row);
	                                        }
	                                    }
	                                },params.row.status == 1 ? '正常' : '关闭')
	                            ]);
	                        },
	                        width: '90px'
                        	
						},
						{
							title: '操作',
							align: 'center',
                        	render: (h, params) => {
	                            return h('div', [
	                                h('Button', {
	                                	props: {
	                                        type: 'success',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                        'margin-right':'10px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.addAppData = {
													rolecode: params.row.rolecode,
													rolename: params.row.rolename,
													starttime: params.row.starttime,
													endtime: params.row.endtime,
													year: 1,
													id: params.row.id
												}
												this.isModal = true
	                                        }
	                                    }
	                                },'续费'),
	                                h('Button', {
	                                	props: {
	                                        type: 'warning',
	                                        size: 'small',
	                                        
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                        'margin-right':'10px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	var date = params.row.endtime.split(' ');
	                                        	this.editAppData.isModal = true;
	                                        	this.editAppData.name = params.row.name;
	                                        	this.editAppData.appid = params.row.id;
	                                        	this.editAppData.date = date[0];
	                                        	this.editAppData.time = date[1];
	                                        	this.editAppData.rolecode = params.row.rolecode;
	                                        	console.log(date);
	                                        }
	                                    }
	                                },'修改'),
	                                h('Button', {
	                                	props: {
	                                        type: 'info',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                        'margin-right':'10px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.example_data.isModal = true;
	                                        	this.example_data.fromappid = params.row.id;
	                                        	this.example_data.name = params.row.name;
	                                        	// this.example_data.logo = params.row.logo;
	                                        }
	                                    }
	                                },'设为样板'),
	                                h('Button', {
	                                	props: {
	                                        type: 'error',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	console.log(params.row);
	                                        	var _this = this;
	                                        	this.$Modal.confirm({
	                                        		content:'确定要删除该应用吗？删除后数据无法恢复',
	                                        		cancelText: '取消',
	                                        		onOk:function(){
	                                        			_this.delApp(params.row);
	                                        		},
	                                        		onCancel:function(){
	                                        		}
	                                        	});
	                                        }
	                                    }
	                                },'删除')
	                            ]);
	                        },
	                        width: '260px'
						},
					],
					data:[]
				}
			}
		},
		created:function(){
			this.get();
			this.getAgentprice();
		},
		methods:{
			delApp:function(params){
				var _this = this;
				var json = {
				    action: 'app_del',
				    id: params.id
				};
				console.log(json);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(json)).then(function(response){
					console.log(response);
				    if(response.data.status == 1){
				    	_this.infoData.data.splice(params._index,1);
				    	_this.$Message.info(response.data.message);
				    }else{
				    	_this.$Message.warning(response.data.message);
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
			get:function(keyword){
				var _this = this;
				keyword ? this.pageData.page = 1 : '';
				var data = {
				    action: 'wxapplistof',
				    appid: this.vueAppid,
				    user: this.$route.query.user,
				    pageno: 10,
				    page: this.pageData.page,
				    keyword: keyword
				};
				_this.searching=keyword?true:false;
				_this.infoData.data = [];
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.infoData.data = response.data.body;
				    	_this.pageData.total = Number(response.data.total);
				    }
				    console.log(response.data);
				    _this.$Loading.finish();
				})
			},
			skippage:function(page){
				this.pageData.page = page;
				this.get();
			},
			companyStatus:function(data){
				var _this = this;
				var json = {
				    action: 'app_status',
				    id: data.id,
				    status: data.status == 1 ? 0 : 1
				};
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(json)).then(function(response){
				    if(response.data.status == 1){
				    	_this.infoData.data[ data._index ].status = data.status == 1 ? 0 : 1;
				    }
				    console.log(response.data);
				    _this.$Loading.finish();
				})
			},
			appPrice:function(){
				this.$Message.error('超级管理员还没有续费功能');
				return false;
				var _this = this;
				var json = {
				    action: 'app_year',
				    appid: this.addAppData.id,
				    year: this.addAppData.year
				};
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(json)).then(function(response){
				    console.log(response.data);
				    if(response.data.status == 1){
				    	_this.$Message.info('续费成功');
				    	_this.get();
				    }else{
				    	_this.$Message.info(response.message);
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
			editPriseApp:function(){
				var _this = this;
				var date = this.formatDate(this.editAppData.date) + ' ' + this.editAppData.time;
				var data = {
				    action: 'app_edit',
				    appid: this.editAppData.appid,
				    appname: this.editAppData.name,
				    endtime: this.editAppData.single ? '0' : date,
				    rolecode: this.editAppData.rolecode
				};
				console.log(data);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.get();
				    	_this.addAppData.name = '';
				    }else{
				    	_this.$Message.info(response.data.message);
				    }
				    console.log(response.data);
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
			getAgentprice:function(){
				var _this = this;
				var data = {
				    action: 'role_listof'
				};
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.pariceList = response.data.body;
				    }else{
				    	_this.$Message.info(response.data.message);
				    }
				    console.log(response.data);
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
			formatDate:function(date) {
			  	console.log(typeof date);
			  	if(date && typeof date == 'string'){
			    	return date;
			  	}else if(!date){
			  		date = new Date();
			  	}
			  	var year = date.getFullYear();
			  	var month = date.getMonth() + 1;
			  	var day = date.getDate();

			  	return [year, month, day].map(this.formatNumber).join('-')
			},
			formatNumber:function(n) {
			  	n = n.toString()
			  	return n[1] ? n : '0' + n
			},
			ExampleAdd:function(event){
				var file = event.target.files[0],
				_this = this;
				if(file){
				    var isFile = /^(image\/jpeg|image\/png|image\/gif)$/i;
				    if(isFile.test(file.type)){
				        var reader = new FileReader();  
				        reader.readAsDataURL(file);  //将文件以Data URL形式读入页面  
				        reader.onload=function(e){  
				            var ret = this.result;
				            _this.example_data.cover = ret;
				        }  
				    }else{
				        this.$Message.error('文件格式不正确');
				    }
				}
				
			},
			addAppExample:function(){
				var _this = this;
				if(!this.example_data.cover || !this.example_data.name){
					return _this.$Message.success('图片或名称不能为空');
				}
				var data = {
				    action: 'example_appadd',
				    fromappid: this.example_data.fromappid,
				    cover: this.example_data.cover,
				    example_name: this.example_data.name,
				};//logo: this.example_data.logo
				console.log(data.fromappid);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    console.log(response.data);
				    if(response.data.status == 1){
				    	_this.example_data.isModal = false;
				    	_this.example_data.cover = '';
				    	_this.$Message.success('添加样板成功');
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
			}
		}
	}
</script>

<style type="text/css">
	.label-price .label-span{
		display: inline-block;
		width: 80px;
	}
	



</style>