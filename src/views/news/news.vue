<template>
    <div>
        <Card class="new-list-card" style="" dis-hover>
            <p slot="title">新闻列表</p>
            <Layout class="layout-wrapper">
                <Header class="header-wrapper">
                    <div class="search-area">
                        <Button
                            type="primary"
                            class="ant-btn mg-r-20"
                            v-on:click="pathEdit"
                        >
                            <Icon type="md-add" />添加新闻
                        </Button>
                        <Input
                            v-model="keyword"
                            placeholder="关键字"
                            @on-keyup.enter="dataInitial"
                            clearable
                            class="ant-search-input mg-r-10"
                            style="width: 200px;"
                        />
                        <Button
                            type="primary"
                            @click="dataInitial"
                            icon="ios-search"
                            class="ant-search-btn"
                        ></Button>
                    </div>
                </Header>
                <Layout class="layout-wrapper">
                    <Sider
                        class="sider-wrapper"
                        width="198"
                        style="overflow-y: auto;"
                    >
                        <label
                            class="ant-radio-button-wrapper"
                            :class="{
                                'ant-radio-button-wrapper-checked':
                                    classid == 0,
                            }"
                            v-on:click="classStateEdit(0)"
                        >
                            <span>全部</span>
                        </label>
                        <template v-for="(item, index) in classList">
                            <label
                                class="ant-radio-button-wrapper"
                                :key="index"
                                :class="{
                                    'ant-radio-button-wrapper-checked':
                                        classid == item.id,
                                }"
                                v-on:click="classStateEdit(item.id)"
                            >
                                <Icon
                                    class="ant-icon"
                                    type="md-settings"
                                    style="left: 0px;"
                                    v-on:click.stop="handleEdit(item)"
                                />
                                <span>{{ item.sortname }}</span>
                                <Icon
                                    class="ant-icon"
                                    type="ios-close-circle-outline"
                                    style="right: 0px;"
                                    v-on:click.stop="
                                        delGroundState(item, index)
                                    "
                                />
                            </label>
                            <template
                                v-if="item.children"
                                v-for="(items, indexs) in item.children"
                            >
                                <label
                                    class="ant-radio-button-wrapper ant-wrapper-children"
                                    :class="{
                                        'ant-radio-button-wrapper-checked':
                                            classid == items.id,
                                    }"
                                    v-on:click="classStateEdit(items.id)"
                                >
                                    <Icon
                                        class="ant-icon"
                                        type="md-settings"
                                        style="left: 0px;"
                                        v-on:click.stop="handleEdit(items)"
                                    />
                                    <span>—— {{ items.sortname }}</span>
                                    <Icon
                                        class="ant-icon"
                                        type="ios-close-circle-outline"
                                        style="right: 0px;"
                                        v-on:click.stop="
                                            delGroundState(items, indexs)
                                        "
                                    />
                                </label>
                            </template>
                        </template>

                        <div class="add-class-container">
                            <Button
                                type="dashed"
                                icon="md-add"
                                class="class-btn"
                                @click="showClass = true"
                                >新建分类</Button
                            >
                        </div>
                        <div class="add-class-dialog" v-if="showClass">
                            <Row
                                type="flex"
                                justify="center"
                                align="middle"
                                style="margin: 10px 5px 0 5px;"
                            >
                                <Col span="8">选择分类:</Col>
                                <Col span="16">
                                    <Select v-model="uid">
                                        <Option value="0">一级分类</Option>
                                        <Option
                                            v-for="item in classList"
                                            :value="item.id"
                                            >{{ item.sortname }}</Option
                                        >
                                    </Select>
                                </Col>
                            </Row>
                            <Row
                                type="flex"
                                justify="center"
                                align="middle"
                                style="margin: 10px 5px 0 5px;"
                            >
                                <Col span="8">分类名称:</Col>
                                <Col span="16">
                                    <Input
                                        class="ant-search-input"
                                        v-model="classname"
                                    ></Input>
                                </Col>
                            </Row>
                            <Row
                                type="flex"
                                justify="center"
                                align="middle"
                                style="margin: 10px; text-align: center;"
                            >
                                <Col span="12">
                                    <Button
                                        type="primary"
                                        @click="addClassConfirm"
                                        >保存</Button
                                    >
                                </Col>
                                <Col span="12">
                                    <Button @click="addClassCancel"
                                        >取消</Button
                                    >
                                </Col>
                            </Row>
                        </div>
                    </Sider>
                    <Layout class="layout-wrapper">
                        <Content>
                            <tables
                                ref="tables"
                                editable
                                search-place="top"
                                v-model="tableData"
                                :columns="columns"
                                showPage
                                :total="total"
                                :current="page"
                                :page-size="pageno"
                                show-total
                                show-elevator
                                @on-skippage="skippage"
                                @on-selection-change="chooseEdit"
                                :loading="loading"
                            />
                        </Content>
                        <Footer class="table-footer">
                            <Checkbox
                                class="table-checkbox"
                                v-model="isSelectAll"
                                @on-change="handleSelectAll"
                            >
                                <span class="mg-l-10">已选</span
                                ><span style="color: #3091f2;">{{
                                    chooseID.length
                                }}</span
                                ><span> / {{ tableData.length }} 条新闻</span>
                            </Checkbox>
                            <Button
                                class="table-btn mg-r-20"
                                :disabled="chooseID.length == 0"
                                @click="goodsedit('delete')"
                                >删除</Button
                            >
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </Card>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%;" />
        </Modal>
    </div>
</template>
<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    name: 'shopList',
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            page: "",
            classList: [],
            tableData: [],
            columns: [{
                type: 'selection',
                width: 80,
                align: 'center'
            },
            // {
            //     title: "封面",
            //     width: 90,
            //     'render': (h, params) => {
            //         return h('img', {
            //             attrs: {
            //                 src: '' + params.row.pic
            //             },
            //             style: {
            //                 margin: '5px 0',
            //                 width: '100%'
            //             },
            //             on: {
            //                 click: () => {
            //                     console.log(params.row);
            //                     this.handleView(params.row.pic)
            //                 }
            //             }
            //         })
            //     }
            // }, 
            {
                title: "新闻标题",
                key: "title"
            }, {
                width: 96,
                title: "浏览次数",
                align: "center",
                key: "counter"
            }, {
                title: "新闻日期",
                key: "date",
                width: 200
            }, {
                width: 96,
                title: "是否推荐",
                align: "center",
                render: (h, params) => {
                    return h('div', {
                        style: {
                            color: params.row.tj == 1 ? '#47cb89' : '#333'
                        }
                    }, params.row.tj == 1 ? '是' : '否');
                }
            }, {
                'title': '操作',
                'key': 'action',
                'align': 'center',
                "width": 200,
                'render': (h, params) => {
                    var isTop = 0
                    return h('div', [
                        h(Buttons, {
                            props: {
                                border: true
                            },
                            style: {
                            },
                            on: {
                                'click': (val) => {
                                    this.$router.push({
                                        name: "addnews",
                                        params: {
                                            pageid: this.page || 1,
                                            newid: params.row.id
                                        },

                                    })
                                }
                            }
                        }, '编辑'),
                        h(Buttons, {
                            props: {
                                type: 'error'
                            },
                            on: {
                                'click': (val) => {

                                    this.remove(params.row)
                                }
                            }
                        }, '删除'),

                    ])
                }
            }],
            classColumns: [
                {
                    title: "新闻分类",
                    key: "sortname"
                }
            ],

            pageno: 10,
            page: 1,
            total: 0,
            keyword: "",
            showClass: false,
            classid: '0',
            classname: "",
            loading: false,
            chooseID: [],
            isSelectAll: false,
            uid: "0",
            visible: false,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            imgName: ""
        }
    },
    created () {
        this.fetchData();
        this.getClass();
    },
    watch: {
        chooseID: function (val) {
            if (val.length >= this.tableData.length) {
                this.isSelectAll = true
            } else {
                this.isSelectAll = false
            }
        },
        '$route': 'fetchData'
    },
    methods: {
        handleView (name) {
            this.imgName = name
            this.visible = true
        },
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.dataInitial();
        },
        dataInitial () {
            this.loading = true;
            if (this.keyword) {
                this.page = 1;
            }
            this.$http.request({
                url: "/api_edit.php?action=news_list",
                params: {
                    appid: this.vueAppid,
                    classid: this.classid,
                    keyword: this.keyword,
                    page: this.page,
                    pageno: this.pageno
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                console.log(res);
                this.total = parseInt(res.data.total);
                this.page = parseInt(res.data.page);
                this.loading = false;
            });
        },
        getClass () {
            this.$http.request({
                url: "/api_edit.php?action=news_class_get",
                params: {}
            }).then((res) => {
                this.classList = res.data.body;
            });
        },
        pathEdit () {
            this.$router.push({
                name: "addnews",
                params: {
                    pageid: this.page,
                    newid: 0
                }
            });
        },
        skippage: function (page) {
            if (this.$route.params.page == page) {
                this.page = page
                return this.dataInitial()
            }
            console.log(page);
            this.$router.push({
                name: "news",
                params: {
                    pageid: page
                }
            })
        },
        selectClass: function () {
            console.log("selectClass");
        },
        setStatus (params) {
            this.$http.request({
                url: "/api_edit.php?action=news_class_add",
                params: {
                    appid: this.vueAppid,
                    upid: this.uid,
                    sortname: this.classname
                }
            }).then((res) => {
                this.uid = "0";
                this.classname = "";
                this.dataInitial();
                console.log(res);
            });
            console.log(params);
        },
        addClassCancel: function () {
            this.showClass = false
        },
        addClassConfirm () {
            this.$http.request({
                url: "/api_edit.php?action=news_class_add",
                params: {
                    appid: this.vueAppid,
                    upid: this.uid,
                    sortname: this.classname
                }
            }).then((res) => {
                this.uid = "0";
                this.classname = "";
                this.getClass();
                console.log(res);
            });
        },
        classStateEdit (id) {
            this.classid = id;
            this.dataInitial();
        },
        handleEdit (item) {
            var _this = this;
            var that = this;
            var value = item.sortname;

            this.$Modal.confirm({
                title: "修改分类名称",
                render: h => {
                    return h("Input", {
                        props: {
                            value: value,
                            autofocus: true,
                            placeholder: "请输入分类名称"
                        },
                        on: {
                            input: val => {
                                value = val;
                            }
                        }
                    });
                },
                onOk: function () {
                    var apiurl = "/api_edit.php?action=news_class_edit";
                    var data = {
                        sortname: value,
                        id: item.id
                    };
                    that.$http.post(apiurl, that.$qs.stringify(data)).then((response) => {
                        that.getClass();

                        console.log(response);
                    })

                    // _this.editGroup(item);
                },
                onCancel () {

                }
            });
        },
        delGroundState: function (item, index) {
            var that = this;
            var value = "";
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除该新闻分类会将其下所有新闻删除",
                onOk: function () {
                    var apiurl = "/api_edit.php?action=news_class_del";
                    var data = {
                        appid: this.vueAppid,
                        id: item.id
                    };
                    that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                        if (response.data.status == 1) {
                            that.classid = "0";
                            that.getClass();
                        } else {
                            that.$Message.error(response.data.message);
                        }
                        console.log(response.data);
                    })

                    // _this.editGroup(item);
                },
                onCancel () {

                }
            });
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            });
            this.chooseID = chooseID
        },
        goodsedit (name) {
            if (this.chooseID.length == 0) {
                this.$Message.warning('请选择要操作的记录')
                return false
            }
            const title = '提醒'

            switch (name) {
                case 'delete':
                    var content = '确定对所选新闻进行：删除'
                    var mode = 'delete'
                    break
            }
            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: () => {
                    this.choose2edit(mode)
                }
            })
        },
        choose2edit: function (mode) { // 将要进行的操作提交到服务器API
            // console.log(name+'='+this.chooseID);
            if (this.chooseID.length > 0) {
                var apiurl = '/api_edit.php?action=news_del'
                var data = {
                    appid: this.vueAppid,
                    del: this.chooseID
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
            } else {
                _this.$Message.info('请选择要操作的记录')
                return false
            }
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

<style lang="stylus" rel="stylesheet/stylus">
.new-list-card {
    font-size: 12px;
    border-radius: 0px;
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
    .ant-wrapper-children {
        // background: #f8f8f8;
    }
}
</style>
