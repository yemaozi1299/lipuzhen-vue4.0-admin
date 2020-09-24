<template>
    <Card>
        <p slot="title">应用管理</p>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="infoData.data"
            :columns="infoData.columns"
            showPage
            :total="pageData.total"
            :current="pageData.page"
            :page-size="pageno"
            show-total
            show-elevator
            @on-skippage="skippage"
            showlayout
            :loading="loading"
        >
            <template slot="header">
                <div class="search-area">
                    <Button
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="isAddCompany = true"
                    >
                        <Icon type="md-add" />添加
                    </Button>
                    <Input
                        v-model="keyword"
                        placeholder="关键字"
                        @on-keyup.enter="get(keyword)"
                        clearable
                        class="ant-search-input mg-r-10"
                        style="width: 200px"
                    />
                    <Button
                        type="primary"
                        @click="get(keyword)"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                </div>
            </template>
        </tables>

        <Modal v-model="isModal" title="续费" @on-ok="appPrice" @on-cancel="">
            <label
                style="display: block; margin-bottom: 10px"
                class="label-price"
            >
                <span class="label-span">版本</span>
                <span>{{ addAppData.rolename }}</span>
            </label>
            <label
                style="display: block; margin-bottom: 10px"
                class="label-price"
            >
                <span class="label-span">开始时间</span>
                <span>{{ addAppData.starttime }}</span>
            </label>
            <label
                style="display: block; margin-bottom: 10px"
                class="label-price"
            >
                <span class="label-span">结束时间</span>
                <span>{{ addAppData.endtime }}</span>
            </label>
            <label
                style="display: block; margin-bottom: 10px"
                class="label-price"
            >
                <span class="label-span">续费</span>
                <Input
                    type="text"
                    style="width: 50px"
                    v-model="addAppData.year"
                ></Input>
                <span>年</span>
            </label>
        </Modal>
    </Card>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons,
    },
    data: function () {
        return {
            pageno: 10,
            loading: false,
            isModal: false,
            searching: false,
            keyword: '',
            searchPoptip: false,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            pariceList: {},
            pageData: {
                total: 0,
                page: 1,
            },
            addAppData: {
                rolecode: '',
                starttime: '',
                rolename: '',
                endtime: '',
                year: 1,
                id: ''
            },
            priceList: {},
            versionArr: {},
            infoData: {
                columns: [

                    {
                        title: '应用图标',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.logo ? ('/userlist/' + params.row.user + '/' + params.row.id + '/userpic/' + params.row.logo) : '/images/noimage.gif',
                                    },
                                    style: {
                                        margin: '10px 0px',
                                        width: '50px',
                                        height: '50px'
                                    },
                                    on: {
                                        click: () => {
                                            window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.row.id);
                                            console.log(params.row.id);
                                        }
                                    }
                                }, '设置')
                            ]);
                        },
                        width: '90px'

                    },
                    {
                        title: '应用名称',
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.row.id);
                                        console.log(params.row.id);
                                    }
                                }
                            }, params.row.name);
                        }
                    },
                    {
                        title: '版本',
                        key: 'rolename',
                        width: '90px'
                    },
                    {
                        title: '到期时间',
                        key: 'endtime',
                        width: '170px'

                    },
                    {
                        title: '访问量',
                        key: 'count',
                        width: '90px'

                    },
                    {
                        title: '所属企业',
                        key: 'companyname',
                    },
                    {
                        title: '状态',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: (params.row.status == 1 ? 'info' : 'error'),
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#fff',
                                    },
                                    on: {
                                        click: () => {
                                            this.companyStatus(params.row);
                                        }
                                    }
                                }, params.row.status == 1 ? '正常' : '关闭')
                            ]);
                        },
                        width: '90px'
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                    },
                                    style: {
                                        color: '#fff',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.addAppData = {
                                                rolecode: params.row.rolecode,
                                                rolename: params.row.rolename,
                                                starttime: params.row.starttime,
                                                endtime: params.row.endtime,
                                                year: 1,
                                                id: params.row.id
                                            };
                                            console.log(params.row.rolecode);
                                            this.addAppData['agentPrice'] = this.getAgentPrice(params.row.rolecode);
                                            this.isModal = true;
                                        }
                                    }
                                }, '续费'),
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
                                                content: '确定要删除该应用吗？删除后数据无法恢复',
                                                cancelText: '取消',
                                                onOk: function () {
                                                    _this.delApp(params.row);
                                                },
                                                onCancel: function () {
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        },
                        width: 170,
                        fixed: "right"
                    },
                ],
                data: []
            }
        }
    },
    created: function () {
        this.get();
        this.getPrice();
    },
    methods: {
        get: function (keyword) {
            var _this = this;
            keyword ? this.pageData.page = 1 : '';
            var data = {
                action: 'wxapplistof',
                appid: this.vueAppid,
                user: this.$route.query.user,
                pageno: 10,
                page: this.pageData.page,
                keyword: keyword
            };
            _this.searching = keyword ? true : false;
            _this.infoData.data = [];
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                }
                // console.log(JSON.stringify(response.data));
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        },
        companyStatus: function (data) {
            var _this = this;
            var json = {
                action: 'app_status',
                id: data.id,
                status: data.status == 1 ? 0 : 1
            };
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(json)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data[data._index].status = data.status == 1 ? 0 : 1;
                }
                // console.log(response.data);
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        delApp: function (params) {
            var _this = this;
            var json = {
                action: 'app_del',
                id: params.id,
                user: params.user
            };
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(json)).then(function (response) {
                // console.log(response);
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
                } else {
                    _this.$Message.warning(response.data.message);
                }
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getPrice: function () {
            var _this = this;
            var data = {
                action: 'agentprice',
                appid: this.vueAppid
            };
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.priceList = response.data.body;
                }
                console.log(_this.priceList);
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getAgentPrice: function (rolecode) {
            for (var i = 0; i < this.priceList.length; i++) {
                if (this.priceList[i].rolecode == rolecode) {
                    return this.priceList[i];
                }
            }
        },
        appPrice: function () {
            var _this = this;
            var price = parseInt(this.addAppData.agentPrice.price) * this.addAppData.year;

            this.$Modal.confirm({
                content: '此续费操作将扣除余额' + price + '元，是否确定',
                cancelText: '取消',
                onOk: function () {
                    _this.appYear();
                },
                onCancel: function () {
                }
            });





        },
        appYear: function () {
            var _this = this;
            var json = {
                action: 'app_year',
                appid: this.addAppData.id,
                year: this.addAppData.year
            };

            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(json)).then(function (response) {
                if (response.data.status == 1) {
                    _this.$Message.info('续费成功');
                    _this.get();
                    _this.$Loading.finish();
                } else {
                    _this.$Modal.info({
                        content: response.data.message,
                        onOk: function () {
                            _this.$Loading.finish();
                        },
                        onCancel: function () {
                            _this.$Loading.finish();
                        }
                    });
                }

            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        }
    }
}
</script>

<style type="text/css">
.label-price .label-span {
    display: inline-block;
    width: 80px;
}
</style>