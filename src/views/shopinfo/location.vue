<template>
    <div>
        <div class="location-wrapper">
            <div class="top-control">
                <div class="top-control-left">
                    <div class="search-ele">
                        <input
                            type="text"
                            class="ant-input"
                            v-model="keyword"
                            placeholder="关键字"
                            v-on:keyup.enter="get"
                        />
                        <span class="ant-input-suffix">
                            <Button
                                slot="append"
                                type="primary"
                                shape="circle"
                                icon="ios-search"
                                class="ant-search-btn"
                                @click="get"
                            ></Button>
                        </span>
                    </div>
                </div>
                <div class="top-control-right">
                    <Button
                        type="primary"
                        icon="md-add"
                        class="ant-btn"
                        v-on:click="modal1 = true"
                        >添加座位</Button
                    >
                </div>
            </div>
            <div class="content-body">
                <tables
                    ref="tables"
                    editable
                    searchable
                    search-place="top"
                    :columns="columns1"
                    :loading="loading"
                    v-model="data1"
                    @on-selection-change="chooseEdit"
                    @on-save-edit="saveEdit"
                    showPage
                    :total="total"
                    :current="page"
                    :page-size="pageno"
                    show-total
                    show-elevator
                    @on-skippage="skippage"
                ></tables>
            </div>
        </div>
        <Modal
            v-model="modal1"
            title="添加座位"
            @on-ok="addLocation"
            @on-cancel="cancel"
            :loading="loading2"
        >
            <div>
                <Form
                    ref="formValidate"
                    :model="formItem"
                    :label-width="160"
                    :rules="ruleValidate"
                >
                    <FormItem label="座位名称" prop="zuoweiName">
                        <Input
                            v-model="formItem.zuoweiName"
                            style="width: 200px"
                        ></Input>
                    </FormItem>
                    <FormItem label="座位备注">
                        <Input
                            v-model="formItem.description"
                            style="width: 200px"
                        ></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>


<script type="text/javascript">
import MarkPoptip from './components/MarkPoptip/MarkPoptip';
import Tables from '@/components/tables'
export default {
    components: {
        Tables,
    },
    data () {
        return {
            page: 1,
            total: 1,
            pageno: 15,
            keyword: '',
            chooseID: [],
            modal1: false,
            loading: false,
            loading2: true,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            ruleValidate: {
                zuoweiName: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ]
            },
            formItem: {
                zuoweiName: "",
                description: "",
                id: ""
            },
            columns1: [
                {
                    type: "selection",
                    width: 50,
                    align: "center"
                },
                {
                    title: "座位排序",
                    width: 150,
                    sortable: true,
                    editable: true,
                    key: "orderid"
                    // render: (h, params) => {
                    //     return h("Input", {
                    //         props: {
                    //             type: "number",
                    //             size: "small",
                    //             value: params.row.orderid
                    //         },
                    //         style: {
                    //             width: "78px"
                    //         },
                    //         on: {
                    //             'on-blur': (val) => {
                    //                 this.setOrder(params.row, val.target.value);
                    //             }
                    //         }
                    //     });
                    // }
                },
                {
                    title: "座位名称",
                    key: "zuoweiName",
                },
                {
                    title: "座位ID",
                    key: "id",
                },
                {
                    title: "是否开启",
                    render: (h, params) => {
                        return h("i-switch", {
                            props: {
                                value: params.row.status == 1 ? true : false
                            },

                            on: {
                                'on-change': () => {
                                    this.statusZuowei(params.row);
                                    console.log(params.row.status);
                                }
                            }
                        });
                    }
                },
                {
                    title: "座位备注",
                    key: "description",
                },
                {
                    title: '操作',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: "text"
                                },
                                style: {
                                    color: "#108ee9"
                                },
                                on: {
                                    click: () => {
                                        this.formItem = params.row;
                                        console.log(params.row);
                                        this.modal1 = true;
                                        this.loading2 = true;
                                    }
                                }
                            }, "编辑"),
                            h('Button', {
                                props: {
                                    type: "text"
                                },
                                style: {
                                    color: "#108ee9"
                                },
                                on: {
                                    click: () => {
                                        var that = this;
                                        this.$Modal.confirm({
                                            title: "提示",
                                            content: "是否删除该座位？",
                                            onOk: function () {
                                                that.delzuowei(params.row);
                                            }
                                        })

                                    }
                                }
                            }, "删除")
                        ]);
                    }
                },
                {
                    title: '座位码',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(MarkPoptip, {
                                props: {
                                    placement: "bottom",
                                    src1: params.row.qrcode
                                },
                                on: {

                                }
                            }),
                        ]);
                    }
                },
            ],
            data1: [
                {
                    "add_time": "1566199422",
                    "app_id": "2sis3ep9mP",
                    "name": "a1",        //座位号名称
                    "description": "a1",       //座位号描述
                    "id": "1667",              //座位id
                    "qrcode": "https://img.zhichiwangluo.com/zcimgdir/thumb/5d5a4e7fbcd78.jpg",
                    "status": "0",       //状态开启或关闭
                    "weight": "344"      //权重
                }, {
                    "add_time": "1566199422",
                    "app_id": "2sis3ep9mP",
                    "name": "a1",        //座位号名称
                    "description": "a1",       //座位号描述
                    "id": "1667",              //座位id
                    "qrcode": "https://img.zhichiwangluo.com/zcimgdir/thumb/5d5a4e7fbcd78.jpg",
                    "status": "0",       //状态开启或关闭
                    "weight": "344"      //权重
                }, {
                    "add_time": "1566199422",
                    "app_id": "2sis3ep9mP",
                    "name": "a1",        //座位号名称
                    "description": "a1",       //座位号描述
                    "id": "1667",              //座位id
                    "qrcode": "https://img.zhichiwangluo.com/zcimgdir/thumb/5d5a4e7fbcd78.jpg",
                    "status": "0",       //状态开启或关闭
                    "weight": "344"      //权重
                },
            ]
        }
    },

    created () {
        this.get();
    },
    methods: {
        saveEdit: function (params) {
            this.setOrder(params.row, params.value);
            console.log(params);
        },
        cancel: function () {
            this.modal1 = false;
            this.formItem = {
                zuoweiName: "",
                description: "",
                id: ""
            }
        },
        addLocation () {
            var that = this;
            var param = {
                action: "zuowei_edit",
                appid: this.vueAppid,
                zuoweiName: this.formItem.zuoweiName,
                description: this.formItem.description,
                status: this.formItem.id ? this.formItem.status : 1,
                id: this.formItem.id
            }
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {

                        if (res.data.status == 1) {
                            that.modal1 = false;
                            that.formItem = {
                                zuoweiName: "",
                                description: "",
                                id: ""
                            }
                            that.get();
                            console.log(res);
                        } else {
                            setTimeout(function () {
                                that.loading2 = false;
                                setTimeout(function () {
                                    that.loading2 = true;
                                }, 100);
                            }, 2000);
                            that.$Message.error(res.data.message);
                        }
                    }).catch(function (response) {
                        that.$Loading.error();
                        that.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                        that.loading2 = false;
                    });
                } else {
                    setTimeout(function () {
                        that.loading2 = false;
                        setTimeout(function () {
                            that.loading2 = true;
                        }, 100);
                    }, 2000);
                }
            });
        },
        get: function () {
            var that = this;
            var param = {
                action: "zuowei_list",
                appid: this.vueAppid,
                pageno: this.pageno,
                page: this.page,
                keyword: this.keyword
            }
            this.loading = true;
            this.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                that.total = res.data.total;
                that.data1 = res.data.body;
                that.loading = false;
                console.log(res.data.body[0]);
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        },
        chooseEdit: function (selection) {
            var chooseID = [];
            selection.forEach((e, index) => {
                chooseID.push(e.id);
            });
            this.chooseID = chooseID;
        },
        skippage: function (page) {
            this.page = page;
            this.get();
        },
        setOrder: function (row, orderid) {
            var that = this;
            var param = {
                action: "zuowei_orderid",
                appid: this.vueAppid,
                id: row.id,
                orderid: orderid
            }
            console.log(param)
            this.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                that.$Message.info(res.data.message);
                console.log(res);
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        },
        statusZuowei: function (row) {
            var that = this;
            var param = {
                action: "zuowei_status",
                appid: this.vueAppid,
                id: row.id,
                status: row.status == 1 ? 0 : 1
            }
            console.log(param)
            this.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                that.$Message.info(res.data.message);
                console.log(res);
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        },
        delzuowei: function (row) {
            var that = this;
            var param = {
                action: "zuowei_del",
                appid: this.vueAppid,
                id: row.id,
            }
            that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                if (res.data.status == 1) {
                    that.get();
                } else {

                    that.$Message.error(res.data.message);
                }
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        }
    }
}
</script>


<style lang="stylus" rel="stylesheet/stylus">
.location-wrapper
    position relative
    .top-control
        background-color #fff
        padding 10px 20px
        overflow hidden
        .top-control-right
            float left
            .ant-btn
                border-radius 0
        .top-control-left
            float left
            margin-right 20px
            .search-ele
                width 200px
                font-size 14px
                line-height 1.5
                color rgba(0, 0, 0, 0.65)
                padding 0
                position relative
                display inline-block
                .ant-input
                    display inline-block
                    padding 4px 11px
                    height 32px
                    font-size 14px
                    color rgba(0, 0, 0, 0.65)
                    background-color #fff
                    background-image none
                    border 1px solid #d9d9d9
                    transition 0.3s
                    font-size 12px
                    border-radius 0
                .ant-input-suffix
                    position absolute
                    right 0
                    top 50%
                    -webkit-transform translateY(-50%)
                    transform translateY(-50%)
                    line-height 0
                    color rgba(0, 0, 0, 0.65)
                    .ant-search-btn
                        border-radius 0
                .ant-input:focus
                    outline 0
                    border-color #2d8cf0
    .content-body
        padding 0 20px 20px 20px
        background #fff
        position relative
        .page-wrap
            margin 16px 16px 16px 0
</style>