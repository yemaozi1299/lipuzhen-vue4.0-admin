<template>
    <div class="distribution-container-eidt">
        <Form
            ref="formValidate"
            :model="formValidate"
            :label-width="110"
            label-position="right"
            :rules="ruleValidate"
        >
            <div class="setting-div mode-setting">
                <p>模式设置</p>
                <div class="setting-area">
                    <div class="mode-switch">
                        <span
                            :class="{
                                active: formValidate.distribution_type == 1
                            }"
                            v-on:click="formValidate.distribution_type = 1"
                            >一级分销推广</span
                        >
                        <span
                            :class="{
                                active: formValidate.distribution_type == 2
                            }"
                            v-on:click="formValidate.distribution_type = 2"
                            >二级分销推广</span
                        >
                    </div>
                    <Form-item label="一级佣金比例" prop="first_commission">
                        <InputNumber
                            :max="20"
                            :min="0"
                            v-model="formValidate.first_commission"
                            :precision="0.001"
                            size="small"
                        ></InputNumber>
                        <span class="mg-l-10">%</span
                        ><span class="tips mg-l-10"
                            >注: 所有级别的佣金比例之和不能超过20</span
                        >
                    </Form-item>
                    <FormItem
                        label="二级佣金比例"
                        v-if="formValidate.distribution_type == 2"
                        prop="second_commission"
                    >
                        <InputNumber
                            :max="20"
                            :min="0"
                            v-model="formValidate.second_commission"
                            size="small"
                        ></InputNumber>
                        <span class="mg-l-10">%</span
                        ><span class="tips mg-l-10"
                            >注: 所有级别的佣金比例之和不能超过20</span
                        >
                    </FormItem>
                    <Row>
                        <Col span="24">
                            <FormItem label="促销部分产生佣金">
                                <i-switch
                                    v-model="formValidate.youhui_yongjin"
                                />
                                <span class="tips mg-l-10"
                                    >注：开启后使用优惠券、储值金、秒杀等抵扣金额部分产生佣金（按商品应付总金额计算佣金）</span
                                >
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
            <div class="setting-div apply-setting">
                <p>推广人员身份申请设置</p>
                <div class="setting-area">
                    <Row>
                        <Col span="4">
                            <FormItem label="消费门槛">
                                <i-switch
                                    v-model="formValidate.threshold_type"
                                    @on-change="changeThreshold"
                                />
                            </FormItem>
                        </Col>
                        <Col span="20">
                            <FormItem
                                label="至少在本店消费"
                                v-if="formValidate.threshold_type"
                                prop="threshold_price"
                            >
                                <InputNumber
                                    :min="1"
                                    v-model="formValidate.threshold_price"
                                    size="small"
                                ></InputNumber>
                                <span class="mg-l-10">元</span
                                ><span class="mg-l-10">才具备推广员资格</span>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
            <!-- <div class="setting-div apply-setting">
				<p>关系锁定</p>
				<div class="setting-area">
					<FormItem label="锁定下级关系周期">
					    <InputNumber :min="1" v-model="value1"></InputNumber>
					    <span class="mg-l-10">天</span><span class="tips mg-l-10">注：当新用户通过推广人员的二维码或小程序卡片进入小程序后，即锁定为该推广人员的下级用户。</span>
					</FormItem>
				</div>
			</div> -->
            <div class="setting-div apply-setting">
                <p>推广人员提现设置</p>
                <div class="setting-area">
                    <FormItem label="提现门槛" prop="withdraw_requirement">
                        <span class="mg-r-10">至少累计</span>
                        <InputNumber
                            :min="0"
                            v-model="formValidate.withdraw_requirement"
                            size="small"
                        ></InputNumber>
                        <span class="mg-l-10">元</span
                        ><span class="mg-l-10">生效佣金才可以提现</span>
                    </FormItem>
                </div>
            </div>
        </Form>
        <div class="button-group">
            <Button type="primary" @click="handleSubmit('formValidate')"
                >提交</Button
            >
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            formValidate: {
                distribution_type: '1',         //分销等级，1为一级，2为二级
                first_commission: 0,       //一级比例
                second_commission: 0,       //二级比例
                youhui_yongjin: false,

                threshold_type: 0,            //消费门槛
                threshold_price: 1.00,

                withdraw_requirement: 0.00
                // relationship_lock_time: 0,      //关系锁定天数

            },
            ruleValidate: {              //表单验证默认string，纯数字input需要设置type:'number'
                first_commission: [
                    { required: true, message: '佣金比例不能为空', trigger: 'blur', type: 'number' }
                ],

                second_commission: [
                    { required: true, message: '佣金比例不能为空', trigger: 'blur', type: 'number' }
                ],
                threshold_price: [
                    { required: true, message: '消费门槛金额不能为空', trigger: 'blur', type: 'number' }
                ],
                withdraw_requirement: [
                    { required: true, message: '提现门槛金额不能为空', trigger: 'blur', type: 'number' }
                ]
            }
        }
    },
    created () {
        this.get();
    },
    methods: {
        changeThreshold: function (e) {
            this.formValidate.threshold_price = e ? 1 : 0;
        },
        get: function () {
            var that = this;
            var data = {
                action: 'fenxiao_get',
                appid: that.vueAppid,
            };
            that.$Loading.start();
            that.$http.post("/block/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                that.$Loading.finish();
                if (res.data.status == 1) {
                    var data = res.data.body;
                    that.formValidate = {
                        distribution_type: parseFloat(data.layer),         //分销等级，1为一级，2为二级
                        first_commission: parseFloat(data.fenrunzhi1),       //一级比例
                        second_commission: parseFloat(data.fenrunzhi2),       //二级比例
                        youhui_yongjin: data.withOtherPromotion == 1 ? true : false,

                        threshold_type: data.menkan == 0 ? false : true,            //消费门槛
                        threshold_price: parseFloat(data.menkan),

                        withdraw_requirement: parseFloat(data.tixian)
                    };
                }
                console.log(res);

            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                console.log(response);
            });
        },
        handleSubmit: function (name) {
            var that = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (that.formValidate.distribution_type == '2' && that.formValidate.first_commission + that.formValidate.second_commission > 20) {
                        return that.$Message.error("所有级别的佣金比例之和不能超过20");
                    }
                    var formValidate = that.formValidate;
                    var data = {
                        action: "fenxiao_set",
                        appid: that.vueAppid,
                        info: {
                            layer: formValidate.distribution_type,         //分销级别
                            fenrunzhi1: formValidate.first_commission,     //一级分销比例
                            fenrunzhi2: formValidate.second_commission,   //二级分销比例
                            menkan: formValidate.threshold_price,         //消费门槛
                            tixian: formValidate.withdraw_requirement,    //提现门槛
                            withOtherPromotion: formValidate.youhui_yongjin ? 1 : 0    //促销是否产生佣金
                        }
                    };
                    console.log(data);
                    that.$Loading.start();
                    that.$http.post("/block/api_edit.php", that.$qs.stringify(data)).then(function (res) {
                        that.$Loading.finish();
                        console.log(res);
                        that.$Message.success("提交成功")
                    }).catch(function (response) {
                        that.$Loading.error();
                        that.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                        console.log(response);
                    });

                }
            });
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.distribution-container-eidt {
    padding: 20px 0 0 20px;
    background: #fff;
    margin-bottom: 10px;
    .setting-div {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 20px;
        > p {
            display: flex;
            align-items: center;
            min-width: 160px;
            max-width: 160px;
            padding-left: 20px;
            margin-right: 20px;
            background-color: #F6F7FB;
            color: #333;
            font-size: 12px;
        }
        .setting-area {
            width: 100%;
            font-size: 14px;
            .mode-switch {
                margin-bottom: 10px;
                color: #59607B;
                display: flex;
                align-items: center;
                span {
                    cursor: pointer;
                    position: relative;
                    display: inline-block;
                    width: 109px;
                    height: 30px;
                    line-height: 30px;
                    box-sizing: border-box;
                    font-size: 12px;
                    border: 1px solid #dedede;
                    text-align: center;
                    &:first-child {
                        border-top-left-radius: 5px;
                        border-bottom-left-radius: 5px;
                    }
                    &:last-child {
                        border-top-right-radius: 5px;
                        border-bottom-right-radius: 5px;
                    }
                    &.active {
                        border-color: #3091f2;
                    }
                }
            }
        }
    }
    .button-group {
        padding: 40px 0 74px 289px;
    }
    .mg-r-10 {
        margin-right: 10px;
    }
    .mg-l-10 {
        margin-left: 10px;
    }
    .tips {
        color: #9FA5BB;
    }
    .ivu-form-item {
        margin-bottom: 10px;
    }
    .ivu-form .ivu-form-item-label, .ivu-form-item-content {
        font-size: 12px;
    }
}
</style>