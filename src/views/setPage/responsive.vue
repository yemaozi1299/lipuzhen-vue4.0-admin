<template>
    <div class="wxxcx-content">
        <!-- <div class="wrap">
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
        </div> -->
        <Row :gutter="16">
            <Col :xs="24" :lg="8" style="padding-bottom: 10px">
                <Card
                    ><a
                        :href="'/edit.html?appid=' + vueAppid"
                        target="_blank"
                        class="card-item"
                        >响应式编辑页</a
                    ></Card
                >
            </Col>
            <Col :xs="24" :lg="8" style="padding-bottom: 10px">
                <Card
                    ><a
                        :href="'/preview.php?appid=' + vueAppid"
                        target="_blank"
                        class="card-item"
                        >预览</a
                    ></Card
                >
            </Col>
            <Col :xs="24" :lg="8" style="padding-bottom: 10px">
                <Card :to="{ name: 'public_site' }">
                    <div class="card-item">生成静态页面</div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.wxxcx-content {
    .card-item {
        display: block;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
}
</style>