<template>
	<div class="shopinfo-content">
		<div class="page-title">店铺管理</div>
		<div class="wrap">
			<div class="tab-container">
				<div class="tab-item"><router-link :to="{path: '/shopinfo/shopinfo'}">店铺设置</router-link></div>
				<div class="tab-item"><router-link :to="{path: '/shopinfo/location'}">座位设置</router-link></div>
				<!-- <div class="tab-item"><router-link :to="{path: '/shopinfo/ticket'}">小票设置</router-link></div> -->
				<div class="tab-item"><router-link :to="{path: '/shopinfo/ticketlist'}">小票机列表</router-link></div>
			</div>
			<div class="content">
				<keep-alive>
		            <router-view></router-view>
		        </keep-alive>
			</div>
		</div>
	</div>
</template> 
<script type="text/javascript">
	export default {
		data(){
			return{
				content: "439px"
			}
		},
		created(){
			this.content = (document.body.clientHeight - 147) + "px";
		}
	}
</script>



<style lang="stylus" rel="stylesheet/stylus">
	.shopinfo-content
		background-color #fff;
		.page-title{
		    padding: 16px;
		    font-size: 15px;
		    border-bottom: 1px solid #d5d6da;
		}
		.wrap{
			width 100%;
			.tab-container{
				display: flex;
			    align-items: center;
			    width: 100%;
			    height: 52px;
			    border-bottom: 1px solid #d5d5de;
				.tab-item{
					margin-right: 10px;
				    height: 49px;
				    cursor: pointer;
				    line-height: 49px;
				    outline: 0;
				    a{
						display: block;
						cursor: pointer;
						padding: 0 20px;
						color: #59607b;
						font-size: 12px;
						border-bottom: 2px solid transparent;
						&.active{
							border-bottom: 2px solid #3091f2;
							transition: all .3s;
						}
				    }

				    
				}
			}
			.content{
				width 100%;
				overflow-x hidden;
				overflow-y auto;
			}
		}
		
</style>

