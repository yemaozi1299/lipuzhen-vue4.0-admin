<template>
    <div
        id="file-explorer"
        data-url="/block/api_edit.php?action=filemanager_list"
        :class="mode"
    >
        <div class="file-panel" data-count="25/58">
            <div class="file-explorer-header">
                <div class="file-explorer-action">
                    <!-- upload and actions here
						uploadFileSizeLimit: 2097152,
						formData: { //{Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数。
							classid:""
						},
						fileVal: "file",
						accept: "",
					 -->
                    <Upload
                        ref="upload"
                        :action="uploadURL"
                        :accept="accept"
                        :data="formData"
                        :max-size="uploadFileSizeLimit"
                        :name="fileVal"
                        :multiple="true"
                        :show-upload-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleSuccessUpload"
                        :on-progress="handleProgressUpload"
                        :on-exceeded-size="handleExceededSize"
                    >
                        <div class="file-uploader" id="uploadFileLabel">
                            上传文件
                        </div>
                    </Upload>

                    <div class="action">
                        <div class="file-action el-button-group">
                            <a
                                class="el-button el-button--default el-button--small"
                                data-action="mkdir"
                                title="新建分组"
                                v-on:click="fileAction"
                            >
                                <span>
                                    <Icon type="md-add" />
                                    新建分组
                                </span>
                            </a>
                            <a
                                class="el-button el-button--default el-button--small"
                                data-action="delete"
                                title="删除"
                                v-on:click="fileAction"
                            >
                                <span>
                                    <Icon type="ios-remove-circle-outline" />
                                    删除
                                </span>
                            </a>
                        </div>
                    </div>
                    <div class="ext-support">
                        <Tooltip
                            max-width="200"
                            :content="filterExt.all.join(',')"
                        >
                            <a href="#">
                                <i class="ico"></i>
                            </a>
                        </Tooltip>
                    </div>
                    <div class="search">
                        <input
                            type="text"
                            name="quick_search"
                            placeholder="搜索文件"
                            v-model="keyword"
                            v-on:keyup.enter="search"
                        />
                        <Icon
                            type="md-search"
                            class="submit"
                            title="搜索"
                            v-on:click="search"
                        />
                    </div>
                    <div
                        class="btn-display"
                        data-action="display"
                        :data-mode="displayMode"
                        v-on:click="displayModeFun"
                    >
                        <button type="button" class="el-button">
                            <i class="ico ivu-icon mainFontColor"></i>
                        </button>
                    </div>
                </div>
                <div id="fileQueueList" v-show="uploadList.length">
                    <div
                        v-for="(item, index) in uploadList"
                        :id="'UF' + item.uid"
                        class="uploadFileItem"
                    >
                        <span class="uploadFileName">{{ item.name }}</span
                        ><span class="uploadFileSize">{{
                            bytesToSize(item.size)
                        }}</span
                        ><span :id="'UP' + item.uid" class="uploadFileProgress"
                            ><div
                                class="uploadFileBar"
                                :style="{ width: item.percentage + '%' }"
                            ></div
                        ></span>
                    </div>
                </div>
            </div>
            <div class="file-panel-tab">
                <ul>
                    <li
                        :class="{ current: currentType == item.type }"
                        v-for="(item, index) in typeList"
                        :data-type="item.type"
                        :data-ftype="item.ftype"
                        v-on:click="filePanelTab"
                    >
                        {{ item.name }}
                    </li>
                    <li id="select-multiple" v-show="false">
                        <a
                            href="#"
                            :class="{
                                disabled: selectedFile == 0
                            }"
                            >选择使用</a
                        >
                    </li>
                    <li class="file-loading" v-show="loadingTip">
                        <span>正在加载中...</span>
                    </li>
                </ul>
                <div
                    class="file-count"
                    title="已加载文件数/文件总数"
                    data-count="25/58"
                >
                    <p class="loaded">
                        已加载: <span>{{ loaded }}</span>
                    </p>
                    <p class="amount">
                        文件总数: <span>{{ amount }}</span>
                    </p>
                </div>
            </div>
            <div
                class="file-panel-content"
                :data-mode="displayMode"
                v-on:scroll="fileScroll"
            >
                <div class="file-list-header">
                    <div class="name">文件名</div>
                    <div class="time">时间</div>
                    <div class="type">类型</div>
                    <div class="action">操作</div>
                </div>
                <div class="head-breadcrumb">
                    <div class="el-breadcrumb">
                        <span
                            v-if="currentTab"
                            class="el-breadcrumb__item"
                            :data-ftype="currentTab.ftype"
                            aria-current="page"
                            v-on:click="ariaCurrent"
                            ><span role="link" class="el-breadcrumb__inner"
                                ><span>{{ currentTab.name }}</span></span
                            ><i
                                class="el-breadcrumb__separator ivu-icon fa-angle-right"
                            ></i
                        ></span>
                        <template v-for="item in breadcrumb">
                            <span
                                class="el-breadcrumb__item"
                                :data-classid="item.classid"
                                ><span role="link" class="el-breadcrumb__inner"
                                    ><span>{{ item.name }}</span></span
                                ></span
                            >
                        </template>
                    </div>
                </div>

                <div class="file-list">
                    <template v-for="(item, index) in floderList">
                        <div
                            class="file folder"
                            data-ftype="folder"
                            data-name="${item.groupname}"
                            data-lock=""
                            v-on:dblclick="dblclickAtions"
                        >
                            <div class="img">
                                <img
                                    src="../../assets/images/file-icon/ico-folder.png"
                                    title="类型: 文件夹"
                                    :alt="item.groupname"
                                    :data-path="item.groupname"
                                    :data-classid="item.id"
                                    data-type="folder"
                                />
                                <div class="action">
                                    <a
                                        href="javascript:void(0);"
                                        data-action="delete"
                                        title="删除"
                                        :data-path="item.id"
                                        :data-name="item.groupname"
                                        v-on:click="deleteAction"
                                    >
                                        <i> </i>
                                    </a>
                                </div>
                            </div>
                            <div
                                class="name"
                                :title="item.groupname"
                                :data-name="item.groupname"
                                :data-path="item.id"
                                :data-classid="item.id"
                                data-lock=""
                                v-on:click="dblclickRename"
                            >
                                <span>{{ item.groupname }}</span>
                            </div>
                            <div class="time"></div>
                            <div class="type">文件夹</div>
                        </div>
                    </template>
                    <template v-for="(item, index) in vueFileList">
                        <div class="file" :data-name="item.pic" data-lock="">
                            <div class="img" :data-ftype="item.typeName">
                                <img
                                    :src="item.path"
                                    :title="
                                        '类型: ' +
                                            item.suffix +
                                            '\n大小: ' +
                                            item.bytes +
                                            '\n修改日期: ' +
                                            item.time
                                    "
                                    :data-url="item.itemPath"
                                    :data-type="item.typeName"
                                    :data-name="item.pic"
                                    v-on:dblclick="dblclickAtions"
                                />
                                <div class="select" v-on:click="selectFile">
                                    选择
                                </div>
                                <div class="action">
                                    <a
                                        href="javascript:void(0);"
                                        title="删除"
                                        data-path=""
                                        :data-name="item.pic"
                                        data-action="delete"
                                        v-on:click="deleteAction"
                                        ><i></i
                                    ></a>
                                </div>
                            </div>
                            <div
                                class="name"
                                :title="item.original"
                                :data-name="item.pic"
                                data-path=""
                                data-lock=""
                                v-on:click="dblclickRename"
                            >
                                <span>{{ item.original }}</span>
                            </div>
                            <div class="time">{{ item.time }}</div>
                            <div class="type">{{ item.suffix }}</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import $ from 'jquery';
import { forEach, parse, getParam } from '@/libs/tools'
// 需要注意的是，jquery-ui引入的时候，
// 直接写 import juqery-ui 没有效果，只能直接写到具体的方法
// 好处是需要引用的也只有两个  draggable  droppable
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/droppable'
import 'jquery-ui/ui/widgets/selectable'

import ico_pdf from '@/assets/images/file-icon/ico-pdf.png';
import ico_word from '@/assets/images/file-icon/ico-word.png';
import ico_txt from '@/assets/images/file-icon/ico-txt.png';
import ico_flash from '@/assets/images/file-icon/ico-unknown.png';
import ico_audio from '@/assets/images/file-icon/ico-audio.png';
import ico_video from '@/assets/images/file-icon/ico-video.png';
import ico_zip from '@/assets/images/file-icon/ico-zip.png';



export default {
    props: {
        options: {
            type: Object,
            default: (val) => {
                return {}
            }
        },
        value: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            loaded: 0,
            amount: 0,
            typeList: [{
                "type": "all",
                "ftype": "0",
                "name": "全部文件"
            }, {
                "type": "image",
                "ftype": "1",
                "name": "图片"

            }, {
                "type": "doc",
                "ftype": "2",
                "name": "PDF"

            }, {
                "type": "word",
                "ftype": "3",
                "name": "WORD文档"

            }, {
                "type": "txt",
                "ftype": "4",
                "name": "TXT"

            }, {
                "type": "flash",
                "ftype": "5",
                "name": "FLASH"

            }, {
                "type": "audio",
                "ftype": "6",
                "name": "音频"

            }, {
                "type": "video",
                "ftype": "7",
                "name": "视频"

            }, {
                "type": "rar",
                "ftype": "8",
                "name": "压缩文档"
            }],
            vueFileList: [],
            floderList: [],
            baseURL: "/block/api_edit.php?action=filemanager_list",
            explorerURL: "/block/api_edit.php?action=filemanager_list",
            deleteURL: "/block/api_edit.php?action=filemanager_del",
            renameURL: "/block/api_edit.php?action=filemanager_memo",
            mkdirURL: "/block/api_edit.php?action=filemanager_classedit",
            deleteMkdirURL: "/block/api_edit.php?action=filemanager_classdel",
            getFolder: "/block/api_edit.php?action=filemanager_classlist",
            moveURL: "/block/api_edit.php?action=filemanager_move",
            lockURL: "/Admin/FileExplorer/lock",
            filterExt: {
                all: [".gif", ".jpg", ".png", ".bmp", ".jpeg", ".swf", ".mp3", ".mp4", ".flv", ".webm", ".txt", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".odt", ".csv", ".rar", ".zip", ".xml"],
                image: [".gif", ".jpg", ".png", ".bmp", ".jpeg"],
                flash: [".swf"],
                audio: [".mp3", ".wma", ".ra"],
                video: [".mp4", ".flv", ".webm"],
                doc: [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".odt", ".csv", ".xml"],
                txt: [".txt"],
                word: [".word"],
                rar: [".rar", ".zip"],
                material: [".gif", ".jpg", ".png", ".bmp", ".jpeg", ".mp3", ".wma", ".ra"]
            },
            currentFolder: "",
            currentType: this.options.type ? this.options.type : "all",
            currentTab: "",
            backwardStack: [],
            forwardStack: [],
            breadcrumb: [],
            mode: this.options.mode || "view",
            displayMode: this.options._displayMode || "grid",
            emptyFileTip: '<p class="file-empty">没有文件.</p>',
            loading: !1,
            currentPage: 1,
            needLoadMore: !1,
            successCallback: this.options.success,
            selectedClass: ".ui-selected",
            selectedSeq: 0,
            cutCache: {},
            cutClass: ".file-cut",
            uploadURL: "/block/api_edit.php?action=filemanager_upload",
            uploadFileSizeLimit: 2048,
            formData: { //{Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数。
                classid: ""
            },
            fileVal: "file",
            accept: "",
            uploadList: [],
            alreadyList: [],
            keyword: "",

            // initParam内容
            fileListContent: "",
            fileList: "",
            fileActionsArea: "",
            loadingTip: false,
            currentURL: "",
            fileInput: "",
            fileCount: "",
            currentTab: "",
            multipleSelectBtn: "",
            selectedFile: [],
            showMode: ""

        }
    },
    created () {
        this.init();
    },
    watch: {
        value: function (val) {
            // val && this.init()
        }
    },
    methods: {
        _initParam: function () {
            this.$nextTick(() => {
                this.container = $("#file-explorer"),
                    this.fileListContent = this.container.find(".file-panel-content"),
                    this.fileList = this.container.find(".file-list"),
                    this.fileActionsArea = this.container.find(".file-explorer-action"),
                    this.baseURL = this.options.url || this.container.attr("data-url"),
                    this.currentURL = this._getFolderURL(""),
                    this.fileInput = void 0,
                    this.fileCount = this.container.find(".file-count"),
                    this.multipleSelectBtn = this.container.find("#select-multiple a");
                this._enableMultipleSelect();

            });
        },
        init: function () {
            var me = this;
            me._initParam();
            if (me.currentType && me.currentType != "all") {
                // 初始化tab
                var li = [];
                forEach(me.typeList, (item, index) => {
                    if (item.type == me.currentType) {
                        return li.push(item);
                    }
                });
                me.typeList = li;
                me.currentTab = li;
                // me._setFileAccept()
            } else {
                me.currentTab = me.typeList[0];
            }
            me._getFiles(me._getFolderURL(""));


        },

        _getFolderURL: function (folder) {
            return parse(this.baseURL, {
                classid: folder,
                filetype: this.currentType
            })
        },
        _getFiles: function (url, callback) {
            var that = this,
                filetype = getParam(url, "filetype");
            this.loadingTip = true;
            this.loading = true;
            if (filetype) {
                filetype = ['all', 'image', 'doc', 'word', 'txt', 'flash', 'audio', 'video', 'rar'].indexOf(filetype);
                if (filetype == -1) filetype = "99";
                url = parse(url, {
                    filetype: filetype
                });
            }
            that.$http.request({
                method: "POST",
                url: url,
                params: {
                    appid: 1
                }
            }).then((data) => {
                var data = data.data;
                if (data.classlist && data.classlist.length) {
                    that.floderList = data.classlist || [];
                }
                if (data.body && data.body.length) {
                    that.refreshFileList(data.body);
                    that.loaded = that.vueFileList.length;
                    that.amount = data.total
                    that.needLoadMore = that.loaded < that.amount;
                }
                that.loading = false;
                that.loadingTip = false;
                that.$nextTick(() => {
                    that._setDraggable();
                });
            })
        },

        // 文件
        refreshFileList: function (body) {
            var li = [],
                me = this,
                that = this;
            body.length && body.forEach(function (item) {
                var ftype = item.filetype;
                var suffix = item.pic.split(".")[1];
                var typeName = "";
                var path = "";

                switch (ftype) {
                    case "1":
                        typeName = "image";
                        path = item.path;
                        break;
                    case "2":
                        typeName = "pdf";
                        path = ico_pdf;
                        break;
                    case "3":
                        typeName = "word";
                        path = ico_word;
                        break;
                    case "4":
                        typeName = "txt";
                        path = ico_txt;
                        break;
                    case "5":
                        typeName = "flash";
                        path = ico_flash;
                        break;
                    case "6":
                        typeName = "audio";
                        path = ico_audio;
                        break;
                    case "7":
                        typeName = "video";
                        path = ico_video;
                        break;
                    case "8":
                        typeName = "zip";
                        path = ico_zip;
                        break;
                }
                li.push({
                    type: "file",
                    pic: item.pic,
                    typeName: typeName,
                    path: path,
                    itemPath: item.path,
                    suffix,
                    bytes: that.bytesToSize(item.size),
                    time: item.time,
                    original: item.original,
                })
            });
            this.vueFileList.push(...li);
            // this._renderList(li);
        },
        bytesToSize: function (bytes) {
            var size;
            size = (size = bytes, size > 1024e3 ? (size / 1024 / 1024).toFixed(2) + " MB" : size > 1024 ? (size / 1024).toFixed(2) + " KB" : size + " bytes")
            return size;
        },
        _refresh: function () {
            this._goToDir(this._getFolderURL(this.currentFolder))
        },
        _goToDir: function (url) {
            var t = getParam(url, "classid");
            this.currentFolder = t || "";
            this.currentPage = 1;
            this.formData = {
                classid: this.currentFolder
            };
            this._emptyList();
            this._getFiles(url)
        },
        _emptyList: function () {
            this.vueFileList = [];
            this.floderList = [];
        },
        setFileAccept: function (ftype) {
            ftype = ftype || this.currentType;
            var filterExt = this.filterExt[ftype].join(","),
                n = filterExt.replace(/,\./g, ",").slice(1);
            this.accept = filterExt;
        },
        _disabledMultipleSelect: function () {
            this.fileList.selectable("destroy")
        },
        // 给列表添加选择功能
        _enableMultipleSelect: function () {
            var me = this;
            me.fileList.selectable({
                filter: ".file",
                cancel: ".ui-selected,a,.select",
                stop: function () {
                },
                selected: function (t, n) {
                    var i = $(n.selected);
                    i.draggable({
                        cursor: "default",
                        cursorAt: {
                            top: 20,
                            left: 0
                        },
                        helper: function () {
                            return $('<div class="drag-helper"><i class="iconfont">&#xe60b;</i></div>')
                        }
                    });
                    i.data("seq", ++me.selectedSeq)
                },
                unselected: function (t, n) {
                    var i = $(n.unselected);
                    i.data("uiDraggable") && i.draggable("destroy"),
                        me.selectedSeq = 0,
                        me._updateSeqUI()
                }
            })
        },
        // 获取当前选中的文件，不包括文件夹
        _getSelectedFile: function () {
            var me = this;
            var list = [],
                selectedFile = this.fileList.find(".file" + this.selectedClass),
                domList = this._sortFilesBySeq(selectedFile); //排序dom列表
            this._updateSeqUI(domList),
                domList.each((function (index) {
                    var img = selectedFile.eq(index).find(".img img");
                    "folder" !== img.attr("data-type") && list.push({
                        name: img.attr("data-name"),
                        url: img.attr("data-url")
                    })
                }));
            this.selectedFile = list;
            return list
        },
        // 刷新dom列表上的seq数字
        _updateSeqUI: function (e) {
            var me = this;
            (e = e || this.fileList.find(".file" + this.selectedClass)).removeAttr("data-seq"),
                e.length > 1 && e.each((function (t) {
                    e.eq(t).attr("data-seq", t + 1)
                }))
        },
        // 给类别增加droppable放置功能
        _setDraggable: function () {
            var me = this;
            me.fileList.find(".img [data-type=folder]").droppable({
                accept: ".file",
                drop: function (t, n) {
                    var file = me._getSelectedFileAndFolder(),
                        classid = $.trim($(t.target).attr("data-classid"));
                    me._pasteFileToDir(file, me.currentFolder, classid);

                }
            });
        },
        //移动文件到分类下
        _pasteFileToDir: function (file, currentFolder, classid) {
            var me = this;
            me.$http.request({
                url: me.moveURL,
                params: {
                    appid: 1,
                    filename: file,
                    classid: classid
                },
                method: "POST",
            }).then((data) => {
                var data = data.data;
                data && 1 == data.status && (me.$Message.info("移动成功"), me._refresh())
            });
        },
        // 获取所有选中的文件
        _getSelectedFileAndFolder: function () {
            var me = this;
            var arr = [],
                fileList = this.fileList.find(".file" + this.selectedClass);
            return fileList.each((function (index) {
                "folder" !== fileList.eq(index).attr("data-folder") && arr.push(fileList.eq(index).attr("data-name"))
            })),
                arr
        },


        // 事件处理函数
        handleBeforeUpload: function (file) {
            // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
            // const fileExt = file.name.split('.').pop().toLocaleLowerCase();
            this.uploadList.push({
                name: file.name,
                percentage: 0,
                size: file.size,
                uid: file.uid
            });
        },
        handleProgressUpload: function (event, file, fileList) {

        },
        handleSuccessUpload: function (response, file, fileList) {
            if (file.response.status == 0) {
                this.$Notice.error({
                    title: '错误提示',
                    desc: file.response.message
                });
            }
            this.alreadyList.push({
                name: file.name,
                percentage: file.percentage,
                size: file.size,
                uid: file.uid,
                status: file.response.status
            });
            if (this.uploadList.length == this.alreadyList.length) {
                var list = this.uploadList;
                list.forEach((item, index) => {
                    item.percentage = 100;
                });
                this.uploadList = list;
                this._refresh();
                setTimeout(() => {
                    this.uploadList = [];
                    this.alreadyList = [];
                }, 1500);
            }
        },
        handleErrorUpload: function (error, file, fileList) {
            console.log("error=", file);
        },
        handleExceededSize: function (file, fileList) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件大小超过限定大小(2M)'
            });
            console.log("ExceededSize=", file);
        },
        filePanelTab: function (event) {
            var $el = $(event.target),
                me = this,
                filetypeid = $el.attr("data-ftype"),
                ftype = $el.attr("data-type");

            var url = parse(me.baseURL, {
                filetype: ftype,
            });
            me.loading || (me.currentPage = 1,
                me.breadcrumb = [],
                me.currentType = ftype,
                me.currentTab = me.typeList[filetypeid],
                "" == ftype && (ftype = "all"),
                me.setFileAccept(ftype),
                me._emptyList(),
                me.currentFolder = "", //初始化提交按钮上传到api所带的参数
                me.formData = {
                    classid: me.currentFolder
                },
                me._getFiles(url))
        },
        dblclickAtions: function (event) {
            var n = $(event.target),
                me = this;
            switch (n.attr("data-type")) {
                case "folder":
                    var getClassUrl = me._getFolderURL($.trim(n.attr("data-classid")));
                    me.breadcrumb = [{
                        name: $.trim(n.attr("data-path")),
                        classid: n.attr("data-classid")
                    }];
                    me._goToDir(getClassUrl);
                    break;
                case "image":
                    me.$Modal.info({
                        content: '<img style="max-width: 100%;height: auto" src="' + n.attr("data-url") + '" />',
                    })
            }
        },
        dblclickRename: function (event) {
            if (!$(event.target).closest(".name").find("input").length) {
                var $el = $(event.target).closest(".name"),
                    me = this,
                    // 清除.name下的span，然后返回该span方便后续重新插入
                    name = $el.find("span").detach(),
                    title = $.trim($el.attr("title")),
                    fname = $.trim($el.attr("data-name")),
                    classid = $el.attr("data-classid"),
                    isFolder = "folder" == $el.prev(".img").find("img").attr("data-type") ? true : false,
                    input = $('<input type="text"/>');
                $el.append(input.val(title).data("oldName", title)),
                    me._disabledMultipleSelect(),
                    input.on("blur.search keyup.search", (function (t) {
                        if ("blur" === t.type || "focusout" === t.type || "keyup" === t.type && 13 === t.keyCode) {
                            me._enableMultipleSelect();
                            var value = $.trim(this.value);
                            // 如果和旧的名称一样，就直接返回，不调用API
                            if (value === input.data("oldName")) {
                                return name.text(value),
                                    void input.replaceWith(name);
                            }
                            if (input.prop("disabled")) {
                                return;
                            }
                            if ("" != value) {
                                if (!/^[\u4E00-\u9FA5a-zA-Z0-9_\-\.\(\) ]+$/.test(value)) {
                                    return void me.$Message.warning("文件(夹)名只支持英文字母, 数字, -, _, .和()", "error");
                                }
                                input.prop("disabled", true);
                                if (isFolder) {
                                    me.$http.request({
                                        method: "POST",
                                        url: me.mkdirURL,
                                        params: {
                                            classid: classid,
                                            classname: value,
                                        },
                                    }).then((data) => {
                                        var data = data.data;
                                        data && 1 == data.status ? (name.text(value),
                                            input.replaceWith(name),
                                            me._refresh()) : me.$Modal.confirm({
                                                content: "修改失败, 请稍后再试",
                                                onOk: () => {
                                                    input.prop("disabled", !1).focus()
                                                },
                                                onCancel: () => {

                                                }
                                            })
                                    })

                                } else {
                                    me.$http.request({
                                        method: "POST",
                                        url: me.renameURL,
                                        params: {
                                            filename: fname,
                                            memo: value,
                                        },
                                    }).then((data) => {
                                        var data = data.data;
                                        data && 1 == data.status ? (name.text(value),
                                            input.replaceWith(name),
                                            me._refresh()) : me.$Modal.confirm({
                                                content: "修改失败, 请稍后再试",
                                                onOk: () => {
                                                    input.prop("disabled", !1).focus()
                                                },
                                                onCancel: () => {

                                                }
                                            })
                                    })

                                }

                            } else {
                                name.text(title);
                                input.replaceWith(name)
                            }

                        }
                    })).focus()
            }
        },
        search: function () {
            var me = this;
            if (!me.loading) {
                var url = me._getFolderURL(me._currentFolder);
                url = parse(url, {
                    keyword: this.keyword
                }),
                    me._emptyList(),
                    me._getFiles(url)
            }
        },
        fileAction: function (event) {
            var action = $(event.target).closest("a").attr("data-action"),
                me = this,
                that = this;
            if ("cut" == action)
                me._cutFile(),
                    me.fileList.find(me.cutClass).removeClass(me.cutClass.slice(1)),
                    me.fileList.find(".file" + me.selectedClass).addClass(me.cutClass.slice(1));
            else if ("paste" == action)
                me._pasteFile();
            else if ("delete" == action) {
                if (me.loading) {
                    return;
                }
                me.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>确认删除选中文件? 这可能影响到页面背景或图片.</p>',
                    onOk: () => {
                        // 获取选中的文件
                        var file = me._getSelectedFileAndFolder();
                        file.length && that.$http.request({
                            type: "POST",
                            dataType: "JSON",
                            url: me.deleteURL,
                            params: {
                                filename: file,
                                appid: 1
                            },
                        }).then((data) => {
                            var data = data.data;
                            data && 1 == data.status && (that.$Message.info(data.message || "删除成功"), me._refresh())
                        });


                    },
                    onCancel: () => {
                    }
                });

            } else {
                "mkdir" == action && me.$http.post(me.mkdirURL, {
                    classname: "新建分组"
                }).then((t) => {
                    var data = t.data;
                    data && 1 == data.status && me._refresh()
                });
            }
        },
        displayModeFun: function (event) {
            var $el = $(event.target).closest(".btn-display"),
                mode = $el.attr("data-mode");
            this.displayMode = "grid" === mode ? "list" : "grid";
        },
        deleteAction: function (event) {
            var $el = $(event.target).closest("a"),
                path = $.trim($el.attr("data-path")),
                name = $.trim($el.attr("data-name")),
                me = this;
            if ($el.closest(".file").hasClass("folder")) {
                me.$Modal.confirm({
                    title: "确认删除",
                    content: "确认删除该文件夹? 该文件夹下的所有文件都将被删除，这可能影响到页面背景或图片",
                    type: "warning",
                    onOk: () => {
                        me.$http.request({
                            method: "POST",
                            url: me.deleteMkdirURL,
                            params: {
                                classid: path
                            }
                        }).then((data) => {
                            var data = data.data;
                            data && 1 == data.status && (me.$Message.info("删除成功"), me._refresh())
                        });

                    },
                    onCancel: () => {
                    }
                })

            } else {
                me.$Modal.confirm({
                    title: "确认删除",
                    content: "确认删除该文件? 这可能影响到页面背景或图片",
                    type: "warning",
                    onOk: () => {
                        me.$http.request({
                            method: "POST",
                            url: me.deleteURL,
                            params: {
                                filename: name
                            }
                        }).then((data) => {
                            var data = data.data;
                            data && 1 == data.status && (me.$Message.info("删除成功"), me._refresh())
                        });

                    },
                    onCancel: () => {
                    }
                })
            }
        },
        ariaCurrent: function (event) {
            var url = parse(this.baseURL, {
                filetype: this.currentType,
                classid: ""
            });
            this.currentFolder = "";
            this.formData = {
                classid: this.currentFolder
            };
            this.breadcrumb = [];
            this._emptyList();
            this._getFiles(url);
        },
        selectFile: function (event) {
            var file = $(event.target).prev("img"),
                i = {
                    name: file.attr("data-name"),
                    url: file.attr("data-url")
                };
            this._success(i)
        },
        _success: function (t) {
            var me = this;
            this.$emit("successCallback", t);
        },
        fileScroll: function (evnet) {
            var n = this.fileListContent
                , i = n.find(".file-list")
                , r = n.height()
                , o = i.height();
            r + n.scrollTop() + 100 >= o && this._loadMore()
        },
        _loadMore: function () {
            if (this.needLoadMore && !this.loading) {
                this.currentPage++;
                var url = parse(this.baseURL, {
                    classid: this.currentFolder,
                    filetype: this.currentType,
                    page: this.currentPage
                });
                this._getFiles(url);
            } else {
            }

        }

    }
}

</script>

<style>
/***********文件管理*************/
#file-explorer {
}
#file-explorer .file-panel {
    position: relative;
    background: #fff;
    overflow: hidden;
}
#file-explorer .file-panel .file-explorer-header {
    height: 50px;
    padding: 10px;
    /*background: #f1f3f5;*/
    box-sizing: border-box;
    margin-left: 130px;
}
#file-explorer .file-panel .selected,
#file-explorer .file-panel .ui-selected {
    position: relative;
    background: #e1f5fe;
    box-shadow: inset 0 0 0 1px #4fc3f7 !important;
}
#file-explorer .file-panel .file-explorer-header .file-explorer-action {
    height: 100%;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .dir:before {
    margin: 0 15px 0 10px;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .file-action:after,
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .file-action:before {
    margin: 0 15px;
}

#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .action
    .ico,
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .dir
    .ico,
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .file-action
    .ico,
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .sort
    .ico {
    display: inline-block;
    width: 22px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    vertical-align: top;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .ext-support
    a
    .ico {
    display: block;
    width: 14px;
    height: 14px;
    background: url(../../assets/images/file-icon/file-explorer-action.png)
        no-repeat;
}
#file-explorer .file-panel .file-explorer-header .file-explorer-action,
#file-explorer .file-panel .file-explorer-header .file-explorer-action .action,
#file-explorer .file-panel .file-explorer-header .file-explorer-action .dir,
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .file-action,
#file-explorer .file-panel .file-explorer-header .file-explorer-action .sort {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-left: 10px;
}
#file-explorer #fileQueueList {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 80px;
    padding: 2px 5px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 -3px 10px rgba(66, 66, 66, 0.2);
    clear: both;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 1;
}
.webuploader-container {
    position: relative;
}
#file-explorer #uploadFileLabel {
    display: block;
    width: 110px;
    height: 30px;
    background: #2d8cf0;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    -webkit-transition: 0.3s;
    transition: 0.3s;
}
#file-explorer #uploadFileLabel:hover {
    background: #57a3f3;
    border-color: #57a3f3;
    color: #fff;
}
.webuploader-pick {
    position: relative;
    display: block;
    cursor: pointer;
    overflow: hidden;
}
#file-explorer .uploadFileItem {
    padding: 5px 4px;
    border-bottom: 1px dashed #d3d3d3;
}
#file-explorer .uploadFileItem:last-child {
    border-bottom: 0;
}
#file-explorer .uploadFileName,
#file-explorer .uploadFileSize {
    margin-right: 5px;
}
#file-explorer .uploadFileItem a,
#file-explorer .uploadFileItem span {
    font-size: 12px;
}
#file-explorer .uploadFileSize {
    color: #555;
}
#file-explorer .uploadFileProgress {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 100px;
    height: 10px;
    border: 1px solid #e4e4e4;
    vertical-align: -2px;
    border-radius: 2px;
}
#file-explorer .uploadFileProgress .uploadFileBar {
    float: left;
    height: 10px;
    background-color: #18bc9c;
    -webkit-transition: width 0.3s;
    transition: width 0.3s;
}
#file-explorer.single .file-panel .file .img:hover .select {
    display: block;
}

/*#file-explorer .file-panel .file-explorer-header .file-explorer-action .action [data-action]+[data-action], #file-explorer .file-panel .file-explorer-header .file-explorer-action .dir [data-action]+[data-action], #file-explorer .file-panel .file-explorer-header .file-explorer-action .file-action [data-action]+[data-action], #file-explorer .file-panel .file-explorer-header .file-explorer-action .sort [data-action]+[data-action] {
    margin-left: 10px;
}*/
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .ext-support {
    margin: 0 15px 0 103px;
}

#file-explorer .file-panel .file-panel-tab {
    position: absolute;
    top: 0px;
    left: 0;
    width: 130px;
    height: calc(100%);
    background: #f1f3f5;
}
#file-explorer .file-panel .file-panel-tab li {
    height: 40px;
    padding-left: 20px;
    cursor: pointer;
    font-size: 12px;
    list-style: none;
    line-height: 40px;
    -webkit-transition: background 0.1s;
    transition: background 0.1s;
    color: #333;
}
#file-explorer .file-panel .file-panel-tab li.current {
    padding-left: 16px;
    background: #fff;
    border-left: 4px solid #18bc9c;
    color: #18bc9c;
    font-size: 14px;
    cursor: default;
}
#file-explorer .file-panel .file-panel-tab #select-multiple {
    position: absolute;
    bottom: 85px;
    width: 100%;
    height: 30px;
    padding: 0;
}

#file-explorer .file-panel .file-panel-tab #select-multiple a {
    display: block;
    width: 90px;
    height: 30px;
    margin: 0 auto;
    background-color: #4fc3f7;
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
    text-decoration: none;
    line-height: 30px;
    cursor: pointer;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    text-align: center;
}
#file-explorer .file-panel .file-panel-tab #select-multiple a.disabled {
    background-color: #c5c5c5;
    color: #999;
    cursor: not-allowed;
}
#file-explorer.multiple .file-panel .file-panel-tab #select-multiple {
    display: block;
    background: none;
}
#file-explorer .file-panel .file-panel-tab .file-loading {
    font-size: 12px;
    color: #18bc9c;
}
#file-explorer .file-panel .file-panel-tab .file-count {
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 90px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
    color: #777;
    line-height: 22px;
    cursor: default;
}
#file-explorer .file-panel .file-panel-content {
    position: relative;
    margin-left: 130px;
    height: 468px;
    overflow: auto;
}
#file-explorer .file-panel .file-panel-content .file-list-header {
    display: none;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    margin-left: 20px;
    background: #fff;
    font-size: 12px;
    color: #777;
    line-height: 30px;
    z-index: 1;
}
#file-explorer .file-panel .file-panel-content .file-list-header .name {
    width: 240px;
    padding-left: 4px;
}
#file-explorer .file-panel .file-panel-content .file-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    min-height: 100%;
    -webkit-align-content: flex-start;
    align-content: flex-start;
    padding: 20px 7px 0 20px;
    box-sizing: border-box;
}
#file-explorer .file-panel .file {
    position: relative;
    width: 120px;
    height: 140px;
    margin-bottom: 10px;
    margin-right: 10px;
    box-sizing: border-box;
}

#file-explorer .file-panel .file .img[data-ftype="zip"] img,
#file-explorer .file-panel .file .img[data-ftype="pdf"] img,
#file-explorer .file-panel .file .img[data-ftype="word"] img,
#file-explorer .file-panel .file .img[data-ftype="txt"] img,
#file-explorer .file-panel .file .img[data-ftype="audio"] img,
#file-explorer .file-panel .file .img[data-ftype="flash"] img,
#file-explorer .file-panel .file .img[data-ftype="video"] img {
    width: 80px;
    height: 80px;
    margin-top: 10px;
    padding: 19px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-sizing: border-box;
}
#file-explorer .file-panel .file:hover {
    box-shadow: inset 0 0 0 1px #4fc3f7;
}
#file-explorer .file-panel .file .img {
    position: relative;
    width: 110px;
    height: 100px;
    padding: 5px;
    text-align: center;
    box-sizing: initial;
}
#file-explorer .file-panel .file .img img {
    max-width: 100%;
    max-height: 100px;
}
#file-explorer .file-panel .file .action {
    display: none;
    position: absolute;
    top: 110px;
    left: 0;
    width: 120px;
    height: 30px;
    text-align: center;
    cursor: default;
}

#file-explorer .file-panel .file .img .select {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #81d4fa;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    z-index: 1;
}
#file-explorer .file-panel .file .img[data-ftype="image"] img {
    width: 100%;
    height: 100% !important;
    object-fit: contain;
    object-position: center;
}
#file-explorer .file-panel .file .img:hover .action {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
#file-explorer .file-panel .file .action a {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    height: 100%;
    background: #4fc3f7;
    font-size: 12px;
    color: #fff;
    text-decoration: none;
}
#file-explorer .file-panel .file .action a:hover {
    background: #81d4fa;
}
#file-explorer .file-panel .file .action a[data-action="delete"] i {
    background-image: url(../../assets/images/file-icon/delete.png);
}
#file-explorer
    .file-panel
    .file-panel-content[data-mode="list"]
    .file
    .img
    .action
    a[data-action="delete"]
    i {
    background-image: url(../../assets/images/file-icon/delete-blue.png);
}
#file-explorer .file-panel .file .action a i {
    display: block;
    width: 18px;
    height: 18px;
    background-position: 50%;
}
#file-explorer .file-panel .file .name {
    padding: 0 5px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 30px;
}
#file-explorer .file-panel .file .name input {
    width: 100%;
    height: 25px;
    padding: 0 5px;
    border: 1px solid #4fc3f7;
    box-sizing: border-box;
    border-radius: 2px;
    text-align: center;
    line-height: 25px;
    outline: none;
    vertical-align: top;
}
#file-explorer .file-panel .file > .time,
#file-explorer .file-panel .file > .type {
    display: none;
}
#file-explorer .file-panel .file > .time {
    width: 170px;
}
#file-explorer .file-panel .file > .type {
    width: 90px;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .ext-support
    + .popover {
    background: #fff;
    border: 0;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(51, 51, 51, 0.24);
    line-height: 1.6;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .ext-support
    + .popover
    .popover-content {
    padding: 10px;
    color: #333;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .ext-support
    + .popover
    .arrow {
    display: none;
}
.file-img-viewer img {
    max-width: 100%;
}
#file-explorer .file-panel .selected[data-seq]:before,
#file-explorer .file-panel .ui-selected[data-seq]:before {
    position: absolute;
    content: attr(data-seq);
    width: 30px;
    height: 30px;
    background: #4fc3f7;
    text-align: center;
    line-height: 30px;
    color: #fff;
    z-index: 1;
}
#file-explorer .file-panel .file-explorer-header .file-explorer-action .search {
    line-height: normal;
    display: inline-table;
    border-collapse: separate;
    border-spacing: 0;
    margin-right: 10px;
    position: relative;
    width: 290px;
    vertical-align: bottom;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .search
    input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 0;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: 12px;
    height: 35px;
    line-height: 35px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
}

#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .search
    .submit {
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 0;
    width: 1px;
    white-space: nowrap;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: transparent;
    padding: 0 11px;
    border-left: 0;
}
.ui-selectable-helper {
    position: fixed;
    border: 1px solid #447ac2;
    background-color: #91b1db;
    opacity: 0.3;
    z-index: 99999;
}
#file-explorer
    .file-panel
    .file-panel-content[data-mode="list"]
    .file-list-header {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

#file-explorer .file-panel .file-panel-content[data-mode="list"] .file-list {
    min-height: calc(100% - 30px);
    padding-top: 0;
}
#file-explorer .file-panel .file-panel-content[data-mode="list"] .file {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    width: 100%;
    height: 30px;
    margin: 0 0 2px;
    border-radius: 2px;
    cursor: default;
}
#file-explorer .file-panel .file-panel-content[data-mode="list"] .file .img {
    margin: 4px;
    width: 22px;
    height: 22px;
    padding: 0;
}
#file-explorer
    .file-panel
    .file-panel-content[data-mode="list"]
    .file
    .img
    .action {
    top: -4px;
    left: 504px;
}
#file-explorer
    .file-panel
    .file-panel-content[data-mode="list"]
    .file:hover
    .img
    .action {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
#file-explorer
    .file-panel
    .file-panel-content[data-mode="list"]
    .file
    .img
    .action
    a {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 30px;
    flex: 0 0 30px;
    background: none;
}
#file-explorer .file-panel .file-panel-content[data-mode="list"] .file .name {
    width: 170px;
    padding: 0 42px 0 0;
    text-align: left;
}
#file-explorer .file-panel .file-panel-content .file-list-header .time {
    width: 170px;
}
#file-explorer .file-panel .file-panel-content .file-list-header .type {
    width: 90px;
}
#file-explorer .file-panel .file-panel-content .file-list-header .action {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
#file-explorer .file-panel .file-panel-content[data-mode="list"] .file > .time,
#file-explorer .file-panel .file-panel-content[data-mode="list"] .file > .type {
    display: block;
    padding-left: 15px;
    box-sizing: border-box;
    line-height: 16px;
}
#file-explorer .file-panel .file-panel-content .file-list-header .name:before,
#file-explorer .file-panel .file-panel-content .file-list-header .time:before,
#file-explorer .file-panel .file-panel-content .file-list-header .type:before {
    content: "";
    width: 1px;
    height: 18px;
    background: #e0e0e0;
    margin-right: 15px;
}

/*nicebox按钮*/
.el-button-group {
    margin-left: 10px;
}

.el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 12px;
    border-radius: 0;
}
.el-button-group > .el-button:not(:last-child) {
    margin-right: -1px;
}
.el-button-group > .el-button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.el-button-group > .el-button:not(:first-child):not(:last-child) {
    border-radius: 0;
}
.el-button-group > .el-button {
    float: left;
    position: relative;
}
.el-button--small {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: -1px;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
}
.el-icon--left {
    margin-right: 5px;
}
.el-button:focus,
.el-button:hover {
    color: #2d8cf0;
    border-color: #c0ddfb;
    background-color: #eaf4fe;
}
/*文件管理导航条*/
.head-breadcrumb {
    padding: 0 20px 0;
    position: relative;
}
.el-breadcrumb {
    font-size: 14px;
    line-height: 1;
}
.head-breadcrumb .el-breadcrumb {
    font-size: 12px;
    padding: 8px 10px 8px 10px;
    background: #ebedf2;
    border: 1px solid #d8dee4;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    overflow: hidden;
}
.el-breadcrumb:after,
.el-breadcrumb:before {
    display: table;
    content: "";
}
.el-breadcrumb__item {
    float: left;
}
.el-breadcrumb__inner {
    color: #606266;
}
.el-breadcrumb .el-breadcrumb__item .el-breadcrumb__inner {
    font-weight: 400;
    color: #2d8cf0;
    cursor: pointer;
}
.el-breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #606266;
    cursor: auto;
}
.el-breadcrumb__separator {
    margin: 0 6px;
    font-weight: 400;
}
.el-breadcrumb__item:last-child .el-breadcrumb__separator {
    display: none;
}
.mainFontColor {
    color: #2d8cf0 !important;
}

#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .btn-display
    .el-button {
    padding: 3.5px 0;
    width: 32px;
    font-size: 22px;
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .btn-display[data-mode="list"]
    .el-button
    i:before {
    content: "\F3D3";
}
#file-explorer
    .file-panel
    .file-explorer-header
    .file-explorer-action
    .btn-display[data-mode="grid"]
    .el-button
    i:before {
    content: "\F20D";
}
.fa-angle-right:before {
    content: "\F11F";
}
</style>



