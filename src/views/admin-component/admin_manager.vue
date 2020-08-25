<template>
    <Card>
        <p slot="title">超级管理员设置</p>
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
                        style="width: 200px;"
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
            title="添加管理员"
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
                <FormItem label="管理员名称：" prop="realname">
                    <Input
                        type="text"
                        v-model="addCompanyData.realname"
                    ></Input>
                </FormItem>
                <FormItem label="手机号码：" prop="mobile">
                    <Input type="text" v-model="addCompanyData.mobile"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input
                        type="text"
                        v-model="addCompanyData.password"
                    ></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="isPassword">
                    <Input
                        type="text"
                        v-model="addCompanyData.isPassword"
                    ></Input>
                </FormItem>
            </Form>
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
            searchPoptip: false,
            keyword: '',
            searching: false,
            isAddCompany: false,
            infoData: {
                columns: [
                    {
                        title: '管理员名称',
                        key: 'realname',
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                    },
                    {
                        title: '等级',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: params.row.sort == 1 ? 'red' : ''
                                }
                            }, params.row.sort == 1 ? '高级管理员' : '普通管理员');
                        }
                    },
                    {
                        title: '状态',
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
                                            var move = params.row.yesno == 1 ? 'no' : 'ok';
                                            this.editManager(params.row, move);
                                            console.log(params.row);
                                        }
                                    }
                                }, params.row.yesno == 1 ? '正常' : '关闭')
                            ]);
                        }
                    },
                    {
                        title: '最近登录时间',
                        key: 'nowlogin',
                    },
                    {
                        title: '最近登录IP',
                        key: 'nowip',
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
                                        color: "#FFF"
                                    },
                                    on: {
                                        click: () => {
                                            this.editManager(params.row, 'del');
                                            console.log(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: []
            },
            addCompanyData: {
                realname: '',
                mobile: '',
                password: '',
                isPassword: '',
                loading: true
            },
            ruleInline: {
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
            pageData: {
                total: 0,
                page: 1,
            },
        }
    },
    created: function () {
        this.get();
        // this.getAgentprice();
        // this.addPriseApp();
    },
    methods: {
        get: function (keyword) {
            var _this = this;
            keyword ? this.pageData.page = 1 : '';
            var data = {
                action: 'supermanager_listof',
                keyword: keyword || '',
                pageno: 10,
                page: this.pageData.page,
            }
            _this.searching = keyword ? true : false;
            _this.infoData.data = [];
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
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
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
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
                        action: 'supermanager_add',
                        realname: params.realname,
                        mobile: params.mobile,
                        password: params.password
                    };
                    this.$Loading.start();

                    _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.addCompanyData.loading = false;
                        if (response.data.status == 1) {
                            _this.get();
                            _this.addCompanyData.name = '';
                            _this.addCompanyData.password = '';
                            _this.isAddCompany = false;
                        } else {
                            _this.$nextTick(() => {
                                _this.addCompanyData.loading = true;
                            });
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
                } else {
                    this.addCompanyData.loading = false;
                    this.$nextTick(() => {
                        this.addCompanyData.loading = true;
                    });
                }
            })
        },
        editManager: function (params, move) {
            var _this = this;
            var data = {
                action: 'supermanager_check',
                chooseID: params.id,
                editmode: move
            };
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    if (move == 'del') {
                        _this.infoData.data.splice(params._index, 1);
                    } else {
                        params.yesno = params.yesno == 'no' ? 'ok' : 'no';
                    }
                    // _this.getAdmin();
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