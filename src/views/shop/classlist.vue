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
            row-key="id"
        >
            <template slot="header">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="pathEdit"
                >
                    <Icon type="md-add" />添加分组
                </Button>
            </template>
        </tables>
        <Modal v-model="isModal" title="绑定小分类" @on-ok="ok">
            <p>
                <tree-select
                    v-model="treeSelected"
                    style="width: 300px;"
                    check-strictly
                    :expand-all="true"
                    @on-change="handleTreeSelectChange"
                    @on-toggle-expand="handleTreeSelectExpand"
                    @on-check-change="handleTreeSelectCheckChange"
                    @on-select-change="handleTreeSelectClick"
                    :data="treeData"
                ></tree-select>
            </p>
        </Modal>
    </Card>
</template>

<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
import TreeSelect from '_c/tree-select'
export default {
    name: 'shopList',
    components: {
        Tables,
        Buttons,
        TreeSelect
    },
    data () {
        return {
            treeSelected: [],
            treeData: [],
            columns: [{
                key: "groupname",
                title: "分组名",
                tree: true
            }, {
                key: "id",
                title: "ID"
            }, {
                'title': '操作',
                'key': 'action',
                'align': 'left',
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
                                    this.isModal = true;
                                    this.selectedGroup = params.row.id;
                                    console.log(val)
                                }
                            }
                        }, params.row.smallClass == 1 ? '' : '绑定小分类'),
                        h(Buttons, {
                            props: {
                                border: false
                            },
                            style: {
                            },
                            on: {
                                'click': (val) => {
                                    this.editGroup(params.row);
                                    console.log(val)
                                }
                            }
                        }, params.row.smallClass == 1 ? '' : '修改名称'),

                    ])
                }
            }],
            tableData: [],
            classList: [],
            classid: '0',
            pageno: 10,
            page: 1,
            total: 0,
            chooseID: [],
            isSelectAll: false,
            keyword: "",
            selectedGroup: "",
            goods_group_list: [],
            goods_class_list: [],
            isModal: false
        }
    },
    created () {
        this.fetchData();
        // this.tupian();
        // this.getClass();
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
        tupian () {
            var data = {
                title: "标题10086",
                face: "WXjAYYO8bcLd5m.jpg",
                body: [{
                    title: "内容图片1",
                    face: "sgVL9kSBNMkpmm.jpg"
                }, {
                    title: "内容图片2",
                    face: "sgVL9kSBNMkpmm.jpg"
                }, {
                    title: "内容图片3",
                    face: "sgVL9kSBNMkpmm.jpg"
                },]
            }
            this.$http.post("/api_edit.php?action=album_add", data).then((res) => {
                console.log(res);
            });
        },
        dataInitial: function (keyword) {
            var that = this
            var data = {
            }
            console.log(that.$http);
            that.$http.request({
                method: "POST",
                url: "/api_edit.php?action=goods_group_list",
                params: data
            }).then(function (res) {
                that.goods_group_list = res.data.body;
                that.getClass();
                // that.total = parseInt(res.data.total || 0);
                that.chooseID = [];
                console.log(res)
            });
        },
        getClass: function () {
            var that = this
            var data = {
                action: 'goods_classlist',
                appid: this.vueAppid,
                shoptype: this.getType
            }
            that.$http.request({
                method: "POST",
                url: "/api_edit.php",
                params: data
            }).then(function (res) {
                if (res.data.status == 1) {
                    that.goods_class_list = res.data.body
                } else {
                    that.$Message.error(res.data.message)
                }
                that.mergeData();
                console.log(res);
            });
        },
        mergeData () {
            var group = this.goods_group_list || [];
            var classList = this.goods_class_list || [];
            var data = [], tree = [];
            group.forEach((item, index) => {
                data.push({
                    groupname: item.groupname,
                    id: item.id,
                    children: []
                });
                classList.forEach((classItem) => {
                    if (item.id == classItem.groupid) {
                        data[index].children.push({
                            groupname: classItem.classname,
                            id: classItem.id,
                            smallClass: 1
                        });
                    }
                });
            });
            classList.forEach((classItem) => {
                if (classItem.groupid == 0) {
                    tree.push({
                        title: classItem.classname,
                        id: classItem.id
                    });
                }
            });
            this.tableData = data;
            this.treeData = tree;
            console.log(data);
        },
        fetchData () {
            this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1;
            this.dataInitial();
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },
        skippage: function (page) {
            if (this.$route.params.page == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$router.push({
                name: "classlist",
                params: {
                    page: page
                }
            })
        },
        pathEdit () {
            var value = ""
            this.$Modal.confirm({
                title: "添加分类分组",
                render: h => {
                    return h("Input", {
                        props: {
                            value: value,
                            autofocus: true,
                            placeholder: "请输入分组名称"
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
                        method: "POST",
                        url: "/api_edit.php?action=goods_group_add",
                        params: {
                            groupname: value
                        }
                    }).then((res) => {
                        this.dataInitial();
                        console.log(res);
                    });

                    // _this.editGroup(item);
                },
                onCancel () {

                }
            });
        },
        handleTreeSelectChange (list) {
            console.log('=-========', list);
        },
        handleTreeSelectExpand (item) {
            console.log('toggle expand', item);
        },
        handleTreeSelectCheckChange (selectedArray, item) {
            console.log(selectedArray, item);
        },
        handleTreeSelectClick (selectArray, item) {
            console.log(selectArray, item);
        },
        ok () {
            if (this.treeSelected.length) {
                this.$http.request({
                    method: "POST",
                    url: "/api_edit.php?action=goods_add_class2group",
                    params: {
                        groupid: this.selectedGroup,
                        classid: this.treeSelected
                    }
                }).then((res) => {
                    this.dataInitial();
                    this.isModal = false;
                    this.treeSelected = [];
                    console.log(res);
                });
            } else {
                this.$Message.warning("请选择小分类");
            }
        },
        editGroup (item) {
            var value = item.groupname;
            this.$Modal.confirm({
                title: "添加分类分组",
                render: h => {
                    return h("Input", {
                        props: {
                            value: value,
                            autofocus: true,
                            placeholder: "请输入分组名称"
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
                        method: "POST",
                        url: "/api_edit.php?action=goods_groupEdit",
                        params: {
                            groupid: item.id,
                            groupname: value
                        }
                    }).then((res) => {
                        this.dataInitial();
                        console.log(res);
                    });

                    // _this.editGroup(item);
                },
                onCancel () {

                }
            });
        }
    }
}
</script>

<style>
</style>