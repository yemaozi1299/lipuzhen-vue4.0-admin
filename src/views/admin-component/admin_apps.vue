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

        <Modal
            v-model="editAppData.isModal"
            title="修改应用"
            @on-ok="editPriseApp"
            @on-cancel=""
        >
            <label style="display: block; margin-bottom: 10px">
                <span>应用名称：</span>
                <Input
                    type="text"
                    style="width: 200px"
                    v-model="editAppData.name"
                ></Input>
            </label>
            <label style="display: block; margin-bottom: 10px">
                <span>到期时间：</span>
                <label for=""
                    ><Checkbox v-model="editAppData.single"
                        >永久</Checkbox
                    ></label
                >
                <label for="" v-if="!editAppData.single"
                    ><DatePicker
                        type="date"
                        style="
                            width: 170px;
                            display: inline-block;
                            margin-right: 10px;
                        "
                        v-model="editAppData.date"
                    ></DatePicker
                    ><TimePicker
                        type="time"
                        style="width: 170px; display: inline-block"
                        v-model="editAppData.time"
                    ></TimePicker
                ></label>
            </label>
            <label style="display: block; margin-bottom: 10px">
                <span>软件类型：</span>
                <Select style="width: 200px" v-model="selectedSoft">
                    <Option
                        :value="item.id"
                        v-for="item in softList"
                        :key="item.id"
                        >{{ item.softname }}</Option
                    >
                </Select>
            </label>
            <label style="display: block">
                <span>软件型号：</span>
                <Select style="width: 200px" v-model="editAppData.rolecode">
                    <Option
                        :value="item.id"
                        v-for="item in pariceList"
                        :key="item.id"
                        >{{ item.rolename }}</Option
                    >
                </Select>
            </label>
        </Modal>
        <Modal
            v-model="example_data.isModal"
            title="设为样板"
            @on-ok="addAppExample"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="模版缩略图：">
                    <div class="change-img-wrap cover-wrap">
                        <img
                            :src="example_data.cover"
                            alt=""
                            id="collect-cover"
                        />
                        <input
                            type="file"
                            id="page-cocer"
                            @change="ExampleAdd"
                        />

                        <p class="text">点击更换缩略图</p>
                    </div>
                </FormItem>
                <FormItem label="模版标题：">
                    <Input type="text" v-model="example_data.name"></Input>
                </FormItem>
            </Form>
        </Modal>
        <!-- 图片库弹窗 -->
        <!-- <Modal v-model="isUpload" width="860">
            <p slot="header">更换缩略图</p>
            <fileExplorer
                :options="options"
                @successCallback="uploadListFun"
            ></fileExplorer>
            <div slot="footer"></div>
        </Modal> -->

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
// import fileExplorer from '@/components/fileExplorer/fileExplorer'
import noImage from '@/assets/images/noimage.jpg'
export default {
    components: {
        Tables,
        Buttons,
        // fileExplorer
    },
    data: function () {
        return {
            softList: [],
            selectedSoft: "",
            isUpload: false,
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
            /*
                AppCode: null
                AppSecret: null
                bottom_nav: "{"position":"bottom","color":"#59607B","selectedColor":"#3091F2","backgroundColor":"#fff","borderStyle":"black","list":[]}"
                count: "0"
                endtime: "1665564345"
                haveSoft: "0"
                id: "14"
                logo: "BlR5DLJq7XHNb.jpg"
                name: "全功能小程序2"
                roleID: "8"
                softID: "3"
                starttime: "1600917673"
                status: "1"
                url: null
                user: "1"
        	
            */

            example_data: {
                isModal: false,
                cover: '',
                name: '',
                fromappid: '',

            },//logo: ''
            pageno: 10,
            loading: false,
            isModal: false,
            searching: false,
            keyword: '',
            searchPoptip: false,
            moves: '',
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            pariceList: {},
            pageData: {
                total: 0,
                page: 1,
            },
            editAppData: {
                isModal: false,
                name: '',
                date: '',
                single: false,
                rolecode: []
            },
            addAppData: {
                rolecode: '',
                rolename: '',
                starttime: '',
                endtime: '',
                time: '',
                year: 1,
                id: ''
            },
            versionArr: {},
            infoData: {
                columns: [

                    {
                        title: '应用图标',
                        width: 100,
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


                    },
                    {
                        title: '应用名称',
                        align: "center",
                        width: 200,
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
                        title: '所属代理商',
                        key: 'agentname',
                        width: 120,
                    },
                    {
                        title: '所属企业',
                        key: 'companyname',
                        width: 120,
                    },
                    {
                        title: '软件',
                        width: 120,
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
                                        }
                                    }
                                }, params.row.haveSoft == 0 ? '授权' : '修改')
                            ]);
                        },


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
                        align: 'left',
                        width: 320,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
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
                                            }
                                            this.isModal = true
                                        }
                                    }
                                }, '续费'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',

                                    },
                                    style: {
                                        color: '#fff',
                                        'margin-right': '10px'
                                    },
                                    on: {
                                        click: () => {
                                            var date = params.row.endtime.split(' ');
                                            this.editAppData.isModal = true;
                                            this.editAppData.name = params.row.name;
                                            this.editAppData.appid = params.row.id;
                                            this.editAppData.date = date[0];
                                            this.editAppData.time = date[1];
                                            this.editAppData.rolecode = params.row.rolecode;
                                            console.log(date);
                                        }
                                    }
                                }, '修改'),
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
                                            console.log(params.row);
                                            // this.example_data.isModal = true;
                                            // this.example_data.fromappid = params.row.id;
                                            // this.example_data.name = params.row.name;
                                            // this.example_data.logo = params.row.logo;
                                            this.$router.push({
                                                name: "example_appadd",
                                                params: {
                                                    page: 1,
                                                },
                                                query: {
                                                    fromappid: params.row.id,
                                                    name: params.row.name,
                                                    appid: params.row.id
                                                }
                                            });
                                        }
                                    }
                                }, '设为样板'),
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
                    },
                ],
                data: []
            }
        }
    },
    created: function () {
        this.get();
        this.getSoftList();
    },
    watch: {
        selectedSoft (val) {
            this.getAgentprice();
        }
    },
    methods: {
        openPage (params, name) {
            // 开发版固定跳到 应用管理后台
            if (process.env.NODE_ENV == 'development' || params.haveSoft == "0") {
                window.open(`${name + params.id}`);
                return
            }
            if (params.haveSoft == "1" && params.url) {
                window.open(`${params.url + name + params.id}`);
            }
        },
        getSoftList () {
            this.$http.request({
                url: "/api_admin.php?action=soft_listof",
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
        uploadListFun: function (files) {
            this.isUpload = false;
            this.example_data.cover = files.url;
        },
        delApp: function (params) {
            var _this = this;
            var json = {
                action: 'app_del',
                id: params.id
            };
            console.log(json);
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
                    desc: response
                });
                _this.$Loading.error();
            });
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
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body || [];
                    _this.pageData.total = Number(response.data.total);
                }
                console.log(response.data);
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
            _this.$http.post('/api_admin.php', _this.$qs.stringify(json)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data[data._index].status = data.status == 1 ? 0 : 1;
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        appPrice: function () {
            this.$Message.error('超级管理员还没有续费功能');
            return false;
            var _this = this;
            var json = {
                action: 'app_year',
                appid: this.addAppData.id,
                year: this.addAppData.year
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(json)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.$Message.info('续费成功');
                    _this.get();
                } else {
                    _this.$Message.info(response.message);
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
        editPriseApp: function () {
            var _this = this;
            var date = this.formatDate(this.editAppData.date) + ' ' + this.editAppData.time;
            var data = {
                action: 'app_edit',
                appid: this.editAppData.appid,
                appname: this.editAppData.name,
                endtime: this.editAppData.single ? '0' : date,
                roleID: this.editAppData.rolecode
            };
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.get();
                    _this.addAppData.name = '';
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
        getAgentprice: function () {
            var _this = this;
            var data = {
                action: 'role_listof',
                softID: this.selectedSoft
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.pariceList = response.data.body;
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
        formatDate: function (date) {
            console.log(typeof date);
            if (date && typeof date == 'string') {
                return date;
            } else if (!date) {
                date = new Date();
            }
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            return [year, month, day].map(this.formatNumber).join('-')
        },
        formatNumber: function (n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        },
        ExampleAdd: function (event) {
            var file = event.target.files[0],
                _this = this;
            if (file) {
                var isFile = /^(image\/jpeg|image\/png|image\/gif)$/i;
                if (isFile.test(file.type)) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);  //将文件以Data URL形式读入页面  
                    reader.onload = function (e) {
                        var ret = this.result;
                        _this.example_data.cover = ret;
                    }
                } else {
                    this.$Message.error('文件格式不正确');
                }
            }

        },
        addAppExample: function () {
            var _this = this;
            if (!this.example_data.cover || !this.example_data.name) {
                return _this.$Message.success('图片或名称不能为空');
            }
            var data = {
                action: 'example_appadd',
                fromappid: this.example_data.fromappid,
                cover: this.example_data.cover,
                example_name: this.example_data.name,
            };//logo: this.example_data.logo
            console.log(data.fromappid);
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.example_data.isModal = false;
                    _this.example_data.cover = '';
                    _this.$Message.success('添加样板成功');
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
        appGet (params) {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=app_get",
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
                url: "/api_admin.php?action=app_soft_set",
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

<style lang="less">
.label-price {
    .label-span {
        display: inline-block;
        width: 80px;
    }
}
.change-img-wrap {
    position: relative;
    display: inline-block;
    width: 250px;
    height: 250px;
    vertical-align: top;
    cursor: pointer;
    overflow: hidden;
    border-radius: 0px;
    border: 1px solid #eee;
    img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }
    .text {
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
    #page-cocer {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        opacity: 0;
        z-index: 100;
    }
}
</style>