<template>
    <Card>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="tableData"
            :columns="columns"
            @on-selection-change="chooseEdit"
            showPage
            :total="total"
            :current="page"
            :page-size="pageno"
            show-total
            show-elevator
            @on-skippage="skippage"
            showlayout
            showsider
            :loading="loading"
        >
            <template slot="header">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="pathEdit"
                >
                    <Icon type="md-add" />添加图文网页
                </Button>
            </template>
            <template slot="sider">
                <div class="category">
                    <span>分类</span>
                </div>
                <Menu
                    :active-name="classid"
                    width="auto"
                    class="menu-item sider-menu-template"
                    @on-select="selectClass"
                >
                    <MenuItem name="0" class="">
                        <span>全部</span>
                    </MenuItem>
                    <MenuItem
                        v-for="item in classidList"
                        :key="item.id"
                        :name="item.id"
                        class="ant-radio-button-wrapper"
                    >
                        <Icon
                            class="ant-icon"
                            type="md-settings"
                            style="left: 0px"
                            v-on:click.stop="handleEdit(item)"
                        />
                        <span>{{ item.groupname }}</span>
                        <Icon
                            class="ant-icon"
                            type="ios-close-circle-outline"
                            style="right: 0px"
                            v-on:click.stop="delGroundState(item)"
                        />
                    </MenuItem>
                </Menu>

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
                        style="margin: 10px 5px 0 5px"
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
                        style="margin: 10px; text-align: center"
                    >
                        <Col span="12">
                            <Button type="primary" @click="addClassConfirm"
                                >保存</Button
                            >
                        </Col>
                        <Col span="12">
                            <Button @click="addClassCancel">取消</Button>
                        </Col>
                    </Row>
                </div>
            </template>
            <template slot="footer"></template>
        </tables>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>
    </Card>
</template>

<script>
import Tables from "@/components/tables";
import Buttons from "@/components/buttons";

export default {
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            columns: [{
                title: "图标",
                width: 90,
                'render': (h, params) => {
                    if (params.row.picture_url) {
                        return h('img', {
                            attrs: {
                                src: '' + params.row.picture_url
                            },
                            style: {
                                margin: '5px 0',
                                "max-width": '100%',
                            },
                            on: {
                                click: () => {
                                    this.handleView(params.row.picture_url)
                                }
                            }
                        })
                    } else {
                        return h('div', {}, "无")
                    }

                }
            }, {
                title: "标题",
                key: "urlname",
            }, {
                title: "链接",
                key: "url"
            }, {
                'title': '操作',
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
                                    console.log(val)
                                    this.$router.push({
                                        name: "addWeblink",
                                        params: {
                                            pageid: this.page,
                                            wid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '编辑'),
                        h(Buttons, {
                            props: {
                                border: false,
                                type: 'error'
                            },
                            on: {
                                'click': (val) => {
                                    this.removeLink(params.row)
                                }
                            }
                        }, '删除'),
                    ])
                }
            }],
            tableData: [],
            chooseID: [],
            classid: "0",
            classname: "",
            classidList: [],
            showClass: false,
            pageno: 10,
            page: 1,
            total: 0,
            loading: false,
            isSelectAll: false,
            visible: false,
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            imgName: ""
        }
    },
    created () {
        this.fetchData()
    },
    watch: {
        chooseID: function (val) {
            if (val.length >= this.tableData.length) {
                this.isSelectAll = true
            } else {
                this.isSelectAll = false
            }
        },
        "$route": "fetchData"
    },
    methods: {
        handleView (name) {
            console.log(name)
            this.imgName = name
            this.visible = true
        },
        selectClass (id) {   //切换分类
            this.classid = id;
            this.page = 1;
            this.dataInitial();
        },
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=weblink_list",
                params: {
                    page: this.page,
                    groupid: this.classid
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                this.getNewClass();
                console.log(res);
            })
        },
        getNewClass: function () {
            this.$http.request({
                url: "/api_edit.php?action=weblink_groupList",
                params: {
                    appid: this.vueAppid,
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.classidList = res.data.body || [];
                } else {

                }
                console.log(res);
            }).catch(function (response) {
                _this.$Loading.error()
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                })
                _this.loading = false
            })
        },
        addClassConfirm () {
            if (this.classname == '') {
                this.$Message.error('请输入分类名称')
                return false
            }
            this.$http.request({
                url: "/api_edit.php?action=weblink_groupADD",
                params: {
                    groupname: this.classname,
                }
            }).then((res) => {
                this.classname = "";
                this.showClass = false;
                this.getNewClass();
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        addClassCancel () {
            this.showClass = false;
        },
        handleEdit: function (item) {
            var value = "";
            this.$Modal.info({
                title: "修改分类名称",
                render: h => {
                    return h("Input", {
                        props: {
                            value: item.sortname,
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
                onOk: () => {
                    this.$http.request({
                        url: "/api_edit.php?action=weblink_groupEdit",
                        params: {
                            groupid: item.id,
                            groupname: value
                        }
                    }).then((res) => {
                        this.getNewClass();
                    }).catch((response) => {
                        this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    });
                }
            });
        },
        delGroundState (item) {
            var value = "";
            console.log(item);
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除分类会将分类下的产品一起删除",
                onOk: () => {
                    this.$http.request({
                        url: "/api_edit.php?action=weblink_groupDel",
                        params: {
                            groupid: item.id,
                        }
                    }).then((res) => {
                        this.get();
                        this.getClass();
                    }).catch((response) => {
                        this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    });
                }
            });
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$router.push({
                name: "weblink",
                params: {
                    pageid: this.page,
                }
            });
        },
        pathEdit () {
            this.$router.push({
                name: "addWeblink",
                params: {
                    pageid: this.page,
                    wid: 0
                }
            });
        },
        removeLink (params) {
            console.log(params);
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=weblink_del",
                params: {
                    delid: params.id
                }
            }).then((res) => {

                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        }
    }
}
</script>

<style>
</style>