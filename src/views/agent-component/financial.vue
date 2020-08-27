<template>
    <Card>
        <p class="title">财务明细</p>
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
            loading: false,
            pageno: 10,
            searching: false,
            searchPoptip: false,
            keyword: '',
            pageData: {
                total: 0,
                page: 1,
            },
            infoData: {
                columns: [ //所属企业 所属应用 金额	时间	操作员名称 备注		
                    {
                        title: '所属企业',
                        key: 'companyname',
                    },
                    {
                        title: '所属应用',
                        key: 'appname',
                    },
                    {
                        title: '金额',
                        render: (h, params) => {
                            return h('div', {
                            }, params.row.io + ' ' + params.row.money);
                        }
                    },
                    {
                        title: '时间',
                        key: 'daytime',
                    },
                    {
                        title: '备注',
                        key: 'memo',
                    },
                    {
                        title: "操作员名称",
                        key: "managername"
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
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.infoData.data = response.data.body;
                    _this.pageData.total = Number(response.data.total);
                }
                // console.log(JSON.stringify(response.data));
                _this.$Loading.finish();
            })
        },
        skippage: function (page) {
            this.pageData.page = page;
            this.get();
        }
    }
}
</script>