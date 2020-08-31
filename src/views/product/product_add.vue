<template>
    <Card>
        <p slot="title">添加产品</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px;"
        >
            <Form-item label="产品标题" prop="title">
                <Input
                    v-model="formValidate.title"
                    placeholder="请输入名称"
                ></Input>
            </Form-item>
            <Form-item label="产品摘要" prop="summary">
                <Input
                    v-model="formValidate.summary"
                    placeholder="请输入摘要"
                ></Input>
            </Form-item>
            <Form-item label="封面图片" prop="face">
                <Row style="width: 500px;">
                    <Col span="12">
                        <div class="goods-upload-list" v-if="formValidate.face">
                            <img :src="formValidate.face" />
                            <div class="goods-upload-list-cover">
                                <Icon
                                    type="ios-eye-outline"
                                    @click.native="
                                        handleView(formValidate.face)
                                    "
                                ></Icon>
                                <Icon
                                    type="ios-trash-outline"
                                    @click.native="handleRemove"
                                ></Icon>
                            </div>
                        </div>
                        <Button
                            @click="handleBeforeUpload('face')"
                            style="vertical-align: top;"
                        >
                            <div style>
                                <Icon
                                    type="ios-cloud-upload-outline"
                                    size="20"
                                ></Icon
                                >选择图片
                            </div>
                        </Button>
                    </Col>
                </Row>
            </Form-item>
            <Form-item label="轮播图片" prop="face">
                <div
                    class="goods-upload-list"
                    v-if="uploadList.length >= 1"
                    v-for="item in uploadList"
                >
                    <img :src="item" />
                    <div class="goods-upload-list-cover">
                        <Icon
                            type="ios-eye-outline"
                            @click.native="handleView(item)"
                        ></Icon>
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemoveList(item)"
                        ></Icon>
                    </div>
                </div>
                <Button
                    @click="handleBeforeUpload('facemore')"
                    style="vertical-align: top;"
                >
                    <div style>
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图片
                    </div>
                </Button>
            </Form-item>

            <Form-item label="产品分类" prop="classid">
                <Select v-model="formValidate.classid" style="width: 200px;">
                    <template v-for="item in classidList">
                        <Option :value="item.id">{{ item.sortname }}</Option>
                        <template
                            v-if="item.children"
                            v-for="items in item.children"
                        >
                            <Option :value="items.id">{{
                                items.sortname
                            }}</Option>
                        </template>
                    </template>
                </Select>
            </Form-item>
            <Form-item label="产品推荐" prop="tj">
                <i-Switch v-model="formValidate.tj" /> 推荐
            </Form-item>
            <Form-item label="相关产品关键字" prop="keyword">
                <Input
                    v-model="formValidate.keyword"
                    placeholder="请输入关键字"
                    style="width: 300px;"
                ></Input>
                <span class="notes">多个关键字之间请用空格隔开</span>
            </Form-item>
            <Form-item label="发布日期" prop="date">
                <DatePicker
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder=""
                    style="width: 200px;"
                    :value="formValidate.date"
                    @on-change="changeDateTime"
                ></DatePicker>
            </Form-item>
            <Form-item label="产品正文" prop="readme">
                <editor
                    ref="editor"
                    :value="editorContent"
                    @on-change="handleChange"
                />
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
                <Button @click="$router.go(-1)" style="margin-left: 8px;"
                    >取消</Button
                >
            </Form-item>
        </Form>
        <!-- 弹窗 -->
        <Modal v-model="isUpload" width="860">
            <p slot="header">选择图片</p>
            <fileExplorer
                :options="options"
                @successCallback="uploadIcon"
            ></fileExplorer>
            <div slot="footer"></div>
        </Modal>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%;" />
        </Modal>
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

            loading: false,
            formValidate: {
                id: 0,
                classid: "",
                title: "",
                tj: false,
                keyword: "",
                date: "",
                readme: "",
                face: "",
                facemore: "",
                pr: 0,
                summary: ""
            },
            uploadList: [],
            uploadListName: [],
            ruleValidate: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                classid: [
                    { required: true, message: '产品分类不能为空', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请填写日期', trigger: 'blur' }
                ],
                readme: [
                    { required: true, message: '请填写正文内容', trigger: 'blur' }
                ]
            },
            uploadType: "ico",
            isUpload: false,
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: 'image',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            editorContent: '',
            imgName: '',
            visible: false,
            classidList: [],
            pid: 0

        }
    },
    watch: {
        '$route': 'fetchData'
    },
    created () {
        this.fetchData();
        this.getNewClass()
    },
    methods: {
        fetchData () {
            this.pid = this.$route.params.pid ? parseInt(this.$route.params.pid) : 0;
            if (this.pid > 0) {
                this.dataInitial();
            }
        },
        dataInitial () {
            this.$http.request({
                url: "/api_edit.php?action=product_get",
                params: {
                    id: this.pid
                }
            }).then((res) => {
                console.log(res.data.body)

                var data = res.data.body;
                var facemoreUrl = [], facemoreName = [];
                this.formValidate = {
                    id: data.id,
                    classid: data.classid,
                    title: data.name,
                    tj: data.tj == 1 ? true : false,
                    keyword: data.keyword,
                    date: data.date,
                    readme: data.readme,
                    face: data.face_url,
                    faceName: data.face,
                    facemore: data.facemore,
                    summary: data.summary,
                }
                data.facemore.length && data.facemore.forEach(function (item) {
                    facemoreUrl.push(item.url);
                    facemoreName.push(item.filename);
                });
                this.uploadList = facemoreUrl;
                this.uploadListName = facemoreName;
                this.changeContent(data.readme);
                // this.formValidate = res.data.body;
            })
        },
        getNewClass: function () {
            this.$http.request({
                url: "/api_edit.php?action=product_class_get",
                params: {
                    appid: 1
                }
            }).then((res) => {
                this.classidList = res.data.body;

            }).catch(function (response) {
                _this.$Loading.error()
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                })
                _this.loading = false
            })
        },
        handleBeforeUpload: function (type) {
            this.uploadType = type;
            this.isUpload = true;
        },
        uploadIcon: function (file) {
            if (this.uploadType == "facemore") {
                this.uploadList.push(file.url);
                this.uploadListName.push(file.name);
            } else {
                this.formValidate.face = file.url;
                this.formValidate.faceName = file.name;
            }

            this.isUpload = false;
        },
        changeDateTime: function (time) {
            this.formValidate.date = time;
            console.log(time);
        },
        handleChange (html, text) {
            this.formValidate.readme = html
        },
        changeContent (content) {
            this.$refs.editor.setHtml(content)
        },
        handleRemove: function () {
            this.formValidate.face = ""
        },
        handleRemoveList (file) {
            // 从 upload 实例删除数据
            const fileList = this.uploadList;
            const index = fileList.indexOf(file);
            this.uploadList.splice(index, 1)
            this.uploadListName.splice(index, 1)
        },
        handleView (name) {
            console.log(name)
            this.imgName = name
            this.visible = true
        },
        handleSubmit: function (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var apiurl = '/api_edit.php?action=product_edit';
                    var params = {},
                        data = this.formValidate;
                    params = {
                        appid: 1,
                        id: data.id,
                        items: {
                            classid: data.classid,
                            name: data.title,
                            tj: data.tj ? "1" : "0",
                            keyword: data.keyword,
                            date: data.date,
                            readme: data.readme,
                            face: data.faceName,
                            facemore: this.uploadListName,
                            summary: data.summary,
                            pr: data.pr
                        }


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