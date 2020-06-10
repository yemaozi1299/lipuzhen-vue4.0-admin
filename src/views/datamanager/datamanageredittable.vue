<template>
    <Card>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            label-position="top"
        >
            <div style="margin-bottom:10px;font-size:16px">
                数据表信息编辑
            </div>

            <Form-item label="数据表名称" prop="tablename">
                <Row>
                    <Col span="12">
                        <Input
                            v-model="formValidate.tablename"
                            placeholder="请输入数据表名称"
                        ></Input>
                    </Col>
                </Row>
            </Form-item>

            <Row>
                <Col span="7">
                    <div style="margin-bottom:10px;font-size:16px;">
                        字段信息
                    </div>
                </Col>
                <Col span="17">
                    <div style="color:#f30">
                        提示:修改字段英文名会清空此字段的数据,请谨慎操作.
                    </div>
                </Col>
            </Row>

            <Row type="flex" justify="center" align="top" class="code-row-bg">
                <Col span="7">
                    <div>字段名称</div>
                </Col>
                <Col span="8">
                    <div>字段英文名</div>
                </Col>
                <Col span="3">
                    <div>类型</div>
                </Col>
                <Col span="2">
                    <div>必填</div>
                </Col>
                <Col span="2">
                    <div>搜索项</div>
                </Col>
                <Col span="2">
                    <div>操作</div>
                </Col>
            </Row>

            <Form-item
                class="linebg"
                v-for="(item, index) in formValidate.items"
                :key="index"
                :prop="'items.' + index + '.fieldcname'"
                :rules="{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }"
            >
                <Row
                    type="flex"
                    justify="center"
                    align="top"
                    class="code-row-bg2"
                    :gutter="8"
                >
                    <Col span="7">
                        <Input
                            type="text"
                            v-model="item.fieldcname"
                            placeholder="请输入..."
                        ></Input>
                    </Col>
                    <Col span="8">
                        <Input
                            type="text"
                            v-model="item.fieldename"
                            @on-keyup="watchFileName(item)"
                            :maxlength="28"
                            placeholder="只能是英文字母、下划线,不可输入true null false undefined和数字"
                        ></Input>
                    </Col>
                    <Col span="3">
                        <Select placeholder="请选择" v-model="item.fieldtype">
                            <Option value="1">一行文字</Option>
                            <Option value="2">图片</Option>
                            <Option value="3">大段文字</Option>
                        </Select>
                    </Col>
                    <Col span="2">
                        <i-switch v-model="item.must"></i-switch>
                    </Col>
                    <Col span="2">
                        <i-switch v-model="item.search"></i-switch>
                    </Col>
                    <Col span="2">
                        <Button @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
            </Form-item>

            <Form-item>
                <Row>
                    <Col span="12">
                        <Button
                            type="dashed"
                            long
                            @click="handleAdd"
                            icon="plus-round"
                            >新增</Button
                        >
                    </Col>
                </Row>
            </Form-item>

            <Form-item>
                <div align="center">
                    <Button
                        type="primary"
                        :loading="loading"
                        @click="handleSubmit('formValidate')"
                    >
                        <span v-if="!loading">提交</span>
                        <span v-else>Loading...</span>
                    </Button>

                    <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
                    <Button @click="esc" style="margin-left: 8px">取消</Button>
                </div>
            </Form-item>
        </Form>
    </Card>
</template>
<script>
export default {
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            formValidate: {
                items: [
                    {
                        fieldcname: '',
                        fieldename: '',
                        fieldtype: '',
                        must: false,
                        search: false
                    }
                ],
                tablename: '',
                table: 0
            },
            ruleValidate: {
                tablename: [
                    { required: true, message: '数据表名称不能为空', trigger: 'blur' }
                ]
            },
            loading: false,
            fieldename: ''
        }
    },
    created () {
        this.formValidate.table = this.$route.params.table;
        this.get(this.formValidate.table);
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },
    methods: {
        // handleReset:function(name) {
        //     this.$refs[name].resetFields();
        // },
        watchFileName: function (item) {
            item.fieldename = item.fieldename.replace(/[^a-z,A-Z]/g, "");
        },
        handleAdd: function () {
            this.formValidate.items.push({
                fieldcname: '',
                fieldename: '',
                fieldtype: '',
                must: false,
                search: false
            });
        },
        handleRemove: function (index) {
            this.formValidate.items.splice(index, 1);
        },
        fetchData: function () {
            this.formValidate.table = this.$route.params.table;
            this.get(this.$route.params.table);
        },
        get: function (table = 0) {//获取新闻内容
            var _this = this;
            if (table == 0) {
                return false;//添加新闻
            }
            //datamanager_gettable  获取表信息和表字段     $tableid 要获取信息的表ID


            var apiurl = "/block/api_edit.php?action=datamanager_gettable&tableid=" + table + "&appid=" + this.vueAppid;
            _this.$http.get(apiurl).then((response) => {
                console.log(response);
                if (response.data.status == 1) {
                    //{"status":1,"message":"操作成功","tablename":"表四","field":[{"id":"16","fieldcname":"内容","fieldename":"body","fieldtype":"3","must":"0","search":"0","tableid":"4","user":"test008"}]}
                    this.formValidate.tablename = response.data.tablename;
                    this.formValidate.items = response.data.field || [];
                    // console.log(JSON.stringify(this.formValidate.items));
                }
                else {
                    _this.$Message.error(response.data.message);
                }

            })
                .catch(function (response) {
                    console.log(response);
                    _this.$Notice.error({
                        title: '错误提示3',
                        desc: '无法访问服务器,请重试'
                    });
                });
        },
        handleSubmit: function (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    // console.log(this.UEcontent);//编辑器的内容

                    _this.loading = true;


                    //检测有没有选择字段类型

                    // this.formValidate.items.every((e, index) => {
                    //   console.log(e.fieldtype);
                    //   if(e.fieldtype == 0) {
                    //     this.$Message.success(e.fieldcname+'的类型不能为空');
                    //     return false;
                    //   } 
                    // });

                    for (var i = 0, len = this.formValidate.items.length; i < len; i++) {
                        if (this.formValidate.items[i].fieldtype == 0) {
                            _this.$Message.error(this.formValidate.items[i].fieldcname + '字段的类型不能为空');
                            this.loading = false;
                            return false;
                        }
                    }

                    //检测字段英文名是否有重复

                    var fieldenameTemp = [];


                    for (var i = 0, len = this.formValidate.items.length; i < len; i++) {
                        fieldenameTemp.push(this.formValidate.items[i].fieldename);
                    }

                    var nary = fieldenameTemp.sort();
                    for (var i = 0; i < fieldenameTemp.length; i++) {
                        if (nary[i] == nary[i + 1]) {
                            // alert("数组重复内容："+nary[i]);
                            _this.$Message.error(nary[i] + '字段重复了');
                            _this.loading = false;
                            return false;
                        }
                    }

                    var apiurl = "/block/api_edit.php";
                    var data = {
                        appid: this.vueAppid,
                    };

                    data.action = "datamanager_edit";
                    data.tablename = this.formValidate.tablename;
                    data.tableid = this.formValidate.table;
                    data.items = this.formValidate.items;


                    // console.log('sortid='+data.sortid);


                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {


                        // console.log(JSON.stringify(response));

                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');

                            // router.push({ name: 'news', params: { sortid: 602 }});
                            // router.go(-1);
                            _this.$router.push({ path: '/datamanager/' + this.$route.params.page });


                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示1',
                                content: response.data.message
                            });
                            _this.loading = false;
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示2',
                            desc: '无法访问服务器,请重试'
                        });
                        _this.loading = false;
                    });

                } else {
                    _this.$Message.error('表单验证失败!');
                    _this.loading = false;
                }
            })

        },
        esc: function () {
            // this.$router.push('news');
            // console.log('aaaaaaaaaaa');
            this.$router.push({ path: '/datamanager/' + this.$route.params.page });
        }
    }

}
</script>

<style>
.code-row-bg {
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 10px;
    font-weight: bold;
}
.code-row-bg2 {
    padding: 10px 0;
    text-align: center;
    margin-bottom: 0px;
}
.linebg {
    margin-bottom: 0px;
}
</style>