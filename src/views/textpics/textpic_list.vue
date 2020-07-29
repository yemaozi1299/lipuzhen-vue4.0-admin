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
                    <Icon type="md-add" />添加图文网页
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
                title: "标题",
                key: "title"
            }, {
                title: '操作',
                width: 300,
                render: (h, params) => {
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
                                        name: "textpicAdd",
                                        params: {
                                            pageid: this.page,
                                            textid: params.row.id
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
                            style: {

                            },
                            on: {
                                'click': (val) => {
                                    this.delText(params.row);
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
                url: "/api_edit.php?action=textpic_list"

            }).then((res) => {
                if (res.data.status == 1) {
                    this.tableData = res.data.body || [];
                } else {

                }
                console.log(res);
            })
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
                name: "textpic",
                params: {
                    pageid: this.page,
                }
            });
        },

        pathEdit () {
            this.$router.push({
                name: "textpicAdd",
                params: {
                    pageid: this.page,
                    textid: 0
                }
            });
        },
        delText (params) {
            console.log(params);
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=textpic_del",
                params: {
                    delid: params.id
                }
            }).then((res) => {

                console.log(res);
            })
        }
    }
}
</script>

<style>
</style>