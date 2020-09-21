<template>
    <div>
        <div v-if="rolecode == 'singlepage'">
            <div class="share-container container-left ivu-col-span-24">
                <div class="share-img">
                    <img :src="caiye" />
                    <p class="share-right-title">扫描二维码即可浏览</p>
                </div>
            </div>
        </div>
        <!-- =================================================== -->
        <div style="position: relative; margin: 0 10px 10px 10px" v-else>
            <div style="line-height: 55px"><h2>打包发布</h2></div>

            <div class="panel-body" v-if="sharefirst === 0">
                <div class="share-box">
                    <div class="pack">
                        <div class="pack-content">
                            <div class="pack-img">
                                <img :src="zip" />
                            </div>
                        </div>
                        <ul class="pack-content-right">
                            <li>
                                <Button type="success" @click="toSharezipSet"
                                    >小程序打包</Button
                                >
                            </li>
                            <li>
                                <span>完美对接微信小程序</span>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html"
                                >
                                    小程序开发工具下载
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="panel-body" v-else-if="sharefirst === 1">
                <div class="pack-box">
                    <div class="pack-title">
                        <img :src="weixin" alt="" />打包微信小程序
                    </div>

                    <div class="pack-setup">
                        <Steps :current="current">
                            <Step title="小程序信息"></Step>
                            <Step title="打包中"></Step>
                            <Step title="打包完成"></Step>
                        </Steps>
                    </div>

                    <div v-if="current === 0">
                        <div
                            class="carousel-webapp-box-bg"
                            v-if="setting.show"
                            v-on:click="settingCarousel"
                        ></div>
                        <div class="carousel-webapp-box" v-if="setting.show">
                            <!-- <img
                                class="carousel-img"
                                src="../../static/images/xcxyuming.png"
                                alt=""
                            /> -->
                        </div>

                        <div class="pack-tips">
                            请在 “微信公众平台 - 小程序 - 设置 - 开发设置”
                            ，获取以下相关信息,并填写好
                        </div>
                        <!-- <div class="pack-tips">（查看教程）</div> -->

                        <Form
                            ref="formValidate"
                            :model="formValidate"
                            :rules="ruleValidate"
                            label-position="left"
                            :label-width="150"
                        >
                            <Form-item label="小程序AppID" prop="wxappid">
                                <Input
                                    v-model="formValidate.wxappid"
                                    placeholder="小程序AppID"
                                ></Input>
                            </Form-item>
                            <Form-item label="小程序AppSecret" prop="appsecret">
                                <Input
                                    v-model="formValidate.appsecret"
                                    placeholder="请输入小程序AppSecret"
                                ></Input>
                            </Form-item>
                            <Form-item label="服务器配置">
                                <span
                                    >并在 开发 - 开发设置 - 服务器域名
                                    中添加以下域名</span
                                >
                                <span
                                    style="color: #22b5e5"
                                    v-on:click="settingCarousel"
                                    >点击查看教程</span
                                >
                                <div>request合法域名：</div>
                                <div class="setdomain">{{ requestUrl }}</div>
                                <div class="setdomain">
                                    https://apis.map.qq.com
                                </div>
                                <div>socket合法域名：</div>
                                <div class="setdomain">{{ requestUrl }}</div>
                                <div>uploadFile合法域名：</div>
                                <div class="setdomain">{{ requestUrl }}</div>
                                <div>downloadFile合法域名：</div>
                                <div class="setdomain">{{ requestUrl }}</div>
                            </Form-item>
                        </Form>

                        <div class="register">
                            <span>还没注册小程序？</span>
                            <a href="https://mp.weixin.qq.com/" target="_blank"
                                >注册通道&gt;&gt;</a
                            >
                        </div>

                        <div align="center" style="margin-top: 10px">
                            <Button
                                type="primary"
                                @click="handleSubmit('formValidate')"
                                >提交</Button
                            >
                            <Button type="primary" @click="sharefirst = 0"
                                >取消</Button
                            >
                        </div>
                    </div>

                    <div v-else-if="current === 1" class="pack-tips">
                        <Spin>
                            <Icon
                                type="load-c"
                                size="88"
                                class="demo-spin-icon-load"
                            ></Icon>
                            <div>Loading</div>
                        </Spin>
                    </div>

                    <div v-else-if="current === 2">
                        <div class="pack-tips">
                            <a
                                target="_blank"
                                href="https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html"
                            >
                                小程序开发工具下载
                            </a>
                        </div>
                        <div class="pack-tips">
                            <Button type="primary" @click="toDownload"
                                >打包完成,请下载</Button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import caiye from "@/assets/images/zip/caiye.jpg"
import zip from "@/assets/images/zip/zip.png"
import weixin from "@/assets/images/zip/weixin.svg"
export default {
    data () {
        return {
            caiye,
            zip,
            weixin,
            value1: 0,
            setting: {
                show: false
            },
            requestUrl: window.vueAppUrl,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            rolecode: this.$cookieStore.get("CookRolecode"),
            current: 0,
            filename: '',
            sharefirst: 0,
            formValidate: {
                wxappid: '',
                appsecret: ''
            },
            ruleValidate: {

                wxappid: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                appsecret: [
                    { required: true, message: '必填', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.get();
    },
    methods: {
        get: function () {//获取新闻内容
            var _this = this;
            var apiurl = "/api_edit.php?action=goods_payGet&appid=" + this.vueAppid;;
            _this.$http.get(apiurl)
                .then((response) => {
                    if (response.data.status == 1) {
                        this.formValidate.wxappid = response.data.body.wxappid;
                        this.formValidate.appsecret = response.data.body.appsecret;
                    }
                    else {
                        this.$Message.error(response.data.message);
                    }

                })
                .catch(function (response) {
                    this.$Notice.error({
                        title: '错误提示',
                        duration: 0,
                        desc: response
                    });
                });
        },
        toDownload () {
            // alert(this.filename);
            location = this.filename;
        },
        toSharezipSet () {
            this.sharefirst = 1;
        },
        settingCarousel: function () {
            this.setting.show = !this.setting.show;
        },
        handleSubmit (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {

                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: this.vueAppid
                    };

                    //id,sortid,title,comment,keyword,date,tj,guestbook

                    data.action = "mini_sharezip";
                    data.wxappid = this.formValidate.wxappid;
                    data.appsecret = this.formValidate.appsecret;

                    // console.log('sortid='+data.sortid);
                    console.log(data);
                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                        // console.log(response.data);

                        if (response.data.status == 1) {
                            // _this.$Message.success('提交成功!');

                            _this.current += 1;

                            // _this.$router.push({ path: '/news/'+this.formValidate.sortid })


                            var data = {};
                            data.action = "mini_make";
                            data.appid = _this.vueAppid;
                            console.log(data);
                            _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {

                                // console.log(response.data);

                                console.log(response.data);
                                if (response.data.status == 1) {
                                    // _this.$Message.success('提交成功!');

                                    _this.current += 1;

                                    _this.filename = response.data.zipname;

                                }
                                else {
                                    _this.$Modal.error({
                                        title: '错误提示',
                                        content: response.data.message
                                    });

                                    _this.current -= 1;
                                }



                            }).catch(function (response) {
                                _this.$Notice.error({
                                    title: '错误提示',
                                    desc: response
                                });
                            });

                        }
                        else {

                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    });

                    // _this.$http({
                    //         url:apiurl,
                    //         method:'post',
                    //         onDownloadProgress:function(progressEvent){ //原生获取上传进度的事件
                    //             if(progressEvent.lengthComputable){
                    //                 //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //                 //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    //                 console.log(progressEvent);
                    //                 _this.percent=progressEvent.loaded;
                    //             }
                    //         },
                    //         data:_this.$qs.stringify(data)
                    //     }).then(res =>{
                    //         _this.$Message.success('提交成功!');
                    //         _this.current += 1;
                    //         _this.percent=100;
                    //     }).catch(function(response)
                    //     {                  
                    //         _this.$Notice.error({
                    //               title: '错误提示',
                    //               desc:  response
                    //           });
                    //     });












                } else {
                    _this.$Message.error('表单验证失败!');
                }
            })
        }
    }
}
</script>
<style>
.carousel-webapp-box {
    position: fixed;
    z-index: 10;
    left: 50%;
    top: 50%;
    width: 720px;
    height: 604px;
    margin-left: -360px;
    margin-top: -302px;
    border: 1px solid #ddd;
    background: #fff;
    padding: 0px;
    overflow: scroll;
}
.carousel-webapp-box-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
}

.carouse-thumbnail {
    width: 100%;
    height: 500px;
    background-color: #e6e6e6;
    text-align: center;
}
.carousel-img {
    display: inline-block;
    width: 100%;
    height: auto;
    vertical-align: middle;
}

.share-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 20px;
    overflow: auto;
}

.share-box .pack {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 420px;
    margin: 0 auto;
}

.share-box .pack .pack-content {
    width: 600px;
}

.share-box .pack .pack-content img {
    border-radius: 16px;
}

.share-box .pack .pack-content-right {
    margin-left: 30px;
}

.share-box .pack .pack-content-right li {
    margin-top: 10px;
}

.pack-box {
    width: 600px;
    margin: 0 auto;
}
.pack-title {
    padding-bottom: 20px;
    font-size: 24px;
    text-align: center;
    color: #303445;
    line-height: 35px;
}
.setdomain {
    color: red;
}
.pack-setup {
    padding: 10px 10px 10px 120px;
}

.pack-tips {
    text-align: center;
    padding: 20px;
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
.share-container {
    height: 100%;
}
.share-img {
    width: 258px;
    margin: 0 auto;
    padding-top: 100px;
}
.share-img p {
    text-align: center;
    font-size: 28px;
    padding-top: 20px;
}
.demo-carousel {
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: #506b9e;
}
</style>