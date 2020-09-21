<template>
    <div class="distribution_personnel_management">
        <div class="fn-wrap">
            <div class="search-area">
                <div class="search-area">
                    <Input
                        v-model="formItem.keyword"
                        placeholder="关键字"
                        clearable
                        class="ant-search-input mg-r-10"
                    />
                    <Button
                        type="primary"
                        @click="dataInitial"
                        icon="ios-search"
                        class="ant-search-btn mg-r-10"
                    ></Button>
                    <Button
                        type="primary"
                        class="ant-search-btn"
                        @click="setShowFilter"
                        >筛选
                        <Icon
                            type="ios-arrow-down"
                            :class="{ rotate_180: showFilter }"
                    /></Button>
                </div>
            </div>
        </div>
        <div class="filter-container" :class="{ 'show-filter': showFilter }">
            <div class="filter">
                <p>
                    <span class="mg-r-10">加入时间:</span>
                    <DatePicker
                        type="datetime"
                        placeholder="选择时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        :value="startTime"
                        class="ant-DatePicker-input"
                        @on-change="startTimeChange"
                        style="width: 160px"
                    ></DatePicker>
                    -
                    <DatePicker
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择时间"
                        @on-change="endTimeChange"
                        :options="options3"
                        :value="endTime"
                        class="ant-DatePicker-input"
                        style="width: 160px"
                    ></DatePicker>
                </p>
                <p>
                    <span class="mg-r-10">累计提现佣金区间:</span>
                    <InputNumber
                        v-model="formItem.min_price"
                        :min="0"
                        placeholder=""
                        clearable
                        class="ant-price-input"
                    ></InputNumber>
                    -
                    <InputNumber
                        v-model="formItem.max_price"
                        :min="0"
                        placeholder=""
                        clearable
                        class="ant-price-input"
                    ></InputNumber>
                </p>
            </div>
            <div>
                <Button
                    type="primary"
                    @click="getFilter"
                    class="ant-search-btn mg-r-10"
                    >确定</Button
                >
                <Button @click="clearableFormItem" class="ant-search-btn"
                    >重置</Button
                >
            </div>
        </div>
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
    </div>
</template>

<script type="text/javascript">
export default {
    data () {
        return {
            columns: [{
                title: '用户名',
                align: 'left',
                key: "nicename",
                className: "distribution-row-columns"
            }, {
                title: '手机号',
                align: 'left',
                key: "mobile",
                className: "distribution-row-columns"
            }, {
                title: '性别',
                align: 'left',
                width: 65,
                render: (h, params) => {
                    return h('span', {}, params.row.sex == 0 ? '无' : (params.row.sex == 1 ? '男' : '女'));
                },
                className: "distribution-row-columns"
            }, {
                title: '加入时间',
                align: 'left',
                key: 'time',
                className: "distribution-row-columns"
            }, {
                title: '累计推广佣金',
                align: 'left',
                key: "allmoney",
                className: "distribution-row-columns"
            }, {
                title: '累计提现佣金',
                align: 'left',
                render: (h, params) => {
                    return h('span', {}, parseFloat(+params.row.allmoney - +params.row.ketixianmoney).toFixed(3));
                },
                className: "distribution-row-columns"
            }, {
                title: '推广上级',
                align: 'left',
                key: "up_nicename",
                className: "distribution-row-columns"
            }, {
                title: '下级人数',
                align: 'left',
                key: "xiaji",
                className: "distribution-row-columns"
            },
            {
                title: '操作',
                align: 'left',
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                marginRight: '5px',
                                cursor: "pointer",
                                color: params.row.status == 1 ? '#f90' : '#2db7f5'
                            },
                            hover: {
                                color: "#f87554"
                            },
                            on: {
                                click: () => {
                                    this.fenxiao_user_status(params);
                                }
                            }
                        }, params.row.status == 1 ? '拉黑' : '取消拉黑')
                    ]);
                },

                className: "distribution-row-columns"
            },],
            data: [],
            total: 0,
            page: 1,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            options3: {
                disabledDate: date => {
                    var time = new Date(this.formItem.startTime || "") - 86400000 || Date.now() - 86400000;
                    return date && date.valueOf() < time;
                }
            },
            showFilter: false,
            startTime: "",
            endTime: "",
            formItem: {
                keyword: "",
                startTime: "",
                endTime: "",
                max_price: 0,
                min_price: 0,
            },
            loading: false,
        }
    },
    watch: {
        '$route': 'fetchData',
    },
    created () {
        this.fetchData();
    },
    methods: {
        setShowFilter: function () {
            this.showFilter = !this.showFilter;
        },
        fetchData: function () {
            this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1;
            if (this.showFilter) {
                this.get();
            } else {
                this.getFilter();
            }

        },
        dataInitial: function () {
            this.get();
        },
        clearableFormItem: function () {
            this.formItem = {
                keyword: "",
                startTime: "",
                endTime: "",
                max_price: 0,
                min_price: 0,
            }
            this.startTime = "";
            this.endTime = "";
        },
        skippage: function (page) {
            // this.$router.push({ name: 'shop', params: { page: page }});
            this.$router.push({
                path: '/distribution/distribution_management/' + page
            });
        },
        get: function () {
            var that = this;
            var data = {
                action: 'fenxiao_ListOfByPage',
                appid: that.vueAppid,
                page: this.page,
                keyword: this.formItem.keyword
            };
            console.log(data);
            that.$Loading.start();
            that.loading = true;
            that.$http.post("/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                that.loading = false;
                if (res.data.status == 1) {
                    that.data = res.data.body;
                    that.total = res.data.total;
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
        getFilter: function () {           //筛选时使用此函数
            var that = this;
            var data = {
                action: 'fenxiao_ListOfByPage',
                appid: that.vueAppid,
                page: this.page,
                keyword: this.formItem.keyword,
                starttime: this.formItem.startTime,
                endtime: this.formItem.endTime,
                moneyStart: this.formItem.min_price,
                moneyEnd: this.formItem.max_price
            };
            console.log(data);
            that.$Loading.start();
            that.loading = true;
            that.$http.post("/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                that.loading = false;
                if (res.data.status == 1) {
                    that.data = res.data.body;
                    that.total = res.data.total;
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
        fenxiao_user_status: function (params) {
            var that = this;
            var data = {
                action: 'fenxiao_user_status',
                appid: that.vueAppid,
                uid: params.row.uid,
                status: params.row.status == 1 ? 0 : 1
            };
            console.log(data);
            that.$Loading.start();
            that.$http.post("/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                if (res.data.status == 1) {
                    that.data[params.index].status = data.status;
                }

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
        startTimeChange: function (time) {
            if (time.split(" ")[1] == "00:00:00") {
                var date = new Date();
                this.startTime = time.split(" ")[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                this.formItem.startTime = this.startTime;
            } else {
                this.formItem.startTime = time;
            }

            if (this.formItem.endTime && this.formItem.startTime > this.formItem.endTime) {
                this.formItem.endTime = this.endTime = "";
            }
            console.log(this.formItem.startTime);
        },
        endTimeChange: function (time) {
            if (time.split(" ")[1] == "00:00:00") {
                var date = new Date();
                this.endTime = time.split(" ")[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                this.formItem.endTime = this.endTime;
            } else {
                this.formItem.endTime = time;
            }
        },
    }
}

</script>


<style lang="stylus" rel="stylesheet/stylus">
.distribution_personnel_management {
    .mg-r-10 {
        margin-right: 10px;
    }
    .ant-search-btn {
        border-radius: 0px;
        box-shadow: none;
    }
    .rotate_180 {
        transform: rotate(180deg);
    }
    .fn-wrap {
        height: 50px;
        box-sizing: border-box;
        padding: 10px 20px;
        .ant-search-input {
            width: 200px;
            input {
                box-shadow: none;
                border-radius: 0px;
            }
        }
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
    .page-content {
        padding: 20px 20px;
        text-align: right;
    }
    .filter-container {
        height: 0;
        background-color: #F2F9FF;
        margin: 0 20px;
        margin-bottom: 10px;
        transition: all 0.2s;
        overflow: hidden;
        .filter {
            max-width: 1074px;
            p {
                display: inline-block;
                margin-right: 10px;
                margin-bottom: 10px;
                font-size: 12px;
            }
        }
        .ant-DatePicker-input {
            input {
                font-size: 12px;
                border-radius: 0px;
            }
        }
        .ant-price-input {
            width: 110px;
            border-radius: 0px;
            input {
                box-shadow: none;
                font-size: 12px;
                border-radius: 0px;
            }
        }
    }
    .show-filter {
        height: 107px;
        transition: all 0.2s;
        padding: 10px 0 10px 20px;
    }
    .person-table {
        padding: 0 20px;
    }
}
</style>