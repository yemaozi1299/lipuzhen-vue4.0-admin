<template>
    <div class="stored-page">
        <div class="stored-nav">
            <div class="nav-left">修改储值项目</div>
        </div>
        <div class="stored-content">
            <div class="stored-form">
                <Form
                    ref="formValidate"
                    :model="formValidate"
                    :rules="ruleValidate"
                    :label-width="150"
                >
                    <Form-item
                        label="储值项目名称："
                        style="margin-top:10px"
                        prop="title"
                    >
                        <Input
                            type="text"
                            v-model="formValidate.title"
                            size="small"
                            style="width:200px"
                            disabled
                        ></Input>
                    </Form-item>
                    <Form-item
                        label="储值金额："
                        style="margin-top:10px"
                        prop="price"
                    >
                        <Input
                            type="text"
                            v-model="formValidate.price"
                            size="small"
                            style="width:200px"
                            disabled
                        ></Input>
                        元
                    </Form-item>
                    <Form-item
                        label="赠送金额："
                        style="margin-top:10px"
                        prop="g_price"
                    >
                        <Input
                            type="text"
                            v-model="formValidate.g_price"
                            size="small"
                            style="width:200px"
                            disabled
                        ></Input>
                        元
                    </Form-item>
                    <Form-item
                        label="储值说明："
                        style="margin-top:10px"
                        prop="description"
                    >
                        <Input
                            type="textarea"
                            v-model="formValidate.description"
                            size="small"
                            style="width:200px"
                        ></Input>
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
    </div>
</template>

<script type="text/javascript">
export default {
    data: function () {
        var that = this;
        var verifyCardInfo = function (rule, value, callback) {
            switch (rule.field) {
                case 'title':
                    if (!value) {
                        that.$Message.warning('名称不能为空');
                        return callback(new Error('名称不能为空'));
                    }
                    callback();
                    break;
                case 'price':
                    if (!value) {
                        that.$Message.warning('金额不能为空');
                        return callback(new Error('金额不能为空'));
                    } else if (value <= 0) {
                        that.$Message.warning('金额不能小于或等于0，至少要0.01');
                        return callback(new Error('金额不能小于或等于0，至少要0.01'));
                    }
                    callback();
                    break;

            }
        }
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            data: [],
            formValidate: {
                title: "",
                price: "",
                g_price: "",
                description: "",
            },
            ruleValidate: {
                title: [
                    { validator: verifyCardInfo, required: true, message: '必填', trigger: 'blur' }
                ],
                price: [
                    { validator: verifyCardInfo, required: true, message: '必填', trigger: 'blur' }
                ],
            }
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function () {
            var _this = this;
            var data = {
                action: 'chuzhi_getone',
                appid: this.vueAppid,
                id: this.$route.query.user
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.body && response.data.body.length >= 1) {
                    _this.formValidate = response.data.body[0];

                } else {
                    _this.$Message.info(response.data.message);
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
            var param = this.formValidate;
            var data = {          //$post['price']  $post['g_price'] $post['status']
                action: 'chuzhi_edit',
                id: this.$route.query.user,
                info: {
                    title: param.title,
                    price: param.price,
                    g_price: param.g_price,
                    status: 1,
                    description: param.description
                },
                appid: this.vueAppid

            };
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.$Message.info(response.data.message);
                    _this.$router.go(-1);
                } else {
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