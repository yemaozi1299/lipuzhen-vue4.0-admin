<template>
    <Card class="add-example-dialog">
        <div class="search-area">
            <Input
                v-model="keyword"
                placeholder="关键字"
                @on-keyup.enter="get(keyword)"
                clearable
                class="ant-search-input mg-r-10"
                style="width: 200px;"
            />
            <Button
                type="primary"
                @click="get"
                icon="ios-search"
                class="ant-search-btn"
            ></Button>
        </div>

        <ul
            class="tpl-container"
            style="padding-bottom: 72px;"
            v-if="isrefresh"
        >
            <li v-for="item in appList">
                <img :src="item.coverUrl" class="cover" />
                <p class="name">{{ item.name }}</p>
                <div class="code-mask">
                    <div class="rolename">{{ item.rolename }}</div>
                    <img class="logo" alt="" :src="item.logo" />
                    <span
                        class="select-btn js-preview-btn"
                        @click="previewApp(item)"
                        >预览</span
                    >
                    <span
                        class="select-btn js-delect-btn"
                        @click="jsDelect(item)"
                        >删除</span
                    >
                </div>
            </li>
        </ul>
        <div class="info-page-btn info-example-btn">
            <Page
                :total="total"
                :current="page"
                show-total
                show-elevator
                @on-change="skippage"
            ></Page>
        </div>
    </Card>
</template>

<script type="text/javascript">
export default {
    data: function () {
        return {
            isrefresh: true,
            moves: window.vueAppUrl,
            appList: [
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
            ],
            keyword: '',
            search: false,
            page: 1,
            total: 0,
            searchPoptip: false
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function () {
            var _this = this;
            this.keyword ? this.page = 1 : '';
            var data = {
                action: 'example_applist',
                keyword: this.keyword,
                page: this.page,
                pageno: 10
            };
            console.log(data);
            this.keyword ? this.search = true : this.search = false;
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.appList = response.data.body;
                    _this.total = parseInt(response.data.total);
                } else {
                    _this.$Message.info(response.data.message);
                }
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        skippage: function (page) {
            this.page = page;
            this.appList = [
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
                { coverUrl: '/images/loading-animate.gif', logo: '//a.richapps.cn/images/loading.gif' },
            ];
            this.get();
        },
        cancelSearch: function () {
            this.keyword = '';
            this.get();
        },
        jsDelect: function (item) {
            var _this = this;
            var params = {
                action: 'example_appdel',
                id: item.id
            };
            // this.isrefresh = false;
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(params)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.appList.splice(item._index, 1);
                } else {
                    _this.$Message.info(response.data.message);
                }
                // _this.isrefresh = true;
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        previewApp: function (params) {
            window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.fromappid);
        }
    }
}
</script>

<style lang="stylus" scoped>
.add-example-dialog .tpl-container {
    width: 100%;
    height: calc(100% - 126px);
    /* padding-bottom: 50px; */
    overflow-y: scroll;
}
.add-example-dialog .tpl-container li {
    position: relative;
    width: 185px;
    height: 294px;
    margin: 0px 14px 20px 14px;
    background-color: #fff;
    vertical-align: top;
    display: inline-block;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid #333;
    overflow: hidden;
}
.add-example-dialog .tpl-container li .cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
}
.add-example-dialog .tpl-container li .name {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #FFF;
    color: #333;
    font-size: 14px;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
.add-example-dialog .tpl-container li .code-mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
}
.add-example-dialog .rolename {
    width: 100%;
    line-height: 30px;
    color: #FFF;
    text-align: center;
    font-size: 16px;
}
.add-example-dialog .tpl-container li .code-mask .logo {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -100px;
    width: 100px;
    height: 100px;
}
.select-btn {
    display: inline-block;
    width: 60px;
    line-height: 25px;
    margin-top: 216px;
    margin-left: 24px;
    color: #fff;
    font-size: 14px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    border: 1px solid white;
    border-color: rgba(255, 255, 255, 0.7);
}
.select-btn.js-preview-btn {
    background-color: #fdcb2e;
    border: 1px solid #fdcb2e;
    color: #3f4125;
}
</style>




