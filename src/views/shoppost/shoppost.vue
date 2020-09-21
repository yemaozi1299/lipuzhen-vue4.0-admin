<template>
    <Card style="position: relative">
        <div>
            <router-link :to="'/shoppost/1/edit'">
                <Button type="primary" icon="md-add" @click="" class="mg-r-20"
                    >添加</Button
                >
            </router-link>

            <Poptip placement="right" width="300" v-model="searchPoptip">
                <Button type="success" shape="circle" icon="ios-search"
                    >搜索</Button
                >
                <div class="api" slot="content">
                    <Input
                        v-model="keyword"
                        placeholder="请输入..."
                        class="mg-r-10"
                        style="width: 200px"
                        @keyup.enter="get(keyword)"
                    ></Input>
                    <Button
                        shape="circle"
                        icon="ios-search"
                        @click="get(keyword)"
                    ></Button>
                </div>
            </Poptip>
        </div>

        <div
            style="
                margin-bottom: 10px;
                font-size: 16px;
                font-weight: bold;
                padding-top: 10px;
            "
        >
            配送方式
            <div
                style="display: inline; font-size: 14px; font-weight: normal"
                v-if="search"
            >
                搜索:{{ keyword }}
                <Button
                    type="primary"
                    size="small"
                    shape="circle"
                    @click="cancelSearch"
                    >返回</Button
                >
            </div>
        </div>

        <div class="itembox" v-for="(item, index) in items" :key="">
            <div class="itembox_header">
                {{ item.name }}
                <div style="float: right">
                    <router-link :to="'/shoppost/1/edit/' + item.id"
                        ><Button
                            size="small"
                            shape="circle"
                            icon="edit"
                            class="mg-r-10"
                            >修改</Button
                        >
                    </router-link>
                    <Button
                        size="small"
                        shape="circle"
                        icon="trash-a"
                        @click="del(item.id)"
                        >删除</Button
                    >
                </div>
            </div>
            <div>
                <Row
                    type="flex"
                    justify="center"
                    align="top"
                    class="code-row-bg3"
                >
                    <Col span="12"> 可配送区域 </Col>
                    <Col span="3">
                        <div>
                            {{
                                item.posttype == 0 ? "首件（个）" : "首重（Kg）"
                            }}
                        </div>
                    </Col>
                    <Col span="3">
                        <div>运费（元）</div>
                    </Col>
                    <Col span="3">
                        <div>
                            {{
                                item.posttype == 0 ? "续件（个）" : "续重（Kg）"
                            }}
                        </div>
                    </Col>
                    <Col span="3">
                        <div>续费（元）</div>
                    </Col>
                </Row>

                <Row
                    v-for="(gitem, gindex) in item.body"
                    type="flex"
                    justify="center"
                    align="top"
                    class="code-row-bg4"
                    :key="index"
                >
                    <Col span="12">
                        <div class="areaname">{{ gitem.areaname }}</div>
                    </Col>
                    <Col span="3">
                        {{ gitem.first }}
                    </Col>
                    <Col span="3">
                        {{ gitem.firstmoney }}
                    </Col>
                    <Col span="3">
                        {{ gitem.second }}
                    </Col>
                    <Col span="3">
                        {{ gitem.secondmoney }}
                    </Col>
                </Row>
            </div>
        </div>
    </Card>
</template>



<script>


export default {
    data () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            items: [],
            keyword: '',
            search: false,
            searchPoptip: false
        };
    },
    created () {
        this.$Loading.start();
        this.sortid = this.$route.params.sortid
        this.get(this.sortid);
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            this.get();
        },
        cancelSearch: function () {
            this.keyword = '';
            this.get();
            this.search = false;
        },
        get: function () {
            var keyword = this.keyword;
            if (keyword) {
                this.search = true;
            }
            else {
                this.search = false;
            }
            var _this = this;
            _this.searchPoptip = false;
            var apiurl = "/api_edit.php?action=goods_postList&keyword=" + keyword + "&appid=" + this.vueAppid;
            _this.$http.get(apiurl)
                .then(function (response) {
                    if (response.data.status == 1) {
                        _this.items = response.data.body;
                    }
                    else {
                        _this.$Message.error(response.data.message);
                    }
                    _this.$Loading.finish();

                })
                .catch(function (response) {
                    _this.$Loading.error();
                    _this.$Notice.error({
                        title: '错误提示',
                        duration: 0,
                        desc: response
                    });
                });

        },
        del: function (id) {
            var _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: "确定删除所选记录吗?",
                onOk: () => {

                    var apiurl = "/api_edit.php";
                    var data = {
                        appid: this.vueAppid
                    };
                    var delid = [];
                    delid[0] = id;

                    data.action = "goods_postDel";
                    data.delid = delid;

                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                        if (response.data.status == 1) {
                            _this.$Message.success(response.data.message);
                            _this.fetchData();
                        }
                        else {
                            _this.$Message.error(response.data.message);
                        }
                        _this.$Loading.finish();
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.$Loading.error();
                    });

                }
            });
        }
    }
};



</script>



<style>
.code-row-bg3 {
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #d0caca;
    font-weight: bold;
    background: #f7f7f7;
}
.code-row-bg4 {
    padding: 10px 0;
    margin-bottom: 0px;
    text-align: center;
    border-bottom: 1px solid #e7e7e7;
}
.areaname {
    padding: 0 10px;
    text-align: left;
}
.linebg {
    margin-bottom: 0px;
}
.post-input {
    text-align: center;
}
.itembox {
    border: 1px solid #d0caca;
    margin: 10px 0;
}
.itembox_header {
    border-bottom: 1px solid #9c9898;
    background: #fdfdfd;
    padding: 0 12px;
    line-height: 40px;
}
</style>