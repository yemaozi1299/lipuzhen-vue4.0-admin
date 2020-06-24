<template>
    <Card>
        <p slot="title">查看商品拼团价</p>
        <div class="good-detail">
            <img class="detail-img" :src="goods.faceUrl" alt="" />
            <div class="detail-title">{{ goods.name }}</div>
            <div class="detail-price">
                价格: <span>{{ goods.price }}</span
                >元
            </div>
        </div>
        <div class="field-list">
            <span class="field-item-label">设置减价：</span>
            <div class="field-item-panel">
                <RadioGroup v-model="header">
                    <Radio label="0" style="margin-right:15px;" disabled>
                        <span>团长无优惠</span>
                    </Radio>
                    <Radio label="1" style="margin-right:15px;" disabled>
                        <span>团长优惠</span>
                    </Radio>
                    <Radio label="2" style="margin-right:15px;" disabled>
                        <span>团长免单</span>
                    </Radio>
                </RadioGroup>
                <div class="sale-setting-table">
                    <Table
                        :columns="infoData.columns"
                        :data="infoData.data"
                        style=""
                        :border="true"
                        :width="width"
                    ></Table>
                </div>
                <div class="sale-setting-detail-table" v-for="item in detail">
                    <div class="detail-table-title">
                        {{ item.num }}人减价分规格设置
                    </div>
                    <Table
                        :columns="item.columns"
                        :data="item.data"
                        style=""
                        :border="true"
                    ></Table>
                </div>
            </div>
            <div style="margin-top:100px;margin-left: 125px;">
                <Button @click="$router.go(-1)">返回</Button>
            </div>
        </div>
    </Card>
</template>

<script type="text/javascript">
export default {
    data: function () {            //参团人数	减价设置	分规格设置
        return {
            width: 360,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            header: '0',
            detail: [],
            have_guige: 0,
            goods: {
                name: '商品名称',
                face: '',
                price: '0.00'
            },
            infoData: {
                columns: [
                    {
                        width: 120,
                        title: '参团人数',
                        render: (h, params) => {
                            return h('div', {}, params.row.num_of_people + '人');
                        },
                        align: 'center'
                    },
                    {
                        width: 120,
                        title: '优惠价设置',
                        render: (h, params) => {
                            return h('div', {}, params.row.price);
                        },
                        align: 'center'
                    },
                    {
                        width: 130,
                        title: '团长优惠价设置',
                        className: 'hidden',
                        render: (h, params) => {
                            return h('div', {}, params.row.leader_price);
                        },
                        align: 'center'
                    },
                    {
                        width: 119,
                        title: '分规格设置',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: params.row.guige == 0 ? '' : '#03f'
                                }
                            }, params.row.guige == 0 ? '无设置' : '见下表');
                        },
                    }
                ],
                data: []
            }
        }
    },
    watch: {
        'header': function (val) {
            if (val == 1) {
                this.infoData.columns[2].className = '';
                this.width = 480;
                // this.$set(this.infoData.columns[2], className, '');
            } else {
                this.infoData.columns[2].className = 'hidden';
                this.width = 360;
            }
        }
    },
    created () {
        this.fetchData();
        this.get();
    },
    methods: {
        fetchData: function () {
            this.goodsid = this.$route.query.goodsID;
            this.group_buy_id = this.$route.query.group_buy_id;
        },
        get: function () {
            var _this = this;
            var params = {
                action: 'groupbuy_see_goods',   //$goodsid=商品ID,$group_buy_id=团ID
                appid: this.vueAppid,
                group_buy_id: this.group_buy_id,
                goodsid: this.goodsid
            };
            // console.log(params);
            this.$http.post("/api_edit.php", this.$qs.stringify(params)).then(function (res) {
                console.log(res.data);
                if (res.data.status == 0) {
                    return _this.$Message.warning(res.data.message);
                }
                _this.goods = res.data.body.goods;

                _this.infoData.data = res.data.body.groupbuy;
                _this.editDetail(res.data.body.groupbuy);
                var data = res.data.body.groupbuy[0];
                if (data.guige == 1) {
                    _this.header = data.guigeinfo[0].leader_price == data.guigeinfo[0].price ? '0' : (data.guigeinfo[0].leader_price == 0 ? '2' : '1')
                } else {
                    _this.header = data.leader_price == data.price ? '0' : (data.leader_price == 0 ? '2' : '1')
                }
            });
        },
        editDetail: function (params) {
            var arr = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].guigeinfo) {
                    arr.push({
                        num: params[i].num_of_people,
                        header: 0,
                        price: 0,
                        status: false,
                        goods_guige: arr,
                        columns: [
                            { title: '规格1', key: 'guigename1', align: 'center', },
                            { title: '规格2', key: 'guigename2', align: 'center', },
                            // {title: '价格',key:'price',align: 'center',},
                            {
                                title: '优惠',
                                align: 'center',
                                key: 'price'
                            },
                        ],
                        data: params[i].guigeinfo
                    });
                }
            }
            this.detail = arr;
        },

        handleSubmit: function () {
            var _this = this;
            var arr = [];
            var params = {
                appid: this.vueAppid,
                action: 'groupbuy_add_goods',
                goodsid: this.goodsid,
                group_buy_id: this.group_buy_id,
                info: []
            };
            for (var i = 0; i < this.detail.length; i++) {
                arr.push({
                    num_of_people: this.detail[i].num,
                    leader_price: this.header == 2 ? 0 : this.detail[i].header,
                    normal_price: this.detail[i].price,
                    have_guige: this.detail[i].status ? 1 : 0,
                    goods_guige: this.detail[i].goods_guige
                });
            }
            params.info = arr;
            console.log(params);
            // return false;
            this.$http.post('/api_edit.php', this.$qs.stringify(params)).then(function (res) {
                console.log(res.data);
                _this.$router.go(-1);
            }).catch(function (response) {
                console.log(response);
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        }
    }
}
</script>

<style type="text/css">
.hidden {
    display: none;
}
.page-content-header {
    padding: 10px 0px;
    overflow: hidden;
    border-bottom: 1px solid #ccc;
    background-color: #fbfbfb;
}
.page-content-tabel {
    padding: 0 15px;
}
.col-left-div {
    padding-left: 15px;
    float: left;
}
.col-right-div {
    padding-right: 15px;
    float: right;
}
.good-detail {
    position: relative;
    height: 110px;
}
.good-detail .detail-img {
    position: absolute;
    top: 20px;
    left: 30px;
    width: 80px;
    height: 80px;
    border: 1px solid #ddd;
}
.good-detail .detail-title {
    position: absolute;
    top: 35px;
    left: 120px;
    line-height: 30px;
    height: 30px;
    font-size: 18px;
}
.good-detail .detail-price {
    position: absolute;
    top: 70px;
    left: 120px;
}
.field-list {
    margin-top: 15px;
    margin-left: 40px;
}
.field-item-label {
    vertical-align: top;
    font-weight: 300;
    margin-left: 50px;
    font-size: 14px;
}
.field-item-panel {
    width: 480px;
    display: inline-block;
}
.sale-setting-table {
    margin-top: 20px;
}
.sale-setting-detail-table {
    margin-top: 30px;
}
.detail-table-title {
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
}
.sale-setting-table .ivu-table-body {
    overflow-x: hidden;
}
</style>

