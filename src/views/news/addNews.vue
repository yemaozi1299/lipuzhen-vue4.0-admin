<template>
    <Card>
        <p slot="title">添加新闻</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px"
        >
            <Form-item label="新闻标题" prop="title">
                <Input
                    v-model="formValidate.title"
                    placeholder="请输入名称"
                ></Input>
            </Form-item>
            <Form-item label="新闻摘要" prop="summary">
                <Input
                    v-model="formValidate.summary"
                    placeholder="请输入摘要"
                ></Input>
            </Form-item>
            <Form-item label="封面图片" prop="face">
                <Row style="width: 500px">
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
                            style="vertical-align: top"
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
                    <Col span="12">
                        <i-Switch v-model="formValidate.face2body" />
                        <span class="notes">封面图片是否在正文显示</span>
                    </Col>
                </Row>
            </Form-item>
            <Form-item label="标识图标" prop="ico">
                <RadioGroup v-model="formValidate.ico">
                    <Radio label="0">无</Radio>
                    <Radio label="1"
                        ><img
                            src="../../assets/images/new-icon/hotnews.gif"
                            alt=""
                    /></Radio>
                    <Radio label="2"
                        ><img
                            src="../../assets/images/new-icon/newnews.gif"
                            alt=""
                    /></Radio>
                    <Radio label="3"
                        ><div class="icon_url">
                            <img :src="formValidate.ico_url" alt="" />
                        </div>
                        <Button @click="handleBeforeUpload('icon')"
                            >自定义图标</Button
                        ></Radio
                    >
                </RadioGroup>
            </Form-item>
            <Form-item label="新闻分类" prop="classid">
                <Select v-model="formValidate.classid" style="width: 200px">
                    <template v-for="item in classidList">
                        <Option :value="item.id">{{ item.sortname }}</Option>
                        <template
                            v-if="item.children"
                            v-for="items in item.children"
                        >
                            <Option :value="items.id"
                                >—— {{ items.sortname }}</Option
                            >
                        </template>
                    </template>
                </Select>
                <Buttons
                    type="info"
                    style="margin: 0 10px"
                    @click="isModal = true"
                    >添加分类</Buttons
                >
            </Form-item>
            <Form-item label="新闻推荐" prop="tj">
                <i-Switch v-model="formValidate.tj" /> 推荐
            </Form-item>
            <Form-item
                label="新闻排序（值越高排序越前）"
                prop="pr"
                v-if="newid > 0"
            >
                <InputNumber
                    v-model="formValidate.pr"
                    placeholder="请输入排序值"
                    style="width: 300px"
                ></InputNumber>
            </Form-item>
            <Form-item label="相关新闻关键字" prop="keyword">
                <Input
                    v-model="formValidate.keyword"
                    placeholder="请输入关键字"
                    style="width: 300px"
                ></Input>
                <span class="notes">多个关键字之间请用空格隔开</span>
            </Form-item>
            <Form-item label="发布日期" prop="date">
                <DatePicker
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder=""
                    style="width: 200px"
                    :value="formValidate.date"
                    @on-change="changeDateTime"
                ></DatePicker>
            </Form-item>
            <Form-item label="新闻正文" prop="body">
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
                @successCallback="uploadIcon"
            ></fileExplorer>
            <div slot="footer"></div>
        </Modal>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>
        <Modal
            v-model="isModal"
            title="添加分类"
            @on-ok="addClassConfirm"
            @on-cancel=""
            :loading="classLoad"
        >
            <label style="display: block; margin-bottom: 10px">
                <span>分类名称：</span>
                <Input
                    type="text"
                    style="width: 200px"
                    v-model="classname"
                ></Input>
            </label>
        </Modal>
    </Card>
</template>

<script>
import fileExplorer from '@/components/fileExplorer/fileExplorer';
import Editor from '@/components/textEditor/editor.vue';
import { formatDate } from '@/libs/tools'
import Buttons from '@/components/buttons'
export default {
    components: {
        Editor,
        fileExplorer,
        Buttons
    },
    data () {
        return {
            isModal: false,
            classLoad: true,
            classname: "",
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: '',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            loading: false,
            formValidate: {
                id: 0,
                classid: "",
                title: "",
                ico: "0",
                ico_url: "",
                tj: false,
                keyword: "",
                date: "",
                body: "",
                face: "",
                face2body: false,
                summary: "",
                pr: 0
            },
            ruleValidate: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                classid: [
                    { required: true, message: '新闻分类不能为空', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请填写日期', trigger: 'blur' }
                ],
                body: [
                    { required: true, message: '请填写正文内容', trigger: 'blur' }
                ]
            },
            uploadType: "ico",
            isUpload: false,
            editorContent: '',
            imgName: '',
            visible: false,
            classidList: [],
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            nowDate: "",
            upid: 0,
            selectedLang: {
                id: 0,
                name: "Chinese"
            },
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
            this.newid = this.$route.params.newid ? parseInt(this.$route.params.newid) : 0;
            // this.formValidate.classid = this.$route.query.classid ? this.$route.query.classid : "0";
            this.selectedLang = {
                id: this.$route.query.languageid || 0,
                name: this.$route.query.languagename || "Chinese"
            };
            if (this.newid > 0) {
                this.dataInitial();
            } else {
                this.getNewClass();
            }
            this.nowDate = formatDate(new Date(), 'yyyy-MM-dd');
            this.formValidate.date = this.nowDate;
        },
        dataInitial () {
            this.$http.request({
                url: "/api_edit.php?action=news_get",
                params: {
                    id: this.newid
                }
            }).then((res) => {
                var data = res.data.body;
                this.formValidate = {
                    id: data.id,
                    classid: data.classid,
                    title: data.title,
                    ico: data.ico,
                    ico_url: "",
                    tj: data.tj == 0 ? false : true,
                    keyword: data.keyword,
                    date: data.date || this.nowDate,
                    body: data.body,
                    face: data.face,
                    face2body: data.face2body == 0 ? false : true,
                    summary: data.summary,
                    pr: data.pr
                }
                console.log(data);
                this.changeContent(data.body);
                this.getNewClass();
                // this.formValidate = res.data.body;
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getNewClass: function () {
            this.$http.request({
                url: "/api_edit.php?action=news_class_get",
                params: {
                    appid: this.vueAppid,
                    language: this.selectedLang.id
                }
            }).then((res) => {
                this.classidList = res.data.body || [];
                this.$nextTick(() => {
                    this.classidList.length && (this.formValidate.classid = this.$route.query.classid ? String(this.$route.query.classid) : this.classidList[0].id);
                });
            }).catch((response) => {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                })
                _this.loading = false
            })
        },
        handleBeforeUpload: function (type) {
            this.uploadType = type;
            this.isUpload = true;
        },
        uploadIcon: function (file) {
            if (this.uploadType == "icon") {
                this.formValidate.ico_url = file.url;
            } else {
                this.formValidate.face = file.url;
            }

            this.isUpload = false;
        },
        changeDateTime: function (time) {
            this.formValidate.date = time;
            console.log(time);
        },
        handleChange (html, text) {
            this.formValidate.body = html
        },
        changeContent (content) {
            this.$refs.editor.setHtml(content)
        },
        handleRemove: function () {
            this.formValidate.face = ""
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
                    var apiurl = '/api_edit.php?action=news_edit';
                    var params = {},
                        data = this.formValidate;
                    params = {
                        appid: _this.vueAppid,
                        id: data.id,
                        items: {
                            classid: data.classid,
                            title: data.title,
                            ico: data.ico,
                            ico_url: data.ico_url,
                            tj: data.tj ? "1" : "0",
                            keyword: data.keyword,
                            date: data.date,
                            body: data.body,
                            face: data.face,
                            face2body: data.face2body ? "1" : "0",
                            summary: data.summary,
                            pr: data.pr,
                            language: this.selectedLang.id
                        },
                    }
                    console.log(params);

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
                            desc: response
                        })
                        _this.loading = false
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            });
        },

        addClassConfirm () {
            if (this.classname == '') {
                this.$Message.error('请输入分类名称');
                this.classLoad = false;
                this.$nextTick(() => {
                    this.classLoad = true;
                });
                return false;
            }
            this.$http.request({
                url: "/api_edit.php?action=news_class_add",
                params: {
                    appid: this.vueAppid,
                    upid: this.upid,
                    sortname: this.classname
                }
            }).then((res) => {
                this.classLoad = false;
                this.isModal = false;
                this.upid = "0";
                this.classname = "";
                this.$Message.info("添加成功");
                this.getNewClass();
                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
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
</style>