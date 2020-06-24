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
            <template slot="addbtn">
                <Button class="mg-r-20" type="info" @click="pathEdit"
                    >添加相册</Button
                >
            </template>
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
                title: "封面",
                width: 90,
                'render': (h, params) => {
                    return h('img', {
                        attrs: {
                            src: '' + params.row.pic
                        },
                        style: {
                            margin: '5px 0',
                            width: '100%'
                        },
                        on: {
                            click: () => {
                                this.handleView(params.row.pic)
                            }
                        }
                    })
                }
            }, {
                title: "标题",
                key: "title"
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
                                    this.show(params.row)
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
                                    this.remove(params.index)
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
        dataInitial (keyword) {
            if (keyword) {
                this.page = 1;
            }
            this.$http.request({
                method: "POST",
                url: "/block/api_edit.php?action=album_list",
                params: {
                    page: this.page,
                    pageno: this.pageno,
                    keyword: keyword
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                this.total = parseInt(res.data.total || 1);
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
        show (item) {
            this.$router.push({
                name: "album_add",
                params: {
                    pageid: this.page,
                    aid: item.id
                }
            });
        },
        pathEdit () {
            this.$router.push({
                name: "album_add",
                params: {
                    pageid: this.page,
                    aid: 0
                }
            });
        }
    }
}
</script>

<style>
</style>