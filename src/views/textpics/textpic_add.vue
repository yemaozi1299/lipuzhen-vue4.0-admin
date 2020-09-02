<template>
    <Card>
        <p slot="title">添加图文网页</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px;"
        >
            <Form-item label="标题" prop="title">
                <Input
                    v-model="formValidate.title"
                    placeholder="请输入名称"
                ></Input>
            </Form-item>

            <Form-item label="正文" prop="body">
                <editor
                    ref="editor"
                    :value="editorContent"
                    @on-change="handleChange"
                />
            </Form-item>
            <FormItem label="CSS代码">
                <Input
                    v-model="formValidate.css"
                    type="textarea"
                    :autosize="true"
                    placeholder="CSS代码段"
                ></Input>
            </FormItem>
            <FormItem label="JavaScript代码">
                <Input
                    v-model="formValidate.js"
                    type="textarea"
                    :autosize="true"
                    placeholder="JavaScript代码段"
                ></Input>
            </FormItem>
            <Form-item>
                <Button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit('formValidate')"
                >
                    <span v-if="!loading">提交</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button @click="$router.go(-1)" style="margin-left: 8px;"
                    >取消</Button
                >
            </Form-item>
        </Form>
    </Card>
</template>

<script>
import fileExplorer from '@/components/fileExplorer/fileExplorer';
import Editor from '@/components/textEditor/editor.vue';
export default {
    components: {
        Editor,
        fileExplorer,
    },
    data () {
        return {
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: 'image',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            loading: false,
            formValidate: {
                id: 0,
                title: "",
                body: "",
                js: "",
                css: "",
            },
            ruleValidate: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                body: [
                    { required: true, message: '请填写正文内容', trigger: 'blur' }
                ]
            },
            editorContent: '',
            imgName: '',
            visible: false,
            classidList: [],
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            pid: 0

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
            this.pid = this.$route.params.textid ? parseInt(this.$route.params.textid) : 0;
            if (this.pid > 0) {
                this.dataInitial();
            }
        },
        dataInitial () {
            this.$http.request({
                url: "/api_edit.php?action=textpic_get",
                params: {
                    id: this.pid
                }
            }).then((res) => {
                console.log(res);
                var data = res.data.body;
                this.formValidate = {
                    id: this.pid,
                    body: data.body,
                    css: data.css,
                    js: data.js,
                    title: data.title
                };
                this.changeContent(data.body);
            })
        },
        handleChange (html, text) {
            this.formValidate.body = html
        },
        changeContent (content) {
            this.$refs.editor.setHtml(content)
        },
        handleSubmit: function (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var apiurl = '/api_edit.php?action=textpic_edit';
                    var params = {},
                        data = this.formValidate;
                    params = {
                        appid: this.vueAppid,
                        id: data.id,
                        title: data.title,
                        body: data.body,
                        js: data.js,
                        css: data.css,
                    }
                    console.log(params);
                    //  _this.$qs.stringify(data)

                    this.$http.post(apiurl, params).then(function (response) {
                        if (response.data.status == 1) {
                            _this.$Message.info('保存成功');
                            _this.$router.go(-1);
                        }
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
<style lang="less" scoped>
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