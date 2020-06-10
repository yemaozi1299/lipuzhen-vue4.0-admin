<template>
    <Card>
        <p slot="title">
            {{ tablename }} {{ line == 0 ? "添加记录" : "编辑记录" }}
        </p>
        <Form ref="formValidate" :model="formValidate" :label-width="80">
            <Form-item label="分类">
                <Radio-group v-model="classid" type="button">
                    <Radio
                        v-for="classitem in classitems"
                        :key="classitem.id"
                        :label="classitem.id"
                        >{{ classitem.classname }}</Radio
                    >
                </Radio-group>
            </Form-item>

            <Form-item
                v-for="(item, index) in formValidate.items"
                :key="index"
                :label="item.fieldcname"
                :prop="'items.' + index + '.body'"
                :rules="{
                    required: item.must,
                    message: '不能为空',
                    trigger: 'blur'
                }"
            >
                <template v-if="item.fieldtype == 2">
                    <!-- <Input v-model="item.body" placeholder="上传图片"></Input> -->

                    <div class="demo-upload-list" v-if="item.body">
                        <img
                            :src="moves + item.body"
                            @click="handleView(moves + item.body)"
                        />
                    </div>

                    <!-- <Upload
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png','gif']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :on-error="handleErrorTips"
                  :before-upload="handleUpload"
                  type="drag"
                  accept="image/*" 
                  :action="'/block/api_edit.php?action=datamanager_uploadImage&fieldid='+item.fieldid"
                  style="display: inline-block;width:158px;">
                  <div style="width: 158px;height:58px;line-height: 58px;">
                      <Icon type="ios-cloud-upload-outline" size="20"></Icon>上传图片,支持拖拽
                  </div>
              </Upload> -->
                    <Button
                        @click="handleBeforeUpload(item)"
                        style="vertical-align:top;"
                    >
                        <div style="">
                            <Icon
                                type="ios-cloud-upload-outline"
                                size="20"
                            ></Icon
                            >选择图片
                        </div>
                    </Button>
                    <Resource
                        v-model="isUploadOne"
                        :on-success="handleSuccess"
                        :fileid="fileid"
                    ></Resource>
                </template>
                <template v-else-if="item.fieldtype == 3">
                    <editor
                        :ref="`editor-${item.fieldid}`"
                        v-model="item.body"
                    />
                </template>
                <template v-else>
                    <Input v-model="item.body" placeholder="文本"></Input>
                </template>
            </Form-item>

            <Form-item>
                <div align="center">
                    <Button type="primary" @click="handleSubmit('formValidate')"
                        >提交</Button
                    >
                    <Button @click="esc" style="margin-left: 8px">取消</Button>
                </div>
            </Form-item>

            <Modal title="查看图片" v-model="visible">
                <img :src="imgName" v-if="visible" style="width: 100%" />
            </Modal>
        </Form>
    </Card>
</template>
<script>
import Editor from '@/components/textEditor/editor.vue';
import { forEach } from '@/libs/tools';
export default {
    components: {
        Editor
    },
    data () {
        return {
            moves: '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            formValidate: {
                "items": [
                    {
                        "fieldid": "1",
                        "fieldcname": "",
                        "fieldename": "",
                        "fieldtype": "",
                        "must": true,
                        "search": "",
                        "classid": 0,
                        "body": ""
                    }
                ]
            },
            classitems: [
                {
                    "id": "",
                    "classname": ""
                }],
            classid: 0,
            tablename: '',
            table: 0,
            line: 0,
            loading: false,
            imgName: '',
            visible: false,
            isUploadOne: false,
            fileid: ''
        }
    },
    created () {
        this.table = this.$route.params.table;
        this.table = this.table == undefined ? 0 : this.table;
        this.line = this.$route.params.line;
        this.line = this.line == undefined ? 0 : this.line;
        this.get(this.table, this.line);
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData',
        // 'formValidate.items': {
        //     handler: function (val, oldVal) {
        //         console.log(val);
        //     },
        //     deep: true
        // },
    },
    methods: {
        // handleReset:function(name) {
        //     this.$refs[name].resetFields();
        // },
        handleChange () {
            var that = this;
            forEach(this.formValidate.items, item => {
                if (item.fieldtype == 3) {
                    that.$nextTick(() => {
                        that.$refs[`editor-${item.fieldid}`][0].setHtml(item.body);
                    });

                }
                console.log(item);
            });
        },
        fetchData: function () {
            this.table = this.$route.params.table;
            this.table = this.table == undefined ? 0 : this.table;
            this.line = this.$route.params.line;
            this.line = this.line == undefined ? 0 : this.line;
            this.get(this.table, this.line);
        },
        get: function (table, line) {//获取指定表指定记录
            var _this = this;

            if (table == 0) {
                this.$Modal.info({
                    title: '错误提示',
                    content: `表ID丢失`
                });
                return false;
            }

            //  /block/api_edit.php?action=datamanager_gettableline&tableid=4&line=1
            console.log("datamanagereditdata111111111111");
            this.$http.request({
                method: 'post',
                url: "/block/api_edit.php",
                params: {
                    action: 'datamanager_gettableline',
                    tableid: table,
                    line: line,
                    appid: this.vueAppid
                }
            }).then(function (response) {
                _this.tablename = response.data.tablename;
                _this.formValidate.items = response.data.items;
                _this.getclass(table);
                _this.handleChange();
                _this.classid = _this.formValidate.items[0].classid;
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示#datamanagereditdata',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });

        },
        getclass: function (table) {
            var apiurl = "/block/api_edit.php";
            var data = {
                action: "datamanager_classlist",
                appid: this.vueAppid,
                tableid: table
            };


            this.$http.post(apiurl, this.$qs.stringify(data)).then((response) => {
                if (response.data.status == 1) {
                    this.classitems = response.data.body;
                }
            });
        },
        handleSubmit: function (name) {

            // console.log(this.formValidate.items);
            // return;
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    // console.log(this.UEcontent);//编辑器的内容
                    _this.loading = true;
                    var apiurl = "/block/api_edit.php";
                    var data = {
                        appid: this.vueAppid,
                    };
                    data.action = "datamanager_editline";
                    data.items = this.formValidate.items;
                    data.tableid = this.table;
                    data.classid = this.classid;
                    data.line = this.line;

                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');

                            // router.push({ name: 'news', params: { sortid: 602 }});
                            // router.go(-1);

                            _this.$router.push({ path: '/datamanager/' + this.$route.params.page + '/listData/' + this.table });


                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                        }
                    }).catch(function (response) {
                        _this.loading = false;
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                    });

                } else {
                    _this.$Message.error('带*号字段必须填写!');
                }
            })

        },
        esc: function () {
            // this.$router.push('news');
            // console.log('aaaaaaaaaaa');
            this.$router.push({ path: '/datamanager/' + this.$route.params.page + '/listData/' + this.table });
        },

        handleView: function (name) {
            this.imgName = name;
            this.visible = true;
        },
        // handleRemove (file) {
        //     // 从 upload 实例删除数据
        //     const fileList = this.$refs.upload.fileList;
        //     this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        // },
        handleBeforeUpload: function (item) {
            this.fileid = item.fieldid;
            this.isUploadOne = true;
        },
        handleSuccess: function (res, file) {
            var _this = this;
            console.log(res, file);
            // 因为上传过程为实例，这里模拟添加 url
            // console.log(res);
            // console.log(file);
            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = 'ffffffff';

            if (res.status == 1) {

                //写入数据

                this.formValidate.items.forEach((item, index) => {
                    if (item.fieldid == res.fieldid) {
                        console.log(this.formValidate.items);
                        console.log(index);
                        this.formValidate.items[index].body = res.name;
                    }
                });


            }
            else {
                _this.$Notice.warning({
                    title: '上传失败',
                    desc: '' + res.message
                });
            }

            _this.$Message.destroy();

        },
        handleFormatError: function (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize: function (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleErrorTips: function (error, file, fileList) {
            var _this = this;
            // console.log(error);
            // console.log(file);
            // console.log(fileList);

            _this.$Notice.warning({
                title: '上传失败',
                desc: '网络不通,请重试。'
            });
        }
        ,
        handleUpload: function () {
            this.$Message.loading('正在上传', 0);
        }


    }

}
</script>

<style>
.demo-upload-list {
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
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>