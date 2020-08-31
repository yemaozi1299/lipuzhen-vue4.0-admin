<template>
    <Card>
        <p slot="title">软件管理</p>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="tableData"
            :columns="columns"
            @on-selection-change="chooseEdit"
            showPage
            :total="total"
            :current="page"
            :page-size="pageno"
            show-total
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
                    <Icon type="md-add" />添加软件
                </Button>
            </template>
        </tables>

        <Modal
            v-model="addCompanyData.isModal"
            title="添加代理商"
            @on-ok="addSoft"
            @on-cancel=""
            :loading="addCompanyData.loading"
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="软件名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.softname"
                    ></Input>
                </FormItem>
                <FormItem label="软件代码：">
                    <Input
                        type="text"
                        v-model="addCompanyData.softcode"
                    ></Input>
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
            addCompanyData: {
                id: 0,
                isModal: false,
                loading: false,
                softcode: "",
                softname: "",
                description: "",
                yc: false
            },
            columns: [
                {
                    key: "softname",
                    title: "软件名称"
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
                    width: 400,
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
                                            isModal: true,
                                            id: params.row.id,
                                            softname: params.row.softname,
                                            softcode: params.row.softcode,
                                            description: params.row.description,
                                            yc: params.row.yc == "1" ? true : false
                                        }
                                        this.addCompanyData = param;
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'success'
                                },
                                style: {
                                    margin: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "admin_privilege",
                                            params: {
                                                softID: params.row.id
                                            },
                                            query: {
                                                softname: params.row.softname
                                            }
                                        });
                                    }
                                }
                            }, '添加功能'),
                            h('Button', {
                                props: {
                                    type: 'warning'
                                },
                                style: {
                                    margin: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "admin_role",
                                            params: {
                                                softID: params.row.id
                                            },
                                            query: {
                                                softname: params.row.softname
                                            }
                                        });
                                    }
                                }
                            }, '添加型号'),
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
            pageno: 10,
            page: 1,
            total: 0,
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
        showAddRole () {
            this.addCompanyData = {
                id: 0,
                isModal: true,
                loading: false,
                softname: "",
                description: "",
                yc: false
            }
        },
        addSoft () {
            var data = this.addCompanyData;
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    id: data.id,
                    action: data.id ? "soft_edit" : "soft_add",
                    softname: data.softname,
                    softcode: data.softcode,
                    description: data.description,
                    yc: data.yc ? "1" : "0"
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.dataInitial();
                }
                this.addCompanyData = {
                    id: 0,
                    isModal: false,
                    loading: false,
                    softname: "",
                    description: "",
                    yc: false
                };
                console.log(res.data);
            });
        },
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=soft_listof",
                params: {

                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.tableData = res.data.body || [];
                }
                console.log(res.data);
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
                url: "/api_admin.php?action=soft_hidde",
                params: {
                    softID: param.id,
                    hidde: param.yc == "1" ? "0" : "1"
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.dataInitial();
                }
                console.log(res.data);
            });
        },
        del (softID) {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php",
                params: {
                    softID: softID,
                    action: "soft_del",
                }
            }).then((res) => {
                if (res.data.status == 1) {
                } else {
                    this.$Message.warning(res.data.message);
                }
                this.dataInitial();

                console.log(res.data);
            });
        },
    }
}
</script>

<style>
</style>