<template>
    <div class="ticket-container">
        <div class="content_tab">
            <div class="pos_opera">
                <span class="title">自动打印小票</span
                ><span class="pos"
                    ><i-switch
                        v-model="formItem.autoPrint"
                        @on-change="change"
                    ></i-switch
                    ><span
                        >注：开启后，无需开启商家后台，外卖有新订单时即可自动打印小票。</span
                    ></span
                >
            </div>
            <div class="pos_opera pos_in">
                <span class="title">小票机参数设置</span>
                <Button
                    type="primary"
                    icon="md-add"
                    class="ant-btn"
                    v-on:click="showModal"
                    >添加小票机</Button
                >
            </div>
        </div>
        <div class="table-wrapper">
            <Tables
                :columns="columns1"
                :loading="loading"
                v-model="data1"
            ></Tables>
            <div class="page-wrap">
                <!-- <Row>
				    <Col span="12" style="text-algin:left">
				      	<div></div>
				    </Col>
				    <Col span="12">
				      	<Page
				        	:total="total"
				        	:current="page"
				        	:page-size="pageno"
				        	show-total
				        	show-elevator
				        	@on-change="skippage"
				      	></Page>
				    </Col>
			  	</Row> -->
            </div>
        </div>
        <Modal
            v-model="modal1"
            title="添加小票机"
            @on-ok="addTicket"
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
                    <FormItem label="小票机型号" prop="type">
                        <RadioGroup v-model="formItem.type">
                            <Radio label="1">小票机wifi版</Radio>
                            <Radio label="2">小票机GPRS版</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="小票机名称" prop="jiqiName">
                        <Input
                            v-model="formItem.jiqiName"
                            style="width: 200px"
                        ></Input>
                    </FormItem>
                    <FormItem label="机器号" prop="sn">
                        <Input
                            v-model="formItem.sn"
                            style="width: 200px"
                        ></Input>
                    </FormItem>
                    <FormItem label="秘钥" prop="keycode">
                        <Input
                            v-model="formItem.keycode"
                            style="width: 200px"
                        ></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script type="text/javascript">
import Vue from 'vue';
import Tables from '@/components/tables'
export default {
    components: {
        Tables,
    },
    data () {
        return {
            modal1: false,
            loading2: true,
            formItem: {
                jiqiName: "",
                type: "1",
                sn: "",
                keycode: "",
                id: '',
                autoPrint: false,
            },
            ruleValidate: {
                type: [
                    { required: true, message: '必选', trigger: 'blur' }
                ],
                jiqiname: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                sn: [
                    { required: true, message: '请填写机器ID', trigger: 'blur' },
                ],
                keycode: [
                    { required: true, message: '请填写秘钥', trigger: 'blur' },
                ]
            },
            keyword: "",
            page: 1,
            total: 1,
            pageno: 15,
            keyword: '',
            chooseID: [],
            loading: false,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            columns1: [
                {
                    title: "小票机名称",
                    key: "jiqiName",
                },
                {
                    title: "机器号",
                    key: "sn",
                },
                {
                    title: "秘钥",
                    key: "keycode",
                },
                {
                    title: "类型",
                    render: (h, params) => {
                        return h("span", {}, params.row.type == 1 ? "365小票机 (WiFi版)" : "365小票机 (GPRS版)");
                    }
                },
                {
                    title: "是否开启打印小票",
                    render: (h, params) => {
                        return h("i-switch", {
                            props: {
                                value: params.row.status == 1 ? true : false
                            },

                            on: {
                                'on-change': () => {
                                    this.statusTicket(params.row);
                                    console.log(params.row)
                                }
                            }
                        });
                    }
                },
                {
                    title: '操作',
                    width: 302,
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
                                        this.testTicket(params.row.id);

                                    }
                                }
                            }, "打印测试"),
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
                                            content: "是否删除该小票机",
                                            onOk: function () {
                                                that.delTicket(params.row);
                                            }
                                        })

                                    }
                                }
                            }, "删除")
                        ]);
                    }
                },
            ],
            data1: []
        }
    },
    created () {
        this.get();
    },
    methods: {
        cancel: function () {
            this.modal1 = false;
            this.formItem = {
                jiqiName: "",
                type: "1",
                sn: "",
                keycode: "",
                id: ''
            }
        },
        showModal () {
            this.modal1 = true;
            this.loading2 = true;
        },
        testTicket (id) {
            var that = this;
            var param = {
                action: "xiaopiaoji_test",
                appid: this.vueAppid,
                id: id,
            }
            that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                if (res.data.status == 1) {
                    console.log(res.data);
                    that.$Message.info(res.data.message);
                } else {

                    that.$Message.info(res.data.message);
                }
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        },
        addTicket () {
            var that = this;
            var param = {
                action: "xiaopiaoji_edit",
                jiqiName: this.formItem.jiqiName,
                appid: this.vueAppid,
                type: this.formItem.type,
                sn: this.formItem.sn,
                key: this.formItem.keycode,
                status: 1,
                id: this.formItem.id
            }
            console.log(param);
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                        if (res.data.status == 1) {
                            that.modal1 = false;
                            that.formItem = {
                                jiqiName: "",
                                type: "1",
                                sn: "",
                                keycode: "",
                                id: ''
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
        delTicket (row) {
            var that = this;
            var param = {
                action: "xiaopiaoji_del",
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
        },
        statusTicket (row) {
            var that = this;
            var param = {
                action: "xiaopiaoji_status",
                id: row.id,
                appid: this.vueAppid,
                status: row.status == 1 ? 0 : 1
            };
            that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                if (res.data.status == 1) {
                    console.log(res);
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
        },
        change () {
            var that = this;
            var param = {
                action: "xiaopiaoji_autoprint",
                appid: this.vueAppid,
                status: this.formItem.autoPrint ? 1 : 0
            };
            console.log(param)
            that.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                if (res.data.status == 1) {
                    console.log(res);
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
        },
        skippage: function (page) {
            // this.$router.push({ path: "/member/" + page });
        },
        get: function () {
            var that = this;
            var param = {
                action: "xiaopiaoji_list",
                appid: this.vueAppid
            }
            this.loading = true;
            this.$http.post("/block/api_edit.php", that.$qs.stringify(param)).then(function (res) {
                that.data1 = res.data.body;
                that.loading = false;
                that.$set(that.formItem, "autoPrint", res.data.autoPrint == 1 ? true : false);
                console.log(res);
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
.ticket-container
    padding 0 20px 20px 20px
    background #fff
    position relative
    .content_tab
        .pos_opera
            padding-top 16px
            .title
                display inline-block
                height 30px
                line-height 30px
                font-size 12px
                padding-right 15px
                border none
            .pos
                display inline-block
                height 30px
                line-height 30px
                font-size 12px
                padding-left 15px
                padding-right 15px
                span
                    vertical-align middle
                    color #999
                    padding-left 15px
                    padding-right 15px
        .pos_in
            padding-bottom 16px
            .ant-btn
                border-radius 0
    .table-wrapper
        .page-wrap
            margin 16px 16px 16px 0
</style>