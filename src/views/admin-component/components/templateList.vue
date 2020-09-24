<template>
    <div class="template-def-style">
        <Layout class="layout-wrapper">
            <Header class="header-wrapper">
                <!-- 搜索框 -->
                <Input
                    v-model="keyword"
                    placeholder="关键字"
                    @on-keyup.enter="get(keyword)"
                    clearable
                    class="ant-search-input mg-r-10"
                    style="width: 200px"
                />
                <Button
                    type="primary"
                    @click="get"
                    icon="ios-search"
                    class="ant-search-btn"
                ></Button>
            </Header>
            <Header class="header-wrapper">
                <RadioGroup v-model="selected">
                    <Radio label="0">
                        <span>全选</span>
                    </Radio>
                    <Radio label="1">
                        <span>电脑网站</span>
                    </Radio>
                    <Radio label="2">
                        <span>手机网站</span>
                    </Radio>
                    <Radio label="3">
                        <span>微信小程序</span>
                    </Radio>
                    <Radio label="4">
                        <span>电脑网站 + 手机网站</span>
                    </Radio>
                    <Radio label="5">
                        <span>电脑网站 + 微信小程序</span>
                    </Radio>
                    <Radio label="6">
                        <span>手机网站 + 微信小程序</span>
                    </Radio>
                </RadioGroup>
                <!-- <Checkbox v-model="getAppType.pc">电脑网站</Checkbox>
                <Checkbox v-model="getAppType.mobile">手机网站</Checkbox>
                <Checkbox v-model="getAppType.mina">微信小程序</Checkbox> -->
            </Header>
            <Layout class="layout-wrapper">
                <Layout class="layout-wrapper">
                    <Content>
                        <div class="cti-cardlist">
                            <Row :gutter="16">
                                <Col
                                    :xs="12"
                                    :lg="8"
                                    style="padding-bottom: 10px"
                                >
                                    <Card :padding="0">
                                        <div style="position: relative">
                                            <div
                                                class="cti-align-center"
                                                :style="mobileBgStyle"
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    class="preview_link"
                                                    :style="pcPreviewStyle"
                                                >
                                                </a>
                                            </div>
                                        </div>
                                        <div class="card-info">
                                            <div class="card-title">
                                                <div class="ac-title-level3">
                                                    空白模板
                                                </div>
                                                <div class="number">
                                                    编号: 0
                                                </div>
                                            </div>
                                        </div>
                                        <div class="deleteBtn">
                                            <Button
                                                v-if="isAdd"
                                                type="info"
                                                @click="addTemplate({ id: 0 })"
                                                >使用样板</Button
                                            >
                                        </div>
                                    </Card>
                                </Col>
                                <Col
                                    :xs="12"
                                    :lg="8"
                                    style="padding-bottom: 10px"
                                    v-for="item in appList"
                                >
                                    <Card :padding="0">
                                        <div style="position: relative">
                                            <div
                                                class="cti-align-center"
                                                :style="mobileBgStyle"
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    class="preview_link"
                                                    :style="pcPreviewStyle"
                                                    @click="previewApp(item)"
                                                >
                                                    <span
                                                        class="bg_span"
                                                    ></span>
                                                    <img
                                                        class="qrcode"
                                                        height="164"
                                                        width="164"
                                                        style="
                                                            height: 164px;
                                                            width: 164px;
                                                        "
                                                        v-if="
                                                            (getAppType.mobile ||
                                                                getAppType.mina) &&
                                                            getAppType.pc ==
                                                                false
                                                        "
                                                        :src="item.QrUrl"
                                                    /><span
                                                        class="bg_round"
                                                        v-if="getAppType.pc"
                                                    ></span
                                                    ><span
                                                        class="txt_span ng-binding"
                                                        v-if="getAppType.pc"
                                                        >预览</span
                                                    ><img
                                                        class="mobile-preview-img"
                                                        :style="
                                                            previewWidthStyle
                                                        "
                                                        :src="
                                                            (getAppType.mobile ==
                                                                true ||
                                                                getAppType.mina ==
                                                                    true) &&
                                                            getAppType.pc ==
                                                                false
                                                                ? item.cover_mobile
                                                                : item.cover_pc
                                                        "
                                                        alt=" "
                                                    />
                                                </a>
                                            </div>
                                            <div
                                                class="mobile-preview"
                                                v-if="
                                                    (getAppType.mobile ==
                                                        false &&
                                                        getAppType.mina ==
                                                            false &&
                                                        getAppType.pc ==
                                                            false) ||
                                                    (getAppType.pc == true &&
                                                        (getAppType.mobile ==
                                                            true ||
                                                            getAppType.mina ==
                                                                true))
                                                "
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    class="preview_link mob"
                                                    style="
                                                        width: 80px;
                                                        height: 130px;
                                                        margin-top: 30px;
                                                        margin-left: auto;
                                                        margin-right: auto;
                                                    "
                                                >
                                                    <img
                                                        class="qrcode"
                                                        height="164"
                                                        width="164"
                                                        style="
                                                            height: 164px;
                                                            width: 164px;
                                                        "
                                                        :src="item.QrUrl"
                                                    />
                                                    <span
                                                        class="bg_span"
                                                    ></span>
                                                    <img
                                                        :src="item.cover_mobile"
                                                        alt=" "
                                                        style="
                                                            width: 80px;
                                                            height: 130px;
                                                        "
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div class="card-info">
                                            <div class="card-title">
                                                <div class="ac-title-level3">
                                                    {{ item.name }}
                                                </div>
                                                <div class="number">
                                                    编号: {{ item.id }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="deleteBtn">
                                            <Button
                                                v-if="isAdd"
                                                class="mg-r-20"
                                                type="info"
                                                @click="addTemplate(item)"
                                                >使用样板</Button
                                            >
                                            <Button
                                                type="error"
                                                @click="jsDelect(item)"
                                                >删除</Button
                                            >
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div class="page-content" v-if="total > pageno">
                            <Page
                                :total="total"
                                :current="page"
                                show-total
                                show-elevator
                                @on-change="skippage"
                            ></Page>
                        </div>
                    </Content>
                    <Footer class="table-footer"> </Footer>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<script type="text/javascript">
import mobileBg from '@/assets/images/templateList/mobileBg.png';
export default {
    props: {
        isAdd: {
            type: Boolean,
            default: (val) => {
                return false
            }
        },
    },
    data: function () {
        return {
            isrefresh: true,
            moves: window.vueAppUrl,
            appList: [],
            keyword: '',
            search: false,
            page: 1,
            total: 0,
            pageno: 10,
            searchPoptip: false,
            getAppType: {
                pc: true,
                mobile: true,
                mina: true,
            },
            selected: "0",
        }
    },
    computed: {
        mobileBgStyle () {
            return (this.getAppType.mobile == true || this.getAppType.mina == true) && this.getAppType.pc == false ? { 'background': 'url(' + mobileBg + ') no-repeat center', 'height': '404px' } : ''
        },
        previewWidthStyle () {
            return (this.getAppType.mobile == true || this.getAppType.mina == true) && this.getAppType.pc == false ? { 'width': '180px', 'height': '280px' } : { 'position': 'absolute', 'left': 0, 'top': 0 }
        },
        pcPreviewStyle () {
            return (this.getAppType.mobile == true || this.getAppType.mina == true) && this.getAppType.pc == false ? { 'width': '180px', 'height': '280px', 'margin-top': '50px', 'margin-left': 'auto', 'margin-right': 'auto' } : ''
        }
    },
    created: function () {
        this.get();
    },
    watch: {
        selected (val) {
            switch (val) {
                case '0':
                    this.getAppType = {
                        pc: true,
                        mobile: true,
                        mina: true
                    }
                    break;
                case '1':
                    this.getAppType = {
                        pc: true,
                        mobile: false,
                        mina: false
                    }
                    break;
                case '2':
                    this.getAppType = {
                        pc: false,
                        mobile: true,
                        mina: false
                    }
                    break;
                case '3':
                    this.getAppType = {
                        pc: false,
                        mobile: false,
                        mina: true
                    }
                    break;
                case '4':
                    this.getAppType = {
                        pc: true,
                        mobile: true,
                        mina: false
                    }
                    break;
                case '5':
                    this.getAppType = {
                        pc: true,
                        mobile: false,
                        mina: true
                    }
                    break;
                case '6':
                    this.getAppType = {
                        pc: false,
                        mobile: true,
                        mina: true
                    }
                    break;
            }
            this.appList = [];
            this.page = 1;
            this.get();
        }
    },
    methods: {
        get: function () {
            var _this = this;
            this.keyword ? this.page = 1 : '';
            var data = {
                action: 'example_applist',
                keyword: this.keyword,
                page: this.page,
                pageno: 10,
                pc: this.getAppType.pc ? 1 : 0,
                mobile: this.getAppType.mobile ? 1 : 0,
                mina: this.getAppType.mina ? 1 : 0,
            };
            console.log(data);
            this.keyword ? this.search = true : this.search = false;
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response.data);
                if (response.data.status == 1) {
                    _this.appList = response.data.body;
                    _this.total = parseInt(response.data.total);
                } else {
                    _this.$Message.info(response.data.message);
                }
                _this.$Loading.finish();
            }).catch((response) => {
                this.$Notice.error({
                    title: '提示',
                    desc: response,
                    duration: 10
                });
            });
        },
        getAppList () {

        },
        skippage: function (page) {
            this.page = page;
            this.appList = [];
            this.get();
        },
        cancelSearch: function () {
            this.keyword = '';
            this.get();
        },
        jsDelect: function (item) {
            var _this = this;
            var params = {
                action: 'example_appdel',
                id: item.id
            };
            this.$Modal.confirm({
                title: '提示',
                content: "确定删除所选样板吗?",
                onOk: () => {
                    this.$http.post("/api_admin.php", params).then((res) => {
                        this.appList.splice(item._index, 1);
                    }).catch((response) => {
                        this.$Notice.error({
                            title: '错误提示',
                            desc: response,
                        });
                    })
                },
                onCancel: () => {
                }
            });

        },
        previewApp: function (params) {
            this.$emit("previewApp", params);
            // window.open('//a.richapps.cn/appeditor/preview.php?appid=' + params.fromappid);
        },
        addTemplate (params) {
            this.$emit("successCallback", params);
        }
    }
}
</script>

<style lang="stylus" scoped>
.template-def-style {
    .ivu-card-head {
        padding: 0;
    }
    .cti-align-center {
        text-align: center;
        overflow: hidden;
    }
    .preview_link {
        display: inline-block;
        max-width: 320px;
        width: 100%;
        height: 240px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .bg_round, .bg_span, .txt_span {
            display: none;
        }
        &.mob {
            .qrcode {
                width: 50px !important;
                height: 50px !important;
                left: 15px;
                top: 42px;
            }
        }
        .qrcode {
            position: absolute;
            z-index: 11;
            left: 48px;
            top: 100px;
            display: none;
            width: 80px !important;
            height: 80px !important;
        }
        &:hover {
            .bg_span {
                z-index: 9;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background: #000;
                display: block;
                opacity: 0.4;
            }
            .bg_round {
                z-index: 10;
                position: absolute;
                top: 80px;
                left: 115px;
                width: 90px;
                height: 90px;
                border-radius: 90px;
                background: #5673d6;
                display: block;
                opacity: 0.5;
            }
            .txt_span {
                z-index: 11;
                position: absolute;
                top: 90px;
                left: 125px;
                width: 70px;
                height: 70px;
                border-radius: 70px;
                background: #5673d6;
                color: #fff;
                text-align: center;
                display: block;
                line-height: 70px;
            }
            .qrcode {
                display: block;
            }
        }
        .mobile-preview-img {
            max-width: 320px;
            heiget: auto;
        }
    }
    .mobile-preview {
        z-index: 99;
        width: 100px;
        height: 200px;
        text-align: center;
        position: absolute;
        top: 52px;
        right: 0;
        background: url('../../../assets/images/templateList/mobileBg.png') no-repeat right;
        background-size: 100%;
    }
    .card-info {
        padding: 10px 15px;
        .card-title {
            overflow: hidden;
            .ac-title-level3 {
                float: left;
                display: block;
                max-width: 60%;
                font-size: 12px;
            }
            .number {
                float: left;
                display: block;
                margin-top: 0;
                padding-left: 5px;
            }
        }
    }
    .deleteBtn {
        padding: 10px;
        text-align: right;
    }
    .ac-title-level3, .ac-title-level4 {
        color: #252b3a;
        font-weight: 700;
    }
    .ac-title-level3 {
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .number {
        color: #8a8e99;
        margin-top: 5px;
    }
}
</style>




