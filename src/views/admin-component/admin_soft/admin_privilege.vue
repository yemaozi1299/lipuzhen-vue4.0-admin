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
                    v-on:click="addCompanyData.isModal = true"
                >
                    <Icon type="md-add" />添加功能
                </Button>
                <Button class="ant-btn mg-r-20" to="/admin_soft">
                    <Icon type="ios-undo" />返回
                </Button>
            </template>
        </tables>
        <Modal
            v-model="addCompanyData.isModal"
            title="添加功能"
            @on-ok="add"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="所属软件：">
                    <div>{{ softname }}</div>
                </FormItem>
                <FormItem label="功能名称：">
                    <Input type="text" v-model="addCompanyData.p_name"></Input>
                </FormItem>
                <FormItem label="功能代码：">
                    <Input type="text" v-model="addCompanyData.p_code"></Input>
                </FormItem>
                <FormItem label="是否隐藏：">
                    <i-switch v-model="addCompanyData.yc" />
                </FormItem>
            </Form>
        </Modal>
        <Modal
            v-model="edit_isModal"
            title="修改功能"
            @on-ok="edit"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="所属软件：">
                    <div>{{ softname }}</div>
                </FormItem>
                <FormItem label="功能名称：">
                    <Input type="text" v-model="addCompanyData.p_name"></Input>
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
            addCompanyData: {
                p_id: 0,
                isModal: false,
                p_name: "",
                p_code: "",
                softID: "",
                yc: false
            },
            columns: [
                {
                    key: "p_name",
                    title: "功能名称"
                },
                {
                    key: "p_code",
                    title: "功能代码"
                },
                {
                    title: '操作',
                    align: 'center',
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
                                        var param = this.addCompanyData;
                                        param.p_id = params.row.p_id;
                                        param.p_name = params.row.p_name;
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
                                                this.del(params.row.p_code);
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
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=privilege_listof",
                params: {
                    softID: this.softID
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.tableData = res.data.body || [];
                }
                console.log(res);
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
        add () {
            var data = this.addCompanyData;
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    softID: this.softID,
                    action: "privilege_add",
                    p_name: data.p_name,
                    p_code: data.p_code,
                    yc: data.yc ? "1" : "0"
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.dataInitial();
                    this.addCompanyData = {
                        isModal: false,
                        p_name: "",
                        p_code: "",
                        softID: "",
                        yc: false
                    };
                } else {
                    this.$Message.warning(res.data.message);
                }

                console.log(res.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        edit () {
            var data = this.addCompanyData;
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    p_id: data.p_id,
                    action: "privilege_edit",
                    p_name: data.p_name,
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.dataInitial();
                    this.addCompanyData = {
                        p_id: 0,
                        isModal: false,
                        p_name: "",
                        p_code: "",
                        softID: "",
                        yc: false
                    };
                } else {
                    this.$Message.warning(res.data.message);
                }
                console.log(res.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        del (p_code) {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    p_code: p_code,
                    action: "privilege_del",
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
        }
    }
}
</script>

<style>
</style>