<template>
    <Card class="message-content-list">
        <p slot="title">留言管理</p>
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
                    @click="classmovein('del')"
                    >删除</Button
                >
                <Dropdown
                    trigger="click"
                    placement="top"
                    class="mg-r-20"
                    @on-click="classmovein"
                >
                    <Button
                        class="table-btn"
                        :disabled="chooseID.length == 0"
                        icon="ios-arrow-dropup"
                        >审核操作</Button
                    >
                    <DropdownMenu slot="list">
                        <DropdownItem name="ok"> 已审核</DropdownItem>
                        <DropdownItem name="no"> 未审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </tables>
        <Modal v-model="isModal" width="660">
            <p slot="header">回复留言</p>
            <div style="text-align:left">
                <div class="expand-row">
                    <span class="expand-key">回复内容： </span>
                    <span class="expand-value">{{
                        messageContent.message
                    }}</span>
                </div>

                <Input
                    v-model="replyContent"
                    :autosize="{ minRows: 5, maxRows: 5 }"
                    type="textarea"
                    placeholder="请输入回复内容"
                ></Input>
            </div>
            <div slot="footer">
                <Button
                    type="info"
                    long
                    size="large"
                    :loading="modal_loading"
                    @click="guestbookReply"
                    >回复留言</Button
                >
            </div>
        </Modal>
    </Card>
</template>

<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
import expandRow from './components/table-expand.vue';
export default {
    name: 'shopList',
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
                title: "内容",
                type: 'expand',
                width: 65,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        },
                        on: {
                            "on-del-reply": (id) => {
                                var list = [];
                                list.push(id);
                                this.classmovein('del', list);
                            }
                        }
                    })
                }
            },
            {
                title: '姓名',
                key: 'name',
            }, {
                title: '电话',
                key: 'tel',
            }, {
                title: '公司',
                key: 'company',
            }, {
                title: '邮箱',
                key: 'email',
            }, {
                title: '状态',
                render: (h, params) => {
                    return h('div', {
                        style: {
                            color: params.row.yesno == 1 ? '#19be6b' : '#ffad33'
                        }
                    }, params.row.yesno == 1 ? '已审核' : '未审核')
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
                                    this.isModal = true;
                                    this.messageContent = {
                                        id: params.row.id,
                                        message: params.row.message
                                    }
                                }
                            }
                        }, '回复留言'),

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
            isModal: false,
            modal_loading: false,
            replyContent: "",
            messageContent: {
                id: "",
                message: ""
            }
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
                groupid: this.classid
            }
            this.$http.post("/api_edit.php?action=guestbook_list", data).then((res) => {
                var tabList = [];
                res.data.body && res.data.body.forEach((item) => {
                    var box = item;
                    box.main && (box.main.reply = box.re || []);
                    tabList.push(box.main);
                });
                this.total = parseInt(res.data.total || 0);
                this.tableData = tabList;
            });
        },
        getClass () {
            var data = {}
            this.$http.post("/api_edit.php?action=guestbook_groupList", data).then((res) => {
                this.classList = res.data.body || [];
            });
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.get()
            }
            this.$router.push({
                name: "message",
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
        addMessage () {
            this.$router.push({
                name: "addMessage",
                params: {
                    pageid: this.page || 1,
                    mid: 1
                }
            })
        },
        selectClass (id) {
            this.classid = id;
            this.page = 1;
            this.get();
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        classmovein (type, id) {
            var editList = id || this.chooseID;
            if (editList.length == 0) {
                this.$Message.warning('请选择要操作的留言')
                return false
            }
            switch (type) {
                case 'ok':
                    var content = '确定对所选留言进行：通过审核'
                    break
                case 'no':
                    var content = '确定对所选留言进行：未审核'
                    break
                case 'del':
                    var content = '确定对所选留言进行：删除'
                    break
            }
            this.$Modal.confirm({
                title: '提醒',
                content: content,
                onOk: () => {
                    this.choose2edit(type, editList)
                }
            })

        },
        choose2edit (type, editList) {
            this.$http.request({
                url: "/api_edit.php?action=guestbook_check",
                params: {
                    chooseID: editList,
                    editmode: type
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.chooseID = [];
                    this.get();
                }
            })
        },
        guestbookReply () {
            this.modal_loading = true;
            if (this.replyContent == '') {
                _this.$Message.error('请输入回复内容');
                this.modal_loading = false;
                return false
            }
            this.$http.request({
                url: "/api_edit.php?action=guestbook_re",
                params: {
                    id: this.messageContent.id,
                    message: this.replyContent
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.isModal = false;
                    this.messageContent = {
                        id: "",
                        message: ""
                    }
                    this.get();
                }
                this.modal_loading = false;
            })
        },
        handleEdit: function (item) {           //
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
                        url: "/api_edit.php?action=guestbook_groupEdit",
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
                        url: "/api_edit.php?action=guestbook_groupDel",
                        params: {
                            groupid: item.id,
                        }
                    }).then((res) => {
                        this.get();
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
                url: "/api_edit.php?action=guestbook_groupADD",
                params: {
                    groupname: this.classname
                }
            }).then((res) => {
                this.classname = "";
                this.showClass = false;
                this.getClass();
            });
        },
        addClassCancel () {
            this.showClass = false
        }
    },


}
</script>
<style lang="less">
.message-content-list {
    label {
        box-shadow: none;
    }

    .expand-row {
        margin-bottom: 10px;
    }
    .expand-key {
        font-weight: 900;
    }
    .expand-value {
        font-size: 14px;
        line-height: 16px;
    }
}
</style>

