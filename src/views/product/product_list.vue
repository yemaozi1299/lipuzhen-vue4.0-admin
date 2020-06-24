<template>
    <Card>
        <p slot="title">产品列表</p>
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
            searchable
            @on-search-change="get"
        >
            <template slot="addbtn">
                <Button type="info" @click="pathEdit">添加产品</Button>
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
                        v-for="item in classList"
                        :key="item.id"
                        :name="item.id"
                        class="ant-radio-button-wrapper"
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
            <template slot="footer">
                <Checkbox
                    class="table-checkbox"
                    v-model="isSelectAll"
                    @on-change="handleSelectAll"
                >
                    <span class="mg-l-10">已选</span
                    ><span style="color:#3091F2">{{ chooseID.length }}</span
                    ><span> / {{ tableData.length }} 个产品</span>
                </Checkbox>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="classmovein('del')"
                    >删除</Button
                >
            </template>
        </tables>
    </Card>
</template>

<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            columns: [{
                type: 'selection',
                width: 80,
                align: 'center'
            },
            {
                title: '产品名称',
                key: 'name',
            }, {
                title: '时间',
                key: 'date',
            }, {
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
                title: '操作',
                render: (h, params) => {
                    return h('div', [
                        h(Buttons, {
                            props: {
                                border: false
                            },
                            style: {
                            },
                            on: {
                                'click': (val) => {
                                    this.$router.push({
                                        name: "addProduct",
                                        params: {
                                            pageid: this.page,
                                            pid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '编辑'),

                    ])
                }
            },],
            tableData: [],
            pageno: 10,
            page: 1,
            total: 0,

            chooseID: [],

            classid: "0",
            classname: "",
            classList: [],
            showClass: false,
            isSelectAll: false,
        }
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
    created () {
        this.fetchData();
        this.getClass();
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.get();
        },
        get (keyword) {
            if (keyword) {
                this.page = 1;
            }
            var data = {
                keyword: keyword,
                page: this.page,
                pageno: this.pageno,
                classid: this.classid
            }
            this.$http.post("/block/api_edit.php?action=product_list", data).then((res) => {
                console.log(res);
                this.total = parseInt(res.data.total || 0);
                this.tableData = res.data.body || [];
            });
        },
        getClass () {
            var data = {}
            this.$http.post("/block/api_edit.php?action=product_class_get", data).then((res) => {
                this.classList = res.data.body || [];
            });
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.get()
            }
            this.$router.push({
                name: "product",
                params: {
                    pageid: page
                }
            })
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },

        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        selectClass (id) {   //切换分类
            this.classid = id;
            this.page = 1;
            this.get();
        },
        handleEdit: function (item) {           //
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
                        url: "/block/api_edit.php?action=product_class_edit",
                        params: {
                            id: item.id,
                            sortname: value
                        }
                    }).then((res) => {
                        this.getClass();
                    });
                }
            });
        },
        delGroundState () {
            var value = "";
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除留言分类会将分类下的产品一起删除",
                onOk: () => {
                    this.$http.request({
                        url: "/block/api_edit.php?action=product_class_del",
                        params: {
                            id: item.id,
                        }
                    }).then((res) => {
                        this.get();
                        this.getClass();
                    })
                }
            });
        },
        addClassConfirm () {

        },
        addClassCancel () {

        },
        pathEdit () {
            this.$router.push({
                name: "addProduct",
                params: {
                    pageid: this.page,
                    pid: 0
                }
            });
        },
    },

}
</script>

<style>
</style>