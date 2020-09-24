<template>
    <Layout id="welcome-wrapper" class="layout-wrapper">
        <Header class="index-header">
            <div class="header-nav" :style="'width:' + maxWidth + 'px'">
                <h1 class="logo">
                    <a href="javascript:void(0)"
                        ><img class="logo-large" :src="welcome_logo"
                    /></a>
                </h1>
                <ul class="nav-list">
                    <li class="active">
                        <router-link to="">管理中心</router-link>
                    </li>
                    <li v-if="isAgent">
                        <router-link to="/agent_info">代理商平台</router-link>
                    </li>
                    <li v-if="isAdmin">
                        <router-link to="/admin_info"
                            >超级管理员平台</router-link
                        >
                    </li>
                    <li>
                        <span @click="showEditAdmin">管理员管理</span>
                    </li>
                </ul>
                <ul class="account-wrap">
                    <li>
                        <div class="" v-on:click="loadingOut">退出</div>
                    </li>
                </ul>
            </div>
        </Header>
        <Content>
            <Card class="page-component">
                <tables
                    ref="tables"
                    editable
                    search-place="top"
                    v-model="appData.content"
                    :columns="appData.title"
                    showPage
                    :total="pageData.total"
                    :current="pageData.page"
                    :page-size="appData.pageno"
                    show-total
                    show-elevator
                    showlayout
                    :loading="loading"
                >
                    <template slot="header">
                        <div class="search-area">
                            <Button
                                type="primary"
                                class="ant-btn mg-r-20"
                                @click="softData.isModal = true"
                            >
                                <Icon type="md-add" />添加应用
                            </Button>
                        </div>
                    </template>
                </tables>
            </Card>
        </Content>
        <Modal
            v-model="softData.isModal"
            title="设为样板"
            @on-ok="addSoft"
            @on-cancel=""
            :loading="softData.loading"
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="应用名称：">
                    <Input type="text" v-model="softData.name"></Input>
                </FormItem>
                <FormItem label="softID">
                    <Select
                        v-model="softData.softID"
                        placeholder="选择软件类型"
                    >
                        <Option v-for="item in softList" :value="item.id">{{
                            item.softname
                        }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

        <Modal
            v-model="isEdit"
            title="管理员设置"
            @on-ok="isEdit = false"
            @on-cancel=""
            width="1000"
        >
            <tables
                ref="tables"
                editable
                search-place="top"
                v-model="adminData.data"
                :columns="adminData.columns"
                showPage
                :total="editAdmin.total"
                :current="editAdmin.page"
                :page-size="pageno"
                show-total
                show-elevator
                @on-skippage="adminSkippage"
                showlayout
            >
                <template slot="header">
                    <div class="search-area">
                        <!-- v-on:click="editAdmin.isModal = true" -->

                        <Button
                            type="primary"
                            class="ant-btn mg-r-20"
                            @click="goeditAdmin"
                        >
                            <Icon type="md-add" />添加
                        </Button>
                        <Input
                            v-model="keyword"
                            placeholder="关键字"
                            @on-keyup.enter="getAdmin(keyword)"
                            clearable
                            class="ant-search-input mg-r-10"
                            style="width: 200px"
                        />
                        <Button
                            type="primary"
                            @click="getAdmin(keyword)"
                            icon="ios-search"
                            class="ant-search-btn"
                        ></Button>
                    </div>
                </template>
            </tables>
        </Modal>
        <Modal
            v-model="editPassword.isModal"
            title="修改密码"
            @on-ok="editPasswordData('editPassword')"
            @on-cancel=""
            :loading="editPassword.loading"
        >
            <Form
                ref="editPassword"
                :model="editPassword"
                :rules="passwordLine"
                label-position="left"
                :label-width="100"
            >
                <FormItem label="账号/手机号：">
                    <span>{{ editPassword.phone }}</span>
                </FormItem>
                <FormItem label="新密码：" prop="password">
                    <Input
                        type="password"
                        v-model="editPassword.password"
                    ></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="isPassword">
                    <Input
                        type="password"
                        v-model="editPassword.isPassword"
                    ></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="addManagerData.isModal" title="添加管理员" width="960">
            <addAdmin
                @successCallback="successCallback"
                @cancelCallback="cancelCallback"
            ></addAdmin>
            <p slot="footer"></p>
        </Modal>
    </Layout>
</template>
<script>
import welcome_logo from '@/assets/images/welcome_logo.png'
import applogo from '@/assets/images/welcome/applogo.png'
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
import Cookies from 'js-cookie';

import addAdmin from './home_manager/home_add'
export default {
    components: {
        Tables,
        Buttons,
        addAdmin
    },
    data () {
        return {
            softData: {
                name: "",
                isModal: false,
                softID: 0,
                loading: true
            },
            softList: [],
            loading: false,
            welcome_logo,
            applogo,
            selectData: [],
            tabActive: 'xcx',
            isAgent: 0,
            isAdmin: 0,
            pageData: {
                total: 0,
                page: 1,
                pageno: 10,
            },
            content: 2,
            wxAppName: '',
            picname: '',
            path: '/images/applogo.png',
            app_id: '',
            isModal: false,
            _index: 0,
            isUploadApp: false,
            maxWidth: 1200,

            mbData: {
                title: [
                    {
                        title: '网站图标',
                        key: "img"
                    },
                    {
                        name: '网站名称',
                        key: "name"
                    },
                    {
                        yumin: '网站域名',
                        key: "yumin"
                    },
                ],
                data: [
                    {

                    }
                ]
            },
            appData: {
                title: [
                    {
                        title: '应用图标',
                        key: 'img',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.logo || this.applogo,
                                    },
                                    style: {
                                        margin: '10px',
                                        width: '50px',
                                        height: '50px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params);
                                            this._index = params.row._index;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '应用名称',
                        key: 'name',
                        width: 250,
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
                                            this.show(params);
                                            this._index = params.row._index;
                                            console.log(params.row);
                                        }
                                    }
                                }, params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '所属软件',
                        align: 'center',
                        key: 'soft'
                    },
                    {
                        title: '版本',
                        align: 'center',
                        key: 'rolename'
                    },

                    {
                        title: '状态',
                        width: 100,
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {}, params.row.status == 1 ? '正常' : '关闭');
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'endtime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'opr',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        disabled: params.row.overdue == 1 ? true : false
                                    },
                                    style: {
                                        margin: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.routerPage(params.row)
                                        }
                                    }
                                }, '管理')
                            ]);
                        }
                    }
                ],
                content: []
            },

            addManagerData: {
                isModal: false
            },
            isEdit: false,
            pageno: 10,
            keyword: "",
            passwordLine: {
                password: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                isPassword: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
            },
            editAdmin: {
                isModal: false,
                searchPoptip: false,
                id: '',
                total: 0,
                page: 1,
                realname: '',
                mobile: '',
                password: '',
                isPassword: '',
                loading: true,
                body: []
            },
            adminLine: {
                realname: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                isPassword: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
            },
            editPassword: {
                isModal: false,
                loading: true,
                password: '',
                isPassword: '',
                id: '',
                phone: ''
            },
            adminData: {
                columns: [
                    { title: "管理员名称", key: "realname" },
                    {
                        title: "等级",
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: params.row.sort == 1 ? '#ed4014' : '#2d8cf0'
                                }
                            }, params.row.sort == 1 ? '高级管理员' : '普通管理员');
                        },
                        width: '120px'
                    },
                    {
                        title: "状态",
                        render: (h, params) => {
                            return h('div', [
                                h(Buttons, {
                                    props: {
                                        type: (params.row.yesno == 1 ? 'success' : 'error'),
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            var mode = params.row.yesno == 1 ? 'no' : 'ok';
                                            this.editManager(params.row, mode);
                                        }
                                    }
                                }, params.row.yesno == 1 ? '正常' : '关闭')
                            ]);
                        }
                    },
                    { title: "最近登录时间", key: "nowlogin" },
                    { title: "最近登录IP", key: "nowip" },
                    {
                        title: "操作",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editPassword.id = params.row.id;
                                            this.editPassword.phone = params.row.mobile;
                                            this.editPassword.isModal = true;
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: "确认删除",
                                                content: "确认删除该管理员吗，删除后，该管理员下的所有数据都会被删除",
                                                type: "warning",
                                                onOk: () => {
                                                    this.editManager(params.row, 'del');
                                                },
                                                onCancel: () => {
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                data: []
            },
        }
    },
    created: function () {
        window.document.title = '欢迎使用';
        this.getAppList();
        this.getSoftList();
        this.isAgentorAdmin();
    },
    methods: {
        getSoftList () {
            this.$http.request({
                method: "POST",
                url: "/api_home.php?action=soft_listof",
                params: {

                }
            }).then((res) => {
                this.softList = res.data.body || [];
                console.log(res.data);
            });
        },
        loadingOut () {
            var _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '是否退出登录？',
                onOk: () => {
                    _this.$http.post('/logout.php').then(function (response) {
                        if (response.data.status == 1) {
                            _this.$Message.info('退出成功');
                            window.location.href = 'http://a.richapps.cn/';
                        } else {

                        }
                    })
                        .catch(function (response) {
                            _this.$Notice.error({
                                title: '错误提示',
                                desc: response
                            });
                            _this.$Loading.error();
                        });

                },
                onCancel: () => {
                    _this.$Message.info('取消退出');
                }
            });

        },
        isAgentorAdmin: function () {
            var _this = this;
            var data = {
                action: 'check_isAgent'
            }
            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                _this.isAgent = response.data.isAgent;
                _this.$Loading.finish();
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
            var data = {
                action: 'check_isAdmin'
            }
            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                _this.isAdmin = response.data.isAdmin;
                _this.$Loading.finish();
            })
                .catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                    _this.$Loading.error();
                });
        },

        getAppList: function (page) {
            var _this = this;
            var data = {
                action: 'wxapp_listof',
                page: page || 1,
                pageno: 10,
                apptype: 0
            }

            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    var body = [];
                    _this.appData.content = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                } else if (response.data.status == 2) {
                    _this.$Modal.confirm({
                        title: '提示',
                        content: response.data.message,
                        onOk: function () {
                            window.location.href = 'http://a.richapps.cn/';
                        },
                        onCancel: function () {
                            window.location.href = 'http://a.richapps.cn/';
                        }
                    });
                }
                _this.$Loading.finish();
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });

        },
        routerPage (params) {
            Cookies.set("CookVueAppid", params.id);
            Cookies.set("CookRolecode", params.rolename);
            this.$router.push({
                name: "home"
            });
        },
        show: function (params) {
            if (params.row.logo) {
                var pic = params.row.logo.split("/");
                this.picname = pic[pic.length - 1];
            }
            this.isModal = !this.isModal;
            this.path = params.row.logo || '/images/applogo.png';
            this.wxAppName = params.row.name;
            this.$cookieStore.set("CookVueAppid", params.row.id);
            this.app_id = params.row.id;
            console.log(params.row);
        },
        addSoft () {
            if (this.softData.softID == 0) {
                this.softData.loading = false;
                this.$nextTick(() => {
                    this.softData.loading = true;
                });
                return this.$Message.warning("请选择软件类型");
            }
            this.$http.request({
                method: "POST",
                url: "/api_home.php?action=wxapp_add",
                params: {
                    appname: this.softData.name,
                    softID: this.softData.softID
                }
            }).then((res) => {
                this.softData = {
                    name: "",
                    isModal: false,
                    softID: 0,
                    loading: true
                }
                this.getAppList();
                console.log(res.data);
            });
        },
        editPasswordData (name) {
            var _this = this;
            var params = this.editPassword;
            this.$refs[name].validate((valid) => {
                console.log(valid);
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.$nextTick(() => {
                            this.editPassword.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }

                    var data = {
                        action: 'manager_password',
                        managerid: this.editPassword.id,
                        password: this.editPassword.password
                    };
                    _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.editPassword.isModal = false;
                        _this.editPassword.password = '';
                        _this.editPassword.isPassword = '';
                        _this.$Message.success("修改成功");
                        _this.$Loading.finish();
                    }).catch(function (response) {
                        console.log(response);
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.editPassword.loading = false;
                        _this.$nextTick(() => {
                            _this.editPassword.loading = true;
                        });
                    });
                } else {
                    _this.editPassword.loading = false;
                    _this.$nextTick(() => {
                        _this.editPassword.loading = true;
                    });
                }
            });
        },
        goeditAdmin () {
            // this.$router.push({
            //     name: "welcomeAdmin",
            // });
            this.addManagerData.isModal = true;
        },
        successCallback () {
            this.addManagerData.isModal = false;
            this.getAdmin();
        },
        cancelCallback () {
            this.addManagerData.isModal = false;
        },
        getAdmin: function (keyword) {
            var _this = this;
            var data = {
                action: 'manager_listof',
                pageno: 10,
                page: this.editAdmin.page,
                keyword: keyword
            };
            this.$Loading.start();
            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.adminData.data = response.data.body;
                    _this.editAdmin.total = Number(response.data.total);
                }
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
        editManager: function (params, mode) {
            var _this = this;
            var data = {
                action: 'manager_check',
                chooseID: params.id,
                editmode: mode
            };
            this.$Loading.start();
            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.getAdmin();
                }
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
        adminSkippage: function (page) {
            this.editAdmin.page = page;
            this.getAdmin();
        },
        showEditAdmin () {
            // this.editAdmin.id = params.row.id;
            this.isEdit = true;
            this.getAdmin();
        }
    }
}
</script>

<style type="text/css">
/******************顶部样式**********************/
#main-body {
    height: 100%;
}
.index-header {
    width: 100%;
    height: 70px;
    background-color: #333;
    color: #ddd;
    font-size: 14px;
}
/******************导航样式**********************/
.header-nav {
    width: 1200px;
    line-height: 70px;
    margin: 0 auto;
    overflow: hidden;
}
.header-nav .logo {
    float: left;
}
.header-nav .logo a {
    width: 200px;
    display: block;
}
.header-nav .nav-list,
.header-nav .account-wrap {
    overflow: hidden;
    zoom: 1;
}
.header-nav .nav-list {
    float: left;
}
.header-nav .nav-list li a {
    color: #ddd;
    display: block;
    width: 100%;
    height: 100%;
}
.header-nav .nav-list li.active a {
    color: #fff;
}
.header-nav .account-wrap {
    float: right;
}
.header-nav ul li {
    float: left;
    width: 100px;
    line-height: 70px;
    text-align: center;
    cursor: pointer;
}
.header-nav .nav-list li:hover a {
    color: #fff;
}
/******************中部样式**********************/
.wrp_tab {
    width: 100%;
    height: 46px;
    border-bottom: 1px solid #ddd;
}
.tab {
    width: 1200px;
    margin: 0 auto;
}
.tab_navs {
    overflow: hidden;
    zoom: 1;
}
.tab_navs li {
    line-height: 44px;
    float: left;
    text-align: center;
}
.tab_navs li a {
    margin-right: 45px;
    color: #818484;
    font-size: 15px;
    display: block;
}
.tab_navs li a:hover {
    border-bottom: 2px solid #2d8cf0;
    color: #2d8cf0;
}
.tab_navs li.active a {
    border-bottom: 2px solid #2d8cf0;
    color: #2d8cf0;
}
.data_box {
    width: 100%;
    overflow: auto;
    margin-top: 15px;
    padding-bottom: 20px;
}
.label_tab {
    line-height: 50px;
}
.data_content {
    margin-top: 10px;
}
.data_page {
    padding-top: 20px;
}
/******************angular-dialog弹窗**********************/
.rich-dialog {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
}
.rich-content {
    width: 450px;
    margin-left: -225px;
    margin-top: -175px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 5px;
    overflow: hidden;
}
.rich-title {
    height: 50px;
    line-height: 50px;
    color: #666;
    text-indent: 12px;
    font-size: 16px;
    background-color: #f0f0f0;
}
.collect-page-wrap {
    margin: 20px 0 0 0;
    padding-left: 35px;
    padding-bottom: 15px;
    line-height: 40px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
}
.collect-page-wrap label {
    display: inline-block;
    width: 120px;
    text-align: right;
    color: #888;
    vertical-align: middle;
}
.collect-page-wrap .change-img-wrap {
    margin-bottom: 10px;
    vertical-align: text-top;
}
.change-img-wrap.cover-wrap {
    width: 120px;
}
.change-img-wrap {
    position: relative;
    display: inline-block;
    width: 150px;
    height: 120px;
    vertical-align: top;
    cursor: pointer;
    overflow: hidden;
}
.change-img-wrap img {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    display: block;
}
.change-img-wrap .text {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #fff;
    font-size: 14px;
}
.text {
    max-width: 100%;
    min-height: 10px;
    line-height: 1.4em;
    white-space: pre-wrap;
    word-break: break-all;
    height: auto !important;
}
.rich-submit-btn {
    display: block;
    width: 150px;
    line-height: 30px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 15px;
    margin-bottom: 15px;
    text-align: center;
    color: #fff;
    background-color: #2c91fb;
    cursor: pointer;
    border-radius: 5px;
}
.add-collect-title {
    width: 200px;
}
/****************************************/
#welcome-wrapper {
    background-color: #eff0f5;
    width: 100%;
    height: 100%;
}

.page-component {
    width: 1200px;
    height: calc(100% - 70px);
    margin: 20px auto 0px;
}
</style>