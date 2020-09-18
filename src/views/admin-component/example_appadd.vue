<template>
    <Card>
        <p slot="title">添加链接</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px"
        >
            <Form-item label="链接标题" prop="example_name">
                <Input
                    v-model="formValidate.example_name"
                    placeholder="请输入应用样板名称"
                ></Input>
            </Form-item>

            <FormItem label="是否支持">
                <Checkbox v-model="pc">电脑网站</Checkbox>
                <Checkbox v-model="mobile">手机网站</Checkbox>
                <Checkbox v-model="mina">微信小程序</Checkbox>
            </FormItem>

            <Form-item label="电脑网站封面" v-if="pc">
                <div class="goods-upload-list">
                    <img :src="cover_pc" />
                    <div class="goods-upload-list-cover">
                        <Icon
                            type="ios-eye-outline"
                            @click.native="handleView(cover_pc)"
                        ></Icon>
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemove"
                        ></Icon>
                    </div>
                </div>
                <Button
                    @click="handleBeforeUpload('pc')"
                    style="vertical-align: top"
                >
                    <div style>
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图标
                    </div>
                </Button>
            </Form-item>

            <Form-item label="手机网站封面" v-if="mobile">
                <div class="goods-upload-list">
                    <img :src="cover_mobile" />
                    <div class="goods-upload-list-cover">
                        <Icon
                            type="ios-eye-outline"
                            @click.native="handleView(cover_mobile)"
                        ></Icon>
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemove"
                        ></Icon>
                    </div>
                </div>
                <Button
                    @click="handleBeforeUpload('mobile')"
                    style="vertical-align: top"
                >
                    <div style>
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图标
                    </div>
                </Button>
            </Form-item>

            <Form-item label="手机网站封面" v-if="mina">
                <div class="goods-upload-list">
                    <img :src="cover_mina" />
                    <div class="goods-upload-list-cover">
                        <Icon
                            type="ios-eye-outline"
                            @click.native="handleView(cover_mina)"
                        ></Icon>
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemove"
                        ></Icon>
                    </div>
                </div>
                <Button
                    @click="handleBeforeUpload('mina')"
                    style="vertical-align: top"
                >
                    <div style>
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图标
                    </div>
                </Button>
            </Form-item>

            <Form-item>
                <Button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit('formValidate')"
                >
                    <span v-if="!loading">提交</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button @click="$router.go(-1)" style="margin-left: 8px"
                    >取消</Button
                >
            </Form-item>
        </Form>
        <!-- 弹窗 -->
        <Modal v-model="isUpload" width="860">
            <p slot="header">选择图片</p>
            <fileExplorer
                :options="options"
                @successCallback="uploadCover"
            ></fileExplorer>
            <div slot="footer"></div>
        </Modal>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" style="width: 100%" />
        </Modal>
    </Card>
</template>

<script>
import fileExplorer from '@/components/fileExplorer/fileExplorer';
import Editor from '@/components/textEditor/editor.vue';
import Buttons from '@/components/buttons'
export default {
    components: {
        Editor,
        fileExplorer,
        Buttons
    },
    data () {
        return {
            loading: false,
            ruleValidate: {
                example_name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
            },
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: 'image',
                appid: this.$route.query.appid || 1,
                php: "/api_admin.php"
            },

            formValidate: {
                example_name: ""
            },
            fromappid: 0,
            pc: false,
            mobile: false,
            mina: false,
            visible: false,
            isUpload: false,
            imgName: "",
            cover_pc: "",
            cover_mobile: "",
            cover_mina: "",
            cover_pc_name: "",
            cover_mobile_name: "",
            cover_mina_name: "",
            uploadType: "",
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData () {
            this.fromappid = this.$route.query.fromappid ? parseInt(this.$route.query.fromappid) : 0;
            this.formValidate.example_name = this.$route.query.name ? this.$route.query.name : "";
            this.options.appid = this.$route.query.appid ? this.$route.query.appid : 1;
        },
        uploadCover (file) {
            this['cover_' + this.uploadType] = file.url;
            this['cover_' + this.uploadType + '_name'] = file.name;
            this.isUpload = false;
        },
        handleView (name) {
            console.log(name)
            this.imgName = name
            this.visible = true
        },
        handleRemove: function (mode) {
            this[mode] = "";
        },
        handleBeforeUpload: function (type) {
            this.uploadType = type;
            this.isUpload = true;
        },
        handleSubmit (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var apiurl = '/api_admin.php?action=example_appadd';
                    var params = {};
                    params = {
                        fromappid: this.fromappid,
                        example_name: this.formValidate.example_name,
                        pc: this.pc ? 1 : 0,
                        mobile: this.mobile ? 1 : 0,
                        mina: this.mina ? 1 : 0,
                        cover_pc: this.cover_pc_name,
                        cover_mobile: this.cover_mobile_name,
                        cover_mina: this.cover_mina_name,
                    }
                    console.log(params);
                    //  _this.$qs.stringify(data)

                    this.$http.post(apiurl, params).then(function (response) {
                        _this.$Message.info('保存成功');
                        _this.$router.go(-1);
                        console.log(response);
                        _this.loading = false;
                    }).catch(function (response) {
                        _this.$Loading.error()
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        })
                        _this.loading = false
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            });
        },


    }
}
</script>
<style lang="less">
.goods-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
}
.goods-upload-list img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
}
.goods-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.goods-upload-list:hover .goods-upload-list-cover {
    display: block;
}
.goods-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
.icon_url {
    display: inline-block;
    width: 50px;
    height: 37px;
    border: 1px solid #ddd;
    margin-right: 10px;
    position: relative;
    overflow: hidden;
    vertical-align: top;
    img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }
}
.notes {
    margin: 0 10px;
    font-size: 13px;
    color: #666;
}
</style>