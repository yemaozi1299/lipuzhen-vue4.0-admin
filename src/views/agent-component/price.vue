<template>
	<div>
		<div class="agent-info-content">
			<div class="info-title">代理商价格</div>	
			<div class="price-user-table">
				<Table :columns="userData.columns" :data="userData.data" style="" :border="true"></Table>
			</div>
			
		</div>
	</div>

</template>


<script type="text/javascript">
	export default {
		data:function(){
			return{
				vueAppid: this.$cookieStore.get("CookVueAppid"),
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
							title: "价格",
                        	key: 'price',
                        	width: "100px",
                        	align: 'center'
						},
						{
							title: '描述',
                        	key: 'description'
						},
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
			this.getInfo();
		},
		methods:{
			get:function(){
				var _this = this;
				var data = {
				    action: 'agentprice',
				    appid: this.vueAppid
				};
				this.$Loading.start();
				_this.$http.post('/move/api_agent.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	_this.userData.data = response.data.body
				    }
				    // console.log(response.data);
				    _this.$Loading.finish();
				})
			},
			getInfo:function(){
				var _this = this;
				var data = {
				    action: 'agent_info',
				    appid: this.vueAppid
				};
				this.$Loading.start();
				_this.$http.post('/move/api_agent.php',_this.$qs.stringify(data)).then(function(response){
				    if(response.data.status == 1){
				    	var data =  response.data;
				    	_this.userData.columns[2].title = data.agentjb + '价格';

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

</style>