<template>
    <Card>
        <p slot="title">代理商财务明细</p>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="infoData.data"
            :columns="infoData.columns"
            showPage
            :total="pageData.total"
            :current="pageData.page"
            :page-size="pageno"
            show-total
            show-elevator
            @on-skippage="skippage"
            showlayout
            :loading="loading"
        >
            <template slot="header">
                <div class="search-area">
                    <Input
                        v-model="keyword"
                        placeholder="关键字"
                        @on-keyup.enter="get(keyword)"
                        clearable
                        class="ant-search-input mg-r-10"
                        style="width: 200px;"
                    />
                    <Button
                        type="primary"
                        @click="get(keyword)"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                </div>
            </template>
        </tables>
    </Card>
</template>
<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons,
    },
    data: function () {
        return {
            searchPoptip: false,
            keyword: '',
            searching: false,
            pageno: 10,
            loading: false,
            pageData: {
                total: 0,
                page: 1,
            },
            infoData: {
                columns: [   //代理商 应用名称 所属企业 金额 方向  操作时间 IP 备注 
                    {
                        title: '代理商',
                        key: 'agentname',
                        className: 'demo-table-info-column',
                    },
                    {
                        title: '所属企业',
                        key: 'companyname'
                    },
                    {
                        title: '应用名称',
                        key: 'appname'
                    },
                    {
                        title: '金额',
                        render: (h, params) => {
                            return h('div', {}, params.row.io + ' ' + params.row.money);
                        }
                    },
                    {
                        title: '操作时间',
                        key: 'daytime',
                        width: '170px'
                    },
                    {
                        title: 'IP',
                        key: 'ip'
                    },
                    {
                        title: '备注',
                        key: 'memo'
                    },
                    {
                        title: '操作员名称',
                        key: 'managername'
                    }

                ],
                data: []
            }
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function (keyword) {
            var _this = this;
            keyword ? this.pageData.page = 1 : '';
            var data = {
                action: 'moneylistof',
                keyword: keyword,
                pageno: 10,
                page: this.pageData.page,
            };
            _this.searching = keyword ? true : false;
            _this.infoData.data = [];
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {

                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                }
                // console.log(JSON.stringify(response.data));
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        }
    }
}
</script>
<style type="text/css">
.agent-info-content {
    width: 100%;
    height: 100%;
    margin: auto;
    overflow: hidden;
}
</style>