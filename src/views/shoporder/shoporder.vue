<template>
    <Card class="shoporder-wrapper">
        <div style="margin-bottom:10px">
            <Menu
                mode="horizontal"
                theme="light"
                :active-name="shoptype"
                @on-select="changeshoptype"
                class="menu-box"
            >
                <MenuItem name="ec">
                    <Icon type="android-playstore"></Icon>普通商品</MenuItem
                >
                <MenuItem name="jifen">
                    <Icon type="android-bicycle"></Icon>积分商品</MenuItem
                >
                <!-- <MenuItem name="stored">
                    <Icon type="cash"></Icon>储值</MenuItem> -->
            </Menu>
        </div>
        <div>
            <Form :model="formSearch" :label-width="80">
                <Row :gutter="16">
                    <Col span="10">
                        <Form-item label="下单时间">
                            <Date-picker
                                v-model="searchdate"
                                format="yyyy-MM-dd"
                                type="datetimerange"
                                :options="searchdateOption"
                                placeholder="选择日期"
                                @on-ok="handleOk"
                            ></Date-picker>
                        </Form-item>
                    </Col>
                    <Col span="9">
                        <Input
                            v-model="formSearch.keyword"
                            placeholder="关键字"
                        >
                            <Select
                                v-model="formSearch.searchtype"
                                slot="prepend"
                                placeholder="订单号"
                                style="width: 100px"
                            >
                                <Option value="number">订单号</Option>
                                <Option value="receiver">收货人姓名</Option>
                                <Option value="mobile"
                                    >收货人手机号</Option
                                ></Select
                            >
                        </Input>
                    </Col>
                    <Col span="5">
                        <Button type="primary" @click="search">筛选</Button>
                        <template v-if="isSearching">
                            <Button @click="search_esc">取消</Button></template
                        >
                    </Col>
                </Row>
            </Form>
        </div>
        <Row>
            <Col span="11" v-if="name == 'ec' || name == 'jifen'">
                <Radio-group v-model="ordertype" type="button">
                    <Radio label="">全部</Radio>
                    <Radio label="0">待付款</Radio>
                    <Radio label="1">待发货</Radio>
                    <Radio label="2">已发货</Radio>
                    <Radio label="3">已完成</Radio>
                    <Radio label="7">已取消</Radio></Radio-group
                >
            </Col>
            <Col span="10" v-else>
                <Radio-group v-model="ordertype" type="button">
                    <Radio label="">全部</Radio>
                    <Radio label="0">待付款</Radio>
                    <Radio label="1">已完成</Radio></Radio-group
                >
            </Col>
            <Col span="13">
                <Page
                    :total="total"
                    :current="page"
                    :page-size="pageno"
                    show-total
                    show-elevator
                    @on-change="skippage"
                ></Page>
            </Col>
        </Row>

        <div v-if="name == 'ec' || name == 'jifen'">
            <div class="itembox">
                <!-- <Row type="flex" justify="center" align="top" class="code-row-bg3">
                    <Col span="10">商品信息</Col>
                    <Col span="5">下单时间</Col>
                    <Col span="2">快递费</Col>
                    <Col span="2">实付金额</Col>
                    <Col span="3">支付方式</Col>
                    <Col span="2">订单状态</Col>
                </Row> -->
            </div>

            <div v-if="total > 0">
                <Table
                    :columns="columns"
                    :data="items"
                    size="small"
                    ref="table"
                ></Table>
                <div style="padding: 20px 0;">
                    <Page
                        :total="total"
                        :current="page"
                        :page-size="pageno"
                        show-total
                        show-elevator
                        @on-change="skippage"
                    ></Page>
                </div>
            </div>
            <div v-else>
                <div class="no-record">查无记录</div>
            </div>
        </div>
        <!-- 商品 买家信息 交易状态 类型 储值金额(元) 实收: 元 -->
        <div v-if="name == 'stored'">
            <div class="itembox">
                <Row
                    type="flex"
                    justify="center"
                    align="top"
                    class="code-row-bg3"
                >
                    <Col span="4">储值名称</Col>
                    <Col span="4">买家信息</Col>
                    <Col span="4">交易状态</Col>
                    <Col span="4">类型</Col>
                    <Col span="4">储值金额(元)</Col>
                    <Col span="4">实收: 元</Col>
                </Row>
            </div>
            <div v-if="total > 0">
                111111
            </div>
            <div v-else>
                <div class="no-record">查无记录</div>
            </div>
        </div>

        <Modal
            v-model="isOrderPriceEdit"
            title="修改实付金额"
            @on-ok="orderPriceEdit()"
            @on-cancel=""
            :loading="orderPriceEditLoading"
        >
            <label style="display:block;margin-bottom:10px">
                <span>订单号：</span>
                <span>{{ activeNumber }}</span>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>实付金额：</span>
                <Input
                    type="text"
                    style="width:200px;"
                    v-model="orderPrice"
                ></Input>
            </label>
        </Modal>

        <Modal
            v-model="orderPost.isModal"
            title="填写订单物流信息"
            @on-ok="goodsOrderPost()"
            @on-cancel=""
            :loading="orderPost.loading"
        >
            <label style="display:block;margin-bottom:10px">
                <span>订单号：</span>
                <span>{{ activeNumber }}</span>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>快递公司：</span>
                <Select v-model="orderPost.postname" style="width:200px">
                    <Option
                        v-for="item in expressList"
                        :value="item.name"
                        :key="item.id"
                        >{{ item.name }}</Option
                    >
                </Select>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>快递单号：</span>
                <Input
                    type="text"
                    style="width:200px;"
                    v-model="orderPost.postnumber"
                ></Input>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>发货时间：</span>
                <DatePicker
                    type="date"
                    placeholder="发货日期"
                    style="width: 200px"
                    format="yyyy-MM-dd"
                    @on-change="setPostDate"
                ></DatePicker>
                -
                <TimePicker
                    type="time"
                    placeholder="Select time"
                    style="width: 168px"
                    v-model="orderPost.posttime"
                ></TimePicker>
            </label>
        </Modal>
        <!-- this.activeNumber = params.row.number;
                                                this.showPostname = params.row.postname;
                                                this.showPostnumber = params.row.postnumber; -->
        <Modal
            v-model="modal1"
            title="发货信息"
            @on-ok="modal1 = false"
            @on-cancel="modal1 = false"
        >
            <label style="display:block;margin-bottom:10px">
                <span>订单号：</span>
                <span>{{ activeNumber }}</span>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>快递公司：</span>
                <span>{{ showPostname }}</span>
            </label>
            <label style="display:block;margin-bottom:10px">
                <span>快递单号：</span>
                <span>{{ showPostnumber }}</span>
            </label>
        </Modal>
    </Card>
</template>
<script>export
    default {
        data () {
            function insert (h, params) {
                var arr = [h("div", {}, "订单号：" + params.row.number + " | 姓名：" + params.row.receiver + " | 手机号：" + params.row.mobile + " | 地址：" + params.row.province + params.row.city + params.row.area + params.row.address)];
                for (var i = 0; i < params.row.goodslist.length; i++) {
                    var goods = params.row.goodslist[i];
                    arr.push(h("div", [
                        h("img", {
                            attrs: {
                                src: goods.face
                            },
                            style: {
                                "margin": '10px 10px 0px 0px',
                                width: '50px',
                                height: '50px',
                                "vertical-align": "middle"
                            },
                        }),
                        h("span", {
                            attrs: {
                                class: "goods-name",
                            },

                        }, "名称：" + goods.name),
                        h("span", {
                            attrs: {
                                class: "goods-price",
                            }
                        }, "金额：" + goods.price),
                        h("span", {
                            attrs: {
                                class: "goods-num",
                            }
                        }, "数量：" + goods.how),
                    ], ""));
                }

                return arr;
            }
            return {
                modal1: false,
                showPostname: '',
                showPostnumber: '',
                expressList: [{ "id": "152", "code": "YZPY", "name": "邮政快递", "weight": "10", "add_time": "1458728085" }, { "id": "151", "code": "ZTO", "name": "中通速递", "weight": "10", "add_time": "1458728085" }, { "id": "135", "code": "YTO", "name": "圆通速递", "weight": "10", "add_time": "1458728085" }, { "id": "101", "code": "STO", "name": "申通快递", "weight": "10", "add_time": "1458728085" }, { "id": "95", "code": "SF", "name": "顺丰快递", "weight": "10", "add_time": "1458728085" }, { "id": "86", "code": "QFKD", "name": "全峰快递", "weight": "10", "add_time": "1458728085" }, { "id": "55", "code": "JD", "name": "京东快递", "weight": "10", "add_time": "1458728085" }, { "id": "42", "code": "HHTT", "name": "天天快递", "weight": "10", "add_time": "1458728085" }, { "id": "37", "code": "GTO", "name": "国通快递", "weight": "10", "add_time": "1458728085" }, { "id": "23", "code": "EMS", "name": "EMS", "weight": "10", "add_time": "1458728085" }, { "id": "16", "code": "DBL", "name": "德邦", "weight": "10", "add_time": "1458728085" }, { "id": "10", "code": "BTWL", "name": "百世物流", "weight": "10", "add_time": "1458728085" }, { "id": "149", "code": "ZYWL", "name": "中邮物流", "weight": "0", "add_time": "1458728085" }, { "id": "146", "code": "ZTWL", "name": "中铁物流", "weight": "0", "add_time": "1458728085" }, { "id": "144", "code": "ZTKY", "name": "中铁快运", "weight": "0", "add_time": "1458728085" }, { "id": "141", "code": "ZMKM", "name": "芝麻开门", "weight": "0", "add_time": "1458728085" }, { "id": "140", "code": "ZJS", "name": "宅急送", "weight": "0", "add_time": "1458728085" }, { "id": "134", "code": "YTKD", "name": "运通快递", "weight": "0", "add_time": "1458728085" }, { "id": "132", "code": "YTD", "name": "易通达", "weight": "0", "add_time": "1458728085" }, { "id": "126", "code": "YFSD", "name": "亚风快递", "weight": "0", "add_time": "1458728085" }, { "id": "125", "code": "YFHEX", "name": "原飞航物流", "weight": "0", "add_time": "1458728085" }, { "id": "124", "code": "YFEX", "name": "越丰物流", "weight": "0", "add_time": "1458728085" }, { "id": "122", "code": "YD", "name": "韵达快递", "weight": "0", "add_time": "1458728085" }, { "id": "121", "code": "YCWL", "name": "远成物流", "weight": "0", "add_time": "1458728085" }, { "id": "119", "code": "YADEX", "name": "源安达快递", "weight": "0", "add_time": "1458728085" }, { "id": "115", "code": "XFEX", "name": "信丰快递", "weight": "0", "add_time": "1458728085" }, { "id": "114", "code": "XBWL", "name": "新邦物流", "weight": "0", "add_time": "1458728085" }, { "id": "113", "code": "WXWL", "name": "万象物流", "weight": "0", "add_time": "1458728085" }, { "id": "111", "code": "WJWL", "name": "万家物流", "weight": "0", "add_time": "1458728085" }, { "id": "109", "code": "UAPEX", "name": "全一快递", "weight": "0", "add_time": "1458728085" }, { "id": "108", "code": "TSSTO", "name": "唐山申通", "weight": "0", "add_time": "1458728085" }, { "id": "103", "code": "SURE", "name": "速尔快递", "weight": "0", "add_time": "1458728085" }, { "id": "102", "code": "STSD", "name": "三态速递", "weight": "0", "add_time": "1458728085" }, { "id": "98", "code": "SHWL", "name": "盛辉物流", "weight": "0", "add_time": "1458728085" }, { "id": "96", "code": "SFWL", "name": "盛丰物流", "weight": "0", "add_time": "1458728085" }, { "id": "88", "code": "RFD", "name": "如风达", "weight": "0", "add_time": "1458728085" }, { "id": "85", "code": "QCKD", "name": "全晨快递", "weight": "0", "add_time": "1458728085" }, { "id": "81", "code": "NEDA", "name": "能达速递", "weight": "0", "add_time": "1458728085" }, { "id": "78", "code": "MHKD", "name": "民航快递", "weight": "0", "add_time": "1458728085" }, { "id": "73", "code": "LHT", "name": "联昊通速递", "weight": "0", "add_time": "1458728085" }, { "id": "70", "code": "LB", "name": "龙邦快递", "weight": "0", "add_time": "1458728085" }, { "id": "69", "code": "KYWL", "name": "跨越速递", "weight": "0", "add_time": "1458728085" }, { "id": "68", "code": "KYDSD", "name": "快优达速递", "weight": "0", "add_time": "1458728085" }, { "id": "65", "code": "JYWL", "name": "佳怡物流", "weight": "0", "add_time": "1458728085" }, { "id": "63", "code": "JYM", "name": "加运美", "weight": "0", "add_time": "1458728085" }, { "id": "62", "code": "JYKD", "name": "晋越快递", "weight": "0", "add_time": "1458728085" }, { "id": "61", "code": "JXD", "name": "急先达", "weight": "0", "add_time": "1458728085" }, { "id": "59", "code": "JLDT", "name": "嘉里大通", "weight": "0", "add_time": "1458728085" }, { "id": "57", "code": "JIUYE", "name": "九曳供应链", "weight": "0", "add_time": "1458728085" }, { "id": "56", "code": "JGSD", "name": "京广速递", "weight": "0", "add_time": "1458728085" }, { "id": "51", "code": "HTKY", "name": "百世汇通", "weight": "0", "add_time": "1458728085" }, { "id": "49", "code": "HQKY", "name": "华企快运", "weight": "0", "add_time": "1458728085" }, { "id": "47", "code": "HOAU", "name": "天地华宇", "weight": "0", "add_time": "1458728085" }, { "id": "45", "code": "HMJKD", "name": "黄马甲快递", "weight": "0", "add_time": "1458728085" }, { "id": "44", "code": "HLWL", "name": "恒路物流", "weight": "0", "add_time": "1458728085" }, { "id": "35", "code": "GSD", "name": "共速达", "weight": "0", "add_time": "1458728085" }, { "id": "26", "code": "FEDEX", "name": "FedEx联邦快递", "weight": "0", "add_time": "1458728085" }, { "id": "24", "code": "FAST", "name": "快捷速递", "weight": "0", "add_time": "1458728085" }, { "id": "21", "code": "DTWL", "name": "大田物流", "weight": "0", "add_time": "1458728085" }, { "id": "6", "code": "BFDF", "name": "百福东方", "weight": "0", "add_time": "1458728085" }, { "id": "4", "code": "AXD", "name": "安信达快递", "weight": "0", "add_time": "1458728085" }, { "id": "3", "code": "ANE", "name": "安能物流", "weight": "0", "add_time": "1458728085" }, { "id": "2", "code": "AJ", "name": "安捷快递", "weight": "0", "add_time": "1458728085" }],
                orderPost: {
                    isModal: false,
                    id: "",
                    postdate: "",
                    posttime: "",
                    postname: "",   //快递公司名称
                    postnumber: "",   //快递单号
                    loading: true,
                    index: ""
                },
                isOrderPriceEdit: false,
                orderPriceEditLoading: true,
                activeNumber: "",
                orderPrice: 0,
                orderID: 0,
                _index: 0,
                columns: [
                    {
                        "title": "商品信息",
                        "align": "left",
                        render: (h, params) => {
                            return h('div', insert(h, params), "");
                        }
                    },
                    {
                        "title": "下单时间",
                        "key": "createtime",
                        "align": "center",
                        "width": 241
                    },
                    {
                        "title": "快递费",
                        "key": "postmoney",
                        "align": "center",
                        "width": 120
                    },
                    {
                        "title": "实付金额",
                        "key": "money",
                        "align": "center",
                        "width": 120
                    },
                    {
                        "title": "订单状态",
                        "align": "center",
                        "width": 110,
                        "height": 250,
                        render: (h, params) => {   //0待付款 1待发货 2已发货 3已完成 4已退货  7用户未支付前点取消
                            return h('div', [
                                h("div", {}, params.row.attrib == 0 ? "待付款" : (params.row.attrib == 1 ? "待发货" : (params.row.attrib == 2 ? "已发货" : (params.row.attrib == 3 ? "已完成" : (params.row.attrib == 4 ? "已退货" : (params.row.attrib == 7 ? "订单已取消" : "")))))),
                                h('div', {

                                    style: {
                                        color: '#39f',
                                        display: "block"
                                    },
                                    on: {
                                        click: () => {
                                            /*
                                                isOrderPriceEdit: false,
                                                orderPriceEditLoading: true,
                                                activeNumber: "",
                                                orderPrice: 0
        
                                            */
                                            if (params.row.attrib == 2) {    //查看发货信息
                                                this.modal1 = true;
                                                this.activeNumber = params.row.number;
                                                this.showPostname = params.row.postname;
                                                this.showPostnumber = params.row.postnumber;
                                                console.log(params.row);
                                            }
                                            console.log(params.row);
                                        }
                                    }
                                }, (params.row.attrib == 2 && this.shoptype == 'ec') ? "发货信息" : ""),
                                h('div', {

                                    style: {
                                        color: params.row.groupbuyCanPost == 1 ? '#39f' : '',
                                        display: "block"
                                    },
                                    on: {
                                        /*
                                            orderPost:{
                                                isModal: false,
                                                id: "",
                                                posttime: "",
                                                postname: "",   //快递公司名称
                                                postnumber: "",   //快递单号
                                                loading: true
                                            }
                                        */
                                        click: () => {
                                            if (params.row.attrib == 1 && this.shoptype == 'ec' && params.row.groupbuyCanPost == 1) {
                                                this.orderPost.isModal = true;
                                                this.orderPost.id = params.row.id;
                                                this.activeNumber = params.row.number;
                                                this.orderPost.index = params.row._index;
                                                this.orderPost.postdate = "";
                                                this.orderPost.posttime = "";
                                                this.orderPost.postname = "";
                                                this.orderPost.postnumber = "";

                                            } else if (params.row.attrib == 2) {
                                                var _this = this;
                                                this.$Modal.confirm({
                                                    content: '确定要退货吗？',
                                                    cancelText: '取消',
                                                    onOk: function () {
                                                        _this.orderReturn(params.row);
                                                    },
                                                    onCancel: function () {
                                                    }
                                                });

                                            } else if (params.row.attrib == 1 && this.shoptype == 'jifen') {
                                                this.orderPost.id = params.row.id;
                                                this.orderPost.index = params.row._index;
                                                this.goodsOrderPost();
                                            }
                                        }
                                    }
                                }, params.row.attrib == 0 ? "" : (params.row.groupbuyCanPost == 0 ? '等待拼团结束' : (params.row.groupbuyCanPost == 1 && params.row.attrib == 1) ? "发货" : (params.row.attrib == 2 ? "退货" : ""))),
                                h('div', {

                                    style: {
                                        color: '#f90',
                                        display: "block"
                                    },
                                    on: {
                                        click: () => {
                                            if (params.row.attrib == 0) {    //查看发货信息
                                                this.waimaiCashPayAndFinish(params.row);

                                            }
                                            console.log(params.row);
                                        }
                                    }
                                }, (params.row.attrib == 0 && params.row.paycash == 1) ? "结算" : "")   //(params.row.attrib == 0 && params.row.paycash == 1) ? "结算" : ""
                            ], "");
                        }
                    },
                ],
                name: 'ec',
                vueAppid: this.$cookieStore.get("CookVueAppid"),
                formSearch: {
                    searchtype: '',
                    keyword: '',
                    starttime: '',
                    endtime: '',
                },
                items: [],
                ordertype: '',
                page: 1,
                pageno: 10,
                total: 0,
                searchdate: '',
                shoptype: 'ec',
                isSearching: false,
                searchdateOption: {
                    shortcuts: [{
                        text: '最近一周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近一个月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近三个月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            return [start, end];
                        }
                    }]
                }
            };
        },
        created () {
            this.name = this.$route.params.shoptype || 'ec';
            this.get();
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            ordertype: function () {
                this.get();
            }
        },
        methods: {
            orderReturn: function (params) {
                var _this = this;
                var data = {
                    appid: this.vueAppid,
                    action: "goods_orderReturn",
                    id: params.id,
                }
                console.log(data);
                _this.$http.request({
                    method: "POST",
                    url: "/api_edit.php",
                    params: data
                }).then(function (response) {
                    if (response.data.status == 1) {
                        _this.items[params._index].attrib = 4;

                        _this.$Message.success("已退货");
                    } else {
                        setTimeout(function () {
                            _this.orderPriceEditLoading = false;
                        }, 1000);
                        setTimeout(function () {
                            _this.orderPriceEditLoading = true;
                        }, 2000);
                        _this.$Message.info(response.data.message);
                    }
                });

            },
            setPostDate: function (val) {
                this.orderPost.postdate = val;
            },
            goodsOrderPost: function () {
                /*
                    this.orderPost.isModal = true;
                    this.orderPost.id = params.row.id;
                    this.activeNumber = params.row.number;
                */
                var _this = this;
                if (this.shoptype == 'ec') {
                    var data = {
                        appid: this.vueAppid,
                        action: "goods_orderPost",
                        id: this.orderPost.id,
                        postname: this.orderPost.postname,
                        postnumber: this.orderPost.postnumber,
                        posttime: this.orderPost.postdate + " " + this.orderPost.posttime,
                    }
                } else if (this.shoptype == 'jifen') {
                    var data = {
                        appid: this.vueAppid,
                        action: "goods_orderPost",
                        id: this.orderPost.id,
                    }
                }

                console.log(data);

                _this.$http.post('/api_edit.php', data).then(function (response) {
                    console.log(response.data);
                    if (response.data.status == 1) {
                        _this.orderPost.isModal = false;
                        _this.orderPost.loading = false;
                        _this.items[_this.orderPost.index].attrib = 2;

                        _this.$Message.success("发货成功");
                    } else {
                        setTimeout(function () {
                            _this.orderPriceEditLoading = false;
                        }, 1000);
                        setTimeout(function () {
                            _this.orderPriceEditLoading = true;
                        }, 2000);
                        _this.$Message.info(response.data.message);
                    }

                });
            },
            orderPriceEdit: function () {
                var _this = this;
                if (this.orderPrice < 0) {
                    _this.$Message.warning("实付金额不能小于0");
                    setTimeout(function () {
                        _this.orderPriceEditLoading = false;
                    }, 2000);
                    setTimeout(function () {
                        _this.orderPriceEditLoading = true;
                    }, 2500);
                    return false;
                }
                var data = {
                    appid: this.vueAppid,
                    action: "goods_orderPriceEdit",
                    id: this.orderID,
                    price: this.orderPrice
                }


                _this.$http.post('/api_edit.php', data).then(function (response) {
                    if (response.data.status == 1) {
                        _this.isOrderPriceEdit = false;
                        _this.orderPriceEditLoading = false;
                        _this.items[_this._index].money = _this.orderPrice;
                        _this.$Message.success("修改成功");
                    } else {
                        setTimeout(function () {
                            _this.orderPriceEditLoading = false;
                        }, 1000);
                        setTimeout(function () {
                            _this.orderPriceEditLoading = true;
                        }, 2000);
                        _this.$Message.info(response.data.message);
                    }

                });
            },
            fetchData: function () {
                this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1;
                this.shoptype = this.$route.params.shoptype || 'ec';
                this.name = this.$route.params.shoptype || 'ec';
                this.get();
            },

            skippage: function (page) {
                // this.$router.push({ name: 'shop', params: { page: page }});
                this.$router.push({
                    path: '/shoporder/' + page + '/' + this.shoptype
                });
            },
            changeshoptype: function (name) {
                this.name = name;
                if (name == 'ec') {
                    this.$router.push({
                        path: '/shoporder/1/ec'
                    });

                } else if (name == 'jifen') {
                    this.$router.push({
                        path: '/shoporder/1/jifen'
                    });
                } else if (name == 'stored') {
                    this.$router.push({
                        path: '/shoporder/1/stored'
                    });
                }
            },

            get: function () {
                var _this = this;

                this.shoptype = this.$route.params.shoptype || 'ec';

                var apiurl = "/api_edit.php";
                var data = {
                    appid: this.vueAppid
                };
                data.action = "goods_orderList";
                data.shoptype = this.shoptype == "ec" ? 0 : (this.shoptype == "jifen" ? 1 : 2); //0=普通商品订单 1=外卖订单 2=储值信息
                data.page = this.page;
                data.pageno = this.pageno;

                data.searchtype = this.formSearch.searchtype; //searchtype number=订单号 receiver=收货人姓名 mobile=收货人手机号
                data.keyword = this.formSearch.keyword;
                data.starttime = this.formSearch.starttime;
                data.endtime = this.formSearch.endtime;
                data.ordertype = this.ordertype; //ordertype 全部 待付款0 待发货1 已发货2 已完成3
                console.log(data);

                _this.$http.post(apiurl, data).then(function (response) {

                    if (response.data.status == 1) {
                        _this.total = response.data.total;
                        _this.page = response.data.page;
                        _this.items = response.data.body;

                        console.log(response.data.body);
                    } else {
                        _this.total = 0;
                    }


                })

            },
            getNowFormatDate: function (date) {
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            handleOk: function () {
                console.log(this.searchdate);
                return typeof this.searchdate[0] == "object" ? (this.formSearch.starttime = this.getNowFormatDate(this.searchdate[0]),
                    this.formSearch.endtime = this.getNowFormatDate(this.searchdate[1]),
                    this.isSearching = true,
                    this.get()) : this.$Message.warning("请选择日期");

            },
            search: function () {
                console.log(this.searchdate);
                return this.formSearch.keyword ? (this.formSearch.starttime = '',
                    this.formSearch.endtime = '', this.get()) : this.$Message.warning("请输入关键字");

            },
            search_esc: function () {
                this.formSearch.searchtype = '';
                this.formSearch.keyword = '';
                this.formSearch.starttime = '';
                this.formSearch.endtime = '';
                this.ordertype = '';
                this.page = 1;
                this.isSearching = false;
                this.searchdate = '';
                this.get();
            },
            del: function (id) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: "确定删除所选记录吗?",
                    onOk: () => {

                        var apiurl = "/api_edit.php";
                        var data = {
                            appid: this.vueAppid
                        };
                        var delid = [];
                        delid[0] = id;

                        data.action = "goods_postDel";
                        data.delid = delid;

                        _this.$http.post(apiurl, data).then(function (response) {
                            if (response.data.status == 1) {
                                _this.$Message.success(response.data.message);
                                _this.fetchData();
                            } else { }

                        })

                    },
                    onCancel: () => {
                        // this.$Message.info('点击了取消');
                    }
                });
            },
            waimaiCashPayAndFinish: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: "确认结账吗?",
                    onOk: () => {

                        var apiurl = "/api_edit.php";
                        var data = {
                            action: "waimaiCashPayAndFinish",
                            appid: this.vueAppid,
                            number: row.number
                        };
                        console.log(data);
                        _this.$http.post(apiurl, data).then(function (response) {
                            console.log(response)
                            _this.get();

                        })
                    },
                    onCancel: () => {
                        // this.$Message.info('点击了取消');
                    }
                });
            }
        }
    };</script>
<style lang="stylus" rel="stylesheet/stylus">
.shoporder-wrapper {
    .menu-box {
        margin-bottom: 20px;
        height: 40px;
        line-height: 20px;
    }
    .code-row-bg3 {
        padding: 10px 0;
        text-align: center;
        font-weight: bold;
        background: #f7f7f7;
    }
    .code-row-bg4 {
        padding-top: 10px;
        margin-bottom: 0px;
        text-align: center;
    }
    .orderheader {
        padding: 5px;
        margin-bottom: 0px;
        text-align: left;
        background: #f7f7f7;
        border-bottom: 1px solid #e7e7e7;
    }
    .goodsline {
        padding-left: 10px;
        padding-bottom: 5px;
        text-align: left;
    }
    .goodsline img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
    .goods-name, .goods-num, .goods-price {
        display: inline-block;
        width: 120px;
        text-align: left;
        word-break: break-all;
        vertical-align: middle;
    }
    .areaname {
        padding: 0 10px;
        text-align: left;
    }
    .linebg {
        margin-bottom: 0px;
    }
    .post-input {
        text-align: center;
    }
    .itembox {
        border: 1px solid #D0CACA;
        margin: 10px 0;
    }
    .searchbox {
        border: 1px solid #D0CACA;
        margin: 10px 0;
        padding: 10px;
    }
    .itembox_header {
        border-bottom: 1px solid #9C9898;
        background: #fdfdfd;
        padding: 0 12px;
        line-height: 40px;
    }
    .no-record {
        text-align: center;
    }
}
</style>

