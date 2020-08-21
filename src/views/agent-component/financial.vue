<template>
	<div>
		<div class="info-title">
			<div class="info-table-add">
				<span class="info-title-span">财务明细</span>
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
	</div>
</template>


<script type="text/javascript">
	export default {
		data:function(){
			return{
				searching:false,
				searchPoptip: false,
				keyword: '',
				pageData:{
					total: 0,
					page: 1,
				},
				infoData:{
					columns: [ //所属企业 所属应用 金额	时间	操作员名称 备注		
						{
							title: '所属企业',
                        	key: 'companyname',
						},
						{
							title: '所属应用',
                        	key: 'appname',
						},
						{
							title: '金额',
                        	render: (h, params) => {
	                            return h('div', {
	                            },params.row.io + ' ' + params.row.money);
	                        }
						},
						{
							title: '时间',
                        	key: 'daytime',
						},
						{
							title: '备注',
                        	key: 'memo',
						},
						{
							title:"操作员名称",
							key:"managername"
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
				_this.$http.post('/move/api_agent.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.infoData.data = response.data.body;
				    	_this.pageData.total = Number(response.data.total);
				    }
				    // console.log(JSON.stringify(response.data));
				    _this.$Loading.finish();
				})
			},
			skippage:function(page){
				this.pageData.page = page;
				this.get();
			}
		}
	}
</script>