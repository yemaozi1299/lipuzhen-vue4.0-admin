<template>
    <div class="editor-wrapper">
        <div :id="editorId"></div>
    </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
import axios from 'axios'
import $ from 'jquery'
export default {
    name: 'Editor',
    props: {
        value: {
            type: String,
            default: ''
        },
        /**
         * 绑定的值的类型, enum: ['html', 'text']
         */
        valueType: {
            type: String,
            default: 'html',
            validator: (val) => {
                return oneOf(val, ['html', 'text'])
            }
        },
        /**
         * @description 设置change事件触发时间间隔
         */
        changeInterval: {
            type: Number,
            default: 200
        },
        /**
         * @description 是否开启本地存储
         */
        cache: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        editorId () {
            return `editor${this._uid}`
        }
    },
    methods: {
        setHtml (val) {
            this.editor.txt.html(val)
        }
    },
    mounted () {
        let that = this;
        this.editor = new Editor(`#${this.editorId}`);
        this.editor.customConfig.onchange = (html) => {
            let text = this.editor.txt.text()
            if (this.cache) localStorage.editorCache = html
            this.$emit('input', this.valueType === 'html' ? html : text)
            this.$emit('on-change', html, text, this.editorId)
        }
        this.editor.customConfig.onchangeTimeout = this.changeInterval

        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        this.editor.customConfig.withCredentials = true;
        this.editor.customConfig.uploadImgServer = `/`;  // 上传图片到服务器
        this.editor.customConfig.uploadFileName = 'file';
        this.editor.customConfig.uploadImgMaxLength = 5;
        this.editor.customConfig.zIndex = 100;


        this.editor.viewsource = {
            init: function (editorSelector) {
                $(editorSelector + " .w-e-toolbar").prepend('<div class="w-e-menu html-e-menu" onclick="window.wangEditor.viewsource.toggleViewsource(\'' + editorSelector + '\')"><a class="_wangEditor_btn_viewsource" href="javascript:void(0);">&#60;&#47;&#62;</a></div>');
            },
            toggleViewsource: function (editorSelector) {
                var editorHtml = window.wangEditor.txt.html();
                var editorBtn = $(editorSelector);
                var htmlBtn = $(editorSelector + ' .html-e-menu');
                editorBtn.toggleClass('fullscreen-editor');
                if (editorBtn.hasClass("fullscreen-editor")) {
                    editorHtml = editorHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
                    $(editorSelector + ' ._wangEditor_btn_viewsource').text('返回');
                    htmlBtn.siblings().hide();
                } else {
                    editorHtml = window.wangEditor.txt.text().replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, " ");
                    $(editorSelector + ' ._wangEditor_btn_viewsource').text('</>');
                    htmlBtn.siblings().show();
                }


                console.log(editorHtml);
                window.wangEditor.txt.html(editorHtml);
                window.wangEditor.change && window.wangEditor.change();	//更新编辑器的内容
            }
        }

        this.editor.customConfig.uploadImgHooks = {

            fail: function (xhr, editor, result) {
                console.log("fail", xhr, editor, result)
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },

        };
        this.editor.customConfig.customUploadImg = function (files, insert) {
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法

            // 上传代码返回结果之后，将图片插入到编辑器中
            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                let param = new FormData(); //创建form对象
                param.append('file', file);//通过append向form对象添加数据 
                console.log(param)
                //param.append('chunk','0');//添加form表单中其他数据
                //console.log(param.get('tweetPic')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
                axios.post(`/api_edit.php?action=filemanager_upload&appid=${that.$cookieStore.get("CookVueAppid")}`, param).then(response => {
                    insert(response.data.url)
                    console.log(response.data.url);
                });
            }

            // insert(imgUrl)
        }
        // create这个方法一定要在所有配置项之后调用
        window.wangEditor = this.editor;
        this.editor.create();
        this.editor.viewsource.init(`#${this.editorId}`);
        // 如果本地有存储加载本地存储内容
        // let html = this.value || localStorage.editorCache
        // if (html) this.editor.txt.html(html)
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.editor-wrapper {
    z-index: 100 !important;
    ._wangEditor_btn_viewsource {
        color: #999;
    }
    .w-e-menu {
        &:hover {
            ._wangEditor_btn_viewsource {
                color: #333;
            }
        }
    }
}
</style>
