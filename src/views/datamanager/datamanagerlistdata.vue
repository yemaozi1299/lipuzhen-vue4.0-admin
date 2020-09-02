<template>
    <Card>
        <!-- <div
            style="font-size:16px;margin:0px 0px 10px 5px;display:flex;flex-direction:row;"
        >
            <div style="margin-right:10px;line-height:35px">分类:</div>

            <Radio-group v-model="classid" type="button">
                <Radio label="0">全部</Radio>
                <Radio
                    v-for="classitem in classitems"
                    :key="classitem.id"
                    :label="classitem.id"
                    >{{ classitem.classname }}</Radio
                >
            </Radio-group>
            <div style="margin-left:10px;">
                <Button type="info" icon="gear-b" @click="modalClass = true"
                    >编辑分类</Button
                >
            </div>
        </div>
        <div>
            <Tables
                :columns="fields"
                v-model="items"
                :total="total"
                :current="page"
                :page-size="pageno"
                show-total
                show-elevator
                @on-change="skippage"
                searchable
                :isSearch="search"
                @on-path-edit="pathEdit"
                @on-cancel-search="cancelSearch"
                @on-search-change="get(table, 1, keyword)"
            >
                <span slot="addbtn">
                    <Button
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="pathEdit"
                    >
                        <Icon type="md-add" />数据表添加
                    </Button>
                    <Button
                        class="ant-btn mg-r-20"
                        type="warning"
                        shape="circle"
                        icon="trash-a"
                        @click="del"
                        >清空</Button
                    >
                </span>
            </Tables>
        </div> -->

        <Tables
            :columns="fields"
            v-model="items"
            :total="total"
            :current="page"
            :page-size="pageno"
            show-total
            show-elevator
            @on-change="skippage"
            showlayout
        >
            <div slot="header">
                <div class="search-area">
                    <Button
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="pathEdit"
                    >
                        <Icon type="md-add" />数据添加
                    </Button>
                    <Button
                        class="ant-btn mg-r-20"
                        type="warning"
                        shape="circle"
                        icon="trash-a"
                        @click="del"
                        >清空</Button
                    >
                    <Input
                        v-model="keyword"
                        placeholder="关键字"
                        @on-keyup.enter="get(table, 1, keyword)"
                        clearable
                        class="ant-search-input mg-r-10"
                        style="width: 200px;"
                    />
                    <Button
                        type="primary"
                        @click="get(table, 1, keyword)"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                    <Button style="float: right;" @click="$router.go(-1)"
                        >返回</Button
                    >
                </div>
            </div>
        </Tables>

        <Modal
            v-model="modalClass"
            title="分类管理"
            cancel-text=""
            ok-text="关闭"
        >
            <Tag
                type="border"
                closable
                color="blue"
                v-for="classitem in classitems"
                :key="classitem.id"
                :name="classitem.id"
                @on-close="classdel"
                >{{ classitem.classname }}</Tag
            >
            <div style="margin-top: 10px; display: flex; flex-direction: row;">
                <Input
                    v-model="classname"
                    size="small"
                    placeholder="请输入分类名称"
                    style="width: 150px; margin-right: 10px;"
                ></Input>
                <Button size="small" @click="classedit">保存</Button>
            </div>
        </Modal>
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
            fields: [
                {
                    "title": "",
                    "key": ""
                }],
            items: [
                {
                    "title": "",
                    "picture": ""
                }],
            classitems: [
                {
                    "id": "",
                    "classname": ""
                }],
            page: 1,
            classid: 0,
            modalClass: false,
            classname: "",
            classeditid: 0,
            total: 0,
            pageno: 10,
            table: 0,
            tablename: '表数据',
            keyword: '',
            search: false,
            searchPoptip: false,
            doing: 0
        };
    },
    created () {
        this.fetchData();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'fetchData',
        classid: function () {
            this.get(this.table, this.page, this.keyword, this.classid);
        }
    },
    methods: {
        pathEdit: function () {
            this.$router.push({
                path: `/datamanager/${this.$route.params.page}/editData/${this.table}`
            })
        },
        fetchData: function () {
            this.page = this.$route.params.datapage ? parseInt(this.$route.params.datapage) : 1;
            this.table = parseInt(this.$route.params.table);
            this.get(this.table, this.page, this.keyword, this.classid);
        },
        skippage: function (page) {
            // this.$router.push({ name: 'datamanager', params: { page: page }});
            this.$router.push({ path: '/datamanager/1/listData/' + this.table + '/' + page });
        },
        cancelSearch: function () {
            this.keyword = '';
            this.get(this.table, this.page);
            this.search = false;
        },
        backToTable: function () {
            this.$router.push({ path: '/datamanager/' + this.$route.params.page });
        },
        classdel: function (event, name) {
            var _this = this;
            console.log('name');
            var apiurl = "/api_edit.php";
            var data = {
                appid: _this.vueAppid
            };
            data.action = "datamanager_classdel";
            data.tableid = this.table;
            data.classid = name;


            _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                if (response.data.status == 1) {
                    _this.getclass(this.table);
                }
                else {
                    _this.$Message.error(response.data.message);
                }
            });

        },
        classedit: function () {
            var _this = this;
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "datamanager_classedit";
            data.tableid = this.table;
            data.classid = this.classeditid;
            data.classname = this.classname;


            _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                if (response.data.status == 1) {
                    _this.classname = '';
                    _this.getclass(this.table);
                }
                else {
                    _this.$Message.error(response.data.message);
                }
            });

        },
        get: function (table, page = 1, keyword = '', classid = 0) {
            var that = this;
            if (keyword) {
                that.search = true;
            }
            else {
                that.search = false;
            }
            that.searchPoptip = false;
            //datamanager_listofbody&tableid=1


            // var apiurl="/api_edit.php?action=datamanager_listofbody&tableid="+table+"&page="+page+"&keyword="+keyword;


            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "datamanager_listofbody";
            data.tableid = table;
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.classid = that.classid;

            if (this.doing == 1) {
                return false;
            }
            this.doing = 1;

            this.$Loading.start();
            that.$http.post(apiurl, that.$qs.stringify(data)).then((response) => {

                this.doing = 0;
                if (response.data.status == 1) {
                    that.fields = response.data.field;
                    that.items = response.data.body;
                    that.tablename = response.data.tablename;
                    that.page = response.data.page;
                    that.total = response.data.total;
                    that.fieldsEdit();

                    console.log(response);
                }
                else {
                    // that.$Message.error(response.data.message);
                    that.tablename = response.data.tablename;
                    that.fields = [{ "title": "搜索:" + that.keyword, "key": "search" }];
                    that.items = [{ "search": "查无记录" }];

                }
                this.$Loading.finish();

            });
            that.getclass(table);


        },
        getclass: function (table) {
            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid
            };
            data.action = "datamanager_classlist";
            data.tableid = table;

            this.$Loading.start();

            this.$http.post(apiurl, this.$qs.stringify(data)).then((response) => {
                if (response.data.status == 1) {
                    this.classitems = response.data.body;
                }
                this.$Loading.finish();
            });

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

                    data.action = "datamanager_tableclear";
                    data.tableid = this.table;

                    if (_this.doing == 1) {
                        return false;
                    }
                    this.doing = 1;

                    _this.$Loading.start();

                    _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                        if (response.data.status == 1) {
                            _this.$Message.success(response.data.message);
                            _this.page = 1;
                            _this.fetchData();
                        }
                        else {
                            _this.$Message.error(response.data.message);
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                        _this.$Loading.error();
                    });
                    this.doing = 0;

                },
                onCancel: () => {
                    // this.$Message.info('点击了取消');
                }
            });
        },
        fieldsEdit: function () {
            var _this = this;
            //如果字段是图片的话,则增加显示图片的操作


            // this.fields.forEach(function(item) {
            //   this.checkboxModel.push(item.id);
            // });


            this.fields.forEach((e, index) => {
                if (e.fieldtype == 2) {

                    var renderimg = {
                        "render": (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row[params.column.key].indexOf('/') != -1 ? params.row[params.column.key] : (params.row[params.column.key] ? '/userlist/' + _this.vueAppUser + '/' + _this.vueAppid + '/userpic/' + params.row[params.column.key] : '/static/images/noimage.gif')
                                },
                                style: {
                                    width: params.row[params.column.key] ? '150px' : '50px'
                                }
                            });
                        }
                    };

                    if (typeof e.render == 'undefined') {
                        this.$set(e, 'render', renderimg.render); //局部
                    } else {
                        e.render = renderimg.render
                    }


                }

            })


            //在表格最后添加一列-操作
            var render = {
                "title": "操作",
                "key": "action",
                "align": 'center',
                "render": (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.show(params.index)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.remove(params.index)
                                }
                            }
                        }, '删除')
                    ]);
                }
            };

            this.fields.push(render);



        },
        show: function (index) {
            // this.$Modal.info({
            //     title: '用户信息',
            //     content: `标题：${this.items[index].title}<br>图片：${this.items[index].picture}<br>日期：${this.items[index].date}`
            // })
            var delline = this.items[index].line;

            this.$router.push({ path: '/datamanager/' + this.$route.params.page + '/editData/' + this.$route.params.table + '/' + delline });
        },
        remove: function (index) {
            var table = this.table;
            var delline = this.items[index].line;

            var _this = this;
            var apiurl = "/api_edit.php?action=datamanager_delline&tableid=" + table + "&delline=" + delline + "&appid=" + this.vueAppid;
            this.$http.get(apiurl)
                .then((response) => {
                    if (response.data.status == 1) {
                        this.items.splice(index, 1);

                    }
                    else {
                        _this.$Message.error(response.data.message);
                    }

                })
                .catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: '无法访问服务器,请重试'
                    });
                });


        }





    }
};



</script>




<style>
</style>