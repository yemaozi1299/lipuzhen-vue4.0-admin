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
            <Form label-position="left" :label-width="100">
                <FormItem label="版本">
                    <span>{{ addAppData.rolename }}</span>
                </FormItem>
                <FormItem label="开始时间">
                    <span>{{ addAppData.starttime }}</span>
                </FormItem>
                <FormItem label="结束时间">
                    <span>{{ addAppData.endtime }}</span>
                </FormItem>
                <FormItem label="续费">
                    <Row>
                        <Col span="8">
                            <Input-number
                                :min="1"
                                type="text"
                                style="width: 50px"
                                v-model="addAppData.year"
                                :disabled="addAppData.loading"
                            ></Input-number>
                            <span> 年</span>
                        </Col>
                        <Col span="16">
                            续扣费：<span>{{ yearPrice }}</span>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </Modal>

        <Modal
            v-model="softData.isModal"
            title="设置软件授权信息"
            @on-ok="appsoftSet"
        >
            <Form :label-width="100" label-position="left">
                <!-- <FormItem label="APPID">
                    <span>{{ softData.id }}</span>
                </FormItem>
                <FormItem label="应用名称">
                    <span>{{ softData.name }}</span>
                </FormItem>
                <FormItem label="roleID">
                    <span>{{ softData.roleID }}</span>
                </FormItem>
                <FormItem label="softID">
                    <span>{{ softData.softID }}</span>
                </FormItem> -->
                <FormItem label="授权状态">
                    <i-switch v-model="softData.haveSoft">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </FormItem>
                <div v-show="softData.haveSoft">
                    <FormItem label="授权域名">
                        <Input
                            v-model="softData.url"
                            placeholder="http://www.baidu.com"
                        ></Input>
                    </FormItem>
                    <FormItem label="AppSecret（选填）">
                        <Input
                            v-model="softData.AppSecret"
                            placeholder=""
                        ></Input>
                    </FormItem>
                </div>
            </Form>
        </Modal>
    </Card>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
import noImage from '@/assets/images/noimage.jpg'
export default {
    components: {
        Tables,
        Buttons,
    },
    data: function () {
        return {
            softData: {
                isModal: false,
                name: "",
                haveSoft: false,
                id: "",
                roleID: "",
                softID: "",
                AppSecret: "",
                url: "",
                user: ""
            },
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
                id: '',
                loading: false
            },
            priceList: {},
            versionArr: {},
            yearPrice: "",
            infoData: {
                columns: [

                    {
                        title: '应用图标',
                        render: (h, params) => {
                            return h('div', {
                                attrs: {
                                    class: 'app-upload-list'
                                }
                            }, [
                                h('img', {
                                    attrs: {
                                        src: params.row.logo ? ('/userlist/' + params.row.user + '/' + params.row.id + '/userpic/' + params.row.logo) : noImage,
                                    },

                                    on: {
                                        click: () => {
                                            window.open('/appeditor/preview.php?appid=' + params.row.id);
                                            console.log(params.row.id);
                                        }
                                    }
                                }, '设置')
                            ]);
                        },
                        width: '100px'

                    },
                    {
                        title: '应用名称',
                        align: "center",
                        render: (h, params) => {
                            var btn = [
                                h('Dropdown', {
                                    props: {
                                        placement: "right"
                                    },
                                    on: {
                                        'on-click': (val) => {
                                            this.openPage(params.row, val);
                                            console.log(val);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                        },
                                        style: {
                                            margin: '5px',
                                            padding: '0 20px',
                                            color: '#39f'
                                        },
                                        on: {
                                            click: () => {

                                            }
                                        }
                                    }, params.row.name),
                                    h('DropdownMenu', {
                                        slot: "list"
                                    }, [
                                        h('DropdownItem', {
                                            props: {
                                                name: "/preshow.php?appid="
                                            }
                                        }, '预览网站'),
                                        h('DropdownItem', {
                                            props: {
                                                name: "/appeditor/preview.php?appid="
                                            }
                                        }, '预览小程序')
                                    ])
                                ])
                            ];

                            return h('div', btn);
                        }
                    },
                    {
                        title: '版本',
                        key: 'rolename',
                        width: '120px'
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
                        title: '软件',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: (params.row.haveSoft == 0 ? 'success' : 'warning'),
                                        size: 'small'
                                    },
                                    style: {
                                        color: '#fff',
                                    },
                                    on: {
                                        click: () => {
                                            this.appGet(params.row);
                                            console.log("=============================");
                                        }
                                    }
                                }, params.row.haveSoft == 0 ? '授权' : '修改')
                            ]);
                        },
                        width: '120px'

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
                                            this.appYearMoney();
                                            console.log(params.row);
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
    watch: {
        'addAppData.year' (val) {
            this.appYearMoney();
            console.log(val);
        }
    },
    methods: {
        openPage (params, name) {
            // 开发版固定跳到 应用管理后台
            if (process.env.NODE_ENV == 'development' || params.haveSoft == "0") {
                window.open(`${name + params.id}`, '_self');
                return
            }
            if (params.haveSoft == "1" && params.url) {
                window.open(`${params.url + name + params.id}`, '_self');
            }
        },
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
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                }
                // console.log(JSON.stringify(response.data));
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
        appYearMoney () {
            var _this = this;
            _this.$http.get('/api_agent.php', {
                action: "app_year_money",
                appid: this.addAppData.id,

            }).then(function (res) {
                _this.yearPrice = parseFloat(res.data.price || 0) * _this.addAppData.year;
                console.log(res.data.price);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        appPrice: function () {
            var _this = this;

            this.$Modal.confirm({
                content: '此续费操作将扣除余额' + this.yearPrice + '元，是否确定',
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
        },


        appGet (params) {
            this.$http.request({
                method: "POST",
                url: "/api_agent.php?action=app_get",
                params: {
                    user: params.user,
                    appid: params.id
                }
            }).then((res) => {
                this.showHaveSoft(res.data);
                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        showHaveSoft (params) {
            var data = params.body;
            data.haveSoft = data.haveSoft == "1" ? true : false;
            data.isModal = true;
            this.softData = data;
        },
        appsoftSet () {
            var params = this.softData;
            this.$http.request({
                method: "POST",
                url: "/api_agent.php?action=app_soft_set",
                params: {
                    user: params.user,
                    appid: params.id,
                    url: params.url,
                    AppSecret: params.AppSecret,
                    haveSoft: params.haveSoft ? "1" : "0"
                }
            }).then((res) => {
                this.softData.isModal = false;
                this.get();
                console.log(res);
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