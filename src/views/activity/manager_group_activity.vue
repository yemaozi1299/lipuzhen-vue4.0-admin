<template>
    <Card>
        <p slot="title">拼团活动列表</p>
        <Layout class="layout-wrapper">
            <Header class="header-wrapper">
                <Button type="info" icon="md-add" v-on:click="routerPage"
                    >新建拼团</Button
                >
            </Header>
            <Content>
                <Tables
                    editable
                    :columns="infoData.columns"
                    v-model="infoData.data"
                    showPage
                    :total="pageData.total"
                    :current="pageData.page"
                    :page-size="pageData.pageno"
                    show-total
                    show-elevator
                    @on-change="skippage"
                ></Tables>
            </Content>
        </Layout>
    </Card>
</template>

<script type="text/javascript">     //项目名称	拼团人数	拼团时限	商品个数	活动时间	用户限参团数	用户限购件数	活动状态	操作
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons
    },
    data: function () {
        /*添加团购  $info['groupbuyname']=团购名称    
            $info['user_limit_join']=每位用户可同时进行的团数 
            num_of_people  拼团人数
            $info['user_limit_buy']=每位用户每次参团时可购买件数 
            $info['limit_time']=拼团时限   c limit_time
            $info['start_date']=开始时间    
            $info['end_date']=结束时间为0则长期有效    
            $info['can_use_youhui']=是否可用优惠券*/
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            active: 0,
            pageData: {
                total: 0,
                page: 1,
                pageno: 20
            },
            infoData: {
                columns: [
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'groupbuyname',
                    },
                    {
                        title: '拼团人数',
                        align: 'center',
                        key: 'num_of_people'
                    },
                    {
                        title: '拼团时限',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.limit_time.split(":")[0] + "小时" + params.row.limit_time.split(":")[1] + "分钟");
                        }
                    },
                    {
                        title: '商品个数',
                        align: 'center',
                        key: 'goods_total',
                    },
                    {
                        width: '169px',
                        align: 'center',
                        title: '活动时间',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.end_date == '长期' ? '长期' : (params.row.start_date + '至' + params.row.end_date));
                        }
                    },
                    {
                        title: '用户限参团数',
                        key: 'user_limit_join',
                        align: 'center',
                    },
                    {
                        title: '用户限购件数',
                        key: 'user_limit_buy',
                        align: 'center',
                    },
                    {
                        title: '活动状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.status == 1 ? '正常' : '关闭');
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'activityGoods',
                                                params: {
                                                    page: this.pageData.page
                                                },
                                                query: {
                                                    name: params.row.groupbuyname,
                                                    id: params.row.id
                                                }
                                            });
                                        }
                                    }
                                }, '添加商品')
                            ]);
                        }
                    },


                ],
                data: [

                ]
            }
        }
    },
    created: function () {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
            this.get();
        },
        toggleItem: function (i) {
            this.active = i;
        },
        skippage: function (page) {
            this.pageData.page = page;
        },
        get: function () {
            var _this = this;
            var params = {
                action: 'groupbuy_listof',
                appid: this.vueAppid,
                page: this.pageData.page,
                pageno: this.pageData.pageno
            };
            this.$http.post("/api_edit.php", this.$qs.stringify(params)).then(function (res) {
                _this.infoData.data = res.data.body;
                _this.pageData.total = res.data.total;
                // console.log(JSON.stringify(res.data));
            }).catch(function (response) {
                console.log(response);
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        routerPage: function (params) {
            this.$router.push({
                name: 'addActivity',
                params: {
                    page: this.pageData.page
                }
            });
        },
    }
}
</script>

<style type="text/css">
.page-content-header {
    padding: 10px 0px;
    overflow: auto;
    border-bottom: 1px solid #ccc;
}
.page-content-tabel {
    padding: 0 15px 74px;
}
.col-left-div {
    padding-left: 15px;
    float: left;
}
.col-right-div {
    padding-right: 15px;
    float: right;
}

.status-list {
    padding: 10px 15px;
    /*border-bottom: 1px solid #ddd;*/
}
.status-list .status-item {
    display: inline-block;
    margin-right: 10px;
    height: 40px;
    line-height: 40px;
    padding: 0px 15px;
    font-size: 16px;
    cursor: pointer;
}
.status-list .status-item.active {
    color: rgb(92, 173, 255);
    border-bottom: 2px solid rgb(92, 173, 255);
}
.status-list .status-item:hover {
    color: rgb(92, 173, 255);
    border-bottom: 2px solid rgb(92, 173, 255);
}
</style>








