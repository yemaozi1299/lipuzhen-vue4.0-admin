<template>
    <Card>
        <Layout class="layout-wrapper">
            <Content>
                <tables
                    ref="tables"
                    editable
                    v-model="items"
                    :columns="columns"
                    @on-selection-change="chooseEdit"
                    showPage
                    :total="total"
                    :current="page"
                    :page-size="pageno"
                    show-total
                    show-elevator
                    @on-skippage="skippage"
                    searchable
                    :isSearch="search"
                    @on-cancel-search="cancelSearch"
                    @on-search-change="get"
                >
                    <Button
                        slot="addbtn"
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="pathEdit"
                    >
                        <Icon type="md-add" />数据表添加
                    </Button>
                </tables>
            </Content>
            <Footer class="table-footer">
                <Checkbox
                    class="table-checkbox"
                    v-model="isSelectAll"
                    @on-change="handleSelectAll"
                >
                    <span class="mg-l-10">已选</span
                    ><span style="color: #3091f2">{{ chooseID.length }}</span
                    ><span> / {{ items.length }} 个数据库</span>
                </Checkbox>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="del"
                    >删除</Button
                >
            </Footer>
        </Layout>
    </Card>
</template>



<script>

import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons,
    },
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            items: [],
            total: 0,
            page: 1,
            pageno: 10,
            keyword: '',
            checked: false,
            search: false,
            searchPoptip: false,
            chooseID: [],
            isSelectAll: false,
            columns: [{
                type: 'selection',
                width: 80,
                align: 'center'
            },
            {
                title: '名称',
                key: 'tablename',
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
                                    this.$router.push({
                                        path: `/datamanager/${this.$route.params.page || 1}/edittable/${params.row.id}`
                                    });

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
                                    this.chooseID.push(params.row.id);
                                    this.del();
                                }
                            }
                        }, '删除'),

                    ])
                }
            }, {
                'title': '管理',
                'key': 'action',
                'align': 'left',
                "width": 200,
                'render': (h, params) => {
                    var isTop = 0
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
                                        path: `/datamanager/${this.$route.params.page || 1}/listData/${params.row.id}`
                                    })
                                }
                            }
                        }, '数据管理'),
                    ])
                }
            }]
        };
    },
    created () {

        this.fetchData();
    },
    watch: {
        chooseID: function (val) {
            if (val.length >= this.items.length) {
                this.isSelectAll = true
            } else {
                this.isSelectAll = false
            }
        },
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },
    methods: {
        pathEdit: function () {
            this.$router.push({
                path: `/datamanager/${this.$route.params.page || 1}/edittable`
            })
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        fetchData: function () {
            this.page = parseInt(this.$route.params.page || 1);
            this.get(this.keyword);
        },
        skippage: function (page) {
            // this.$router.push({ name: 'datamanager', params: { page: page }});
            this.$router.push({ path: '/datamanager/' + page });
        },
        cancelSearch: function () {
            this.keyword = '';
            this.get();
            this.search = false;
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },
        get: function (keyword) {
            var _this = this;
            if (keyword) {
                this.page = 1;
                this.search = true;
            }
            else {
                this.search = false;
            }
            this.searchPoptip = false;
            var apiurl = "/api_edit.php?action=datamanager_listoftable&page=" + this.page + "&keyword=" + keyword + '&pageno=' + this.pageno + "&appid=" + this.vueAppid;
            _this.$Loading.start();
            _this.$http.get(apiurl)
                .then(function (response) {
                    console.log(response);
                    if (response.data.status == 1) {
                        _this.items = response.data.body;
                        _this.total = response.data.total;
                    }
                    else {
                        _this.$Message.error(response.data.message);
                    }
                    _this.$Loading.finish();
                })
                .catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示1111',
                        desc: response
                    });
                    _this.$Loading.error();
                });
        },
        checkedAll: function () {
            var _this = this;
            if (this.checked) {//实现反选
                _this.chooseID = [];
            } else {//实现全选
                _this.chooseID = [];
                _this.items.forEach(function (item) {
                    _this.chooseID.push(item.id);
                });
            }
        },
        del: function () {
            var _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: "确定删除所选数据表吗?",
                onOk: () => {
                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: this.vueAppid
                    };

                    data.action = "datamanager_deltable";
                    data.delline = this.chooseID;


                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                        // response.data = eval('(' + response.data + ')'); 
                        if (response.data.status == 1) {
                            _this.$Message.success(response.data.message);
                            _this.chooseID = [];
                            _this.fetchData();
                        }
                        else {
                            _this.$Message.error(response.data.message);
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.$Loading.error();
                    });

                },
                onCancel: () => {
                    // this.$Message.info('点击了取消');
                }
            });
        }
    }
};



</script>

<style type="text/css">
.domain-header {
    padding-top: 10px;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;
    overflow: hidden;
}
.domain-header input {
    margin: 9px;
    float: left;
}
.domain-header span {
    padding: 5px;
    font-size: 12px;
    font-weight: bold;
    float: left;
}
#domain-list .entry {
    overflow: hidden;
    border-bottom: 1px dashed #bebebe;
}
.entry-checkbox {
    width: 16px;
    height: 16px;
}
.entry-checkbox {
    margin: 15px;
    margin-left: 10px;
    margin-right: 5px;
    padding-left: 0px;
    float: left;
}
.entry-domain {
    width: 350px;
}
.entry-domain {
    float: left;
    margin-left: 5px;
}
.entry-domain a {
    width: 100%;
    height: 48px;
    font-size: 14px;
    line-height: 48px;
    color: #1a6cc1;
    text-decoration: none;
    display: block;
}
.entry-status,
.entry-desc {
    float: right;
    margin: 15px;
    margin-right: 5px;
}
</style>
