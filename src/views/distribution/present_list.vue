<template>
    <div class="distribution-present-list">
        <header class="top">
            <div class="search-ele">
                <input type="text" class="ant-input" v-model="searchVal" />
                <span class="ant-input-suffix">
                    <Button
                        type="primary"
                        shape="circle"
                        @click="dataInitial"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                </span>
            </div>
        </header>
        <div class="person-table">
            <Table :columns="columns" :data="data" :loading="loading"></Table>
        </div>
        <div class="page-content" v-if="total >= 10">
            <Page
                :total="total"
                :page-size="10"
                :current="page"
                show-total
                show-elevator
                @on-change="skippage"
            ></Page>
        </div>
        <Modal
            v-model="modal1"
            width="380"
            title="确认银行卡打款信息"
            ok-text="确认打款"
            @on-ok="fenxiao_tixian_bank_check"
            @on-cancel="modal1 = false"
        >
            <Row>
                <Col span="6">提现金额</Col>
                <Col span="18">{{ fenxiao_info.money }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">用户姓名</Col>
                <Col span="18">{{ fenxiao_info.accountTitle }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">提现方式</Col>
                <Col span="18">{{
                    fenxiao_info.fx == 0 ? "储值卡" : "银行卡"
                }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">银行</Col>
                <Col span="18">{{ fenxiao_info.bank }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">银行卡号</Col>
                <Col span="18">{{ fenxiao_info.accountNumber }}</Col>
            </Row>
        </Modal>

        <Modal
            v-model="modal2"
            width="380"
            title="确认银行卡打款信息"
            :footer-hide="true"
        >
            <Row>
                <Col span="6">提现金额</Col>
                <Col span="18">{{ fenxiao_info.money }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">用户姓名</Col>
                <Col span="18">{{ fenxiao_info.accountTitle }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">提现方式</Col>
                <Col span="18">{{
                    fenxiao_info.fx == 0 ? "储值卡" : "银行卡"
                }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">银行</Col>
                <Col span="18">{{ fenxiao_info.bank }}</Col>
            </Row>
            <Row style="padding-top: 10px">
                <Col span="6">银行卡号</Col>
                <Col span="18">{{ fenxiao_info.accountNumber }}</Col>
            </Row>
        </Modal>
    </div>
</template>

<script type="text/javascript">
export default {
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            modal1: false,
            modal2: false,
            loading: false,
            total: 0,
            page: 1,
            searchVal: '',
            fenxiao_info: {
                money: 0,
                accountTitle: '',
                accountNumber: 0,
                bank: '',
                fx: 0
            },
            columns: [
                {
                    title: '用户名',
                    align: 'left',
                    key: "nicename",
                    className: "distribution-row-columns"
                },
                {
                    title: '手机号',
                    align: 'left',
                    key: "mobile",
                    className: "distribution-row-columns"
                },

                {
                    title: '提现金额',
                    align: 'left',
                    key: "money",
                    className: "distribution-row-columns"

                },
                {
                    title: '提现时间',
                    align: 'left',
                    render: (h, params) => {
                        return h('span', {}, params.row.time);
                    },
                    className: "distribution-row-columns"
                },
                {
                    title: '提现方式',
                    align: 'left',
                    render: (h, params) => {
                        return h('span', {}, params.row.fx == 1 ? '银行卡' : '储值卡');
                    },
                    className: "distribution-row-columns"
                },
                {
                    title: '状态',
                    align: 'left',
                    render: (h, params) => {
                        return h('span', {}, params.row.attrib == 1 ? '已提现' : '待审核');
                    },
                    className: "distribution-row-columns"

                },

                {
                    title: '操作',
                    align: 'center',
                    width: 140,
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    cursor: "pointer",
                                    "margin-right": '5px',
                                    color: '#3091f2'
                                },
                                on: {
                                    click: () => {
                                        params.row.attrib == 0 ? (this.modal1 = true) : (this.modal2 = true);
                                        this.fenxiao_info = {
                                            id: params.row.id,
                                            money: params.row.money,
                                            accountTitle: params.row.accountTitle,
                                            accountNumber: params.row.accountNumber,
                                            bank: params.row.bank,
                                            fx: params.row.fx,
                                        }
                                        console.log(params)
                                        // this.fenxiao_tixian_bank_check(params.row);
                                    }
                                }
                            }, params.row.attrib == 0 ? '同意提现' : '查看结果'),

                        ]);
                    },
                    className: "distribution-row-columns"
                }
            ],
            data: []
        }
    },
    watch: {
        '$route': 'fetchData',
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1;
            this.get()
        },
        dataInitial: function () {
            this.get();
        },
        get: function () {
            var that = this;
            var data = {
                action: 'fenxiao_tixian_list',
                appid: that.vueAppid,
                page: this.page,
                keyword: this.searchVal
            };
            console.log(data);
            that.$Loading.start();
            that.loading = true;
            that.$http.post("/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                that.loading = false;
                that.total = res.data.total;
                if (res.data.status == 1) {
                    that.data = res.data.body
                }
                console.log(res);

            }).catch(function (response) {
                that.$Loading.error();
                that.loading = false;
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                console.log(response);
            });
        },
        fenxiao_tixian_bank_check: function (params) {
            var that = this;
            var data = {
                action: 'fenxiao_tixian_bank_check',
                appid: that.vueAppid,
                id: this.fenxiao_info.id
            };
            that.$Loading.start();
            that.$http.post("/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                that.get();
                console.log(res);


            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                console.log(response);
            });
        },
        skippage: function (page) {
            // this.$router.push({ name: 'shop', params: { page: page }});
            this.$router.push({
                path: '/distribution/present_list/' + page
            });
        },
    }
}

</script>


<style lang="stylus" rel="stylesheet/stylus">
.distribution-present-list {
    .person-table {
        padding: 0 20px;
    }
    .distribution-row-columns {
        font-size: 12px;
    }
    th.distribution-row-columns {
        color: #303445;
        background: #F6F7FB;
        font-weight: 500;
        border: none;
        border-right: 2px solid #FFF;
    }
    .distribution-row {
        padding-top: 10px;
        .title {
            display: inline-block;
            width: 60px;
            color: #303445;
            margin-right: 26px;
            vertical-align: top;
        }
    }
    .page-content {
        padding: 20px 20px;
        text-align: right;
    }
    header.top {
        padding: 10px 0;
        display: flex;
        margin: 0 20px;
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
                border-radius: 4px;
                transition: 0.3s;
                font-size: 12px;
                height: 30px;
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
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }
        }
        .ant-btn {
            margin-left: 20px;
            line-height: 30px;
            .ant-btn-text {
                font-size: 12px;
                margin-left: 7px;
            }
        }
    }
}
</style>







