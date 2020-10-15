<template>
    <Card>
        <p slot="title">当前软件：{{ softname }}</p>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="tableData"
            :columns="columns"
            show-elevator
            @on-skippage="skippage"
            showlayout
            :loading="loading"
        >
            <template slot="header">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="showAddRole"
                >
                    <Icon type="md-add" />添加型号
                </Button>
                <Button class="ant-btn mg-r-20" to="/admin_soft">
                    <Icon type="ios-undo" />返回
                </Button>
            </template>
        </tables>
        <Modal
            v-model="addCompanyData.isModal"
            title="添加型号"
            @on-ok="add"
            @on-cancel=""
            :loading="addCompanyData.loading"
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="软件名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.rolename"
                    ></Input>
                </FormItem>
                <FormItem label="代码名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.rolecode"
                    ></Input>
                </FormItem>
                <FormItem label="市场价格：">
                    <Input
                        type="text"
                        v-model="addCompanyData.marketprice"
                    ></Input>
                </FormItem>
                <FormItem label="功能选择：">
                    <CheckboxGroup v-model="addCompanyData.p_code_arr">
                        <Checkbox
                            border
                            :label="item.p_code"
                            v-for="item in codeList"
                            style="margin-bottom: 10px"
                            >{{ item.p_name }}</Checkbox
                        >
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="描述：">
                    <Input
                        type="text"
                        v-model="addCompanyData.description"
                    ></Input>
                </FormItem>
                <FormItem label="是否隐藏：">
                    <i-switch v-model="addCompanyData.yc" />
                </FormItem>
            </Form>
        </Modal>

        <Modal
            v-model="edit_isModal"
            title="添加型号"
            @on-ok="edit"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="软件名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.rolename"
                    ></Input>
                </FormItem>
                <FormItem label="市场价格：">
                    <Input
                        type="text"
                        v-model="addCompanyData.marketprice"
                    ></Input>
                </FormItem>
                <FormItem label="功能选择：">
                    <CheckboxGroup v-model="addCompanyData.p_code_arr">
                        <Checkbox
                            border
                            :label="item.p_code"
                            v-for="item in codeList"
                            style="margin-bottom: 10px"
                            >{{ item.p_name }}</Checkbox
                        >
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="描述：">
                    <Input
                        type="text"
                        v-model="addCompanyData.description"
                    ></Input>
                </FormItem>
                <FormItem label="是否隐藏：">
                    <i-switch v-model="addCompanyData.yc" />
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>

<script>
import Tables from "@/components/tables";
import Buttons from "@/components/buttons";

export default {
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            softname: "",
            edit_isModal: false,
            codeList: [],
            selectedCode: [],
            addCompanyData: {
                roleID: 0,
                isModal: false,
                softID: "",
                yc: false,
                description: "",
                marketprice: "",
                rolename: "",
                rolecode: "",
                p_code_arr: [],
                loading: true
            },
            columns: [
                {
                    key: "rolename",
                    title: "型号名称"
                },
                {
                    key: "rolecode",
                    title: "代码名称"
                },
                {
                    key: "marketprice",
                    title: "市场价格"
                },
                {
                    key: "description",
                    title: "描述"
                },
                {
                    key: "yc",
                    title: "是否隐藏",
                    render: (h, params) => {
                        return h("div", [
                            h("Button", {
                                props: {
                                    type: params.row.yc == 1 ? 'error' : 'success'
                                },
                                style: {
                                    margin: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.changeShow(params.row);
                                    }
                                }
                            }, params.row.yc == 1 ? '隐藏' : '显示')
                        ])
                    }
                },
                {
                    title: '操作',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info'
                                },
                                style: {
                                    margin: '5px'
                                },
                                on: {
                                    click: () => {
                                        var param = {
                                            isModal: false,
                                            roleID: params.row.id,
                                            softID: this.softID,
                                            yc: params.row.yc == "1" ? true : false,
                                            description: params.row.description,
                                            marketprice: params.row.marketprice,
                                            rolename: params.row.rolename,
                                            p_code_arr: params.row.p_code_arr
                                        }
                                        this.edit_isModal = true;
                                        this.addCompanyData = param;
                                    }
                                }
                            }, '修改'),

                            h('Button', {
                                props: {
                                    type: 'error'
                                },
                                style: {
                                    margin: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: "确定删除所选记录吗?",
                                            onOk: () => {
                                                this.del(params.row.id);
                                            },
                                            onCancel: () => {
                                                // this.$Message.info('点击了取消');
                                            }
                                        });
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            tableData: [],
            chooseID: [],
            classid: "0",
            softID: 1,
            loading: false,
            isSelectAll: false,
        }
    },
    created () {
        this.fetchData()
    },
    watch: {
        chooseID: function (val) {
            if (val.length >= this.tableData.length) {
                this.isSelectAll = true
            } else {
                this.isSelectAll = false
            }
        },
        "$route": "fetchData"
    },
    methods: {
        fetchData () {
            this.softID = this.$route.params.softID ? parseInt(this.$route.params.softID) : 1;
            this.softname = this.$route.query.softname || "";
            this.dataInitial();
            this.getPrivilege();
        },
        showAddRole () {
            this.addCompanyData.isModal = true;
            this.addCompanyData.p_code_arr = this.selectedCode;
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=role_listof",
                params: {
                    softID: this.softID
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.tableData = res.data.body || [];
                } else {
                    this.tableData = [];
                }
                console.log(res.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getPrivilege () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=privilege_listof",
                params: {
                    softID: this.softID
                }
            }).then((res) => {
                console.log(res);
                if (res.data.status == 1) {
                    var body = res.data.body || [], code = [];
                    body.forEach(function (item) {
                        code.push(item.p_code);
                    });
                    this.codeList = body;
                    this.addCompanyData.p_code_arr = code;
                    this.selectedCode = code;
                }
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        add () {
            var data = this.addCompanyData || {};
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=role_add",
                params: {
                    rolename: data.rolename,
                    softID: this.softID,
                    p_code_arr: data.p_code_arr,
                    rolecode: data.rolecode,
                    marketprice: data.marketprice,
                    description: data.description,
                    yc: data.yc ? "1" : "0"
                }
            }).then((res) => {
                this.addCompanyData = {
                    isModal: false,
                    softID: this.softID,
                    yc: false,
                    description: "",
                    marketprice: "",
                    rolename: "",
                    p_code_arr: this.selectedCode,
                    loading: false
                };
                this.dataInitial();

            }).catch((response) => {
                this.addCompanyData.loading = false;
                this.$nextTick(() => {
                    this.addCompanyData.loading = true;
                })
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        edit () {
            var data = this.addCompanyData || {};
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=role_edit",
                params: {
                    roleID: data.roleID,
                    rolename: data.rolename,
                    softID: this.softID,
                    p_code_arr: data.p_code_arr,
                    marketprice: data.marketprice,
                    description: data.description,
                    yc: data.yc ? "1" : "0"
                }
            }).then((res) => {
                console.log(res.data);
                if (res.data.status == 1) {
                    this.addCompanyData = {
                        isModal: false,
                        softID: this.softID,
                        yc: false,
                        description: "",
                        marketprice: "",
                        rolename: "",
                        p_code_arr: this.selectedCode
                    };
                } else {
                    this.$Message.error(res.data.message);
                }
                this.dataInitial();

            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        del (roleID) {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    roleID: roleID,
                    action: "role_del",
                }
            }).then((res) => {
                if (res.data.status == 1) {
                } else {
                    this.$Message.warning(res.data.message);
                }
                this.dataInitial();

                console.log(res.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$route.push({})
        },
        changeShow (param) {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=role_hidde",
                params: {
                    softID: param.id,
                    hidde: param.yc == "1" ? "0" : "1"
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.dataInitial();
                }
                console.log(res.data);
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

<style>
</style>