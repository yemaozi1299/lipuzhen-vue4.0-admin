<template>
    <Card>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="tableData"
            :columns="columns"
            showPage
            :total="total"
            :current="page"
            :page-size="pageno"
            show-total
            @on-skippage="skippage"
            showlayout
        >
            <template slot="header">
                <div class="search-area">
                    <Button
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="pathEdit"
                    >
                        <Icon type="md-add" />添加
                    </Button>
                </div>
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
            columns: [
                {
                    key: "level",
                    title: "代理商等级"
                },
                {
                    key: "description",
                    title: "描述"
                },
                {
                    title: '状态',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: params.row.yc == 1 ? 'error' : 'success',
                                    size: 'small'
                                },
                                style: {
                                    color: params.row.yc == 1 ? '' : '#fff',
                                },
                                on: {
                                    click: () => {
                                        this.toggleHide(params.row);
                                        // console.log(params.row);
                                    }
                                }
                            }, params.row.yc == 1 ? '隐藏' : '显示')
                        ]);
                    },
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    color: '#fff',
                                    'margin-right': '10px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "level_add",
                                            params: {
                                                page: 1,
                                            },
                                            query: {
                                                levelID: params.row.id
                                            }
                                        });
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    color: '#fff',
                                },
                                on: {
                                    click: () => {
                                        this.roleDel(params.row);
                                    }
                                }
                            }, '删除'),
                        ]);
                    },
                }
            ],
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
        pathEdit () {
            this.$router.push({
                name: "level_add",
                params: {
                    page: 1
                }
            });
        },
        fetchData () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.dataInitial();
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=level_listof",
                params: {
                }
            }).then((res) => {
                this.tableData = res.data.body || [];
                console.log(res);
            })
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            });
            this.chooseID = chooseID
        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$route.push({})
        },
        toggleHide: function (params) {
            var _this = this;
            var data = {
                action: 'level_hidde',
                levelID: params.id,
                hidde: params.yc == 1 ? 0 : 1
            };
            console.log(data);
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                params.yc = params.yc == 1 ? 0 : 1
                console.log(response.data);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        roleDel: function (params) {
            var _this = this;
            this.$Modal.confirm({
                content: '确定要删除该级别吗？',
                cancelText: '取消',
                onOk: function () {
                    var data = {
                        action: 'level_del',
                        levelID: params.id
                    };
                    _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                        _this.dataInitial();
                        console.log(response.data);
                    }).catch((response) => {
                        this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    });
                },
                onCancel: function () {
                }
            });
        },
    }
}
</script>

<style>
</style>