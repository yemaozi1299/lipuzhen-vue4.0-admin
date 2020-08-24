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
            <template slot="sider"></template>
            <template slot="footer"></template>
        </tables>



		
	    <Modal
	        v-model="isAddCompany"
	        title="添加企业"
	        @on-ok="addCompany('addCompanyData')"
	        @on-cancel=""
	        :loading="addCompanyData.loading">
	        <Form ref="addCompanyData" :model="addCompanyData" :rules="ruleInline" label-position="left" :label-width="100">
	        	<FormItem label="企业名称：" prop="name">
	        		<Input type="text" v-model="addCompanyData.name"></Input>
	        	</FormItem>
	        	<FormItem label="管理名姓名：" prop="realname">
	        		<Input type="text" v-model="addCompanyData.realname"></Input>
	        	</FormItem>
	        	<FormItem label="手机：" prop="mobile">
	        		<Input type="text" v-model="addCompanyData.mobile"></Input>
	        	</FormItem>
	        	<FormItem label="密码：" prop="password">
	        		<Input type="password" v-model="addCompanyData.password"></Input>
	        	</FormItem>
	        	<FormItem label="确认密码：" prop="isPassword">
	        		<Input type="password" v-model="addCompanyData.isPassword"></Input>
	        	</FormItem>
	        </Form>
	    </Modal>
	    <Modal
	        v-model="isEdit"
	        title="管理员设置"
	        @on-ok="addAdmin"
	        @on-cancel=""
	        width="1000">
	        <div class="info-table-add">
				<Button type="primary" style="margin-right:20px;"icon="plus" shape="circle" v-on:click="editAdmin.isModal = true"> 添加 </Button>
				<Poptip placement="left" width="300"  v-model="editAdmin.searchPoptip">
				    <Button type="info" shape="circle" icon="ios-search">搜索</Button>
				    <div class="api" slot="content">
				        <Input v-model="keyword" placeholder="关键字" style="width: 200px;" @keyup.enter="getAdmin(keyword)"></Input>
				        <Button type="primary" shape="circle" icon="ios-search" @click="getAdmin(keyword)"></Button>
				    </div>
				</Poptip>
			</div>
	        <Table :columns="adminData.columns" :data="adminData.data" style="" :border="true"></Table>
	        <Page :total="editAdmin.total" :current="editAdmin.page" show-total show-elevator @on-change="adminSkippage" style="margin-top:20px"></Page>
	    </Modal>
		<Modal
	        v-model="editAdmin.isModal"
	        title="添加管理员"
	        @on-ok="addManager('editAdmin')"
	        @on-cancel=""
	        :loading="editAdmin.loading">
	        <Form ref="editAdmin" :model="editAdmin" :rules="adminLine" label-position="left" :label-width="100">
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
	        		<Input type="password" v-model="editAdmin.isPassword"></Input>
	        	</FormItem>
	        </Form>
	    </Modal>
	    <Modal
	        v-model="editPassword.isModal"
	        title="修改密码"
	        @on-ok="editPasswordData('editPassword')"
	        :loading="editPassword.loading">
	        <Form ref="editPassword" :model="editPassword" :rules="passwordLine" label-position="left" :label-width="100">
				<FormItem label="账号/手机号：" prop="">
	        		<span>{{editPassword.phone}}</span>
	        	</FormItem>
	        	<FormItem label="新密码：" prop="password">
	        		<Input type="password" v-model="editPassword.password"></Input>
	        	</FormItem>
	        	<FormItem label="确认密码：" prop="isPassword">
	        		<Input type="password" v-model="editPassword.isPassword"></Input>
	        	</FormItem>
	        </Form>
	    </Modal>
	    <Modal
	        v-model="agentEdit.isModal"
	        title="成为代理商"
	        @on-ok="enterUpgrade">
	        <div>
	        	<span style="width:80px;display:inline-block">代理商等级:</span>
		        <Select v-model="agentEdit.value" style="width:200px">
	                <Option v-for="item in agentEdit.body" :value="item.code" :key="item.value">{{ item.name }}</Option>
	            </Select>
	        </div>
	        <div style="margin-top:20px">
	        	<span style="width:80px;display:inline-block">地区:</span>
		        <Input type="text" v-model="agentEdit.area" style="width:200px"/>
	        </div>
	        <div style="margin-top:20px">
	        	<span style="width:80px;display:inline-block">开始时间:</span>
		        <DatePicker type="date" placeholder="请选择日期" style="width: 200px" format="yyyy-MM-dd" @on-change="start_time"></DatePicker>
		        <TimePicker type="time" placeholder="Select time" style="width: 168px" v-model="agentEdit.start_date"></TimePicker>
	        </div>
	        <div style="margin-top:20px">
	        	<span style="width:80px;display:inline-block">结束时间:</span>
		        <DatePicker type="date" placeholder="请选择日期" style="width: 200px" format="yyyy-MM-dd" @on-change="end_time"></DatePicker>
		        <TimePicker type="time" placeholder="Select time" style="width: 168px" v-model="agentEdit.end_date"></TimePicker>
	        </div>
	    </Modal>


		<Modal
	        v-model="isModal"
	        title="添加应用"
			width="860"
	        @on-ok="enterUpgrade">
			<Layout class="layout-wrapper">
				<Header class="header-wrapper">
                    <div class="search-area">
                        <Input
                            v-model="searchAppList.keyword"
                            placeholder="关键字"
                            @on-keyup.enter="getSearchAppList"
                            clearable
                            class="ant-search-input mg-r-10"
                            style="width: 200px;"
                        />
                        <Button
                            type="primary"
                            @click="getSearchAppList"
                            icon="ios-search"
                            class="ant-search-btn"
                        ></Button>
                    </div>
                </Header>
				<Content>
					<ul class="tpl-container" @scroll='getGroundList' id="enterScrollList" style="height: calc(100% - 145px);">
	    				<li @click="selectApp({id:''})" style="cursor:pointer">
	    					<div class="cover-null" style="border:1px solid #bbb">
								<Icon type="plus"></Icon>
	    					</div>
	    					<p class="name">空白模板</p>
	    				</li>
	    				<li v-for="item in appList">
	    					<img class="cover" style="width:100%;height: auto;" :src="moves + '/images/loading-animate.gif'" v-lazy="item.coverUrl">
	    					<p class="name">{{item.name}}</p>
	    					<div class="code-mask">
	    						<div class="rolename">{{item.rolename}}</div>
	    						<img class="logo" alt="" :src="item.logo">
	    						<span class="select-btn use-btn" @click="selectApp(item)">使用</span>
	    						<span class="select-btn js-preview-btn" @click="previewApp(item)">预览</span>
	    					</div>
	    				</li>
	    				<div class="list-no-more">没有更多数据了</div>
        				<div class="list-loading" v-show="scrollList" style="opacity:0.5;cursor: default;"><i class="ivu-load-loop ivu-icon ivu-icon-load-c"></i> Loading...</div>
	    			</ul>
				</Content>
				
			</Layout>
		</Modal>

	    
	    
	    <div class="angular-dialog">
	    	<div class="add-collect-dialog rich-dialog add-example-dialog" v-if="addAppData.isModal">
	    		<div class="rich-content" style="width:400px;height:232px;margin-top: -126px;margin-left: -200px;">
	    			<header class="rich-title"><span class="rich-title-content">添加应用</span><i class="icon-cross" v-on:click="addAppData.isModal = false">×</i></header>
	    			<ul class="collect-page-wrap">
						<li>
							<label for="">应用名称：</label>
							<input type="text" style="width:200px;" v-model="addAppData.name"></input>
						</li>
						<li>
							<label for="">应用型号：</label>
							<Select style="width:200px;" v-model="addAppData.rolecode">
								<Option :value="item.rolecode" v-for="item in pariceList" :key="item.rolecode">{{item.rolename}}</Option>
							</Select>
						</li>
					</ul>
					<span class="rich-submit-btn" @click="addPriseApp">确定</span>
	    		</div>
	    	</div>
	    </div>
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
            scrollList: false,
            pageNum: 1,
            total: 1,
            page: 1,
            pageno: 10,
            moves: window.vueAppUrl,
            appList: [],
            isEdit: false,
            isModal: false,
            isAddCompany: false,
            searchPoptip: false,
            searching: false,
            loading: false,
            keyword: '',
            pariceList: {},
            pageData: {
                total: 0,
                page: 1,
            },
            searchAppList: {
                searchPoptip: false,
                search: false,
                keyword: ''
            },
            agentEdit: {
                isModal: false,
                id: '',
                value: 'gj',
                area: '',
                start_time: '',
                end_time: '',
                start_date: '',
                end_date: '',
                body: []
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
            addCompanyData: {
                name: '',
                realname: '',
                mobile: '',
                password: '',
                isPassword: '',
                loading: true
            },
            adminData: {
                columns: [
                    { title: "管理员名称", key: "realname" },
                    {
                        title: "等级",
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: 'red'
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
                                    style: {
                                        color: "#FFF"
                                    },
                                    on: {
                                        click: () => {
                                            var mode = params.row.yesno == 1 ? 'no' : 'ok';
                                            this.editManager(params.row, mode);
                                            console.log(params.row);
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
                                        type: 'warning',
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
                                            this.editManager(params.row, 'del');
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
            ruleInline: {
                name: [
                    { required: true, message: '必填', trigger: 'blur' }
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
                        align: 'center',
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
                        },
                        width: '90px'
                    },
                    {
                        title: '所属代理商',
                        key: 'agentname',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', {}, params.row.status == 1 ? '正常' : '关闭');
                        },
                        width: '90px'
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
                                                path: '/admin_computer',
                                                query: {
                                                    user: params.row.id
                                                }
                                            });
                                            console.log(params.row);
                                        }
                                    }
                                }, params.row.appcount)
                            ]);
                        },
                        width: '90px'
                    },
                    {
                        title: '注册时间',
                        key: 'regtime',
                        width: '170px'
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
                                }, '添加')
                            ]);
                        },
                        width: '90px'
                    },
                    {
                        title: '成为代理商',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: () => {
                                            this.agentEdit.isModal = true;
                                            this.agentEdit.id = params.row.id;
                                            console.log(params.row);
                                        }
                                    }
                                }, '确认')
                            ]);
                        },
                        width: '120px'
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
                    }
                ],
                data: [

                ]
            }
        }
    },
    created: function () {
        this.get();
        this.getAppList();
        this.getAgentprice();
        this.getAgentJibie();
        // this.addPriseApp();
    },
    methods: {
        getGroundList: function (e) {
            var $this = e.target,
                viewH = $this.offsetHeight,
                //可见高度  
                contentH = $this.scrollHeight,
                //内容高度  
                scrollTop = $this.scrollTop; //滚动高度  

            // console.log($this.getAttribute("class").indexOf('js-on-more'));
            if ($this.getAttribute("class").indexOf('js-on-more') >= 0) {
                return false;
            }
            // console.log(viewH,contentH,scrollTop);
            if (scrollTop / (contentH - viewH) >= 1) { //到达底部100px时,加载新内容  
                this.pageNum++;
                this.getAppList();
                //console.log(me.page,me.maxPage);
            }
        },
        delApp: function (params) {
            var _this = this;
            var json = {
                action: 'company_del',
                user: params.id
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(json)).then(function (response) {
                console.log(response);
                if (response.data.status == 1) {
                    _this.infoData.data.splice(params._index, 1);
                    _this.$Message.info(response.data.message);
                } else {
                    _this.$Message.warning(response.data.message);
                }
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
            // console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body || [];
                    _this.pageData.total = Number(response.data.total);
                } else {
                    _this.$Message.info(response.data.message);
                }
                // console.log(response.data);
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
        getAppList: function () {
            var _this = this;
            var data = {
                action: 'example_applist',
                page: this.pageNum,
                pageno: 30
            };

            // console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                // console.log(response.data);
                if (response.data.status == 1) {
                    if (response.data.body == null || response.data.body.length < 0) {
                        document.getElementById('scrollList').classList.add("js-on-more");
                    } else {
                        document.getElementById('scrollList') && document.getElementById('scrollList').classList.remove("js-on-more");
                    }
                    _this.appList = _this.appList.concat(response.data.body || []);
                    _this.total = response.data.total;
                } else {
                    _this.$Message.info(response.data.message);
                }

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
        cancelSearch: function () {
            this.pageNum = 1;
            this.searchAppList.keyword = '';
            this.getSearchAppList();
        },
        getSearchAppList: function () {
            var _this = this;
            var data = {
                action: 'example_applist',
                page: 1,
                pageno: 30,
                keyword: this.searchAppList.keyword
            };
            this.appList = [];
            this.scrollList = true;
            console.log(data);
            this.searchAppList.keyword ? this.searchAppList.search = true : this.searchAppList.search = false;
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                // if(response.data.body == null || response.data.body.length < 30){
                // 	document.getElementById('scrollList').classList.add("js-on-more");
                // }else{
                // 	document.getElementById('scrollList') && document.getElementById('scrollList').classList.remove("js-on-more");
                // }
                if (response.data.status == 1) {
                    _this.appList = response.data.body;
                    _this.total = response.data.total;
                } else {
                    _this.$Message.info(response.data.message);
                }
                _this.scrollList = false;
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
        addPriseApp: function () {
            var _this = this;
            var data = {
                action: 'app_add',
                user: this.addAppData.user,
                app_name: this.addAppData.name,
                rolecode: this.addAppData.rolecode,
                example_appid: this.addAppData.example_appid
            };
            // console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
                    _this.addAppData.name = '';
                    _this.isModal = false;
                    _this.addAppData.isModal = false;
                }
                console.log(response);
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
        addCompany: function (name) {
            var _this = this;
            var params = this.addCompanyData;

            this.$refs[name].validate((valid) => {
                console.log(params);
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.isAddCompany = true;
                        this.addCompanyData.loading = false;
                        this.$nextTick(() => {
                            this.addCompanyData.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }
                    var data = {
                        action: 'company_add',
                        companyName: params.name,
                        realname: params.realname,
                        mobile: params.mobile,
                        password: params.password
                    };
                    this.$Loading.start();
                    _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.addCompanyData.loading = false;
                        // console.log(response);
                        if (response.data.status == 1) {
                            _this.get();
                            _this.addCompanyData.name = '';
                            _this.addCompanyData.password = '';
                            _this.isAddCompany = false;
                        } else {
                            console.log(response);
                            _this.$Message.error(response.data.message);
                            _this.$nextTick(() => {
                                _this.addCompanyData.loading = true;
                            });
                        }
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
        addskippage: function (page) {
            this.page = page;
            this.getAppList()
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
                appid: this.vueAppid,
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.pariceList = response.data.body;
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
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.adminData.data = response.data.body;
                    _this.editAdmin.total = Number(response.data.total);
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
        addAdmin: function () {
            var _this = this;
            var data = {
                action: 'role_listof',
                appid: this.vueAppid,
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.pariceList = response.data.body;
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
                    console.log(data);
                    _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
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
                    this.editAdmin.loading = false;
                    this.$nextTick(() => {
                        this.editAdmin.loading = true;
                    });
                }
            })
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
                        managerid: this.editPassword.id,
                        password: this.editPassword.password
                    };
                    this.$Loading.start();
                    _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
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
                            desc: '无法访问服务器,请重试'
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
        enterUpgrade: function () {
            var _this = this;
            var start = this.agentEdit.start_time + (this.agentEdit.start_date ? this.agentEdit.start_date : '00:00:00');
            var end = this.agentEdit.end_time + (this.agentEdit.end_date ? this.agentEdit.end_date : '00:00:00');
            var data = {
                action: 'agent_add',
                companyid: this.agentEdit.id,
                rolecode: this.agentEdit.value,
                starttime: start,
                endtime: end,
                area: this.agentEdit.area
            };
            // console.log(data);
            this.$Loading.start();
            console.log(data);
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
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
        editManager: function (params, mode) {
            var _this = this;
            var data = {
                action: 'manager_check',
                user: params.user,
                chooseID: params.id,
                editmode: mode
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.getAdmin();
                }
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
        start_time: function (val) {
            this.agentEdit.start_time = val;
        },
        end_time: function (val) {
            this.agentEdit.end_time = val;
        },
        selectApp: function (item) {
            if (item.id == '') {
                this.addAppData.isModal = true;
                this.addAppData.example_appid = '';
                this.addAppData.name = '我的小程序';
            } else {
                this.addAppData.example_appid = item.id;
                this.addAppData.name = item.name;
                this.addPriseApp();
            }

        },
        previewApp: function (params) {
            window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.fromappid);
        },
        getAgentJibie: function () {
            var _this = this;
            var data = {
                action: 'agent_jb',
            }
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                _this.agentEdit.body = _this.editCode(response.data);
                console.log(response);
                // console.log(response.data);
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
        editCode: function (list) {
            var obj = [];
            for (var key in list) {
                obj.push({
                    code: key,
                    name: list[key]
                });
            }
            console.log(obj)
            return obj;
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
