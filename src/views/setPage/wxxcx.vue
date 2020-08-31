<template>
    <div class="wxxcx-content">
        <div class="wrap">
            <div class="tab-container">
                <div class="link-wrap-left">
                    <a :href="'/appeditor/?appid='" target="_blank">
                        <Button type="text" icon="ios-construct" size="large"
                            >小程序界面编辑</Button
                        >
                    </a>
                </div>
                <div class="link-wrap-right">
                    <a :href="'/appeditor/preview.php?appid='" target="_blank">
                        <Button type="text" icon="md-play" size="large"
                            >预览</Button
                        >
                    </a>
                </div>
            </div>
            <div class="content">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.wxxcx-content {
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