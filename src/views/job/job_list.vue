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
            searchable
            @on-search-change="dataInitial"
        >
            <template slot="addbtn">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="pathEdit"
                >
                    <Icon type="md-add" />添加招聘信息
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
                        <span>{{ item.groupname }}</span>
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
                    ><span> / {{ tableData.length }} 条留言</span>
                </Checkbox>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="delJob(chooseID)"
                    >删除</Button
                >
            </template>
        </tables>
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
                type: 'selection',
                width: 80,
                align: 'center'
            }, {
                title: '岗位名称',
                key: 'name',
                sortable: true,
                // editable: true
            }, {
                title: '简历',
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
                                        name: "resume",
                                        params: {
                                            pageid: this.page,
                                            jobid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, params.row.resume + '条'),

                    ])
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
                                        name: "addJob",
                                        params: {
                                            pageid: this.page,
                                            jobid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '编辑'),

                    ])
                }
            }],
            tableData: [],
            chooseID: [],
            classid: "0",
            pageno: 10,
            page: 1,
            total: 0,
            loading: false,
            isSelectAll: false,
            classList: [],
            showClass: false,
            classname: "",
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
        "$route": "fetchData"
    },
    methods: {
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1
            this.dataInitial()
        },
        dataInitial (keyword) {
            if (keyword) {
                this.page = 1
            }
            this.loading = true;
            this.$http.request({
                method: "POST",
                url: "/block/api_edit.php?action=job_list",
                params: {
                    keyword: keyword,
                    page: this.page,
                    pageno: this.pageno,
                    groupid: this.classid

                }
            }).then((res) => {
                this.loading = false;
                this.tableData = res.data.body || [];
                this.total = parseInt(res.data.total || 0);
                console.log(res.data);
            });
        },
        getClass () {
            this.$http.request({
                method: "POST",
                url: "/block/api_edit.php?action=job_groupList",
                params: {}
            }).then((res) => {
                this.classList = res.data.body || [];
                console.log(res.data);
            })
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => {
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$route.push({})
        },
        pathEdit () {
            this.$route.push({
                name: "addJob",
                params: {
                    pageid: this.page
                }
            })
        },
        selectClass (id) {
            this.classid = id;
            this.page = 1;
            this.dataInitial();
        },
        handleEdit: function (item) {
            var value = "";
            this.$Modal.info({
                title: "修改分类名称",
                render: h => {
                    return h("Input", {
                        props: {
                            value: item.groupname,
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
                        url: "/block/api_edit.php?action=job_groupEdit",
                        params: {
                            groupid: item.id,
                            groupname: value
                        }
                    }).then((res) => {
                        this.getClass();
                    });
                }
            });
        },
        delGroundState: function (item) {
            var value = "";
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除留言分类会将分类下的留言一起删除",
                onOk: () => {
                    this.$http.request({
                        url: "/block/api_edit.php?action=job_groupDel",
                        params: {
                            groupid: item.id,
                        }
                    }).then((res) => {
                        this.dataInitial();
                        this.getClass();
                    })
                }
            });
        },
        addClassConfirm () {
            if (this.classname == '') {
                this.$Message.error('请输入分类名称')
                return false
            }
            this.$http.request({
                url: "/block/api_edit.php?action=job_groupADD",
                params: {
                    groupname: this.classname
                }
            }).then((res) => {
                this.classname = "";
                this.showClass = false;
                this.getClass();
            });
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        delJob (id) {
            console.log(id);
            var that = this;
            this.$http.request({
                method: "POST",
                url: "/block/api_edit.php?action=job_del",
                params: {
                    delid: id
                }
            }).then((res) => {
                console.log(res);
            })
        },
        addClassCancel () {
            this.showClass = false
        }
    }
}
</script>

<style>
</style>