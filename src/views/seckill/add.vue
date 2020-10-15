<template>
    <Card class="seckill_add_member">
        <Layout class="layout-wrapper">
            <Header class="header-wrapper top">
                <div class="search-ele">
                    <input
                        type="text"
                        class="ant-input"
                        v-model="keyword"
                        placeholder="关键字"
                        v-on:keyup.enter="get(1, keyword)"
                    />
                    <span class="ant-input-suffix">
                        <Button
                            slot="append"
                            type="primary"
                            shape="circle"
                            icon="ios-search"
                            class="ant-search-btn"
                            @click="get(1, keyword)"
                        ></Button>
                    </span>
                </div>
                <div class="top-wrapper-right">
                    <Button @click="$router.go(-1)">返回</Button>
                </div>
            </Header>
            <Layout class="layout-wrapper main">
                <Sider class="sider-wrapper left">
                    <label
                        class="ant-radio-button-wrapper"
                        :class="{
                            'ant-radio-button-wrapper-checked':
                                activeClass == 0,
                        }"
                        v-on:click="classStateEdit(0)"
                    >
                        <span>全部</span></label
                    >
                    <label
                        class="ant-radio-button-wrapper"
                        v-for="(item, index) in sort"
                        :key="index"
                        :class="{
                            'ant-radio-button-wrapper-checked':
                                activeClass == item.id,
                        }"
                        v-on:click="classStateEdit(item.id)"
                    >
                        <span>{{ item.classname }}</span></label
                    >
                </Sider>
                <Layout class="layout-wrapper right">
                    <Content>
                        <ul class="list">
                            <li
                                class="item"
                                v-for="(item, index) in data1"
                                v-on:click="settingGoods(index)"
                            >
                                <div class="img-box mg-r-10">
                                    <img :src="item.faceUrl" alt="" />
                                </div>

                                <div class="item-content">
                                    <div class="item-title">
                                        {{ item.name }}
                                    </div>
                                    <div class="item-text">
                                        价格：
                                        <span class="red">{{
                                            item.price
                                        }}</span>
                                    </div>
                                    <div class="item-text">
                                        库存：
                                        <span class="red">{{ item.kc }}</span
                                        >件
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="page-wrap">
                            <Page
                                :total="total"
                                :current="page"
                                :page-size="pageno"
                                show-total
                                show-elevator
                                @on-change="skippage"
                            ></Page>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </Card>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    name: 'shopList',
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            activeClass: 0,
            activeTotal: 0,
            page: 1,
            modalClass: false,
            total: 1,
            pageno: 15,
            keyword: '',
            search: false,
            searchPoptip: false,
            sort: [],
            data1: [],

        };
    },
    created () {
        // this.$Loading.start();
        this.fetchData();
        this.goodsClassList();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        $route: "fetchData"
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.page
                ? parseInt(this.$route.params.page)
                : 1;
            this.get();
        },
        skippage: function (page) {
            this.$router.push({
                name: "seckilladd",
                params: {
                    page: page
                }
            });
        },
        get: function () {
            var that = this;
            var page = that.page,
                keyword = that.keyword,
                classid = that.activeClass || 0;
            if (keyword) {
                that.search = true;
            }
            else {
                that.search = false;
            }
            that.searchPoptip = false;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "seckill_list_noseckill_goods";
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.classid = classid;
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    that.data1 = response.data.body;
                    that.page = response.data.page;
                    that.total = response.data.total;
                    that.activeTotal = response.data.total;
                }
                else {
                    that.total = 0;
                }
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });

        },

        classStateEdit: function (id) {
            this.activeClass = id;
            var that = this;
            var page = that.page,
                keyword = that.keyword,
                classid = id || 0;
            if (keyword) {
                that.search = true;
            }
            else {
                that.search = false;
            }
            that.searchPoptip = false;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "seckill_list_noseckill_goods";
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.groupid = classid;
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    that.data1 = response.data.body;
                    that.page = response.data.page;
                    that.total = response.data.total;
                }
                else {
                    that.total = 0;
                }
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });
        },

        goodsClassList: function () {
            var that = this;

            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                shoptype: 0,
                action: "goods_classlist"
            };
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                that.sort = response.data.body || [];
                console.log(response.data)
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });
        },
        settingGoods: function (index) {
            var id = this.data1[index].id;
            this.$router.push({
                name: 'seckillgid',
                params: {
                    page: this.page,
                    type: "0",
                    id: id
                }
            });
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.seckill_add_member {
    .top {
        .search-ele {
            width: 200px;
            font-size: 14px;
            line-height: 1.5;
            color: rgba(0, 0, 0, 0.65);
            padding: 0;
            position: relative;
            display: inline-block;
            .ant-input {
                display: inline-block;
                padding: 4px 11px;
                height: 32px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                transition: 0.3s;
                font-size: 12px;
                border-radius: 0;
            }
            .ant-input-suffix {
                position: absolute;
                right: 0;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                line-height: 0;
                color: rgba(0, 0, 0, 0.65);
                .ant-search-btn {
                    border-radius: 0;
                }
            }
            .ant-input:focus {
                outline: 0;
                border-color: #2d8cf0;
            }
        }
        .top-wrapper-right {
            float: right;
        }
        .ant-btn {
            border-radius: 0;
            margin-left: 20px;
        }
    }
    .main {
        .left {
            label {
                box-shadow: none;
            }
            .ant-radio-button-wrapper:hover {
                background-color: #c9e9ff4d;
                .ant-icon {
                    display: block;
                }
            }
            .ant-radio-button-wrapper {
                margin: 0;
                height: 32px;
                line-height: 30px;
                color: rgba(0, 0, 0, 0.65);
                display: inline-block;
                transition: 0.3s;
                cursor: pointer;
                border: 1px solid #d9d9d9;
                border-left: 0;
                border-top-width: 1.02px;
                background: #fff;
                padding: 0 30px;
                position: relative;
                span {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .ant-radio-button-wrapper {
                width: 100%;
                height: 42px;
                border: 0;
                border-bottom: 1px solid #d5d5de;
                border-radius: 0;
                color: #59607b;
                font-size: 12px;
                text-align: left;
                line-height: 42px;
                display: inline-block;
                .ant-icon {
                    display: none;
                    position: absolute;
                    top: 0;
                    width: 30px;
                    line-height: 42px;
                    text-align: center;
                }
                &.ant-radio-button-wrapper-checked {
                    color: #3091f2;
                    background-color: #c9e9ff;
                    .ant-icon {
                        display: block;
                    }
                }
            }
        }
        .right {
            .list {
                width: 100%;
                .item {
                    position: relative;
                    display: inline-block;
                    margin: 0 10px 10px 0;
                    width: 250px;
                    height: 90px;
                    background: #ffffff;
                    vertical-align: top;
                    font-size: 13px;
                    padding: 10px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    &:hover {
                        box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
                        background-color: #FFFFFF;
                    }
                    .img-box {
                        display: inline-block;
                        height: 70px;
                        width: 70px;
                        position: relative;
                        img {
                            max-width: 100%;
                            max-height: 100%;
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                        }
                    }
                    .mg-r-10 {
                        margin-right: 10px !important;
                    }
                    .item-content {
                        display: inline-block;
                        vertical-align: top;
                        width: 90px;
                        .item-title {
                            width: 100px;
                            line-height: 1.6em;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-weight: bold;
                        }
                        .item-text {
                            width: 100px;
                            margin-top: 4px;
                            line-height: 1.6em;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            .red {
                                color: red;
                            }
                        }
                    }
                }
            }
            .page-wrap {
                padding-top: 20px;
                text-align: left;
            }
        }
    }
}
div.ivu-select-dropdown {
    text-align: left;
}
</style>


