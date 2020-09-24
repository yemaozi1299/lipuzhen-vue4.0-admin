<template>
    <Card>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
        >
            <div style="margin-bottom: 10px; font-size: 16px">
                {{ postid == 0 ? "添加运费模板" : "编辑运费模板" }}
            </div>
            <Form-item label="模版名称">
                <Input
                    v-model="formValidate.name"
                    placeholder="请输入模版名称"
                ></Input>
            </Form-item>

            <Form-item label="计费方式">
                <Radio-group v-model="formValidate.posttype" type="button">
                    <Radio label="0">按件数</Radio>
                    <Radio label="1">按重量</Radio>
                </Radio-group>

                <div>
                    <Row
                        type="flex"
                        justify="center"
                        align="top"
                        class="code-row-bg"
                    >
                        <Col span="12"> 可配送区域 </Col>
                        <Col span="3">
                            <div>
                                {{
                                    formValidate.posttype == 0
                                        ? "首件（个）"
                                        : "首重（Kg）"
                                }}
                            </div>
                        </Col>
                        <Col span="3">
                            <div>运费（元）</div>
                        </Col>
                        <Col span="3">
                            <div>
                                {{
                                    formValidate.posttype == 0
                                        ? "续件（个）"
                                        : "续重（Kg）"
                                }}
                            </div>
                        </Col>
                        <Col span="3">
                            <div>续费（元）</div>
                        </Col>
                    </Row>

                    <Form-item
                        class="linebg"
                        v-for="(gitem, gindex) in formValidate.postitems"
                        :key="gindex"
                        :prop="'postitems.' + gindex + '.first'"
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
                            <Col span="12">
                                {{ gitem.areaname }}
                                <Buttons
                                    type="info"
                                    @click="handleAdd(gindex)"
                                    style="margin: 0 10px"
                                    >编辑</Buttons
                                >
                                <Buttons
                                    type="error"
                                    @click="handleRemove(gindex)"
                                    style="margin: 0 10px"
                                    >删除</Buttons
                                >
                            </Col>
                            <Col span="3">
                                <Input
                                    type="text"
                                    v-model="gitem.first"
                                ></Input>
                            </Col>
                            <Col span="3">
                                <Input
                                    type="text"
                                    v-model="gitem.firstmoney"
                                ></Input>
                            </Col>
                            <Col span="3">
                                <Input
                                    type="text"
                                    v-model="gitem.second"
                                ></Input>
                            </Col>
                            <Col span="3">
                                <Input
                                    type="text"
                                    v-model="gitem.secondmoney"
                                ></Input>
                            </Col>
                        </Row>
                    </Form-item>

                    <Form-item>
                        <Row>
                            <Col span="12">
                                <Button
                                    type="dashed"
                                    long
                                    @click="handleAdd(-1)"
                                    icon="plus-round"
                                    >指定可配送区域和运费</Button
                                >
                            </Col>
                        </Row>
                    </Form-item>
                </div>
            </Form-item>

            <div class="post-input">
                <Button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit('formValidate')"
                >
                    <span v-if="!loading">提交</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </div>
        </Form>

        <Modal
            title="可配送区域"
            v-model="ModalShow"
            @on-ok="postTplSave"
            @on-cancel="postTplcancel"
        >
            <div style="padding-left: 40px">
                <Transfer
                    :data="TransferData"
                    :target-keys="TransferTargetKeys"
                    :render-format="render1"
                    @on-change="handleChangeTransfer"
                ></Transfer>
            </div>
        </Modal>
    </Card>
</template>
<script>
import Buttons from '@/components/buttons'
export default {
    components: {
        Buttons,
    },
    data () {
        return {
            formValidate: {
                "id": "0", "name": "", "posttype": "0", "postitems": [{
                    areaname: '',
                    areaid: [],
                    first: '',
                    firstmoney: '',
                    second: '',
                    secondmoney: ''
                }]
            },
            ruleValidate: {
                name: [
                    { required: true, message: '运费模板名称不能为空', trigger: 'blur' }
                ],
                postitems: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            },
            postid: 0,
            area: [],
            TransferData: [],
            TransferTargetKeys: [],
            loading: false,
            ModalShow: false,
            pindex: -1
        }
    },
    created () {
        var _this = this;
        _this.postid = _this.$route.params.id;
        _this.postid = _this.postid == undefined ? 0 : _this.postid;
        _this.get(_this.postid);
    },
    methods: {
        get: function (postid) {//获取指定记录
            var _this = this;
            postid = postid == undefined ? 0 : postid;

            _this.getarea();

            if (!postid) {
                return false;//添加
            }

            _this.$Loading.start();

            var apiurl = "/api_edit.php?action=goods_postGet&id=" + postid;
            _this.$http.get(apiurl).then(function (response) {

                if (response.data.status == 1) {
                    _this.formValidate.id = postid;
                    _this.formValidate.name = response.data.name;
                    _this.formValidate.posttype = response.data.posttype;
                    _this.formValidate.postitems = response.data.body;

                    // console.log(JSON.stringify(_this.formValidate.postitems));
                }
                else {
                    _this.$Message.error(response.data.message);
                }
                _this.$Loading.finish();

            })
                .catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                    _this.$Loading.error();
                });
        },
        getarea: function () {
            var apiurl = "/api_edit.php";
            var data = {
            };
            data.action = "goods_arealist";

            var _this = this;

            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                // console.log('response=');
                // console.log(response);
                // console.log(response.data.body);
                if (response.data.status == 1) {
                    _this.area = response.data.body || [];
                    // console.log(JSON.stringify(_this.area));
                }
                else {
                    _this.$Message.error(response.data.message);
                    return [];
                }
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        handleSubmit: function (name) {

            var _this = this;

            // return false;
            _this.$refs[name].validate((valid) => {
                if (valid) {

                    //字段检测

                    var len = _this.formValidate.postitems.length;

                    if (len == 0) {
                        _this.$Message.error('请添加可配送区域及价格');
                        return false;
                    }

                    var posttypename = _this.formValidate.posttype == 0 ? "件" : "重"

                    for (var i = 0; i < len; i++) {
                        if (_this.formValidate.postitems[i].areaid.length == 0) {
                            _this.$Message.error('可配送区域第' + (i + 1) + '行为空');
                            return false;
                        }
                        if (_this.formValidate.postitems[i].first == '') {
                            _this.$Message.error('可配送区域第' + (i + 1) + '行首' + posttypename + '数量不能为空');
                            return false;
                        }
                        if (_this.formValidate.postitems[i].firstmoney == '') {
                            _this.$Message.error('可配送区域第' + (i + 1) + '行首' + posttypename + '运费不能为空');
                            return false;
                        }
                        if (_this.formValidate.postitems[i].second == '') {
                            _this.$Message.error('可配送区域第' + (i + 1) + '行续' + posttypename + '数量不能为空');
                            return false;
                        }
                        if (_this.formValidate.postitems[i].secondmoney <= 0) {
                            _this.$Message.error('可配送区域第' + (i + 1) + '行续' + posttypename + '运费不能为空');
                            return false;
                        }

                    }

                    var apiurl = "/api_edit.php";
                    var data = {
                    };

                    data.action = "goods_postEdit";
                    data.postid = _this.formValidate.id;
                    data.items = _this.formValidate;

                    if (_this.loading) {
                        return false;
                    }
                    _this.loading = true;


                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                        // console.log(JSON.stringify(response));

                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');
                            // return;

                            // router.push({ name: 'news', params: { sortid: 602 }});
                            // router.go(-1);
                            _this.$router.push({ path: '/shoppost/' + _this.$route.params.page + '' });
                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                            _this.loading = false;
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.loading = false;
                    });



                } else {
                    _this.$Message.error('请填写完整!');
                }
            })
        },
        arealist: function () {

            var _this = this;

            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "goods_arealist";
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    return response.data.body;
                }
                else {
                    _this.$Message.error(response.data.message);
                }
                _this.$Loading.finish();
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
        },
        // getarea2:function(){
        // 	return _this.area2;
        // },
        handleAdd: function (pindex) {
            var _this = this;
            pindex = pindex == 'undefined' ? 0 : pindex;
            var TransferData = _this.area.slice(0); //生成TransferData 用于显示可添加的省份
            var areaIDexsit = [];     //将所有已添加的省份取出来
            _this.formValidate.postitems.forEach((e2, index2) => {
                if (pindex != index2) //当前区域除外
                {
                    areaIDexsit = areaIDexsit.concat(e2.areaid);
                }
            });
            for (var ii = 0; ii < areaIDexsit.length; ii++) {
                for (var jj = 0; jj < TransferData.length; jj++) {
                    if (TransferData[jj].key === areaIDexsit[ii]) {
                        TransferData.splice(jj, 1);
                    }
                }
            }


            if (pindex == -1)//添加
            {
                _this.TransferTargetKeys = [];
            }
            else//编辑
            {
                _this.TransferTargetKeys = _this.formValidate.postitems[pindex].areaid;
                // _this.TransferData=_this.TransferData.concat(_this.TransferTargetKeys);
            }

            _this.pindex = pindex;
            _this.ModalShow = true;
            _this.TransferData = TransferData;
            // console.log(_this.TransferData);
        },
        handleRemove: function (index) {
            this.formValidate.postitems.splice(index, 1);
        },
        render1: function (item) {
            return item.label;
        },
        handleChangeTransfer: function (newTargetKeys, direction, moveKeys) {
            this.TransferTargetKeys = newTargetKeys;
        },
        cancel: function () {
            this.$router.push({ path: '/shoppost/1' });
        },
        postTplSave: function () {

            var _this = this;

            if (_this.TransferTargetKeys.length <= 0) {
                _this.$Message.info('请选择配送区域');
                return true;
            }

            //根据ID取出省份中文名称

            var areaName = '';
            var pindex = _this.pindex;
            _this.TransferTargetKeys.forEach((e, index) => {
                _this.area.forEach((e2, index2) => {
                    if (e2.key == e) {
                        areaName += e2.label + ',';
                    }
                });
            });

            if (pindex == -1)//添加
            {
                if (_this.formValidate.postitems == null) {
                    _this.formValidate.postitems = [{
                        areaname: areaName,
                        areaid: _this.TransferTargetKeys,
                        first: '',
                        firstmoney: '',
                        second: '',
                        secondmoney: ''
                    }];
                }
                else {
                    _this.formValidate.postitems.push({
                        areaname: areaName,
                        areaid: _this.TransferTargetKeys,
                        first: '',
                        firstmoney: '',
                        second: '',
                        secondmoney: ''
                    });
                }
            }
            else {
                _this.formValidate.postitems[pindex].areaname = areaName;
                _this.formValidate.postitems[pindex].areaid = _this.TransferTargetKeys;
            }



        },
        postTplcancel: function () {
            this.ModalShow = false;
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
    margin-bottom: 0px;
}
.linebg {
    margin-bottom: 0px;
}
.post-input {
    text-align: center;
}
</style>