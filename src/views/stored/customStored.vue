<template>
    <Card>
        <p slot="title">
            自定义储值设置
        </p>
        <div class="stored-content">
            <div class="stored-form">
                <Form
                    ref="formValidate"
                    :model="formValidate"
                    :rules="ruleValidate"
                    :label-width="150"
                >
                    <Form-item
                        label="用户自定义储值金："
                        style="margin-top:10px"
                        prop="stored_name"
                    >
                        <i-switch v-model="formValidate.status"></i-switch>
                    </Form-item>
                    <Form-item
                        label="赠送储值金设置："
                        style="margin-top:10px"
                        prop="stored_name"
                        v-if="formValidate.status"
                    >
                        <RadioGroup
                            v-model="formValidate.type"
                            vertical
                            @on-change="ChangeType"
                        >
                            <Radio label="0">
                                <span>不赠送</span>
                            </Radio>
                            <!-- <Radio label="1">
			                    <span>按比例赠送：至少充</span>
			                    <Input type="text" v-model="formValidate.tiaojian" style="width:70px" size="small"></Input>
			                    <span>元，赠送比例</span>
			                    <Input type="text" v-model="formValidate.value" style="width:70px" size="small"></Input>
			                    <span>例:填入0.1，则赠送金额储值金=充值储值金*0.1</span>
			                </Radio> -->
                            <Radio label="2">
                                <span>按区间赠送：每充值</span>
                                <InputNumber
                                    v-model="formValidate.tiaojian"
                                    size="small"
                                    :disabled="isDisabled"
                                ></InputNumber>
                                <span>元，赠送</span>
                                <InputNumber
                                    type="text"
                                    v-model="formValidate.value"
                                    size="small"
                                    :disabled="isDisabled"
                                ></InputNumber>
                                <span>元</span>
                            </Radio>
                        </RadioGroup>
                    </Form-item>
                </Form>
            </div>
            <div class="stored-btn">
                <Button
                    type="primary"
                    @click="handleSubmit('formValidate')"
                    style="margin-right:10px"
                    >提交</Button
                >
                <Button @click="$router.go(-1)">取消</Button>
            </div>
        </div>
    </Card>
</template>

<script type="text/javascript">
export default {
    data: function () {
        var that = this;
        var verifyCardInfo = function (rule, value, callback) {
            switch (rule.field) {
                case 'type':
                    if (value == 0) {
                        that.formValidate.tiaojian = 0;
                        that.formValidate.value = 0;
                    } else if (value == 1) {
                        // that.formValidate.tiaojian = '';
                        if (!that.formValidate.tiaojian || !that.formValidate.value) {
                            that.$Message.warning('充值金额和赠送金额不能为空');
                            return callback(new Error('充值金额和赠送金额不能为空'));
                        } else if (that.formValidate.value > 1 || that.formValidate.value < 0) {
                            that.$Message.warning('请输入1至0.1之间的数');
                            return callback(new Error('请输入1至0.1之间的数'));
                        }
                    } else if (value == 2) {
                        if (!that.formValidate.tiaojian || !that.formValidate.value) {
                            that.$Message.warning('充值金额和赠送金额不能为空');
                            return callback(new Error('充值金额和赠送金额不能为空'));
                        } else if (that.formValidate.tiaojian <= 0) {
                            that.$Message.warning('充值金额不能小于或等于0，至少要0.01');
                            return callback(new Error('充值金额不能小于或等于0，至少要0.01'));
                        }
                    }
                    callback();
                    break;


            }
        }
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            data: [],
            isDisabled: false,
            formValidate: {
                type: 1,
                status: false,
                tiaojian: '',
                value: ''
            },
            ruleValidate: {
                type: [
                    { validator: verifyCardInfo }
                ]
            }
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        ChangeType: function (e) {
            this.isDisabled = e == 0 ? true : false
        },
        get: function () {
            var _this = this;
            var data = {
                action: 'chongzhiDIY_get',
                appid: this.vueAppid
            };
            this.$Loading.start();
            _this.$http.post('/block/api_edit.php', _this.$qs.stringify(data)).then(function (response) {

                if (response.data.status == 1) {
                    var data = response.data.body;
                    _this.formValidate = {
                        type: data.g_price > 0 ? '2' : '0',
                        tiaojian: parseFloat(data.price || 0),
                        value: parseFloat(data.g_price || 0),
                        status: data.status == '1' ? true : false,
                    };
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        save: function () {
            var _this = this;
            this.data.push(this.formValidate);
            var jsondata = JSON.stringify(this.data);
            var data = {
                action: 'chuzhi_DIY',
                price: this.formValidate.tiaojian,
                g_price: this.formValidate.value,
                status: this.formValidate.status ? 1 : 0,
                appid: this.vueAppid
            };
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/block/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.$Message.success('提交成功!');
                    _this.$router.push({ path: '/stored' });
                    // _this.$router.go(-1);
                } else {
                    _this.$Message.error(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        handleSubmit: function (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    _this.save();
                }
            });
        }
    }
}
</script>
<style type="text/css">
.stored-form {
    margin-left: 100px;
}
.stored-btn {
    margin-top: 20px;
    margin-left: 250px;
}
</style>