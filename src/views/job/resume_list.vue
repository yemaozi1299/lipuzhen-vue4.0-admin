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
            searchable
            @on-search-change="dataInitial"
        >
            <template slot="sider"></template>
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
                type: 'selection',
                width: 80,
                align: 'center'
            }, {
                title: '名称',
                key: 'name',
                // sortable: true,
                // editable: true
            }, {
                title: '邮箱',
                key: 'email',
            }, {
                title: '名称',
                key: 'dayandtime',
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
                                        name: "resume_show",
                                        params: {
                                            pageid: this.page,
                                            jobid: this.jobid,
                                            resumeid: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '查看详情'),

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
            jobid: 0,
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
            this.jobid = this.$route.params.jobid ? parseInt(this.$route.params.jobid) : 0;
            this.dataInitial()
        },
        dataInitial (keyword) {
            if (keyword) {
                this.page = keyword;
            }
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=job_getResumeList",
                params: {
                    id: this.jobid,
                    keyword: keyword,
                    page: this.page,
                    pageno: this.pageno
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
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
            this.$router.push({})
        },
    }
}
</script>

<style>
</style>