<template>
    <div class="files-images-modal">
        <div class="webapp-box-bg" v-if="isModal"></div>
        <div id="image-resource-dialog" class="webapp-box" v-if="isModal">
            <div class="webapp-model-header">
                <ul>
                    <li class="active">我的图片</li>
                </ul>
            </div>
            <span class="webapp-box-close" v-on:click="cancel">×</span>
            <div class="webapp-model-content">
                <div class="sider-left">
                    <ul class="sider-cate">
                        <li
                            v-bind:class="{ active: groupState.id == 0 }"
                            v-on:click="classStateEdit({ id: 0 })"
                        >
                            <span>全部</span>
                        </li>
                        <li
                            v-for="(item, index) in classList"
                            :key="index"
                            v-bind:class="{ active: groupState.id == item.id }"
                        >
                            <i
                                class="cate-compose ivu-icon ivu-icon-compose"
                                v-on:click.stop="handleEdit(item)"
                            ></i
                            ><span v-on:click.stop="classStateEdit(item)">{{
                                item.groupname
                            }}</span
                            ><i
                                class="cate-close ivu-icon ivu-icon-close-circled"
                                v-on:click.stop="delGroundState(item, index)"
                            ></i>
                        </li>
                    </ul>
                </div>

                <div class="sider-content">
                    <div class="resource-list-wrap">
                        <ul class="resource-list">
                            <li
                                v-for="(item, index) in reversedMessage"
                                :key="index"
                                v-bind:class="{ selected: item.select }"
                                v-on:click="toggleSelect(item)"
                            >
                                <a href="javascript:;" class="thumbnail">
                                    <img
                                        :title="item.original"
                                        :src="item.path"
                                    />
                                    <!-- src="../../static/images/loading.gif" -->
                                </a>
                                <div
                                    class="img-operate"
                                    v-on:click.stop="isDelect = true"
                                    v-if="!isDelect"
                                >
                                    <a href="javascript:;" title="删除">
                                        <span class="glyphicon glyphicon-trash"
                                            >删除</span
                                        >
                                    </a>
                                </div>
                                <div
                                    class="img-operate"
                                    v-on:click.stop="
                                        deleteClassList(item, index)
                                    "
                                    v-else
                                    v-on:mouseout="isDelect = false"
                                >
                                    <a
                                        href="javascript:;"
                                        title="确认删除"
                                        style="background-color:#ed3f14"
                                    >
                                        <span class="glyphicon glyphicon-trash"
                                            >确认删除？</span
                                        >
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="webapp-model-footer">
                <div class="box-operation-menu" v-if="boxState == 'default'">
                    <ul>
                        <li class="upload-btn" style="position:relative">
                            <Upload
                                :show-upload-list="false"
                                :on-success="handleGuiGeSuccess"
                                :format="['jpg', 'jpeg', 'png', 'gif']"
                                :max-size="2048"
                                accept="image/*"
                                :action="
                                    '/api_edit.php?action=filemanager_upload&classid=' +
                                        groupState.id +
                                        '&appid=' +
                                        wxappid
                                "
                                multiple
                                style="display: inline-block;width:150px;"
                            >
                                <Button
                                    type="success"
                                    icon="ios-cloud-upload-outline"
                                    >上传图片至当前组</Button
                                >
                            </Upload>
                        </li>
                        <li style="margin-right: 41px;">
                            <Page
                                :total="total"
                                :current="page"
                                :page-size="35"
                                show-total
                                show-elevator
                                @on-change="skippage"
                            ></Page>
                        </li>
                        <li class="">
                            <Button
                                type="info"
                                style="margin-right:10px;"
                                v-on:click="handleRender"
                                >新建分组</Button
                            >
                        </li>
                        <li class="">
                            <Button
                                type="warning"
                                v-on:click="boxState = 'hide'"
                                >批量处理</Button
                            >
                        </li>
                    </ul>
                </div>
                <div
                    class="box-hide"
                    id="box-img-batch"
                    v-if="boxState == 'hide'"
                >
                    已选
                    <span class="resource-select-num">{{
                        activeHideArr.length
                    }}</span
                    >张 移至
                    <select v-model="model1" style="width:200px">
                        <option :value="0">默认</option>
                        <option
                            v-for="item in classList"
                            :value="item.id"
                            :key="item.id"
                            >{{ item.groupname }}</option
                        >
                    </select>
                    <Button v-on:click="SelectClass">确定</Button>
                    <Button v-on:click="delActiveImage">删除选中图片</Button>
                    <Button v-on:click="boxState = 'default'">取消</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        fileid: {
            type: String,
            default: ''
        },
        defaultFileLists: {
            type: Array,
            default () {
                return [];
            }
        },
        onSuccess: {
            type: Function,
            default () {
                return {};
            }
        },
        param: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data: function () {
        return {
            moves: '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            isDelect: false,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            isModal: this.value,
            list: {
                0: [
                    { body: [] }
                ]
            },
            classList: {},
            currentPageData: {},
            groupState: {
                id: 0
            },
            fileList: [],
            addGroupName: '',
            activeHideArr: [],
            model1: [],
            boxState: 'default',
            statePage: 0,
            reversedMessage: [
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
                { path: "/images/loading.gif" },
            ],
            // reversedPage:{},
            isLoading: true,
            classid: 0,
            total: 0,
            page: 1,
            wxappid: this.$cookieStore.get("CookVueAppid")
        }
    },
    created: function () {
        this.getActiveClassData();
        this.getClassData();

    },
    watch: {
        value: function (val) {
            this.getActiveClassData();
            this.getClassData();
            this.isModal = val;
        },
        defaultFileLists: {
            immediate: true,
            handler (fileList) {
                this.fileList = fileList.map(item => {
                    item.status = 'finished';
                    item.percentage = 100;
                    item.uid = Date.now() + this.tempIndex++;
                    return item;
                });
            }
        },
        // boxState:function(val){
        // 	if(val = 'default'){
        // 		this.removeSelect();
        // 		this.activeHideArr = [];
        // 	}
        // },
        // list:{
        // 	handler:function(val){
        // 		var data = this.list[ this.groupState.id ][ this.statePage ];
        // 		this.reversedMessage = data.body;
        // 		this.total = data.total;
        // 	},	
        // 	deep: true
        // }
    },
    computed: {
        // reversedMessage:function(){
        // 	var data = this.list[ this.groupState.id ][ this.statePage ];
        // 	this.total = data.total;
        //      		return data.body;
        // }
    },
    methods: {

        cancel: function () {
            this.isModal = false;
            this.$emit('input', false);
        },
        classStateEdit: function (item) {
            this.groupState.id = item.id;
            this.classid = item.id;
            this.getActiveClassData();
            this.page = 1;
        },
        getActiveClassData: function () {             //获取当前分类的数据
            var _this = this;
            var params = {
                action: "filemanager_list",
                pageno: 35,
                appid: this.vueAppid,
                classid: this.classid,
                page: this.page
            }
            this.$http.post("/api_edit.php", params).then(function (response) {
                _this.reversedMessage = response.data.body || [];
                _this.total = response.data.total || 0;
                // _this.page = 1;
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        get: function () {                             //第一次加载时获取数据
            var _this = this;
            var params = {
                action: "filemanager_list",
                pageno: 35,
                appid: this.vueAppid,
            }
            this.$http.post("/api_edit.php", _this.$qs.stringify(params)).then(function (response) {
                console.log(response.data);
                _this.reversedMessage = response.data.body || [];
                _this.total = response.data.total || 0;
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        delGroundState: function (item, index) {                   //删除分类
            var state = item;
            var _this = this;
            this.$http({
                method: 'post',
                url: '/api_edit.php?action=filemanager_classdel',
                params: {
                    classid: state.id,
                    appid: this.vueAppid
                }
            }).then(function (response) {
                _this.classList.splice(index, 1);
                _this.classStateEdit({ id: 0 });
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        handleGuiGeSuccess: function (res, file) {                //vue上传图片后的回调函数
            this.reversedMessage.splice(0, 0, {
                classid: this.groupState.id,
                path: res.url,
                pic: res.name
            })

            // this.list = data;
            // console.log(res,file);
        },
        deleteClassList: function (item, index) {         //删除图片
            var _this = this;
            var apiurl = "/api_edit.php";
            var data = {
                action: 'filemanager_del',
                filename: item.pic,
                appid: this.vueAppid
            };
            this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.reversedMessage.splice(index, 1);
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },

        getClassData: function () {                               //获取分类数据
            var _this = this;
            this.$http.get("/api_edit.php?action=filemanager_classlist&appid=" + this.vueAppid).then(function (response) {
                // _this.getData();
                _this.classList = response.data.body || [];
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        handleRender: function () {                             //添加图片分类
            var _this = this;
            this.$Modal.confirm({
                title: '添加图片分组',
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: this.addGroupName,
                            autofocus: true,
                            placeholder: '请输入分组名称'
                        },
                        on: {
                            input: (val) => {
                                this.addGroupName = val;
                            }
                        }
                    })
                },
                onOk: function () {
                    _this.addGroup();
                }
            })
        },
        addGroup: function () {                               //添加图片分类
            var _this = this;
            this.$http.request({
                method: 'post',
                url: '/api_edit.php?action=filemanager_classedit',
                params: {
                    classname: _this.addGroupName,
                    classid: 0,
                    appid: this.vueAppid
                }
            }).then(function (response) {
                var classid = String(response.data.classid);
                _this.classList.splice(0, 0, {
                    groupname: _this.addGroupName,
                    id: classid,
                });
                _this.addGroupName = '';
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        handleEdit: function (item) {                        //修改图片分类名称
            var _this = this;
            var value = '';
            this.$Modal.confirm({
                title: '修改图片分组',
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: item.groupname,
                            autofocus: true,
                            placeholder: '请输入分组名称'
                        },
                        on: {
                            input: (val) => {
                                value = val;
                            }
                        }
                    })
                },
                onOk: function () {
                    item.groupname = value;
                    _this.editGroup(item);
                }
            })
        },

        editGroup: function (item) {                       //修改图片分类名字
            var _this = this;
            this.$http.request({
                method: 'post',
                url: '/api_edit.php?action=filemanager_classedit',
                params: {
                    classname: item.groupname,
                    classid: item.id,
                    appid: this.vueAppid
                }
            }).then(function (response) {

            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        SelectClass: function () {                   //移动图片到其他分类
            var _this = this;
            var apiurl = "/api_edit.php";
            var data = {
                action: 'filemanager_move',
                filename: _this.activeHideArr,
                classid: _this.model1,
                appid: this.vueAppid
            };
            this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.removeSelect();                       //移动完成后移除选中状态
                _this.activeHideArr = [];

            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },
        removeSelect: function () {                      //移除选中状态
            for (var i = 0; i < this.reversedMessage.length; i++) {
                this.reversedMessage[i].select = false;
            }
        },
        delActiveImage: function () {       //删除选中
            var _this = this;
            var apiurl = "/api_edit.php";
            var data = {
                action: 'filemanager_del',
                filename: _this.activeHideArr,
                appid: this.vueAppid
            };
            this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.getActiveClassData();
                _this.activeHideArr = [];
            }).catch(function (response) {
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        },

        skippage: function (page) {
            var _this = this;
            this.page = page;
            _this.getActiveClassData();
        },

        toggleSelect: function (item) {
            if (this.boxState == 'hide') {
                if (!item.select) {
                    this.activeHideArr.push(item.pic);
                } else {
                    var i = this.activeHideArr.indexOf(item.pic);
                    this.activeHideArr.splice(i, 1);
                }

                item.select = !item.select;
            } else {
                this.fileList.push({
                    name: item.pic,
                    url: item.path,
                    status: 'finished',
                    percentage: 100
                });

                this.cancel();
                this.onSuccess({
                    name: item.pic,
                    url: item.path,
                    status: 1,
                    percentage: 100,
                    fieldid: this.fileid,
                    index: this.param.index
                });
                // console.log(this.param);
            }
        },
    }
}
</script>


<style lang="stylus" rel="stylesheet/stylus">
.files-images-modal {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1000;
    .webapp-box {
        position: fixed;
        z-index: 10;
        left: 50%;
        top: 50%;
        width: 890px;
        min-height: 565px;
        margin-left: -435px;
        margin-top: -283px;
        border: 1px solid #DDD;
        /* border-radius: 5px; */
        background: #FFF;
        padding: 0px;
    }
    .webapp-box-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 1;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    .webapp-box select {
        border: 1px solid #ccc;
        border-radius: 4px;
        line-height: 14px;
        padding: 6px 4px 6px 6px;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
        outline: 0;
        width: 160px;
        margin: 0;
    }
    /* ####################顶部布局##################### */
    .webapp-model-header {
        height: 49px;
        padding: 0 16px;
        border-bottom: 1px solid #e9e9e9;
    }
    .webapp-model-header > ul {
        overflow: hidden;
        zoom: 1;
    }
    .webapp-model-header > ul > li {
        height: 49px;
        display: inline-block;
        line-height: 50px;
        text-align: center;
        box-sizing: border-box;
        padding: 0 20px;
        font-size: 14px;
    }
    .webapp-model-header > ul > li.active {
        color: #2c91fb;
        border-bottom: 2px solid #2c91fb;
    }
    .webapp-box-close {
        position: absolute;
        top: 7px;
        right: 20px;
        cursor: pointer;
        font-size: 2.1rem;
        font-weight: bold;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.2;
    }
    /* ####################中部布局#################### */
    .webapp-model-content {
        height: 465px;
    }
    /* ######################左边布局###################### */
    .sider-left {
        width: 22%;
        height: 100%;
        border-right: 1px solid #e9e9e9;
        float: left;
    }
    .sider-left > ul {
        overflow: hidden;
        zoom: 1;
        height: 100%;
        overflow-y: auto;
    }
    .sider-left > ul > li {
        width: 100%;
        padding: 0 30px;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        position: relative;
    }
    .sider-left > ul > li.active {
        background: rgba(48, 145, 242, 0.1);
        color: #2c91fb;
    }
    .sider-left > ul > li:hover {
        background: rgba(48, 145, 242, 0.1);
    }
    .sider-left > ul > li > span {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sider-left > ul > li:hover > i {
        display: block !important;
    }
    .sider-left > ul > li > i.cate-compose {
        display: none;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 30px;
        line-height: 50px;
        text-align: center;
        z-index: 10px;
    }
    .sider-left > ul > li > i.cate-close {
        display: none;
        position: absolute;
        right: 0px;
        top: 0px;
        width: 30px;
        line-height: 50px;
        text-align: center;
        z-index: 10px;
    }
    /* ######################内容###################### */
    .sider-content {
        width: 78%;
        height: 100%;
        float: left;
    }
    .resource-list-wrap {
        height: 465px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .resource-list {
        padding-left: 15px;
        padding-top: 20px;
        text-align: left;
    }
    .resource-list li {
        display: inline-block;
        margin: 0 12px 15px 0;
        border: 1px solid #bfbfbf;
        background-color: #e6e6e6;
        position: relative;
    }
    .resource-list li .thumbnail {
        text-align: center;
        display: inline-block;
        width: 80px;
        height: 80px;
        border: 0;
    }
    .thumbnail:before, .thumbnail:after {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
    .resource-list li img {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
    }
    .resource-list li:hover .img-operate {
        display: block;
        background-color: #dddddd;
        border-color: #ccc;
    }
    .resource-list .img-operate {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .resource-list .img-operate a {
        display: table-cell;
        width: 1%;
        padding: 2px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        text-decoration: none;
        background-color: rgba(0, 0, 0, 0.5);
        line-height: 20px;
    }
    .resource-list li.selected::after {
        position: absolute;
        right: -12px;
        top: -10px;
        display: block;
        width: 24px;
        height: 24px;
        content: '√';
        color: rgb(255, 255, 255);
        font-family: '微软雅黑';
        line-height: 22px;
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: rgb(255, 255, 255);
        border-image: initial;
        background: rgb(106, 187, 3);
        border-radius: 50%;
    }
    /* ####################底部布局#################### */
    .webapp-model-footer {
        height: 50px;
        border-top: 1px solid #e9e9e9;
    }
    .box-operation-menu {
        padding: 10px 16px 10px 10px;
        text-align: right;
    }
    .box-operation-menu > ul {
        overflow: hidden;
        zoom: 1;
    }
    .box-operation-menu > ul > li {
        display: inline-block;
        vertical-align: middle;
    }
    .box-operation-menu > ul > li.upload-btn {
        float: left;
    }
    .box-hide {
        padding: 10px 10px 0px 10px;
        text-align: right;
    }
    /* =================加载动画================== */
    .loading {
        position: relative;
        margin-top: 200px;
        width: 78%;
        float: left;
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
}
</style>