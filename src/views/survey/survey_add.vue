<template>
    <Card>
        <Form ref="formValidate" :model="formValidate" :label-width="80">
            <Form-item
                label="投票标题"
                prop="question"
                :rules="{
                    required: true,
                    message: '必填',
                    trigger: 'blur',
                }"
            >
                <Input
                    v-model="formValidate.question"
                    placeholder="请输入投票标题"
                ></Input>
            </Form-item>
            <Form-item label="选项设置" prop="choice">
                <RadioGroup v-model="formValidate.choice">
                    <Radio label="1">多选</Radio>
                    <Radio label="0">单选</Radio>
                </RadioGroup>
            </Form-item>

            <FormItem
                v-for="(item, index) in formValidate.items"
                v-if="item.status"
                :key="index"
                :label="'选项 '"
                :prop="'items.' + index + '.title'"
                :rules="{
                    required: true,
                    message: '必填',
                    trigger: 'blur',
                }"
            >
                <Row :gutter="24">
                    <Col span="8">
                        <Input
                            type="text"
                            v-model="item.title"
                            placeholder="请输入选项标题"
                        ></Input>
                    </Col>

                    <Col span="4" offset="1">
                        <Button @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="12">
                        <Button
                            type="dashed"
                            long
                            @click="handleAdd"
                            icon="md-add"
                            >新增选项</Button
                        >
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')"
                    >提交</Button
                >
                <Button @click="$router.go(-1)" style="margin-left: 8px;"
                    >返回</Button
                >
            </FormItem>
        </Form>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            index: 1,
            formValidate: {
                question: "",
                items: [
                    {
                        title: '',
                        index: 1,
                        status: 1,
                    }
                ],
                choice: "0"
            },
            isUpload: false,
            currentIndex: 0,
            visible: false,
            imgName: "",
            id: 0
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        fetchData () {
            this.id = this.$route.params.sid ? parseInt(this.$route.params.sid) : 0;
            if (this.id) {
                this.dataInitial()
            }
        },
        dataInitial () {
            this.$http.request({
                url: "/api_edit.php?action=survey_get",
                params: {
                    id: this.id
                }
            }).then((res) => {
                console.log(res);

                var data = res.data.body, body = [];
                data.answer && data.answer.forEach((item) => {
                    body.push({
                        title: item,
                        status: 1
                    })
                });
                this.formValidate = {
                    question: data.question,
                    choice: data.choice,
                    items: body
                }

            })
        },
        handleSubmit (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var action = this.id == 0 ? "/api_edit.php?action=survey_add" : "/api_edit.php?action=survey_edit"
                    var params = {},
                        data = this.formValidate,
                        body = [];

                    data.items.forEach((item) => {
                        if (item.status == 1) {
                            body.push(item.title)
                        }
                    });
                    params = {
                        appid: 1,
                        id: this.id,
                        question: data.question,
                        choice: data.choice,
                        answer: body
                    }
                    console.log(params);
                    _this.$qs.stringify(params)

                    this.$http.get(action, params).then(function (response) {
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
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        handleAdd () {
            this.index++;
            this.formValidate.items.push({
                title: '',
                index: this.index,
                status: 1,
            });
        },
        handleRemove (index) {
            this.formValidate.items[index].status = 0;
        },
        handleView (name) {
            console.log(name)
            this.imgName = name
            this.visible = true
        },

        handleBeforeUpload: function (type, index) {
            this.uploadType = type;
            this.currentIndex = index;
            this.isUpload = true;
        },
        uploadIcon: function (file) {
            if (this.uploadType == "items") {
                this.formValidate.items[this.currentIndex].face = file.name;
                this.formValidate.items[this.currentIndex].url = file.url;
            } else {
                this.formValidate.face = file.name;
                this.formValidate.url = file.url;
            }

            this.isUpload = false;
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
</style>