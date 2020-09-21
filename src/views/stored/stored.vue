<template>
    <Card>
        <p slot="title">储值列表</p>
        <Layout class="layout-wrapper">
            <Header class="header-wrapper">
                <Button
                    type="success"
                    icon="md-add"
                    style="margin-right: 10px"
                    v-on:click="addRecv"
                    >新建储值项目</Button
                >
                <Button style="margin-right: 10px" v-on:click="custom"
                    >自定义储值设置</Button
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
                    show-total
                    show-elevator
                    @on-change="skippage"
                >
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
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            pageData: {
                total: 0,
                page: 1,
            },
            infoData: {
                columns: [
                    {
                        title: '储值卡名称',
                        key: 'title'
                    },
                    {
                        title: '创建时间',
                        key: 'add_time'
                    },
                    {
                        title: '储值金额（元）',
                        key: 'price'
                    },
                    {
                        title: '赠送金额',
                        key: 'g_price'
                    },
                    {
                        title: '操作',
                        width: '200px',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#0c6',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: '/editStored',
                                                query: {
                                                    user: params.row.id
                                                }
                                            });
                                        }
                                    }
                                }, '编辑'),
                                // h('Button', {
                                // 	props: {
                                //         type: 'text',
                                //         size: 'small'
                                //     },
                                //     style: {
                                //         color:'#2db7f5',
                                //         'margin-right': '10px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //         	this.$router.push({
                                //         		path: '/editStored',
                                //         	});
                                //         }
                                //     }
                                // },'充值明细'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#f30',
                                    },
                                    on: {
                                        click: () => {
                                            var _this = this;
                                            this.$Modal.confirm({
                                                content: '确定要删除该储值卡吗？',
                                                cancelText: '取消',
                                                onOk: function () {
                                                    _this.chuzhi_del(params.row);
                                                },
                                                onCancel: function () {
                                                }
                                            });


                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    },
                    {
                        title: '状态',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: params.row.status == '1' ? '#2db7f5' : '#f30',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.chuzhi_status(params.row);
                                        }
                                    }
                                }, params.row.status == '1' ? '开启' : '关闭')
                            ]);
                        }
                    },
                ],
                data: []
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
            this.pageData.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
            this.get();
        },
        get: function () {
            var _this = this;
            var data = {
                action: 'chuzhi_list',
                appid: this.vueAppid,
                page: this.pageData.page,
                // pageno: 10
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                } else {
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        },
        chuzhi_del: function (params) {
            var _this = this;
            var data = {
                action: 'chuzhi_del',
                appid: this.vueAppid,
                delid: [params.id]
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
        },
        chuzhi_status: function (params) {
            var _this = this;
            var data = {
                action: 'chuzhi_updown',
                appid: this.vueAppid,
                id: [params.id],
                mode: params.status == 1 ? 0 : 1
            };
            console.log(params.status)
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    params.status = params.status == 1 ? 0 : 1;
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
        },
        addRecv: function () {
            this.$router.push({
                name: 'addStored',
                params: {
                    page: this.pageData.page
                }
            });
        },
        custom: function () {
            this.$router.push({
                name: 'customStored',
                params: {
                    page: this.pageData.page
                }
            });
        }
    }
}
</script>
<style type="text/css">
</style>