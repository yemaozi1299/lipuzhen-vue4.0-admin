<template>
    <Card class="seckill_controller_member">
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
                <router-link
                    :to="{
                        name: 'seckilladd',
                        params: { page: page }
                    }"
                    ><Button type="primary" icon="md-add" class="ant-btn"
                        >新建秒杀商品</Button
                    ></router-link
                >
            </Header>
            <Layout class="layout-wrapper main">
                <Sider class="sider-wrapper left">
                    <label
                        class="ant-radio-button-wrapper"
                        :class="{
                            'ant-radio-button-wrapper-checked': activeClass == 0
                        }"
                        v-on:click="classStateEdit(0)"
                    >
                        <span>全部</span>
                    </label>
                    <label
                        class="ant-radio-button-wrapper"
                        v-for="(item, index) in sort"
                        :key="index"
                        :class="{
                            'ant-radio-button-wrapper-checked':
                                activeClass == item.id
                        }"
                        v-on:click="classStateEdit(item.id)"
                    >
                        <span>{{ item.classname }}</span>
                    </label>
                </Sider>
                <Layout class="layout-wrapper right">
                    <Content>
                        <Tables
                            :columns="columns1"
                            v-model="data1"
                            :loading="loading"
                            showPage
                            :total="total"
                            :current="page"
                            :page-size="pageno"
                            show-total
                            show-elevator
                            @on-change="skippage"
                        ></Tables>
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
        function overTime (start, end) {
            if (new Date(start) > new Date()) {
                return 0;  //未开始
            }
            if ((new Date(start) < new Date() && new Date() < new Date(end))) {
                return 1;
            }
            return 2;
        }
        return {
            loading: false,
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
            columns1: [
                {
                    title: "图片",
                    width: 90,
                    key: "face",
                    align: "center",
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                attrs: {
                                    src: params.row.face
                                },
                                style: {
                                    margin: '10px',
                                    width: '50px',
                                    height: '50px'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "名称",
                    key: "name",
                    className: 'demo-table-info-column'
                },
                {
                    width: 93,
                    title: "秒杀价格",
                    key: "price",
                    className: 'demo-table-info-column'
                },
                {
                    title: "总销量",
                    key: "sold",
                    width: 76,
                    className: 'demo-table-info-column'
                },
                {
                    title: "秒杀数量",
                    width: 93,
                    key: "kc",
                    className: 'demo-table-info-column'
                },
                {
                    width: 190,
                    align: "left",
                    title: "活动时间",
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {

                            }, params.row.start_time + " 至 "),

                            h('div', {
                                style: {
                                },
                            }, params.row.end_time)
                        ]);
                    }
                },
                {
                    width: 76,
                    align: "center",
                    title: "状态",
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    type: "text",
                                    color: overTime(params.row.start_time, params.row.end_time) == 1 ? "#ffb954" : "#59607b"
                                },

                            }, overTime(params.row.start_time, params.row.end_time) == 0 ? "未开始" : (overTime(params.row.start_time, params.row.end_time) == 1 ? "进行中" : "已结束"))
                        ]);
                    }
                },
                {
                    title: "操作",
                    align: "center",
                    key: "status",
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    type: "text",
                                    cursor: "pointer",
                                    color: "#108ee9",
                                    "margin-right": '5px',
                                },
                                on: {
                                    click: () => {
                                        var type = overTime(params.row.start_time, params.row.end_time);
                                        this.goSettingPage(type, params.row.id);
                                        console.log("111")
                                    }
                                }
                            }, overTime(params.row.start_time, params.row.end_time) == 0 ? "编辑" : "详情"),
                            h('span', {

                            }, " | "),
                            h('span', {
                                style: {
                                    cursor: "pointer",
                                    "margin-left": '5px',
                                    color: "#108ee9"
                                },
                                on: {
                                    click: () => {
                                        this.delSeckill(params.row.id);
                                    }
                                }
                            }, "删除")
                        ]);
                    }
                },

                {
                    width: 96,
                    title: "上架",
                    render: (h, params) => {
                        return h('div', [
                            h('Checkbox', {
                                style: {
                                },
                                props: {
                                    value: params.row.status == 1 ? (overTime(params.row.start_time, params.row.end_time) == 2 ? false : true) : false,
                                    disabled: overTime(params.row.start_time, params.row.end_time) == 2 ? true : false
                                },
                                on: {
                                    'on-change': (row) => {
                                        this.seckillStart(row, params.row.id);
                                        console.log(row);
                                    }
                                }
                            })
                        ]);
                    }
                },
            ],
            data1: []
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
        seckillStart: function (status, id) {
            var that = this;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                action: status ? "seckill_start" : "seckill_stop",
                goodsid: id
            };
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {

                } else {

                }
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示3',
                    desc: '无法访问服务器,请重试'
                });
                that.$Loading.error();
            });
        },
        fetchData: function () {
            this.page = this.$route.params.page
                ? parseInt(this.$route.params.page)
                : 1;
            this.get();
        },
        skippage: function (page) {
            this.$router.push({ path: "/member/" + page });
        },
        get: function () {
            var that = this;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                page: this.keyword ? 1 : this.page,
                keyword: this.keyword,
                classid: this.activeClass || 0,
                action: "seckill_listof"
            }
            that.$Loading.start();
            this.loading = true;
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                that.data1 = response.data.body || [];
                that.page = response.data.page || 1;
                that.total = response.data.total || 0;
                that.activeTotal = response.data.total || 0;
                that.$Loading.finish();
                that.loading = false;
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示3',
                    desc: '无法访问服务器,请重试'
                });
                that.$Loading.error();
                that.loading = false;
            });

        },

        classStateEdit: function (id) {
            var that = this;
            this.activeClass = id;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                page: this.keyword ? 1 : this.page,
                keyword: this.keyword,
                classid: id,
                action: "seckill_listof"
            }

            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);

                that.data1 = response.data.body || [];
                that.page = response.data.page || 1;
                that.total = response.data.total || 0;

                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示1',
                    desc: '无法访问服务器,请重试'
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
            that.$Loading.start();
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                that.sort = response.data.body || [];
                console.log(response.data)
                that.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                that.$Notice.error({
                    title: '错误提示2',
                    desc: '无法访问服务器,请重试'
                });
                that.$Loading.error();
            });
        },
        goSettingPage: function (type, id) {
            var type = type == 0 ? 1 : 2;
            this.$router.push({
                path: '/seckill/goods-setting/' + type + '/' + id
            });
        },
        delSeckill: function (id) {
            var that = this;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                action: "seckill_del",
                goodsid: id
            };
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    that.get();
                } else {

                }
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示3',
                    desc: '无法访问服务器,请重试'
                });
                that.$Loading.error();
            });
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.seckill_controller_member {
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
            .page-wrap {
                width: 100%;
                text-align: right;
                padding: 20px 10px 20px 0;
            }
        }
    }
}
</style>


