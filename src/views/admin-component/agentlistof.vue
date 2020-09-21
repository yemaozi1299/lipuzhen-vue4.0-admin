<template>
    <Card>
        <p slot="title">代理商管理</p>
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

        <Modal
            v-model="isAddCompany"
            title="添加代理商"
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
                <FormItem label="代理商名称：" prop="name">
                    <Input type="text" v-model="addCompanyData.name"></Input>
                </FormItem>
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
        <Modal
            v-model="money_edit.isModal"
            title="操作"
            @on-ok="moneyEdit"
            @on-cancel=""
        >
            <label style="display: block; margin-bottom: 10px">
                <span>金额：</span>
                <Input
                    type="text"
                    style="width: 200px"
                    v-model="money_edit.money"
                ></Input>
            </label>

            <label style="display: block">
                <span>方向：</span>
                <Select style="width: 200px" v-model="money_edit.io">
                    <Option value="+">入账</Option>
                    <Option value="-">扣款</Option>
                </Select>
            </label>
            <label style="display: block; margin-top: 20px">
                <span>备注：</span>
                <Input
                    type="text"
                    v-model="money_edit.bei"
                    style="width: 200px"
                ></Input>
            </label>
        </Modal>
        <Modal
            v-model="agent_edit_data.isModal"
            title="修改代理商"
            @on-ok="agent_edit"
            @on-cancel=""
        >
            <div>
                <span style="width: 80px; display: inline-block"
                    >代理商等级:</span
                >
                <Select
                    v-model="agent_edit_data.agentjbcode"
                    style="width: 200px"
                >
                    <!-- <Option v-for="item in agent_edit_data.body" :value="item.rolecode" :key="item.rolecode">{{ item.rolename }}</Option>
	                高级代理 -> 门店级代理
	                黄金代理 -> 区县级代理
	                白金代理 -> 市级代理
	                钻石代理 -> 省级代理 -->

                    <Option
                        :value="index"
                        v-for="(item, index) in jibieList"
                        :key="index"
                        >{{ item }}</Option
                    >
                </Select>
            </div>
            <div style="margin-top: 20px">
                <span style="width: 80px; display: inline-block">地区:</span>
                <Input
                    type="text"
                    v-model="agent_edit_data.area"
                    style="width: 200px"
                ></Input>
            </div>
            <div style="margin-top: 20px">
                <span style="width: 80px; display: inline-block"
                    >开始时间:</span
                >
                <DatePicker
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 200px"
                    format="yyyy-MM-dd HH:mm:ss"
                    @on-change="start_date"
                    :value="agent_edit_data.startdate"
                ></DatePicker>
            </div>
            <div style="margin-top: 20px">
                <span style="width: 80px; display: inline-block"
                    >结束时间:</span
                >
                <DatePicker
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 200px"
                    format="yyyy-MM-dd HH:mm:ss"
                    @on-change="end_date"
                    :value="agent_edit_data.enddate"
                ></DatePicker>
            </div>
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
            loading: false,
            pageno: 10,
            jibieList: {},
            searchPoptip: false,
            keyword: '',
            isAddCompany: false,
            searching: false,
            money_edit: {
                isModal: false,
                money: 0,
                io: '',
                bei: '',
                appid: ''
            },
            agent_edit_data: {
                isModal: false,
                companyid: '',
                jibiecode: '',
                startdate: '',
                enddate: '',
                starttime: '',
                endtime: '',
                area: '',
                body: []
            },
            infoData: {
                columns: [
                    {
                        title: '代理商名称',
                        key: 'name',
                        width: 120
                    },
                    {
                        title: '代理级别',
                        key: 'agentjb',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '余额',
                        key: 'balance',
                        width: 70,
                        align: 'center',
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
                                            // this.companyStatus(params.row);
                                        }
                                    }
                                }, params.row.status == 1 ? '正常' : '关闭')
                            ]);
                        },
                        width: "70px",
                        align: 'center',
                    },
                    {
                        title: '地区',
                        key: 'area',
                        width: 70
                    },
                    {
                        title: '开始时间',
                        key: 'starttime',
                        width: 170
                    },
                    {
                        title: '结束时间',
                        key: 'endtime',
                        width: '160px'
                    },
                    // {
                    // 	title: 'IP',
                    //  key: 'ip',
                    // },
                    {
                        title: '企业数量',
                        key: 'haveCompany',
                        align: 'center',
                    },
                    {
                        title: '应用数量',
                        key: 'haveAPP',
                        align: 'center',
                    },

                    {
                        title: '操作',
                        fixed: 'right',
                        width: 230,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#FFF",
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            var data = this.agent_edit_data;

                                            data.isModal = true;
                                            data.agentjbcode = params.row.agentjbcode;
                                            data.companyid = params.row.user;
                                            data.startdate = params.row.starttime;
                                            data.enddate = params.row.endtime;
                                            data.area = params.row.area;
                                            this.agent_edit_data = data;
                                            console.log(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#FFF",
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            // console.log(params.row)
                                            this.money_edit.appid = params.row.user;
                                            this.money_edit.isModal = true;
                                        }
                                    }
                                }, '财务'),
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
                                            var _this = this;
                                            this.$Modal.confirm({
                                                content: '确定要删除吗？',
                                                cancelText: '取消',
                                                onOk: function () {
                                                    _this.agentDel(params.row);
                                                },
                                                onCancel: function () {
                                                }
                                            });

                                            // console.log(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        },
                    }
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
        // this.getAgentJibie();
        // this.getRolecode();
        // this.getAgentprice();
        // this.addPriseApp();
    },
    methods: {
        get: function (keyword) {
            var _this = this;
            keyword ? this.pageData.page = 1 : '';
            var data = {
                action: 'agentlistof',
                keyword: keyword || '',
                pageno: 10,
                page: this.pageData.page,
            }
            _this.searching = keyword ? true : false;
            _this.infoData.data = [];
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
                    desc: response
                });
                _this.$Loading.error();
            });
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        },
        agentDel: function (params) {
            var _this = this;
            var data = {
                action: 'agent_del',
                id: params.user
            }
            // console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
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
        moneyEdit: function () {
            var _this = this;
            var params = this.money_edit;
            var data = {
                action: 'money_edit',
                agentid: params.appid,
                money: params.money,
                io: params.io,
                memo: params.bei
            }
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
                    _this.$Message.info(response.data.message);
                } else {
                    _this.$Message.info(response.data.message);
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
        agent_edit: function () {
            var _this = this;
            var params = this.agent_edit_data;
            var data = {
                action: 'agent_edit',
                companyid: params.companyid,
                jibiecode: params.agentjbcode,
                starttime: params.startdate + ' ' + params.starttime,
                endtime: params.enddate + ' ' + (params.endtime),
                area: params.area
            }
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
                    // _this.infoData.data[params._index].balance += params.model;
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
        start_date: function (val) {
            this.agent_edit_data.startdate = val
        },
        end_date: function (val) {
            this.agent_edit_data.enddate = val
        },
        getAgentJibie: function () {
            var _this = this;
            var data = {
                action: 'agent_jb',
            }
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                _this.jibieList = response.data;
                console.log(response);
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
        }
    }

}
</script>