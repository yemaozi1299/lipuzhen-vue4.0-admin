<template>
    <div class="card_controller">
        <header class="top">
            <div class="search-ele">
                <input type="text" class="ant-input" v-model="searchVal" />
                <span class="ant-input-suffix">
                    <Button
                        type="primary"
                        shape="circle"
                        @click="onGetVipcard"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                </span>
            </div>
            <div class="ant-btn">
                <Checkbox @on-change="onGetVipcard">只显示VIP名片</Checkbox>
            </div>
            <!-- <Button type="primary" icon="md-add" class="ant-btn" v-on:click="addSort">新建分类</Button> -->
            <!--            <Button type="primary" icon="md-add" class="ant-btn">新建用户</Button>
			<Button type="primary" ghost  class="ant-btn">回收站</Button> -->
        </header>
        <main class="main">
            <div class="left" v-if="false">
                <label
                    class="ant-radio-button-wrapper"
                    :class="{
                        'ant-radio-button-wrapper-checked': activeClass == 0,
                    }"
                    v-on:click="classStateEdit(0)"
                >
                    <span>全部用户（0）</span>
                </label>
                <label
                    class="ant-radio-button-wrapper"
                    v-for="(item, index) in sort"
                    :key="index"
                    :class="{
                        'ant-radio-button-wrapper-checked':
                            activeClass == item.classid,
                    }"
                    v-on:click="classStateEdit(item.classid)"
                >
                    <Icon
                        class="ant-icon"
                        type="md-settings"
                        style="left: 0px"
                        v-on:click.stop="handleEdit(item)"
                    />
                    <span>{{ item.name }}（{{ item.count }}）</span>
                    <Icon
                        class="ant-icon"
                        type="ios-close-circle-outline"
                        style="right: 0px"
                        v-on:click.stop="delGroundState(item, index)"
                    />
                </label>
                <label class="ant-radio-button-wrapper">
                    <span>黑名单（0）</span>
                </label>
            </div>
            <div class="right">
                <Tables
                    editable
                    :columns="columns1"
                    v-model="data1"
                    :total="pageData.total"
                    :page-size="10"
                    :current="pageData.page"
                    shoPage
                    show-total
                    show-elevator
                    @on-change="skippage"
                />
            </div>
        </main>

        <Modal
            v-model="is_setting_official_modal"
            title="提示"
            @on-ok="setOfficial"
        >
            <p>
                是否将该用户设为销售人员？成为销售人员后，将可以编辑名片，请到销售人员列表中操作。
            </p>
        </Modal>
    </div>
</template>

<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            onVip: false,
            pageData: {
                total: 1,
                page: 1
            },
            searchVal: "",
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            is_setting_official_modal: false,
            activeIndex: 0,
            activeClass: 0,
            activeTotal: 10,
            activePage: 1,
            sort: [
                { classid: 1, name: '未分类', count: 2 },
                { classid: 2, name: '正在跟进客户', count: 4 },
            ],
            columns1: [
                {
                    title: '头像',
                    align: 'center',
                    render: (h, params) => {
                        return h('img', {
                            attrs: {
                                src: params.row.headimgurl || "/static/images/noimage.gif"
                            },
                            style: {
                                margin: '10px',
                                width: '50px',
                                height: '50px'
                            }
                        });
                    }

                },
                {
                    title: '用户名',
                    align: 'left',
                    render: (h, params) => {
                        return h('span', {}, params.row.name);
                    }

                },
                {
                    title: '电话',
                    align: 'left',
                    key: 'mobile'
                },
                // {
                // 	title: '名片设置',
                // 	align: 'left',
                // 	render:(h, params) => {
                // 		return h('div', [
                // 			h('Button', {
                //                                props: {
                //                                    type: 'text'
                //                                },
                //                                style: {
                //                                    padding: 0,
                //                                    color: '#3091f2'
                //                                },
                //                                on: {
                //                                    click: () => {
                //                                        this.goSetPage();
                //                                    }
                //                                }
                //                            },'编辑名片')

                // 		]);
                // 	}
                // },
                {
                    title: '设为VIP',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('i-switch', {
                                props: {
                                    value: params.row.cardType == 1 ? true : false
                                },
                                on: {
                                    'on-change': (res) => {
                                        this.cardSetType(params.row, res, params.index);
                                    }
                                }
                            }, "是")
                        ]);
                    }
                },
                {
                    title: '设为官方名片',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('i-switch', {
                                props: {
                                    value: params.row.official == 1 ? true : false
                                },
                                on: {
                                    'on-change': (res) => {
                                        this.cardSetOfficial(params.row, res, params.index);
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    width: 150,
                    key: "login_time"
                },
                {
                    title: '操作',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    cursor: "pointer",
                                    margin: '5px',
                                    color: params.row.status == 1 ? 'red' : '#3091f2'
                                },
                                on: {
                                    click: () => {
                                        this.cardSetStatus(params.row, params.index);
                                    }
                                }
                            }, params.row.status == 1 ? '加入黑名单' : '移出黑名单'),


                        ]);
                    }
                }
            ],
            data1: [
                {
                    "headimgurl": "http://www.rich.com/userlist/3/52/userpic/2ZLupRJ5I1i9.jpg",  //头像
                    "phone": "13144815885",          //电话 
                    "name": "李白",                //名字
                    "isdefault": "1",             //是否关闭 1是关闭
                    "isvip": "1",                 //是否是vip
                    "add_time": "2019-01-18 10:44:00",    //创建时间
                }]
        }
    },
    created: function () {
        this.onGetVipcard();
    },
    methods: {
        cardSetType: function (param, type, _index) {
            var that = this;
            var params = {
                action: "card_setType",
                appid: this.vueAppid,
                id: param.id,
                cardType: type ? 1 : 0
            }
            console.log(params);
            this.$http.post("/api_edit.php", that.$qs.stringify(params)).then(function (response) {
                console.log(response);
                that.data1[_index].cardType = params.cardType;
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        cardSetOfficial: function (params, type, _index) {
            var that = this;
            var param = {
                action: "card_setOfficial",
                appid: this.vueAppid,
                id: params.id,
                status: type ? 1 : 0
            }
            console.log(params);
            this.$http.post("/api_edit.php", that.$qs.stringify(param)).then(function (response) {
                that.data1[_index].official = param.status;
                console.log(response);
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        cardSetStatus: function (params, _index) {
            var that = this;
            var param = {
                action: "card_setStatus",
                appid: this.vueAppid,
                id: params.id,
                status: params.status == 1 ? 0 : 1
            }
            this.$http.post("/api_edit.php", that.$qs.stringify(param)).then(function (response) {
                that.data1[_index].status = param.status;
                console.log(response);
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        onGetVipcard: function (e) {
            var onVip = typeof e === "boolean" ? (e ? 1 : 0) : this.onVip;
            var that = this;
            var params = {
                action: "card_listOfByPage",
                appid: this.vueAppid,
                onlyVIP: onVip,
                pageno: 10,
                page: this.pageData.page,
                keyword: this.searchVal
            }
            console.log(this.searchVal);
            this.$http.post("/api_edit.php", that.$qs.stringify(params)).then(function (response) {
                console.log(response.data.body);
                that.data1 = response.data.body;
            }).catch(function (response) {
                that.$Loading.error();
                that.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        goSetPage () {
            this.$router.push({
                path: '/card_setting'
            });
        },
        skippage: function () {

        },
        setOfficial: function () {
            this.data1[this.activeIndex].is_official = 1;
        },
        classStateEdit: function (id) {
            this.activeClass = id;
        },
        handleEdit: function (item) {
            var _this = this;
            var value = '';
            this.$Modal.info({
                title: '修改分类名称',
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: item.name,
                            autofocus: true,
                            placeholder: '请输入分类名称'
                        },
                        on: {
                            input: (val) => {
                                value = val;
                            }
                        }
                    })
                },
                onOk: function () {
                    item.name = value;
                    // _this.editGroup(item);
                }
            });
        },
        delGroundState: function (item, index) {

        },
        addSort: function () {
            var _this = this;
            var value = "";
            this.$Modal.info({
                title: '添加分类',
                render: (h) => {
                    return h('Input', {
                        props: {
                            autofocus: true,
                            placeholder: '请输入分类名称'
                        },
                        on: {
                            input: (val) => {
                                value = val;
                            }
                        }
                    })
                },
                onOk: function () {
                    _this.sort.push({ name: value, count: 0 });
                    // _this.editGroup(item);
                }
            });
        }
    }
} 
</script>

<style lang="stylus" rel="stylesheet/stylus">
.card_controller {
    header.top {
        padding-top: 10px;
        display: flex;
        .search-ele {
            width: 180px;
            font-size: 14px;
            line-height: 1.5;
            color: rgba(0, 0, 0, 0.65);
            padding: 0;
            position: relative;
            display: inline-block;
            .ant-input {
                display: inline-block;
                padding: 4px 11px;
                height: 32px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                transition: 0.3s;
                font-size: 12px;
                height: 30px;
                border-radius: 0;
            }
            .ant-input-suffix {
                position: absolute;
                right: 0;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                line-height: 0;
                color: rgba(0, 0, 0, 0.65);
                .ant-search-btn {
                    border-radius: 0;
                }
            }
            .ant-input:focus {
                outline: 0;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }
        }
        .ant-btn {
            margin-left: 20px;
            line-height: 30px;
            .ant-btn-text {
                font-size: 12px;
                margin-left: 7px;
            }
        }
    }
    .main {
        display: flex;
        margin-top: 10px;
        .left {
            flex: 0.15;
            margin-right: 20px;
            width: 200px;
            height: 900px;
            border: 1px solid #d5d5de;
            overflow-y: auto;
            label {
                box-shadow: none;
            }
            .ant-radio-button-wrapper:hover {
                background-color: #c9e9ff4d;
                .ant-icon {
                    display: block;
                }
            }
            .ant-radio-button-wrapper {
                margin: 0;
                height: 32px;
                line-height: 30px;
                color: rgba(0, 0, 0, 0.65);
                display: inline-block;
                transition: 0.3s;
                cursor: pointer;
                border: 1px solid #d9d9d9;
                border-left: 0;
                border-top-width: 1.02px;
                background: #fff;
                padding: 0 30px;
                position: relative;
                span {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .ant-radio-button-wrapper {
                width: 100%;
                height: 42px;
                border: 0;
                border-bottom: 1px solid #d5d5de;
                border-radius: 0;
                color: #59607b;
                font-size: 12px;
                text-align: left;
                line-height: 42px;
                display: inline-block;
                .ant-icon {
                    display: none;
                    position: absolute;
                    top: 0;
                    width: 30px;
                    line-height: 42px;
                    text-align: center;
                }
                &.ant-radio-button-wrapper-checked {
                    color: #3091f2;
                    background-color: #c9e9ff;
                    .ant-icon {
                        display: block;
                    }
                }
            }
        }
        .right {
            flex: 1;
            .page-wrap {
                width: 100%;
                text-align: right;
                padding: 20px 10px 20px 0;
            }
        }
    }
    .card-page-body-page {
        padding: 10px 0px 10px 20px;
    }
}
</style>


