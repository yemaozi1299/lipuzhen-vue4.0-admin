<template>
	<div>
		<div class="agent-info-content">
			<div class="info-title">
				<div class="info-table-add">
					<span class="info-title-span">应用型号</span>
					<Button type="info" style="margin-right:20px;"icon="plus" shape="circle" v-on:click="role_add.isModl = true"> 添加 </Button>
				</div>
			</div>	
			<div class="info-table">
				
				<Table :columns="userData.columns" :data="userData.data" style="" :border="true"></Table>
			</div>
			
		</div>
		<Modal
	        v-model="role_add.isModl"
	        title="添加应用型号"
	        @on-ok="addRole"
	        @on-cancel="">
	        <label style="display:block;margin-bottom:10px;">
	        	<span style="width:90px;display:inline-block;">型号名称：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.rolename"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">型号代码：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.rolecode"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">驿站级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.gj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">微企级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.wq_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">企业级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.qy_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">区县级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.hj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">市级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.bj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">省级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.zs_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">型号描述：</span>
	        	<Input type="text" style="width:200px;" v-model="role_add.description"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="width:90px;display:inline-block;">是否隐藏：</span>
		        <Select v-model="role_add.yc" style="width:200px">
	                <Option :value="1" >隐藏</Option>
	                <Option :value="0" >不隐藏</Option>
	            </Select>
	        </label>
	    </Modal>


	    <Modal
	        v-model="role_edit.isModl"
	        title="编辑应用型号"
	        @on-ok="editRole"
	        @on-cancel="">
	        <label style="display:block;margin-bottom:10px">
	        	<span>型号名称：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.rolename"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>型号代码：</span>
	        	<Input disabled type="text" style="width:200px;" v-model="role_edit.rolecode"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>驿站级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.gj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="">微企级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.wq_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span style="">企业级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.qy_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>区县级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.hj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>市级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.bj_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>省级价格：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.zs_price"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>型号描述：</span>
	        	<Input type="text" style="width:200px;" v-model="role_edit.description"></Input>
	        </label>

	        <label style="display:block;margin-bottom:10px">
	        	<span>是否隐藏：</span>
		        <Select v-model="role_edit.yc" style="width:200px">
	                <Option :value="1" >隐藏</Option>
	                <Option :value="0" >不隐藏</Option>
	            </Select>
	        </label>
	    </Modal>
	</div>

</template>


<script type="text/javascript">
	export default {
		data:function(){
			return{
				vueAppid: this.$cookieStore.get("CookVueAppid"),
				role_add:{  //$rolecode,$rolename,$gj_price,$hj_price,$bj_price,$zs_price,$description',$yc
					isModl: false,
					rolecode: '',
					rolename: '',
					wq_price: '',
					qy_price: '',
					gj_price: '',
					hj_price: '',
					bj_price: '',
					zs_price: '',
					description: '',
					yc: 0
				},
				role_edit:{
					isModl: false,
					rolecode: '',
					rolename: '',
					wq_price: '',
					qy_price: '',
					gj_price: '',
					hj_price: '',
					bj_price: '',
					zs_price: '',
					description: '',
					yc: 0
				},
				userData:{
					columns: [
						{
							title: '版本名称',
                        	key: 'rolename',
                        	width: "250px",
                        	align: 'center'
						},
						{
							title: '版本代码',
                        	key: 'rolecode',
                        	width: "130px",
                        	align: 'center'
						},
						{
							title: '金额',
                        	key: 'gj_price',
                        	width: "100px",
                        	align: 'center'
						},
						{
							title: '描述',
                        	key: 'description',
						},
						{
							title: '状态',
                        	render: (h, params) => {
	                            return h('div', [
	                                h('Button', {
	                                	props: {
	                                        type: params.row.yc == 1 ? '' : 'success',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color: params.row.yc == 1 ? '' : '#fff',
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	this.toggleHide(params.row);
	                                        	// console.log(params.row);
	                                        }
	                                    }
	                                },params.row.yc == 1 ? '隐藏' : '显示')
	                            ]);
	                        },
	                        width: '70px'
						},
						{
							title: '操作',
                        	render: (h, params) => {
	                            return h('div', [
	                                h('Button', {
	                                	props: {
	                                        type: 'warning',
	                                        size: 'small'
	                                    },
	                                    style: {
	                                        color:'#fff',
	                                        'margin-right': '10px'
	                                    },
	                                    on: {
	                                        click: () => {
	                                        	var data = {
	                                        		isModl: true,
	                                        		rolecode: params.row.rolecode,
	                                        		rolename: params.row.rolename,
	                                        		wq_price: params.row.wq_price,
	                                        		qy_price: params.row.qy_price,
	                                        		gj_price: params.row.gj_price,
	                                        		hj_price: params.row.hj_price,
	                                        		bj_price: params.row.bj_price,
	                                        		zs_price: params.row.zs_price,
	                                        		description: params.row.description,
	                                        		yc: params.row.yc
	                                        	};
	                                        	this.role_edit = data;
	                                        }
	                                    }
	                                },'编辑'),
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
	                                        	this.roleDel(params.row);
	                                        }
	                                    }
	                                },'删除'),
	                            ]);
	                        },
	                        width: '160px'
						}

					],
					data:[
						{
							name: '电商版',
							code: 'dianshang',
							price: 0,
							describe: '除外卖组件，其他功能都能使用'
						}
					]
				}
			}
		},
		created:function(){
			this.get();
		},
		methods:{
			get:function(){
				var _this = this;
				var data = {
				    action: 'role_listof',
				};
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.userData.data = response.data.body;
				    	// console.log(response.data);
				    }
				    // console.log(JSON.stringify(response.data));
				    _this.$Loading.finish();
				})
			},
			addRole:function(){
				var _this = this;
				var params = this.role_add;
				var data = {             //$rolecode,$rolename,$gj_price,$hj_price,$bj_price,$zs_price,$description',$yc
				    action: 'role_add',
				    rolename: params.rolename,
				    rolecode: params.rolecode,
				    wq_price: params.wq_price,
				    qy_price: params.qy_price,
				    gj_price: params.gj_price,
				    hj_price: params.hj_price,
				    bj_price: params.bj_price,
				    zs_price: params.zs_price,
				    description: params.description,
				    yc: params.yc
				};
				// console.log(data);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.userData.data.push(data);
				    }
				    console.log(response.data);
				    _this.$Loading.finish();
				});
			},
			editRole:function(){
				var _this = this;
				var params = this.role_edit;
				var data = {             //$rolecode,$rolename,$gj_price,$hj_price,$bj_price,$zs_price,$description',$yc
				    action: 'role_edit',
				    rolename: params.rolename,
				    rolecode: params.rolecode,
				    wq_price: params.wq_price,
				    qy_price: params.qy_price,
				    gj_price: params.gj_price,
				    hj_price: params.hj_price,
				    bj_price: params.bj_price,
				    zs_price: params.zs_price,
				    description: params.description,
				    yc: params.yc
				};
				console.log(data);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.get();
				    }
				    // console.log(response.data);
				    _this.$Loading.finish();
				});
			},
			roleDel:function(params){
				var isModelDelect = false;
				var _this = this;
				this.$Modal.confirm({
					content:'确定要删除该型号吗？',
					cancelText: '取消',
					onOk:function(){
						var data = {
						    action: 'role_del',
						    rolecode: params.rolecode
						};
						_this.$Loading.start();
						_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
						    if(response.data.status == 1){
						    	_this.userData.data.splice(params._index,1);
						    }
						    console.log(response.data);
						    _this.$Loading.finish();
						});
					},
					onCancel:function(){
					}
				});
			},
			toggleHide:function(params){
				var _this = this;
				var data = {
				    action: 'role_hidde',
				    rolecode: params.rolecode,
				    hidde: params.yc == 1 ? 0 : 1
				};
				console.log(data);
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	params.yc = params.yc == 1 ? 0 : 1
				    }
				    console.log(response.data);
				    _this.$Loading.finish();
				});
			}
		}
	}
</script>

<style type="text/css">

</style>