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
                    <Icon type="md-add" />添加投票调查
                </Button>
            </template>
            <template slot="footer"></template>
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
                title: "投票标题",
                key: "question",
            }, {
                'title': '类别',
                'render': (h, params) => {
                    return h('div', {}, params.row.choice == "1" ? "多选" : "单选")
                }
            }, {
                'title': '操作',
                'render': (h, params) => {
                    var isTop = 0
                    return h('div', [
                        h(Buttons, {
                            props: {
                                border: true
                            },
                            on: {
                                'click': (val) => {
                                    console.log(val)
                                    this.$router.push({
                                        name: "addSurvey",
                                        params: {
                                            pageid: this.page,
                                            sid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '编辑'),
                        h(Buttons, {
                            props: {
                                border: true,
                                type: 'warning'
                            },
                            on: {
                                'click': (val) => {
                                    this.$Modal.confirm({
                                        title: '确认清除',
                                        content: '<p>确认清除投票数据?</p>',
                                        onOk: () => {
                                            this.surveyClear(params.row);
                                        },
                                        onCancel: () => {
                                        }
                                    });
                                    // this.removeLink(params.row)
                                }
                            }
                        }, '清空数据'),
                        h(Buttons, {
                            props: {
                                border: false,
                                type: 'error'
                            },
                            on: {
                                'click': (val) => {
                                    this.$Modal.confirm({
                                        title: '确认删除',
                                        content: '<p>确认删除该投票吗?</p>',
                                        onOk: () => {
                                            this.removeSurvey(params.row)
                                        },
                                        onCancel: () => {
                                        }
                                    });
                                }
                            }
                        }, '删除'),
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
                url: "/api_edit.php?action=survey_list",
                params: {
                    page: this.page,
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                console.log(res);
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
            this.$route.push({})
        },
        pathEdit () {
            this.$router.push({
                name: "addSurvey",
                params: {
                    pageid: this.page,
                    sid: 0
                }
            });
        },
        surveyClear (params) {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=survey_clear",
                params: {
                    id: params.id
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.$Message.success("清除成功");
                }
                console.log(res);
            });
        },
        removeSurvey (params) {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=survey_del",
                params: {
                    delid: [params.id]
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.$Message.success("删除成功");
                }
                console.log(res);
            });
        }
    }
}
</script>

<style>
</style>