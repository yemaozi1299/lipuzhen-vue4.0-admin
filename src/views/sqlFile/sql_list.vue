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
            :loading="loading"
        >
            <template slot="header">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="pathEdit"
                >
                    <Icon type="md-add" />数据库备份
                </Button>
            </template>
            <template slot="footer"
                ><Checkbox
                    class="table-checkbox"
                    v-model="isSelectAll"
                    @on-change="handleSelectAll"
                >
                    <span class="mg-l-10">已选</span
                    ><span style="color: #3091f2">{{ chooseID.length }}</span
                    ><span> / {{ tableData.length }} 条数据库记录</span>
                </Checkbox>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="delRestore"
                    >删除</Button
                ></template
            >
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
                key: "filename",
                title: "文件名"
            }, {
                key: "version",
                title: "版本"
            }, {
                key: "size",
                title: "文件大小"
            }, {
                key: "dateline",
                title: "备份时间"
            }, {
                key: "type",
                title: "类型",
                width: 80
            }, {
                key: "multivol",
                title: "多卷",
                width: 80
            }, {
                key: "volume",
                title: "卷号",
                width: 80
            }, {
                'title': '操作',
                'key': 'action',
                'align': 'center',
                "width": 200,
                'render': (h, params) => {
                    return h('div', [
                        h("Button", {
                            props: {
                                type: "info"
                            },
                            style: {
                            },
                            on: {
                                'click': (val) => {
                                    this.sqlRestore(params.row);
                                }
                            }
                        }, '导入'),
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
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=sql_file_list",
                params: {}
            }).then((res) => {
                this.tableData = res.data.body || [];
                console.log(res);
            })
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.filename)
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
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=sql_backup",
                params: {}
            }).then((res) => {
                this.$Message.info(res.data.message);
                this.dataInitial();
                console.log(res);
            })
        },
        sqlRestore (params) {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=sql_restore",
                params: {
                    filename: params.filename
                }
            }).then((res) => {
                this.$Message.info(res.data.message);
                console.log(res);
            })
        },
        delRestore (params) {
            this.$Modal.confirm({
                title: "确认删除",
                content: "确定删除该数据库记录？删除后将无法恢复",
                onOk: () => {
                    this.$http.request({
                        method: "POST",
                        url: "/api_edit.php?action=sql_file_del",
                        params: {
                            filename: this.chooseID
                        }
                    }).then((res) => {
                        this.$Message.info(res.data.message);
                        this.dataInitial();
                        console.log(res);
                    })
                }
            })
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },

    }
}
</script>

<style>
</style>