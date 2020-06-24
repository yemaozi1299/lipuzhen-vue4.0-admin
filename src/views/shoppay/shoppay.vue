<template>
    <Card>
        <p slot="title">
            支付方式
        </p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150"
        >
            <Form-item label="收款方名称" prop="name">
                <Input
                    v-model="formValidate.name"
                    placeholder="请输入收款方名称"
                ></Input>
            </Form-item>
            <Form-item label="小程序AppID" prop="wxappid">
                <Input
                    v-model="formValidate.wxappid"
                    placeholder="小程序AppID"
                ></Input>
            </Form-item>
            <Form-item label="小程序AppSecret" prop="appsecret">
                <Input
                    v-model="formValidate.appsecret"
                    placeholder="请输入小程序AppSecret"
                ></Input>
            </Form-item>
            <Form-item label="微信支付商户号[MCHID]" prop="mchid">
                <Input
                    v-model="formValidate.mchid"
                    placeholder="请输入微信支付商户号"
                ></Input>
            </Form-item>
            <Form-item label="商户支付密钥[key]" prop="partner_key">
                <Input
                    v-model="formValidate.partner_key"
                    placeholder="请输入商户支付密钥"
                ></Input>
            </Form-item>
            <!-- <Form-item label="存储私钥文件[apiclient_key]" prop="apiclient_key">
            <Input v-model="formValidate.apiclient_key" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入存储私钥文件"></Input>
        </Form-item>
        <Form-item label="存储公钥文件[apiclient_cert]" prop="apiclient_cert">
            <Input v-model="formValidate.apiclient_cert" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入存储公钥文件"></Input>
        </Form-item> -->
        </Form>

        <div align="center" style="margin-top:10px">
            <Button type="primary" @click="handleSubmit('formValidate')"
                >提交</Button
            >
            <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </div>
    </Card>
</template>
<script>
export default {
    data () {
        return {
            vueAppid: 1,
            formValidate: {
                name: '',
                wxappid: '',
                appsecret: '',
                mchid: '',
                partner_key: '',
                apiclient_key: '',
                apiclient_cert: ''
            },
            ruleValidate: {
                name: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                wxappid: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                appsecret: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                mchid: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                partner_key: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                apiclient_key: [
                    { required: true, message: '必填' }
                ],
                apiclient_cert: [
                    { required: true, message: '必填' }
                ]
            }
        }
    },
    created () {
        this.get();
    },
    methods: {
        get: function () {//获取新闻内容
            var _this = this;
            var apiurl = "/block/api_edit.php?action=goods_payGet&appid=" + this.vueAppid;
            _this.$http.get(apiurl)
                .then((response) => {
                    if (response.data.status == 1) {
                        this.formValidate.name = response.data.body.name;
                        this.formValidate.wxappid = response.data.body.wxappid;
                        this.formValidate.appsecret = response.data.body.appsecret;
                        this.formValidate.mchid = response.data.body.mchid;
                        this.formValidate.partner_key = response.data.body.partner_key;
                        this.formValidate.apiclient_key = response.data.body.apiclient_key;
                        this.formValidate.apiclient_cert = response.data.body.apiclient_cert;
                    }
                    else {
                        this.$Message.error(response.data.message);
                    }

                })
                .catch(function (response) {
                    this.$Notice.error({
                        title: '错误提示',
                        duration: 0,
                        desc: '无法访问服务器,请重试'
                    });
                });
        },
        handleSubmit (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {

                    var apiurl = "/block/api_edit.php";
                    var data = {
                        appid: this.vueAppid
                    };

                    //id,sortid,title,comment,keyword,date,tj,guestbook

                    data.action = "goods_paySet";
                    data.name = this.formValidate.name;
                    data.wxappid = this.formValidate.wxappid;
                    data.appsecret = this.formValidate.appsecret;
                    data.mchid = this.formValidate.mchid;
                    data.partner_key = this.formValidate.partner_key;
                    data.apiclient_key = this.formValidate.apiclient_key;
                    data.apiclient_cert = this.formValidate.apiclient_cert;


                    // console.log('sortid='+data.sortid);

                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');

                            // _this.$router.push({ path: '/news/'+this.formValidate.sortid })

                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                    });

                } else {
                    _this.$Message.error('表单验证失败!');
                }
            })
        }
        // ,
        // handleReset (name) {
        //     this.$refs[name].resetFields();
        // }
    }
}
</script>
