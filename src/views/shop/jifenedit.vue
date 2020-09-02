<template>
    <Card>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
            style="padding-bottom: 30px;"
        >
            <div style="margin-bottom: 10px; font-size: 16px;">
                {{ goodsid == 0 ? "添加外卖" : "编辑外卖" }}
            </div>

            <Form-item label="名称" prop="name">
                <Input
                    v-model="formValidate.name"
                    placeholder="请输入名称"
                ></Input>
            </Form-item>
            <Form-item label="简介">
                <Input
                    v-model="formValidate.jianjie"
                    placeholder="请输入简介"
                ></Input>
            </Form-item>

            <Form-item label="* 规格">
                <Radio-group v-model="formValidate.guigehave" type="button">
                    <Radio label="0">无规格</Radio>
                    <Radio label="1">有规格</Radio>
                </Radio-group>

                <div v-if="formValidate.guigehave == 1">
                    <Row
                        type="flex"
                        justify="center"
                        align="top"
                        class="code-row-bg"
                    >
                        <Col span="4">
                            <div>
                                <input
                                    v-model="formValidate.guigename1"
                                    placeholder="规格一(如颜色)"
                                    class="guige-input"
                                />
                            </div>
                        </Col>
                        <Col span="4">
                            <div>
                                <input
                                    v-model="formValidate.guigename2"
                                    placeholder="规格二(如尺码)"
                                    class="guige-input"
                                />
                            </div>
                        </Col>
                        <Col span="6">
                            <div>规格图片</div>
                        </Col>
                        <Col span="3">
                            <div>价格</div>
                        </Col>
                        <Col span="3">
                            <div>库存</div>
                        </Col>
                        <Col span="4">
                            <div>操作</div>
                        </Col>
                    </Row>

                    <Form-item
                        class="linebg"
                        v-for="(gitem, gindex) in formValidate.guigeitems"
                        :key="gindex"
                        :prop="'guigeitems.' + gindex + '.name1'"
                        :rules="{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur',
                        }"
                    >
                        <Row
                            type="flex"
                            justify="center"
                            align="top"
                            class="code-row-bg2"
                            :gutter="8"
                        >
                            <Col span="4">
                                <Input
                                    type="text"
                                    v-model="gitem.name1"
                                    placeholder="规格1"
                                ></Input>
                            </Col>
                            <Col span="4">
                                <Input
                                    type="text"
                                    v-model="gitem.name2"
                                    placeholder="规格2"
                                ></Input>
                            </Col>
                            <Col span="6">
                                <div class="guige-upload-list">
                                    <img
                                        v-if="gitem.picture"
                                        :src="gitem.picturename"
                                        @click="handleView(gitem.picturename)"
                                    />
                                </div>
                                <!-- <Upload
		                        :show-upload-list="false"
		                        :on-success="handleGuiGeSuccess"
		                        :format="['jpg','jpeg','png','gif']"
		                        :max-size="2048"
		                        :on-format-error="handleFormatError"
		                        :on-exceeded-size="handleMaxSize"
		                        :on-error="handleErrorTips"
		                        :before-upload="handleUpload"
		                        type="drag"
		                        accept="image/*" 
		                        :action="'/api_edit.php?action=goods_uploadImage&index='+gindex"
		                        style="display: inline-block;width:158px;">
		                        <div style="width: 158px;height:40px;line-height: 40px;">
		                            <Icon type="ios-cloud-upload-outline" size="20"></Icon>上传图片,支持拖拽
		                        </div>
		                    </Upload> -->
                                <Button
                                    style="vertical-align: top;"
                                    v-on:click="guiGeComputer(gindex)"
                                >
                                    <div style="">
                                        <Icon
                                            type="ios-cloud-upload-outline"
                                            size="20"
                                        ></Icon
                                        >选择图片
                                    </div>
                                </Button>
                            </Col>
                            <Col span="3">
                                <Input
                                    v-model="gitem.price"
                                    type="number"
                                    placeholder="价格"
                                ></Input>
                            </Col>
                            <Col span="3">
                                <Input
                                    v-model="gitem.kc"
                                    placeholder="库存"
                                ></Input>
                            </Col>
                            <Col span="4">
                                <Button
                                    type="error"
                                    @click="handleGuigeRemove(gindex)"
                                    >删除</Button
                                >
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
                </div>
            </Form-item>
            <template v-if="formValidate.guigehave == 0">
                <Form-item label="价格" prop="price">
                    <Input
                        v-model="formValidate.price"
                        type="number"
                        placeholder="请输入价格"
                    ></Input>
                </Form-item>
                <Form-item label="库存" prop="kc">
                    <Input
                        v-model="formValidate.kc"
                        type="number"
                        placeholder="请输入库存"
                    ></Input>
                </Form-item>
            </template>

            <Form-item label="封面图片">
                <div class="goods-upload-list" v-for="item in uploadListOne">
                    <img :src="item.url" />
                    <div class="goods-upload-list-cover">
                        <Icon
                            type="ios-eye-outline"
                            @click.native="handleView(item.url)"
                        ></Icon>
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemoveOne(item)"
                        ></Icon>
                    </div>
                </div>
                <!-- <Upload
		        ref="uploadOne"
		        :show-upload-list="false"
		        :default-file-list="face"
		        :on-success="handleSuccess"
		        :format="['jpg','jpeg','png','gif']"
		        :max-size="2048"
		        :on-format-error="handleFormatError"
		        :on-exceeded-size="handleMaxSize"
		        :before-upload="handleBeforeUploadOne"
		        type="drag" 
                accept="image/*" 
		        action="/api_edit.php?action=goods_uploadImage"
		        style="display: inline-block;width:158px;">
		        <div style="width: 158px;height:58px;line-height: 58px;">
                      <Icon type="ios-cloud-upload-outline" size="20"></Icon>上传图片,支持拖拽
                </div>
		    </Upload> -->
                <Button
                    @click="handleBeforeUploadOne"
                    style="vertical-align: top;"
                >
                    <div style="">
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图片
                    </div>
                </Button>
                <Resource
                    v-model="isUploadOne"
                    ref="uploadOne"
                    :default-file-lists="face"
                ></Resource>
            </Form-item>
            <!-- <Form-item label="轮换图片">
		    <div class="goods-upload-list" v-for="item in uploadList">
		        <template v-if="item.status === 'finished'">
		            <img :src="item.url">
		            <div class="goods-upload-list-cover">
		                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
		                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
		            </div>
		        </template>
		        <template v-else>
		            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
		        </template>
		    </div>
		    <Upload
		        ref="upload"
		        :show-upload-list="false"
		        :default-file-list="facemore"
		        :on-success="handleSuccess"
		        :format="['jpg','jpeg','png','gif']"
		        :max-size="2048"
		        :on-format-error="handleFormatError"
		        :on-exceeded-size="handleMaxSize"
		        :before-upload="handleBeforeUpload"
		        multiple
		        type="drag" 
                accept="image/*" 
		        action="/api_edit.php?action=goods_uploadImage"
		        style="display: inline-block;width:158px;">
		        <div style="width: 158px;height:58px;line-height: 58px;">
                      <Icon type="ios-cloud-upload-outline" size="20"></Icon>上传图片,支持拖拽
                </div>
		    </Upload>
			<Button @click="handleBeforeUpload" style="vertical-align:top;">
				<div style="">
                    <Icon type="ios-cloud-upload-outline" size="20"></Icon>选择图片
                </div>
			</Button>
			<Resource v-model="isUpload" ref="upload" :default-file-lists="facemore"></Resource>
        </Form-item> -->

            <!-- <Form-item label="详细介绍" prop="readme">
            <Input v-model="formValidate.readme" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            <Editor class="editor" v-model="formValidate.readme"></Editor>  
        </Form-item> -->
            <!--         <div>
        	<textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        </div> -->

            <Form-item label="下架" prop="deleted">
                <i-switch v-model="formValidate.deleted"></i-switch>
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
                <Button @click="cancel" style="margin-left: 8px;">取消</Button>
            </Form-item>
        </Form>

        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%;" />
        </Modal>
        <Modal v-model="isUpload" width="860">
            <p slot="header">选择图片</p>
            <fileExplorer
                :options="options"
                @successCallback="uploadListFun"
            ></fileExplorer>
            <div slot="footer"></div>
        </Modal>
    </Card>
</template>
<script>
import fileExplorer from '@/components/fileExplorer/fileExplorer';
export default {
    components: {
        fileExplorer
    },
    data () {
        return {
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: 'image',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            moves: window.vueAppUrl + '/userlist/' + window.vueAppUser + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            formValidate: {
                "id": "0", "name": "", "jianjie": "", "readme": "", "price": 0.00, "kc": 0, "face": [], "facemore": [], "guigehave": "0", "guigename1": "", "guigename2": "", "posttype": 0, "postmoney": "0.00", "posttplid": 0, "zhongliang": 0, "uptime": "0", "orderid": "0", "deleted": false, "click": "0", "classid": [], "guigeitems": [{
                    name1: '',
                    name2: '',
                    picture: '',
                    price: 0.00,
                    zhongliang: 0,
                    kc: 0
                }]
            },
            ruleValidate: {
                name: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '价格不能为空', trigger: 'blur' },
                    { type: 'string', message: '价格不正确', trigger: 'blur' }
                ],
                kc: [
                    { required: true, message: '请输入库存', trigger: 'blur' },
                    { type: 'string', message: '库存不正确,必须是大于0的数字', trigger: 'blur' }
                ],
                // face: [
                //     { required: true, message: '请上传图片', trigger: 'change' }
                // ],
                // readme: [
                //     { required: true, message: '请输入详细介绍', trigger: 'blur' },
                //     { type: 'string', message: '请输入详细介绍', trigger: 'blur' }
                // ]
            },
            goodsid: 0,
            imgName: '',
            visible: false,
            uploadList: [],
            uploadListOne: [],
            classitems: [],
            face: [],
            facemore: [],
            postList: [],
            loading: false,
            shoptype: 'ec',
            isUpload: false,
            isUploadOne: false,
            isUploadGuiGe: false,
            uploadGuiGeID: void 0
        }
    },
    computed: {
        postTplZhongliang: function () {//根据给出的运费模板ID,判断他是否是按重量计费
            if (this.formValidate.posttype == '0') {
                return 0;
            }
            for (var i = 0, len = this.postList.length; i < len; i++) {
                if (this.postList[i].value == this.formValidate.posttplid) {
                    return this.postList[i].posttype;
                }
            }
        }
    },
    created () {
        // this.goodsid = this.$route.params.id;
        // this.goodsid = this.goodsid == 'undefined' ? 0 : this.goodsid;
        // this.shoptype = this.$route.params.shoptype || 'ec';
        // this.get(this.goodsid);
        this.fetchData();


        // console.log(JSON.stringify(this.formValidate));

        // this.face = this.formValidate.face;
        // this.facemore = this.formValidate.facemore;
        //    console.log('2='+JSON.stringify(this.facemore));



    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },
    methods: {
        uploadListFun (files) {
            this.isUpload = false;
            if (this.options.mode == "single") {
                if (this.uploadGuiGeID != void 0) {
                    this.formValidate.guigeitems[this.uploadGuiGeID].picture = files.name
                    this.formValidate.guigeitems[this.uploadGuiGeID].picturename = files.url
                } else {
                    this.uploadListOne = [files];
                }

            } else if (this.options.mode == "multiple") {
                this.uploadList.push(...files);
            }
        },
        handleBeforeUploadOne () {
            this.isUpload = true;
            this.options.mode = "single";
            this.uploadGuiGeID = void 0;
        },
        guiGeComputer: function (index) {
            this.isUpload = true;
            this.uploadGuiGeID = index;
        },
        handleSubmit: function (name) {
            var _this = this;
            this.$refs[name].validate((valid) => {
                if (valid) {

                    //特殊字段检测
                    if (this.formValidate.guigehave == 0) {
                        if (this.formValidate.price <= 0) {
                            _this.$Message.error('价格必须大于0');
                            return false;
                        }

                        if (this.formValidate.posttype == 1) {
                            if (this.postTplZhongliang == 1) {
                                if (this.formValidate.zhongliang <= 0) {
                                    _this.$Message.error('物流重量必须大于0');
                                    return false;
                                }
                            }
                        }

                    }
                    else {
                        if (this.formValidate.guigename1 == "") {
                            _this.$Message.error('规格一名称不能为空');
                            return false;
                        }
                        if (this.formValidate.guigename2 == "") {
                            _this.$Message.error('规格二名称不能为空');
                            return false;
                        }

                        len = this.formValidate.guigeitems.length;


                        if (len == 0) {
                            _this.$Message.error('请添加规格');
                            return false;
                        }




                        for (var i = 0; i < len; i++) {
                            if (this.formValidate.guigeitems[i].name1 == '') {
                                _this.$Message.error('规格第' + (i + 1) + '行' + this.formValidate.guigename1 + '列名称不能为空');
                                return false;
                            }
                            if (this.formValidate.guigeitems[i].name2 == '') {
                                _this.$Message.error('规格第' + (i + 1) + '行' + this.formValidate.guigename2 + '列名称不能为空');
                                return false;
                            }
                            if (this.formValidate.guigeitems[i].price == '') {
                                _this.$Message.error('规格第' + (i + 1) + '行 价格不对');
                                return false;
                            }
                            if (this.formValidate.guigeitems[i].price <= 0) {
                                _this.$Message.error('规格第' + (i + 1) + '行 价格不对');
                                return false;
                            }
                            // if(this.formValidate.guigeitems[i].kc == '') 
                            //   {
                            //     this.$Message.error('规格第'+(i+1)+'行 库存不能为空');
                            //     return false;
                            //   }
                        }



                        if (this.formValidate.posttype == 1) {
                            if (this.postTplZhongliang == 1) {
                                for (var i = 0; i < len; i++) {
                                    console.log(this.formValidate.guigeitems[i].zhongliang);
                                    console.log(this.formValidate.guigeitems);
                                    if (this.formValidate.guigeitems[i].zhongliang == '') {
                                        _this.$Message.error('运费模板第' + (i + 1) + '行 物流重量不能为空');
                                        return false;
                                    }
                                    if (this.formValidate.guigeitems[i].zhongliang <= 0) {
                                        _this.$Message.error('运费模板第' + (i + 1) + '行 物流重量必须大于0');
                                        return false;
                                    }
                                }
                            }
                        }


                    }

                    //检测运费设置



                    if (this.formValidate.posttype == 1) {
                        if (!this.formValidate.posttplid) {
                            _this.$Message.error('请设置运费模板');
                            return false;
                        }
                    }

                    //将图片插入formValidate

                    // console.log(JSON.stringify(this.uploadListOne));
                    // console.log(JSON.stringify(this.uploadList));

                    // console.log('face');

                    // console.log(JSON.stringify(this.face));
                    // console.log(JSON.stringify(this.facemore));


                    //新添加的图片 放在uploadListOne uploadList

                    this.formValidate.face = this.formValidate.facemore = [];

                    if (this.uploadListOne.length > 0) {
                        this.formValidate.face = this.uploadListOne[0].name;
                    }
                    else {
                        this.formValidate.face = [];
                    }

                    for (var i = 0, len = this.uploadList.length; i < len; i++) {
                        this.formValidate.facemore.push(this.uploadList[i].name);
                    }

                    //历史图片 放在this.face this.facemore



                    // console.log(JSON.stringify(this.formValidate.face));
                    // console.log(JSON.stringify(this.formValidate.facemore));


                    // console.log(JSON.stringify(this.formValidate));

                    //               	return;

                    // this.loading = true;
                    //开始保存


                    // console.log("开始保存");


                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: this.vueAppid,
                        shoptype: 1
                    };

                    data.action = "goods_edit";
                    data.id = this.formValidate.id;
                    data.items = this.formValidate;


                    _this.$Loading.start();


                    this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {


                        console.log(JSON.stringify(response.data));
                        _this.$Loading.finish();

                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');
                            _this.$router.push({ path: '/shop/1/wai' });
                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                            _this.loading = false;
                        }

                    }).catch(function (response) {
                        _this.$Loading.error();
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                        _this.loading = false;
                    });



                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },

        fetchData: function () {
            this.goodsid = this.$route.params.id;
            this.goodsid = this.goodsid == undefined ? 0 : this.goodsid;
            this.shoptype = this.$route.params.shoptype || 'ec';

            console.log("goodsid=", this.goodsid);
            // console.log(this.goodsid);
            this.get(this.goodsid);
        },

        changeshoptype: function (name) {
            if (name == '2') {
                this.$router.push({ path: '/shop/1/waimai' });
            }
            else {
                this.$router.push({ path: '/shop/1/ec' });
            }
        },
        get: function (goodsid) {//获取指定记录
            var _this = this;

            this.getclass();
            this.getPostlistName();

            goodsid = goodsid == undefined ? 0 : goodsid;

            if (!goodsid || goodsid == '0') {
                return false// 添加
            }

            //  /api_edit.php?action=goods_getone&goodsid=3



            _this.$Loading.start();

            var apiurl = "/api_edit.php?action=goods_getone&goodsid=" + goodsid + "&appid=" + this.vueAppid + "&shoptype=1";
            _this.$http.get(apiurl).then(function (response) {


                _this.$Loading.finish();
                console.log(response);
                if (response.data.status == 1) {
                    _this.formValidate = response.data.goodsitem;
                    console.log(_this.formValidate);

                    _this.face = _this.formValidate.face;
                    _this.facemore = _this.formValidate.facemore;
                    _this.uploadListOne = _this.formValidate.face;
                    console.log(_this.formValidate.face);
                }
                else {
                    _this.$Message.error(response.data.message);
                }

            })
                .catch(function (response) {
                    _this.$Loading.error();
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: '无法访问服务器,请重试111111111111'
                    });
                });
        },
        getclass: function () {
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                shoptype: 1
            };
            data.action = 'goods_classlist';

            var _this = this;

            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                // console.log('response=');
                // console.log(response);
                // console.log(response.data.body);
                if (response.data.status == 1) {
                    _this.classitems = response.data.body;
                    // console.log(JSON.stringify(this.classitems));
                }
                else {
                    _this.$Message.error(response.data.message);
                }
            });
        },
        getPostlistName: function () {
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                shoptype: 1
            };
            data.action = "goods_postListName";

            var _this = this;

            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                // console.log('response=');
                // console.log(response);
                // console.log(response.data.body);
                if (response.data.status == 1) {
                    _this.postList = response.data.body;
                    // console.log(JSON.stringify(this.postList));
                }
                else {
                    _this.$Message.error(response.data.message);
                }
            });
        },
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.uploadList;
            this.uploadList.splice(fileList.indexOf(file), 1)
        },
        handleRemoveOne (file) {
            // 从 upload 实例删除数据
            this.uploadListOne = [];
        },
        handleSuccess (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';

            file.url = res.url;
            file.name = res.name;
        },

        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleErrorTips () {
            this.$Notice.warning({
                title: '上传失败',
                desc: ''
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },

        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                return this.$Notice.warning({
                    title: '最多只能上传 5 张图片。'
                });
            }
            this.isUpload = true;
        },
        handleAdd: function () {
            // alert(this.formValidate.guigeitems.length);
            if (this.formValidate.guigeitems == null) {
                this.formValidate.guigeitems = [{
                    nameid1: '',
                    nameid2: '',
                    picture: '',
                    price: 0.00,
                    zhongliang: 0.00,
                    kc: 0
                }];
            }
            else {
                this.formValidate.guigeitems.push({
                    nameid1: '',
                    nameid2: '',
                    picture: '',
                    price: 0.00,
                    zhongliang: 0.00,
                    kc: 0
                });
            }

            // guigeEmpty:{ nameid1: '', nameid2: '', picture: '', price: 0.00,kc:0 }
        },
        handleGuigeRemove: function (index) {
            this.formValidate.guigeitems.splice(index, 1);
        },
        handleUpload: function () {
            this.$Message.loading('正在上传', 0);
        },
        cancel: function () {
            this.$router.push({ path: '/shop/' + this.page + '/' + this.shoptype });
        },
        remove (item) {
            if (item) {
                this.$Modal.confirm({
                    title: "删除提示",
                    content: "确定要删除该条新闻吗",
                    onOk: () => {
                        var apiurl = '/api_edit.php?action=news_del'
                        var data = {
                            appid: this.vueAppid,
                            del: [item.id]
                        }
                        console.log(data);
                        var _this = this
                        _this.$http.post(apiurl, data).then(function (response) {
                            if (response.data.status == 1) {
                                _this.dataInitial()
                            } else {
                                _this.$Message.error(response.data.message)
                            }
                        })
                    }
                })

            } else {
                this.$Message.info('请选择要操作的记录')
                return false
            }
        }


    }
}
</script>



<style scoped>
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
.guige-input {
    text-align: center;
}

.guige-upload-list {
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
.guige-upload-list img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
}
</style>