<template>
    <Card class="card_controller_member">
        <Layout class="layout-wrapper">
            <Header class="header-wrapper top">
                <div class="search-ele">
                    <input
                        type="text"
                        class="ant-input"
                        v-model="keyword"
                        placeholder="关键字"
                        v-on:keyup.enter="get(1, keyword)"
                    />
                    <span class="ant-input-suffix">
                        <Button
                            slot="append"
                            type="primary"
                            shape="circle"
                            icon="ios-search"
                            class="ant-search-btn"
                            @click="get(1, keyword)"
                        ></Button>
                    </span>
                </div>
                <Button
                    type="primary"
                    icon="md-add"
                    class="ant-btn"
                    v-on:click="addSort"
                    >新建分类</Button
                >
            </Header>
            <Layout class="layout-wrapper main">
                <Sider class="sider-wrapper left" width="198">
                    <label
                        class="ant-radio-button-wrapper"
                        :class="{
                            'ant-radio-button-wrapper-checked':
                                activeClass == 0,
                        }"
                        v-on:click="classStateEdit(0)"
                    >
                        <span>全部用户（{{ activeTotal }}）</span>
                    </label>
                    <label
                        class="ant-radio-button-wrapper"
                        v-for="(item, index) in sort"
                        :key="index"
                        :class="{
                            'ant-radio-button-wrapper-checked':
                                activeClass == item.id,
                        }"
                        v-on:click="classStateEdit(item.id)"
                    >
                        <Icon
                            class="ant-icon"
                            type="md-settings"
                            style="left: 0px"
                            v-on:click.stop="handleEdit(item)"
                        />
                        <span
                            >{{ item.groupname }}（{{ item.total || 0 }}）</span
                        >
                        <Icon
                            class="ant-icon"
                            type="ios-close-circle-outline"
                            style="right: 0px"
                            v-on:click.stop="delGroundState(item, index)"
                        />
                    </label>
                </Sider>
                <Layout class="right">
                    <Content>
                        <Tables
                            ref="tables"
                            editable
                            :columns="columns1"
                            v-model="data1"
                            @on-selection-change="chooseEdit"
                            :total="total"
                            showPage
                            :current="page"
                            :page-size="pageno"
                            show-total
                            show-elevator
                            @on-change="skippage"
                        ></Tables>
                    </Content>
                    <Footer class="table-footer">
                        <Dropdown
                            trigger="click"
                            placement="top"
                            class="mg-r-20"
                            @on-click="groundedit"
                        >
                            <Button
                                class="table-btn"
                                :disabled="chooseID.length == 0"
                                icon="ios-arrow-dropup"
                                >移入分类</Button
                            >
                            <Dropdown-menu slot="list">
                                <Dropdown-item
                                    :name="item.id"
                                    v-for="(item, index) in sort"
                                    :key="index"
                                    >{{ item.groupname }}</Dropdown-item
                                >
                            </Dropdown-menu>
                        </Dropdown>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
        <Modal
            v-model="is_setting_official_modal"
            title="提示"
            @on-ok="setOfficial"
        >
            <p>
                是否将该用户设为销售人员？成为销售人员后，将可以编辑名片，请到销售人员列表中操作。
            </p>
        </Modal>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>
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
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            is_setting_official_modal: false,
            activeIndex: 0,
            activeClass: 0,
            activeTotal: 0,
            activePage: 1,

            items: [],
            page: 1,
            modalClass: false,
            total: 1,
            pageno: 15,
            keyword: '',
            search: false,
            searchPoptip: false,
            chooseID: [],
            imgName: '',
            visible: false,
            tempnumber: 0,
            doing: 0,

            sort: [
                { classid: 1, groupname: "未分类", count: 2 },
                { classid: 2, groupname: "正在跟进客户", count: 4 }
            ],
            columns1: [
                {
                    type: "selection",
                    width: 50,
                    align: "center"
                },
                {
                    title: "图片",
                    width: 90,
                    key: "headimgurl",
                    render: (h, params) => {
                        return h("img", {
                            attrs: {
                                src: "" + params.row[params.column.key]
                            },
                            style: {
                                width: "100%"
                            },
                            on: {
                                click: () => {
                                    this.handleView(params.row[params.column.key]);
                                }
                            }
                        });
                    }
                },
                {
                    title: "名称",
                    key: "name"
                },
                {
                    title: "昵称",
                    key: "nicename"
                },
                {
                    title: "电话",
                    key: "mobile"
                },
                {
                    title: "注册时间",
                    width: 150,
                    key: "addtime"
                },
                {
                    title: "登录IP",
                    key: "login_ip"
                },
                {
                    title: "操作",
                    width: 80,
                    align: "center",
                    key: "status",
                    render: (h, params) => {
                        var isUP = params.row[params.column.key];
                        return h(
                            "Button",
                            {
                                props: {
                                    type: isUP == 1 ? "success" : "dashed",
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                        this.setUp(params.index, isUP);
                                    }
                                }
                            },
                            isUP == 1 ? "正常" : "停用"
                        );
                    }
                }
            ],
            data1: [
            ]
        };
    },
    created () {
        this.$Loading.start();
        this.fetchData();
        this.memberGroupList();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        $route: "fetchData"
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.page
                ? parseInt(this.$route.params.page)
                : 1;
            this.get();
        },
        skippage: function (page) {
            this.$router.push({ path: "/member/" + page });
        },
        get: function () {
            var that = this;
            var page = that.page,
                keyword = that.keyword,
                classid = that.activeClass || 0;
            if (keyword) {
                that.search = true;
            }
            else {
                that.search = false;
            }
            that.searchPoptip = false;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "member_listOfByPage";
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.groupid = classid;
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    that.data1 = response.data.body;
                    that.page = response.data.page;
                    that.total = response.data.total;
                    that.activeTotal = response.data.total;
                }
                else {
                    that.total = 0;
                }
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });

        },
        handleView: function (name) {
            this.imgName = name;
            this.visible = true;
        },
        setOfficial: function () {
            this.data1[this.activeIndex].is_official = 1;
        },
        classStateEdit: function (id) {
            this.activeClass = id;
            var that = this;
            var page = that.page,
                keyword = that.keyword,
                classid = id || 0;
            if (keyword) {
                that.search = true;
            }
            else {
                that.search = false;
            }
            that.searchPoptip = false;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "member_listOfByPage";
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.groupid = classid;
            console.log(data);
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    that.data1 = response.data.body;
                    that.page = response.data.page;
                    that.total = response.data.total;
                }
                else {
                    that.total = 0;
                }
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });
        },


        setUp: function (index, isUP) {
            var _this = this;
            var chooseID = [];
            chooseID.push(this.data1[index].id);
            this.chooseID = chooseID;
            isUP = parseInt(isUP);
            isUP = isUP == 0 ? 1 : 0;
            if (this.doing == 1) {
                return false;
            }

            if (_this.chooseID.length > 0) {
                var apiurl = "/api_edit.php";
                var data = {};

                data.action = "member_status";
                data.status = isUP;
                data.id = this.chooseID;
                data.appid = this.vueAppid;
                _this.$Loading.start();
                _this.doing = 1;
                _this.$http
                    .post(apiurl, _this.$qs.stringify(data))
                    .then(function (response) {
                        _this.$Loading.finish();
                        _this.doing = 0;
                        if (response.data.status == 1) {
                            _this.data1[index].status = isUP;
                            // this.fetchData();
                        } else {
                            _this.$Message.error(response.data.message);
                        }
                    })
                    .catch(function (response) {
                        _this.$Loading.error();
                        _this.$Notice.error({
                            title: "错误提示",
                            desc: "无法访问服务器,请重试"
                        });
                        _this.doing = 0;
                    });
            } else {
                _this.$Message.info("请选择要操作的记录");
                return false;
            }             //禁用或解禁用户
        },
        delGroundState: function (item, index) {
            var that = this;
            var value = "";
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除分类不会影响分类里的用户",
                onOk: function () {
                    that.$Loading.start();
                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: that.vueAppid,
                        action: "member_groupDel",
                        groupid: item.groupid
                    };
                    that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                        that.sort.push({ groupname: value, count: 0, id: response.data.groupid });
                        console.log(response.data);
                        that.$Loading.finish();
                    }).catch(function (response) {
                        that.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        that.$Loading.error();
                    });

                    // _this.editGroup(item);
                }
            });
        },
        addSort: function () {                      //添加分类

            var that = this;
            var value = "";
            //member_groupEdit
            this.$Modal.info({
                title: "添加分类",
                render: h => {
                    return h("Input", {
                        props: {
                            autofocus: true,
                            placeholder: "请输入分类名称"
                        },
                        on: {
                            input: val => {
                                value = val;
                            }
                        }
                    });
                },
                onOk: function () {
                    that.$Loading.start();
                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: that.vueAppid,
                        action: "member_groupEdit",
                        groupname: value
                    };
                    that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                        that.sort.push({ groupname: value, count: 0, id: response.data.groupid });
                        console.log(response.data);
                        that.$Loading.finish();
                    }).catch(function (response) {
                        that.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        that.$Loading.error();
                    });

                    // _this.editGroup(item);
                }
            });
        },
        handleEdit: function (item) {           //
            var _this = this;
            var that = this;
            var value = "";
            this.$Modal.info({
                title: "修改分类名称",
                render: h => {
                    return h("Input", {
                        props: {
                            value: item.groupname,
                            autofocus: true,
                            placeholder: "请输入分类名称"
                        },
                        on: {
                            input: val => {
                                value = val;
                            }
                        }
                    });
                },
                onOk: function () {
                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: that.vueAppid,
                        action: "member_groupEdit",
                        groupid: item.id,
                        groupname: value
                    };
                    that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                        item.groupname = value;
                        that.$Loading.finish();
                    }).catch(function (response) {
                        that.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        that.$Loading.error();
                    });

                    // _this.editGroup(item);
                }
            });
        },
        groundedit: function (name) {
            var that = this;
            if (that.chooseID.length > 0) {
                var apiurl = "/api_edit.php";
                var data = {
                    appid: this.vueAppid,
                    id: this.chooseID,
                    groupid: name,
                    action: "member_groupSet"
                };
                console.log(data);
                that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                    that.memberGroupList();
                    console.log(response.data)
                    that.$Loading.finish();
                }).catch(function (response) {
                    that.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                    that.$Loading.error();
                });
            } else {
                that.$Message.info("请选择要操作的记录");
                return false;
            }


        },
        memberGroupList: function () {
            var that = this;

            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                action: "member_groupList"
            };
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                that.sort = response.data.body || [];
                console.log(response.data)
                that.$Loading.finish();
            }).catch(function (response) {
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                that.$Loading.error();
            });
        },
        chooseEdit: function (selection) {
            var chooseID = [];
            selection.forEach((e, index) => {
                chooseID.push(e.id);
            });
            this.chooseID = chooseID;
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.card_controller_member {
    .top {
        .search-ele {
            width: 200px;
            font-size: 14px;
            line-height: 1.5;
            color: rgba(0, 0, 0, 0.65);
            padding: 0;
            position: relative;
            display: inline-block;
            .ant-input {
                display: inline-block;
                padding: 4px 11px;
                height: 32px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                transition: 0.3s;
                font-size: 12px;
                border-radius: 0;
            }
            .ant-input-suffix {
                position: absolute;
                right: 0;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                line-height: 0;
                color: rgba(0, 0, 0, 0.65);
                .ant-search-btn {
                    border-radius: 0;
                }
            }
            .ant-input:focus {
                outline: 0;
                border-color: #2d8cf0;
            }
        }
        .ant-btn {
            border-radius: 0;
            margin-left: 20px;
        }
    }
    .main {
        .left {
            label {
                box-shadow: none;
            }
            .ant-radio-button-wrapper:hover {
                background-color: #c9e9ff4d;
                .ant-icon {
                    display: block;
                }
            }
            .ant-radio-button-wrapper {
                margin: 0;
                height: 32px;
                line-height: 30px;
                color: rgba(0, 0, 0, 0.65);
                display: inline-block;
                transition: 0.3s;
                cursor: pointer;
                border: 1px solid #d9d9d9;
                border-left: 0;
                border-top-width: 1.02px;
                background: #fff;
                padding: 0 30px;
                position: relative;
                span {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .ant-radio-button-wrapper {
                width: 100%;
                height: 42px;
                border: 0;
                border-bottom: 1px solid #d5d5de;
                border-radius: 0;
                color: #59607b;
                font-size: 12px;
                text-align: left;
                line-height: 42px;
                display: inline-block;
                .ant-icon {
                    display: none;
                    position: absolute;
                    top: 0;
                    width: 30px;
                    line-height: 42px;
                    text-align: center;
                }
                &.ant-radio-button-wrapper-checked {
                    color: #3091f2;
                    background-color: #c9e9ff;
                    .ant-icon {
                        display: block;
                    }
                }
            }
        }
        .right {
            .page-wrap {
                width: 100%;
                text-align: right;
                padding: 20px 10px 20px 0;
            }
        }
    }
}
div.ivu-select-dropdown {
    text-align: left;
}
</style>


