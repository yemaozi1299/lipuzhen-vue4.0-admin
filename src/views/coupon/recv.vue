<template>
    <Card>
        <Layout>
            <Header class="header-wrapper">
                <Menu mode="horizontal" active-name="0" class="menu-box">
                    <MenuItem name="0">优惠券列表</MenuItem>
                    <!-- <MenuItem name="1">
						已使用的优惠券
                    </MenuItem> -->
                </Menu>
            </Header>
            <Layout class="layout-wrapper">
                <Content>
                    <tables
                        ref="tables"
                        editable
                        :columns="infoData.columns"
                        v-model="infoData.data"
                        showPage
                        :total="pageData.total"
                        :current="pageData.page"
                        :page-size="pageData.pageno"
                        show-total
                        show-elevator
                        @on-skippage="skippage"
                        searchable
                        @on-search-change="get"
                    >
                        <Button
                            slot="addbtn"
                            class="mg-r-10"
                            type="info"
                            icon="md-add"
                            v-on:click="addRecv"
                            >新建优惠券</Button
                        >
                    </tables>
                </Content>
            </Layout>
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
            pageData: {
                total: 0,
                page: 1,
                pageno: 10
            },
            keyword: '',
            typeArr: ['满减券', '折扣券', '代金券', '兑换券', '储值券', '通用券'],       //<!--  满减券    折扣券    代金券    兑换券  储值券    通用券 -->
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            infoData: {//类型	优惠券名称	优惠方式	有效期	库存	已领张数	核销次数	允许自主领取	操作	上架使用
                columns: [
                    {
                        title: '类型',
                        render: (h, params) => {
                            return h('div', {

                            }, this.typeArr[params.row.type]);
                        }
                    },
                    {
                        title: '优惠券名称',
                        key: 'title',
                        width: '120px'
                    },
                    {
                        title: '优惠方式',
                        render: (h, params) => {
                            return h('div', {

                            }, this.condition(params.row));
                        },
                        width: '170px'
                    },
                    {
                        title: '有效期',
                        render: (h, params) => {
                            return h('div', {

                            }, this.expire_time_type(params.row));
                        },
                        width: '200px'
                    },
                    {
                        title: '库存',
                        key: 'stock'
                    },
                    // {
                    // 	title: '已领张数',
                    // 	key: 'recv_count'
                    // },
                    // {
                    // 	title: '核销次数',
                    // 	key: 'type'
                    // },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#fff',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {

                                            this.$router.push({
                                                name: 'editrecv',
                                                query: {
                                                    user: params.row.id
                                                }
                                            });
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#fff',
                                    },
                                    on: {
                                        click: () => {
                                            var _this = this;
                                            this.$Modal.confirm({
                                                content: '确定要删除该优惠券吗？',
                                                cancelText: '取消',
                                                onOk: function () {
                                                    _this.youhui_del(params.row);
                                                },
                                                onCancel: function () {
                                                }
                                            });


                                        }
                                    }
                                }, '删除'),
                            ]);
                        },
                    },
                    {
                        title: '状态',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.enable_status == 1 ? 'success' : 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#fff',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.enable_status(params.row);

                                        }
                                    }
                                }, params.row.enable_status == 1 ? '上架' : '下架')
                            ]);
                        },
                    }
                ],
                data: [

                ]
            }
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function (keyword) {
            var _this = this;
            var data = {
                action: 'youhui_list',
                appid: this.vueAppid,
                keyword: keyword,
                pageon: 10,
                page: this.pageData.page
            };
            this.infoData.data = [];
            this.$Loading.start();
            _this.$http.post('/block/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = response.data.total;
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
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
        condition: function (data) {
            var content = '';
            switch (data.type) {
                case '0':
                    content = '满' + data.tiaojian + '立减' + data.value + '元';
                    break;
                case '1':
                    content = '打' + data.value + '折';
                    break;
                case '2':
                    content = '可抵扣' + data.value + '元';
                    break;
                case '5':
                    content = data.value;
                    break;
            }
            var holiday = data.exclude_holiday == '1' ? '除法定节假日' : '';
            var weekend = data.exclude_weekend == '1' ? '周一至周五' : '';
            return '' + content + ' ' + holiday + ' ' + weekend + '';
        },
        expire_time_type: function (data) {
            if (data.expire == -1) {
                return data.start_use_date + '至' + data.end_use_date;
            } else {
                return '领取' + (data.react == 0 ? '当' : data.react) + '天后生效,有效期' + data.expire + '天';
            }
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        },
        addRecv: function () {
            this.$router.push({
                name: 'addrecv',
            });
        },
        enable_status: function (data) {
            var _this = this;
            var json = {
                action: 'youhui_updown',
                appid: this.vueAppid,
                id: [data.id],
                mode: data.enable_status == 1 ? 0 : 1
            };
            console.log(json);
            this.$Loading.start();
            _this.$http.post('/block/api_edit.php', _this.$qs.stringify(json)).then(function (response) {
                if (response.data.status == 1) {
                    data.enable_status = data.enable_status == 1 ? 0 : 1;
                    console.log(data.enable_status);
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
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
        youhui_del: function (data) {
            var _this = this;
            var json = {
                action: 'youhui_del',
                appid: this.vueAppid,
                id: [data.id]
            };
            console.log(json);
            this.$Loading.start();
            _this.$http.post('/block/api_edit.php', _this.$qs.stringify(json)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data.splice(data._index, 1);
                    console.log(data.enable_status);
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        }
    }
}
</script>
<style type="text/css">
.manager-page {
    height: 100%;
    overflow: auto;
    background-color: #eee;
}
.manager-page-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    padding: 0 20px;
}
.header-left {
    width: 200px;
    height: 50px;
    line-height: 50px;
    float: left;
}
.header-right {
    width: 297px;
    height: 50px;
    line-height: 50px;
    float: right;
}
.manager-page-tab {
    display: inline-block;
}
.manager-page-tab > li {
    position: relative;
    cursor: pointer;
    display: inline-block;
    margin-right: 15px;
    font-size: 15px;
    width: 100px;
    text-align: center;
}
.manager-page-tab > li.active {
    color: #66ccff;
    border-bottom: 2px solid #66ccff;
}
.manager-page .manager-page-body {
    border-radius: 0px;
    height: 100%;
}
.manager-page-body-page {
    padding: 10px 20px;
    background-color: #fff;
}
</style>