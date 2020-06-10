<template>
    <Card>
        <p slot="title">智能名片</p>
        <div class="ant-layout-content">
            <div class="wrap">
                <!-- <div class="tab-container">
					<div class="tab-item"><router-link :to="{path: '/card_setting'}">名片设置</router-link></div>
					<div class="tab-item"><router-link :to="{path: '/card_controller'}">用户管理</router-link></div>
					<div class="tab-item"><router-link :to="{path: '/card_company'}">销售人员名片</router-link></div>
					<div class="tab-item"><router-link :to="{path: '/message_push'}">消息推送</router-link></div>
				</div> -->
                <div class="content">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </div>
    </Card>
</template> 
<script type="text/javascript">
export default {
    data () {
        return {
            content: "439px"
        }
    },
    created () {
        this.content = (document.body.clientHeight - 147) + "px";
    }
}
</script>



<style lang="stylus" rel="stylesheet/stylus">
.ant-layout-content {
    background-color: #fff;
    .page-title {
        padding: 16px;
        font-size: 15px;
        border-bottom: 1px solid #d5d6da;
    }
    .wrap {
        width: 100%;
        .tab-container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 52px;
            border-bottom: 1px solid #d5d5de;
            .tab-item {
                margin-right: 10px;
                height: 49px;
                cursor: pointer;
                line-height: 49px;
                outline: 0;
                a {
                    display: block;
                    cursor: pointer;
                    padding: 0 20px;
                    color: #59607b;
                    font-size: 12px;
                    border-bottom: 2px solid transparent;
                    &.active {
                        border-bottom: 2px solid #3091f2;
                        transition: all 0.3s;
                    }
                }
            }
        }
        .content {
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
}
</style>

