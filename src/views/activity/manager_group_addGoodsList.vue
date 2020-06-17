<template>
    <Card>
        <p slot="title">添加数据 | 所属拼团：{{ name }}</p>
        <Layout class="layout-wrapper">
            <Content>
                <Tables
                    editable
                    :columns="infoData.columns"
                    v-model="infoData.data"
                    showPage
                    :total="total"
                    :current="page"
                    show-total
                    show-elevator
                    :page-size="pageno"
                    @on-change="skippage"
                    searchable
                    @on-search-change="get"
                >
                    <Button
                        slot="addbtn"
                        class="ant-btn mg-r-20"
                        @click="$router.go(-1)"
                    >
                        返回
                    </Button>
                </Tables>
            </Content>
        </Layout>
    </Card>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons
    },
    data: function () {
        return {
            moves: window.vueAppUrl + '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            search: false,
            searchPoptip: false,
            keyword: '',
            name: '',
            goodsID: '',
            page: 1,
            total: 0,
            pageno: 20,
            infoData: {     //商品图片	商品名称	库存	价格	参团状态	操作 HID Keyboard device
                /*"name": "1三十",
                "face": "A5wbWVB47OqrP.jpg",
                "kc": "0",
                "price": "0.00",
                "groupbuyname": ""*/
                columns: [
                    {
                        width: 120,
                        title: '商品图标',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.faceUrl || '/images/applogo.png',
                                    },
                                    style: {
                                        margin: '10px',
                                        width: '50px',
                                        height: '50px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.show(params)
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '库存',
                        key: 'kc',
                        align: 'center'
                    },
                    {
                        title: '价格',
                        key: 'price',
                        align: 'center'
                    },
                    {
                        title: '参团状态',
                        render: (h, params) => {
                            return h('div', {}, params.row.groupbuyname ? ("已参加团：" + params.row.groupbuyname) : '未参团');
                        },
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        color: '#39f'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: 'addGoods',
                                                params: {
                                                    group_buy_id: this.group_buy_id
                                                },
                                                query: {
                                                    group_buy_id: this.group_buy_id,
                                                    goodsID: params.row.id
                                                }
                                            });
                                        }
                                    }
                                }, params.row.groupbuyname ? '' : '添加')
                            ]);
                        }
                    },

                ],
                data: [],
            }
        }
    },
    created () {
        this.fetchData();
        this.get();
    },
    methods: {
        fetchData: function () {
            this.name = this.$route.query.name;
            this.group_buy_id = this.$route.query.id;
        },
        get: function (page) {
            var _this = this;
            var params = {
                action: 'groupbuy_goods_list',
                appid: this.vueAppid,
                keyword: this.keyword,
                page: page || this.page,
                pageno: this.pageno
            };
            console.log(params);
            this.$http.post("/block/api_edit.php", this.$qs.stringify(params)).then(function (res) {
                _this.infoData.data = res.data.body;
                _this.total = parseInt(res.data.total);
                // console.log(JSON.stringify(res.data));
                console.log(res.data);
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
        cancelSearch: function () {
            this.keyword = '';
            this.get(1);
        },
        skippage: function (page) {
            this.page = page;
            this.get(page);
        }
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
</style>