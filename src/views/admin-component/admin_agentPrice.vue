<template>
	<div>
		<div class="agent-info-content">
			<div class="info-title">
				<div class="info-table-add">
					<span class="info-title-span">代理商财务明细</span>
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
			<div class="info-user-table">
				<Table :columns="infoData.columns" :data="infoData.data" style="" :border="true"></Table>
			</div>
			<div class="info-page-btn info-example-btn">
				<Page :total="pageData.total" :current="pageData.page" show-total show-elevator @on-change="skippage" ></Page>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		data:function(){
			return{
				searchPoptip: false,
				keyword: '',
				searching:false,
				pageData:{
					total: 0,
					page: 1,
				},
				infoData:{
					columns: [   //代理商 应用名称 所属企业 金额 方向  操作时间 IP 备注 
						{
							title: '代理商',
                        	key: 'agentname',
                        	className: 'demo-table-info-column',
						},
						{
							title: '所属企业',
                        	key: 'companyname'
						},
						{
							title: '应用名称',
                        	key: 'appname'
						},
						{
							title: '金额',
                        	render: (h, params) => {
	                            return h('div', {},params.row.io + ' ' +params.row.money);
	                        }
						},
						{
							title: '操作时间',
                        	key: 'daytime',
                        	width:'170px'
						},
						{
							title: 'IP',
                        	key: 'ip'
						},
						{
							title: '备注',
                        	key: 'memo'
						},
						{
							title: '操作员名称',
                        	key: 'managername'
						}
						
					],
					data:[]
				}
			}
		},
		created:function(){
			this.get();
		},
		methods:{
			get:function(keyword){
				var _this = this;
				keyword ? this.pageData.page = 1 : '';
				var data = {
				    action: 'moneylistof',
				    keyword: keyword,
				    pageno: 10,
				    page: this.pageData.page,
				};
				_this.searching=keyword?true:false;
				_this.infoData.data = [];
				this.$Loading.start();
				_this.$http.post('/move/api_admin.php',_this.$qs.stringify(data)).then(function(response){

				    if(response.data.status == 1){
				    	_this.infoData.data = response.data.body;
				    	_this.pageData.total = Number(response.data.total);
				    }
				    // console.log(JSON.stringify(response.data));
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
				this.pageData.page = page;
				this.get();
			}
		}
	}
</script>
<style type="text/css">
	.agent-info-content{
		width: 100%;
		height: 100%;
		margin: auto;
		overflow: hidden;
	}
	
</style>