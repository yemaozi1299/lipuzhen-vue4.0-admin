<template>
    <Card>
        <p slot="title">拼团商品列表 | 所属拼团：{{ name }}</p>
        <Layer class="layout-wrapper">
            <Header class="header-wrapper">
                <Button
                    type="info"
                    icon="md-add"
                    style="margin-right: 10px"
                    v-on:click="addGoods"
                    >添加商品</Button
                >
                <Button @click="$router.go(-1)">返回</Button>
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
        </Layer>
    </Card>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    name: 'activityGoods',
    components: {
        Tables,
        Buttons
    },
    data: function () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            name: '',
            goodsID: '',
            pageData: {
                total: 0,
                page: 1,
                pageno: 20
            },
            infoData: {     //商品图片	商品名称	库存	原价	拼团价	团长价	已拼团数	已拼件数	上架销售	操作

                columns: [
                    {
                        title: '商品图片',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.goods_face || '/images/applogo.png',
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
                        title: '商品名称',
                        key: 'goods_name',
                        align: 'center',
                    },
                    {
                        title: '库存',
                        key: 'goods_kc',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, '上架中');
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(Buttons, {

                                    style: {
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'goodsInfo',
                                                params: {
                                                    group_buy_id: params.row.group_buy_id
                                                },
                                                query: {
                                                    group_buy_id: params.row.group_buy_id,
                                                    goodsID: params.row.goodsid
                                                }
                                            });
                                        }
                                    }
                                }, '查看商品信息'),
                                h(Buttons, {
                                    props: {
                                        type: "error"
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.groupbuy_remove_goods(params.row);
                                        }
                                    }
                                }, '移出商品')
                            ]);
                        },
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
        skippage: function (page) {
            this.pageData.page = page;
        },
        fetchData: function () {
            this.name = this.$route.query.name;
            this.goodsID = this.$route.query.id;
        },
        get: function () {
            var _this = this;
            var params = {
                action: 'groupbuy_listofgoods',
                appid: this.vueAppid,
                id: this.goodsID,
                page: this.pageData.page,
                pageno: this.pageData.pageno
            };
            this.$http.post("/api_edit.php", this.$qs.stringify(params)).then(function (res) {
                _this.infoData.data = res.data.body;
                _this.pageData.total = res.data.total;
                // console.log(JSON.stringify(res.data));
                console.log(res.data);
            }).catch(function (response) {
                console.log(response);
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.loading = false;
            });
        },
        addGoods: function () {
            this.$router.push({
                name: 'addGoodsList',
                params: {
                    goodsID: this.goodsID
                },
                query: {
                    name: this.name,
                    id: this.goodsID
                }
            });
        },
        groupbuy_remove_goods: function (params) {
            var _this = this;
            var data = {
                action: 'groupbuy_remove_goods',   //$goodsid,$group_buy_id
                goodsid: params.goodsid,
                group_buy_id: params.group_buy_id,
                appid: this.vueAppid,

            }
            _this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
                    _this.$Message.info(response.data.message);
                } else if (response.data.status == 0) {
                    _this.$Message.info(response.data.message);
                }
                _this.$Loading.finish();
            })
                .catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                    _this.$Loading.error();
                });
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