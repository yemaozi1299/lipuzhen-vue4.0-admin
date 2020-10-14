<template>
    <Card>
        <p slot="title">企业管理</p>
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

        <Modal
            v-model="isAddCompany"
            title="添加企业"
            @on-ok="addCompany('addCompanyData')"
            @on-cancel=""
            :loading="addCompanyData.loading"
        >
            <Form
                ref="addCompanyData"
                :model="addCompanyData"
                :rules="ruleInline"
                label-position="left"
                :label-width="100"
            >
                <FormItem label="企业名称：" prop="name">
                    <Input type="text" v-model="addCompanyData.name"></Input>
                </FormItem>
                <FormItem label="管理名姓名：" prop="realname">
                    <Input
                        type="text"
                        v-model="addCompanyData.realname"
                    ></Input>
                </FormItem>
                <FormItem label="手机：" prop="mobile">
                    <Input type="text" v-model="addCompanyData.mobile"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input
                        type="password"
                        v-model="addCompanyData.password"
                    ></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="isPassword">
                    <Input
                        type="password"
                        v-model="addCompanyData.isPassword"
                    ></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal
            v-model="isEdit"
            title="管理员设置"
            @on-ok="addAdmin"
            @on-cancel=""
            width="1000"
        >
            <div class="search-area">
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
            <Tables
                :columns="adminData.columns"
                v-model="adminData.data"
            ></Tables>
            <Page
                :total="editAdmin.total"
                :current="editAdmin.page"
                show-total
                show-elevator
                @on-change="adminSkippage"
                style="margin-top: 20px"
            ></Page>
        </Modal>
        <Modal
            v-model="editAdmin.isModal"
            title="添加管理员"
            @on-ok="addManager('editAdmin')"
            @on-cancel=""
            :loading="editAdmin.loading"
        >
            <Form
                ref="editAdmin"
                :model="editAdmin"
                :rules="adminLine"
                label-position="left"
                :label-width="100"
            >
                <FormItem label="管理名姓名：" prop="realname">
                    <Input type="text" v-model="editAdmin.realname"></Input>
                </FormItem>
                <FormItem label="手机：" prop="mobile">
                    <Input type="text" v-model="editAdmin.mobile"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input type="password" v-model="editAdmin.password"></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="isPassword">
                    <Input
                        type="password"
                        v-model="editAdmin.isPassword"
                    ></Input>
                </FormItem>
            </Form>
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
                <FormItem label="账号/手机号：" prop="">
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

        <Modal v-model="isModal" title="添加应用-选择样板" width="1080">
            <Card dis-hover>
                <templateList
                    :isAdd="isAdd"
                    @successCallback="selectApp"
                ></templateList>
            </Card>
        </Modal>

        <Modal
            v-model="addAppData.isModal"
            title="添加应用"
            @on-ok="addPriseApp"
        >
            <Form label-position="right" :label-width="100">
                <FormItem label="应用名称：" prop="">
                    <Input
                        type="text"
                        style="width: 200px"
                        v-model="addAppData.name"
                    ></Input>
                </FormItem>
                <template v-if="addAppData.example_appid">
                    <FormItem label="软件型号：" prop="">
                        <!-- <Input
                            disabled
                            :value="addAppData.rolename"
                            style="width: 200px"
                        ></Input> -->
                        {{ addAppData.rolename }}
                    </FormItem>
                </template>
                <template v-else>
                    <FormItem label="软件类型：" prop="">
                        <Select style="width: 200px" v-model="selectedSoft">
                            <Option
                                :value="item.id"
                                v-for="item in softList"
                                :key="item.id"
                                >{{ item.softname }}</Option
                            >
                        </Select>
                    </FormItem>
                    <FormItem label="软件型号：" prop="">
                        <Select
                            style="width: 200px"
                            v-model="addAppData.rolecode"
                        >
                            <Option
                                :value="item.id"
                                v-for="item in pariceList"
                                :key="item.id"
                                >{{ item.rolename }}</Option
                            >
                        </Select>
                    </FormItem>
                </template>
            </Form>
        </Modal>
    </Card>
</template>
<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
import templateList from '@/views/agent-component/components/templateList.vue';
export default {
    components: {
        Tables,
        Buttons,
        templateList
    },
    data: function () {
        return {
            isAdd: true,
            selectedSoft: "",
            softList: [],

            loading: false,
            pageno: 10,
            pageNum: 1,
            moves: window.vueAppUrl,
            appList: [],
            searching: false,
            isEdit: false,
            isModal: false,
            isAddCompany: false,
            searchPoptip: false,
            searchAppList: {
                searchPoptip: false,
                search: false,
                keyword: ''
            },
            keyword: '',
            page: 1,
            total: 0,
            pariceList: {},
            pageData: {
                total: 0,
                page: 1,
            },
            editPassword: {
                isModal: false,
                loading: false,
                password: '',
                isPassword: '',
                id: '',
                phone: ''
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
                                h('Button', {
                                    props: {
                                        type: (params.row.yesno == 1 ? 'success' : 'error'),
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#FFF"
                                    },
                                    on: {
                                        click: () => {
                                            var mode = params.row.yesno == 1 ? 'no' : 'ok';
                                            this.editManager(params.row.id, mode);
                                            // console.log(params.row);
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
                                            this.editPassword.user = params.row.user;
                                            this.editPassword.id = params.row.id;
                                            this.editPassword.phone = params.row.mobile;
                                            this.editPassword.isModal = true;
                                            console.log(params.row);
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
                                            this.editManager(params.row.id, 'del');
                                            console.log(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                data: []
            },

            addCompanyData: {
                name: '',
                realname: '',
                mobile: '',
                password: '',
                isPassword: '',
                loading: true
            },
            ruleInline: {
                name: [
                    { required: true, message: '必填', }
                ],
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
            passwordLine: {
                password: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                isPassword: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
            },
            addAppData: {
                isModal: false,
                user: '',
                name: '',
                rolecode: '',
                example_appid: ''
            },

            infoData: {
                columns: [
                    {
                        title: '企业名称',
                        key: 'name',

                    },
                    {
                        title: '管理员',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        color: '#39f',
                                    },
                                    on: {
                                        click: () => {
                                            this.editAdmin.id = params.row.id;
                                            this.isEdit = true;
                                            this.getAdmin();
                                            console.log(params.row);
                                        }
                                    }
                                }, '设置')
                            ]);
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', {}, params.row.status == 1 ? '正常' : '关闭');
                        }
                    },
                    {
                        title: '应用数量',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        color: '#39f',
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'agent_details',
                                                query: {
                                                    user: params.row.id
                                                }
                                            });
                                            console.log(params.row);
                                        }
                                    }
                                }, params.row.appcount)
                            ]);
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'regtime'
                    },
                    {
                        title: '添加应用',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.isModal = true;
                                            this.addAppData.user = params.row.id;
                                            console.log(params.row);
                                        }
                                    }
                                }, '添加应用')
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', [
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
                                            console.log(params.row);
                                            var _this = this;
                                            this.$Modal.confirm({
                                                content: '确定要删除该企业吗？删除后数据无法恢复',
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
                        width: '90px'

                    },
                ],
                data: [

                ]
            }
        }
    },
    watch: {
        selectedSoft (val) {
            this.getAgentprice();
        },
    },
    created: function () {
        this.get();
        // this.getAgentprice();
        this.getSoftList();
        // this.addPriseApp();
    },
    methods: {
        getSoftList () {
            this.$http.request({
                url: "/api_agent.php?action=soft_listof",
                params: {
                }
            }).then((res) => {
                this.softList = res.data.body || [];
                console.log(res.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        imageLoad: function (e) {
            var $this = e.target;
            $this.setAttribute('src', $this.getAttribute('data-image'));
            console.log('1111');
        },
        editPasswordData: function (name) {
            var _this = this;
            var params = this.editPassword;

            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.editPassword.loading = false;
                        this.$nextTick(() => {
                            this.editPassword.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }

                    var data = {
                        action: 'manager_password',
                        user: this.editPassword.user,
                        managerid: this.editPassword.id,
                        password: this.editPassword.password
                    };
                    console.log(data);
                    this.$Loading.start();
                    _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.editPassword.loading = false;
                        if (response.data.status == 1) {
                            _this.editPassword.password = '';
                            _this.editPassword.isPassword = '';
                            _this.$Message.success("修改成功");
                        } else {
                            _this.$nextTick(() => {
                                _this.editPassword.loading = true;
                            });
                            _this.$Message.error(response.data.message);
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
                } else {
                    this.editAdmin.loading = false;
                    this.$nextTick(() => {
                        this.editAdmin.loading = true;
                    });
                }
            })
        },

        delApp: function (params) {
            var _this = this;
            var json = {
                action: 'company_del',
                user: params.id,
            };
            console.log(json);
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(json)).then(function (response) {
                // console.log(response);
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
                } else {
                    _this.$Message.warning(response.data.message);
                }
                // console.log(response);
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
        get: function (keyword) {
            var _this = this;
            keyword ? this.pageData.page = 1 : '';
            var data = {
                action: 'companylistof',
                keyword: keyword,
                pageno: 10,
                page: this.pageData.page,
            };
            _this.searching = keyword ? true : false;
            _this.infoData.data = [];
            this.$Loading.start();
            // console.log(data);
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body
                    _this.pageData.total = Number(response.data.total);
                } else {
                    _this.$Message.info(response.data.message);
                }
                // 
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

        getSearchAppList: function () {
            var _this = this;
            var data = {
                action: 'example_applist',
                page: 1,
                pageno: 30,
                keyword: this.searchAppList.keyword
            };
            console.log(data);
            this.searchAppList.keyword ? this.searchAppList.search = true : this.searchAppList.search = false;
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                // console.log(response.data);
                if (response.data.body == null || response.data.body.length < 30) {
                    document.getElementById('scrollList').classList.add("js-on-more");
                } else {
                    document.getElementById('scrollList') && document.getElementById('scrollList').classList.remove("js-on-more");
                }
                if (response.data.status == 1) {
                    _this.appList = response.data.body;
                    _this.total = response.data.total;
                } else {
                    _this.$Message.info(response.data.message);
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
        cancelSearch: function () {
            this.pageNum = 1;
            this.searchAppList.keyword = '';
            this.getSearchAppList();
        },
        addPriseApp: function () {
            var _this = this;
            if (!this.addAppData.name) {
                return this.$Message.warning('请输入小程序名称');
            }
            var data = {
                action: 'app_add',
                appid: this.vueAppid,
                user: this.addAppData.user,
                app_name: this.addAppData.name,
                roleID: this.addAppData.rolecode,
                example_appid: this.addAppData.example_appid
            };
            this.loading = true;
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
                    _this.addAppData.name = '';
                    _this.addAppData.example_appid = '',
                        _this.isModal = false;
                    _this.addAppData.isModal = false;
                } else {
                    _this.$Message.warning(response.data.message);
                }
                _this.loading = false;
                // console.log(response.data);
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
        addCompany: function (name) {
            var _this = this;
            var params = this.addCompanyData;

            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.addCompanyData.loading = false;
                        this.$nextTick(() => {
                            this.addCompanyData.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }
                    var data = {
                        action: 'company_add',
                        name: params.name,
                        realname: params.realname,
                        mobile: params.mobile,
                        password: params.password
                    };
                    _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.addCompanyData.loading = false;
                        _this.get();
                        _this.addCompanyData.name = '';
                        _this.addCompanyData.password = '';
                        _this.isAddCompany = false;
                    }).catch(function (response) {
                        _this.addCompanyData.loading = false;
                        _this.$nextTick(() => {
                            _this.addCompanyData.loading = true;
                        });
                        console.log(response);
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    });
                } else {
                    this.addCompanyData.loading = false;
                    this.$nextTick(() => {
                        this.addCompanyData.loading = true;
                    });
                }
            })
        },

        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        },
        adminSkippage: function (page) {
            this.editAdmin.page = page;
            this.getAdmin();
        },
        getAgentprice: function () {
            var _this = this;
            var data = {
                action: 'role_listof',
                softID: this.selectedSoft
            };
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                _this.pariceList = response.data.body;
                console.log(response.data);
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getAdmin: function (keyword) {
            var _this = this;
            var data = {
                action: 'manager_listof',
                user: this.editAdmin.id,
                pageno: 10,
                page: this.editAdmin.page,
                keyword: keyword
            };
            this.$Loading.start();
            // console.log(data);
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.adminData.data = response.data.body;
                    _this.adminData.total = Number(response.data.total);
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
        addAdmin: function () {
            var _this = this;
            var data = {
                action: 'agentprice',
                appid: this.vueAppid,
            };
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.pariceList = response.data.body;
                }
                // console.log(response.data);
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
        addManager: function (name) {
            var _this = this;
            var params = this.editAdmin;

            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.editAdmin.loading = false;
                        this.$nextTick(() => {
                            this.editAdmin.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }
                    var data = {
                        action: 'manager_add',
                        realname: params.realname,
                        mobile: params.mobile,
                        password: params.password,
                        user: this.editAdmin.id
                    };
                    this.$Loading.start();
                    // console.log(data);
                    _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.editAdmin.loading = false;
                        if (response.data.status == 1) {
                            _this.getAdmin();
                            _this.editAdmin.name = '';
                            _this.editAdmin.password = '';
                            _this.editAdmin.isModal = false;
                        } else {
                            _this.$nextTick(() => {
                                _this.editAdmin.loading = true;
                            });
                            _this.$Message.error(response.data.message);
                        }
                        // console.log(response.data);
                        _this.$Loading.finish();
                    }).catch(function (response) {
                        console.log(response);
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.$Loading.error();
                    });
                } else {
                    _this.editPassword.loading = false;
                    _this.$nextTick(() => {
                        _this.editPassword.loading = true;
                    });
                }
            })
        },
        editManager: function (id, mode) {
            var _this = this;
            var data = {
                action: 'manager_check',
                user: this.editAdmin.id,
                chooseID: id,
                editmode: mode
            };
            this.$Loading.start();
            // console.log(data);
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.pariceList = response.data.body;
                    _this.getAdmin();
                }
                // console.log(response.data);
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
        selectApp: function (item) {
            if (item.id == '') {
                this.addAppData.isModal = true;
                this.addAppData.example_appid = '';
                this.addAppData.name = '我的小程序';
            } else {
                this.addAppData.isModal = true;
                this.addAppData.example_appid = item.id;
                this.addAppData.name = item.name;
                // this.addPriseApp();
            }

        },
        previewApp: function (params) {
            window.open('/appeditor/preview.php?appid=' + params.fromappid);
        },
        goeditAdmin () {
            this.$router.push({
                name: "agent_add",
                params: {
                    page: 1
                },
                query: {
                    userid: this.editAdmin.id
                }
            });
        }
    }
}
</script>
<style type="text/css">
.label-div span {
    display: inline-block;
    width: 80px;
}
</style>
