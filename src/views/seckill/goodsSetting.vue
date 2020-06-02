<template>
	<Card class="seckill-content-section">
		<div class="page-block">
			<div class="page-title">秒杀商品设置</div>
			<div class="page-content">
				<p>手机预览</p>
				<div class="container">
					<div class="phone-preview">
						<p class="seckill-price">￥ {{formItem.seckill_price}}</p>
						<p class="origin-price"><s>￥{{data.price}}</s></p>
					</div>
					<div :class="{'goods-info-multi': data.guigehave == 1,'goods-info': true}">
						<p>秒杀商品信息</p>
						<div class="goods-choose">
							<p class="goods-select">商品选择</p>
							<div>
								<div>
									<img :src="data.face[0].url" alt="">
									<div>
										<p class="goods-title">{{data.name}}</p>
										<p class="origin-price">
											<span>价格：</span><span class="red">￥{{data.price}}</span>
										</p>
										<p>
											<span>库存：</span>&nbsp; <span class="red">{{data.guigehave == 1 ? allkc : data.kc}}</span>件
										</p>
									</div>
								</div>
								<router-link :to="{path: '/seckill/add'}"><Button style="border-color: #3091f2;color: #3091f2;border-radius: 0;line-height: 1.15;">更换商品</Button></router-link>
							</div>
						</div>
						<Form :model="formItem" :label-width="93" label-position="left">
					        <FormItem label="开始时间">
					            <DatePicker 
					            	type="datetime" 
					            	placeholder="选择时间" 
					            	format="yyyy/MM/dd HH:mm:ss"
					            	:value="startTime" 
					            	@on-open-change="startopenChange" 
					            	@on-change="startTimeChange" style="width: 200px"
					            	:disabled="isDisabled"></DatePicker>
					        </FormItem>
					        <FormItem label="结束时间">
					            <DatePicker 
					            	type="datetime" 
					            	format="yyyy/MM/dd HH:mm:ss" 
					            	placeholder="选择时间" 
					            	@on-change="endTimeChange" 
					            	:options="options3" 
					            	:value="endTime" style="width: 200px"
					            	:disabled="isDisabled"></DatePicker>
					        </FormItem>
					        <FormItem label="商品设置"  v-if="data.guigehave == 0">
					            <div class="seckill-price">
					            	<span>秒杀价格 </span><Input type="number" @on-change="limitSeckillPrice" v-model="formItem.seckill_price" style="width: 80px" :disabled="isDisabled"></Input><span> 元</span>
					            </div>
					            <div>
					            	<span>秒杀数量 </span><Input type="number" @on-change="limitSeckillkc" v-model="formItem.seckill_kc" style="width: 80px" :disabled="isDisabled"></Input><span> 件</span> <span class="stock">库存{{data.kc}}</span>
					            </div>
					            <p class="seckill-tips">注：秒杀商品数量不能大于商品库存</p>
					        </FormItem>

							<FormItem label="商品设置"  v-if="data.guigehave == 1">
					            <Table :columns="guigeColumns" :data="guigeList" width="700"></Table>
					            <p class="seckill-tips">注：秒杀商品数量不能大于商品库存</p>
					        </FormItem>

					        <FormItem label="购买限制">
					            <div>
					            	<span>单人单秒杀时间段内最高可购买</span><Input type="number" v-model="formItem.seckill_buy_limit" style="width: 60px" :disabled="isDisabled"></Input>件
					            </div>
					        </FormItem>
					        <!-- <FormItem label="优惠叠加">
					            <div style="width:427px">
					            	<i-switch v-model="formItem.seckill_youhui" />是否可与优惠券叠加使用
					            </div>
					        </FormItem> -->
					    </Form>
					    <div class="button-group">
					    	<Button type="primary" style="margin-right:10px" @click="handleSubmit">提交</Button>
					    	<router-link :to="{path: '/seckill'}"><Button>取消</Button></router-link>
					    </div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>
<script type="text/javascript">
	export default {
    	data() {
      		return {
      			isDisabled: false,
      			requestUrl: window.vueAppUrl,
      			vueAppid: this.$cookieStore.get("CookVueAppid"),
      			data:{
      				face:[{
      					url: ""
      				}]
      			},
      			seckillData:{},
      			unitePrice: "",
      			uniteKc: "",
      			allkc: 0,
      			seckill_model: [],
      			startTime: "",
      			endTime: "",
      			formItem:{
      				startTime: "",
      				endTime: "",
      				seckill_price: "",
      				seckill_kc: "",
      				seckill_buy_limit: "",
      				seckill_youhui: false,
      			},
      			options3: {
                    disabledDate: date => {
                    	var time = new Date(this.formItem.startTime || "") - 86400000 || Date.now() - 86400000;
                        return date && date.valueOf() < time;
                    }
                },
                guigeColumns:[
                	{
                		renderHeader: (h, params) => {
	        		        return h('div', {
	        		        },this.data.guigename1);
	        		    },
	        		    key: "name1",
	        		    align: "center"
                	},
                	{
                		renderHeader: (h, params) => {
	        		        return h('div', {
	        		        },this.data.guigename2);
	        		    },
	        		    key: "name2",
	        		    align: "center"
                	},
                	{
                		width: 60,
                		title: "原价",
                		key: "price",
	        		    align: "center"
                	},
                	{
                		width: 194,
                		align: "right",
	        		    renderHeader: (h, params) => {
	        		        return h('div', [
	        		        	h('span', {
	        		        		style: {
	        		        	  		"margin-right": "10px"
	        		        	  	},
	        		        	}, '秒杀价格'),
	        		        	h('Input', {
									props: {
										type: "number",
										value: this.unitePrice,
										disabled: this.isDisabled
									},
	        		        	  	style: {
	        		        	  		width: "95px",
	        		        	  		margin: "0px"
	        		        	  	},
									on: {
										'on-change': (val) => {
											this.setUnitePrice(val.target.value);
											console.log(params.row);
											// this.seckill_model[]
										}
									}
	        		        	}),
	        		        ]);
	        		    },
	        		    render: (h, params) => {
	        		      	return h('div', [
	        		      		h('Input', {
									props: {
										type: "number",
										value: this.seckill_model[params.index].price,
										disabled: this.isDisabled
									},
	        		        	  	style: {
	        		        	  		width: "95px",
	        		        	  		margin: "0px"
	        		        	  	},
									on: {
										'on-change': (el) => {
											// this.unitePrice = "";
											this.seckill_model[params.index].price = parseInt(el.target.value) > parseInt(params.row.price) ? "" : el.target.value;
											console.log(this.seckill_model[params.index].price);
										}
									}
	        		        	}),
	        		      	]);
	        		    }
                	},
                	{
                		width: 194,
                		align: "right",
	        		    renderHeader: (h, params) => {
	        		        return h('div', [
	        		        	h('span', {
	        		        	  	style: {
	        		        	  		"margin-right": "10px"
	        		        	  	},
									on: {
										
									}
	        		        	}, '秒杀数量'),
	        		        	h('Input', {
	        		        		props: {
	        		        			type: "number",
										value: this.uniteKc,
										disabled: this.isDisabled
									},
	        		        	  	style: {
	        		        	  		width: "95px",
	        		        	  		margin: "0px"
	        		        	  	},
									on: {
										'on-keyup': (val) => {
											this.setUniteKc(val.target.value);
											console.log("秒杀数量");
										}
									}
	        		        	}),
	        		        ]);
	        		    },
	        		    render: (h, params) => {
	        		      	return h('div', [
	        		      		h('Input', {
									props: {
										type: "number",
										value: this.seckill_model[params.index].kc,
										disabled: this.isDisabled
									},
	        		        	  	style: {
	        		        	  		width: "95px",
	        		        	  		margin: "0px"
	        		        	  	},
									on: {
										'on-change': (el) => {
											// this.uniteKc = "";
											this.seckill_model[params.index].kc = parseInt(el.target.value) > parseInt(params.row.kc) ? "" : el.target.value;
										}
									}
	        		        	}),
	        		      	]);
	        		    }
                	},
                	{
                		title: "库存",
                		key: "kc",
                		width: 60
                	},


                ],
                guigeList:[{

                }]
      		}
    	},
    	created() {
    		this.fetchData();
    	},
    	methods: {
    		setUnitePrice:function(price){
    			var list = this.seckill_model || [];
    			list.forEach(function(item,index){
    				item.price = price;
    			});
    			this.seckill_model = list
    		},
    		setUniteKc:function(kc){
    			var list = this.seckill_model || [];
    			list.forEach(function(item,index){
    				item.kc = kc;
    			});
    			this.seckill_model = list
    		},
    		fetchData: function() {
    			this.$route.params.id ? (this.get(this.$route.params.id)) : "";
    			this.isDisabled = this.$route.params.type == 2 ? true : false;
    			console.log(this.$route.params.id);
    		},
    		get:function(goodsid) {//获取指定记录
            	var that = this;
            	if (!this.$route.params.id){
	                return this.$Message.error("查无此商品");//添加
	            }
              	that.$Loading.start();

              	var apiurl = "/move/api_edit.php";
              	var params = {
              	    appid: this.vueAppid,
              	    action: "goods_getone",
              	    goodsid: this.$route.params.id,
              	}
              	that.$http.post(apiurl, that.$qs.stringify(params)).then(function(response) {
              		that.$Loading.finish();
              		if (response.data.status == 1) {
              		    that.data = response.data.goodsitem;
              		    if (that.data.guigehave == 1) {
              		        that.guigeList = response.data.goodsitem.guigeitems;
              		        that.getGuigeModel(response.data.goodsitem.guigeitems);
              		    }
              		    that.$route.params.id && that.$route.params.type == 1 ? that.getSettingData() : "";
              		    that.$route.params.id && that.$route.params.type == 2 ? that.getSettingData() : "";
              		} else {
              		    that.$Message.error(response.data.message);
              		}
              	    console.log("goods_getone:",response);
              	}).
              	catch(function(response) {
              	    that.$Notice.error({
              	        title: '错误提示3',
              	        desc: '无法访问服务器,请重试'
              	    });
              	    that.$Loading.error();
              	    console.log(response);
              	});
              
            },
            getGuigeModel:function(items){
            	var kc = 0;
            	var model_item = [];
            	for(var key in items){
            		var s = items[key];
            		model_item.push({
            			guigeid1: s.nameid1,
            			guigeid2: s.nameid2,
            			price: '',
            			kc: ''
            		});
            		kc += parseInt(items[key].kc);
            	}
            	this.seckill_model = model_item;
            	this.allkc = kc;

            },
            setSeckillModel:function(info){
            	var model_item = this.seckill_model || [];
            	var secKill_guige = info.guige || [];
            	model_item.forEach(function(item,index){
            		secKill_guige.forEach(function(guige,index){
            			if((item.guigeid1 == guige.guige_nameid1) && (item.guigeid2 == guige.guige_nameid2)){
            				item.price = guige.price;
            				item.kc = guige.kc;
            			}
            		});
            	});
            	this.seckill_model = model_item;
            },
            getSettingData:function(){
            	var that = this;
            	var apiurl="/move/api_edit.php";
            	var params = {
            		appid: this.vueAppid,
            		action: "seckill_getinfo",
            		goodsid: this.$route.params.id,
            	}
            	that.$http.post(apiurl,that.$qs.stringify(params)).then(function(response) {
            		if (response.data.status == 1) {
            			var itemForm = that.formItem;
            			var seckillInfo = response.data.secKill_info;
            			that.seckillData = response.data.goodsitem;

            			itemForm.seckill_price = seckillInfo.price;
            			itemForm.seckill_kc = seckillInfo.kc;
            			itemForm.seckill_buy_limit = seckillInfo.buy_limit;
            			itemForm.startTime = seckillInfo.start_time;
            			itemForm.endTime = seckillInfo.end_time;

						that.formItem = itemForm;            
						that.startTime = seckillInfo.start_time;
						that.endTime = seckillInfo.end_time;

              		    if (response.data.secKill_info && response.data.secKill_info.guigehave == 1) {
              		        that.setSeckillModel(response.data.secKill_info);
              		    }

              		} else {
              		    that.$Message.error(response.data.message);
              		}
            	  console.log("seckill_getinfo:",response);
            	}).catch(function(response){                  
            	  that.$Notice.error({
            	    title: '错误提示3',
            	    desc:  '无法访问服务器,请重试'
            	  });
            	  that.$Loading.error();
            	});
            },
            startTimeChange:function(time){
            	if(time.split(" ")[1] == "00:00:00"){
            		var date = new Date();
            		this.startTime = time.split(" ")[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            		this.formItem.startTime = this.startTime;
            	}else{
            		this.formItem.startTime = time;
            	}

            	if(this.formItem.endTime && this.formItem.startTime > this.formItem.endTime){
            		this.formItem.endTime = this.endTime = "";
            	}
            	console.log(this.formItem.startTime);
            },
            endTimeChange:function(time){
            	if(time.split(" ")[1] == "00:00:00"){
            		var date = new Date();
            		this.endTime = time.split(" ")[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            		this.formItem.endTime = this.endTime;
            	}else{
            		this.formItem.endTime = time;
            	}
            },
            startopenChange:function(type){
            	if(type){
            		// this.startTime = this.startTime ? this.startTime : new Date();
            	}
            },
            limitSeckillPrice:function(){
            	if(parseFloat(this.formItem.seckill_price) > parseFloat(this.data.price)){
            		this.formItem.seckill_price = "";
            	}
            },
            limitSeckillkc:function(){
            	if(parseInt(this.formItem.seckill_kc) > parseInt(this.data.kc)){
            		this.formItem.seckill_kc = "";
            	}
            	console.log(this.formItem.seckill_kc);
            },
            handleSubmit:function(){
            	var formItem = this.formItem;
            	if(this.data.guigehave == 1){
            		var list = this.seckill_model;
            		var guigeList = this.guigeList;
            		list.forEach((item,index)=>{
            			if(!item.price || !item.kc){
            				return this.$Message.warning("秒杀价格和秒杀数量不能为0且不能空");
            			}
            			if(parseFloat(item.price) > parseFloat(guigeList[index].price)){
            				return this.$Message.warning("秒杀价格不能大于原价");
            			}
            			if(parseFloat(item.kc) > parseFloat(guigeList[index].kc)){
            				return this.$Message.warning("秒杀数量不能大于库存");
            			}
            		});
            	}else{
            		for(var key in formItem){
            			if(formItem[key] == ""){
            				switch(key){
            					case "seckill_price":
            						return this.$Message.warning("请填写秒杀价格");
            					break;
            					case "seckill_kc":
            						return this.$Message.warning("请填写秒杀库存");
            					break;
            					case "seckill_buy_limit":
            						return this.$Message.warning("请填写秒杀商品的限购数量");	
            					break;
            					case "startTime":
            						return this.$Message.warning("请填写秒杀开始时间");	
            					break;
            					case "endTime":
            						return this.$Message.warning("请填写秒杀结束时间");	
            					break;
            				}
            			}
            		}
            		if(formItem.seckill_price <= 0){
            			return this.$Message.warning("秒杀价格不能为0");
            		}
            		if(formItem.seckill_kc <= 0){
            			return this.$Message.warning("秒杀库存不能为0");
            		}
            	}
            	
            	if(this.formItem.startTime && this.formItem.endTime){
            		var startTime = new Date(this.formItem.startTime);
            		var endTime = new Date(this.formItem.endTime);
            		if(startTime < new Date()){
            			return this.$Message.warning("开始时间不能小于当前时间");	
            		}
            	}
            	
            	if(formItem.seckill_buy_limit <= 0){
            		return this.$Message.warning("秒杀商品的限购数量不能为0");	
            	}
            	this.seckillEdit();
            },
            seckillEdit:function(){
                var that = this;
                var formItem = this.formItem;
                var params = {
                    action:"seckill_edit",
                    appid: this.vueAppid,
                    info: {
                    	goodsid: this.$route.params.id,
                    	price: formItem.seckill_price,
                    	kc: formItem.seckill_kc,
                    	guigehave: this.data.guigehave,
                    	buy_limit: formItem.seckill_buy_limit,
                    	start_time: formItem.startTime,
                    	end_time: formItem.endTime,
                    	guigeitems: this.seckill_model,
                    	status: 1
                    }
                }
                console.log(params);
                this.$http.post("/move/api_edit.php", that.$qs.stringify(params)).then(function(response){
                    if (response.data.status == 1) {
                    	that.$Message.success("提交成功");
                    	that.$router.push({ path: '/seckill'});
                    }
                }).catch(function(response){
                    that.$Loading.error(); 
                    that.$Notice.error({
                        title: '错误提示',
                        desc:  '无法访问服务器,请重试'
                    });
                });
            },
    	}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.seckill-content-section{
	.page-block{
		.page-title{
			height: 50px;
		    line-height: 50px;
		    font-size: 16px;
		    color: #303445;
		    padding-left: 19px;
		    border-bottom: 1px solid #E5E6EE;
		}
	    .page-content{
	        padding-left: 21px;
	        > p {
		    	font-size: 12px;
		    	color: #59607b;
		    	line-height: 43px;
		    }
		    .container {
		        display: flex;
		        flex-direction: row;
		        flex-wrap: wrap;
		        .phone-preview {
		            width: 320px;
		            height: 570px;
		            color: #fff;
		            position: relative;
		            background-image: url("http://a.richapps.cn/work/static/images/phone-preview.jpg");
		            background-repeat: no-repeat;
		            margin-right: 30px;
		            background-size: 100%;
		            > p {
    		            position: absolute;
    		        }
    		        .seckill-price {
    		            bottom: 225px;
    		            left: 7px;
    		        }
    		        .origin-price {
    		            bottom: 203px;
    		            left: 6px;
    		        }
		        }
		        
		        .goods-info {
		            max-width: 570px;
		            font-size: 12px;
		            color: #59607B;
		            box-sizing: border-box;
		            border: 1px solid #D5D4DE;
		            padding-left: 23px;
		            padding-right: 28px;
		            padding-bottom: 20px;
		            margin-bottom: 80px;
		            position: relative;
		            .ivu-form-item-content{
		            	> div{
		            		> span{
		            			margin-right: 9px;
		            		}
		            	}
		            }
		            .ivu-input-wrapper{
		            	margin-right: 9px;
		            }
		            .seckill-price{
		            	margin-bottom: 20px;
		            }
		            .seckill-tips{
		            	margin-top: 9px;
		            	color: #9fa5bb;
		            }
		            .stock{
		                margin-right: 9px;
		                color: #9fa5bb;
		                margin-left: 10px;	
		            }
		            &:before {
					    content: "";
					    display: block;
					    width: 10px;
					    height: 10px;
					    background: #fff;
					    border-top: 1px solid #d9d9d9;
					    border-left: 1px solid #d9d9d9;
					    position: absolute;
					    left: -6px;
					    top: 16px;
					    transform: rotate(-45deg);
					}
					> p {
					    line-height: 40px;
					    border-bottom: 1px solid #D5D4DE;
					    margin-bottom: 30px;
					}
					> div {
						display: flex;
					    flex-direction: row;
					    flex-wrap: wrap;
					}
					.goods-choose{
						margin-bottom: 20px;
						.goods-select{
							margin-right: 44px;
						}
						> div {
							display: flex;
						    flex-direction: row;
						    flex-wrap: wrap;
						    align-items: center;
						}
						> div > div {
						    display: flex;
						    flex-direction: row;
						    margin-right: 20px;
						    min-width: 246px;
						    height: 100px;
						    box-sizing: border-box;
						    border: 1px dashed #D5D4DE;
						    padding: 20px 15px 20px 20px;
						}
						img {
						    width: 60px;
						    height: 60px;
						    margin-right: 10px;
						}
						.goods-title {
						    width: 130px;
						    overflow: hidden;
						    white-space: nowrap;
						    text-overflow: ellipsis;
						}
						.origin-price {
						    line-height: 27px;

						}
						.red{
							color: red;
						}
					}
					.button-group{
					    position: absolute;
					    left: 0;
					    bottom: -65px;
					}
		        }
		        .goods-info-multi{
		            max-width: 1064px;
		        }
		    }
	    }
	}
	.ivu-input{
		border-radius: 0px
	}
}

</style>













