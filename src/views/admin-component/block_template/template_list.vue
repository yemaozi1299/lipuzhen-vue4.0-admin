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
                <div class="search-area">
                    <Button
                        type="primary"
                        class="ant-btn mg-r-20"
                        v-on:click="pathEdit"
                    >
                        <Icon type="md-add" />添加模块模板
                    </Button>
                    <Button @click="$router.go(-1)">返回</Button>
                </div>
            </template>
            <template slot="footer">
                <Checkbox
                    class="table-checkbox"
                    v-model="isSelectAll"
                    @on-change="handleSelectAll"
                >
                    <span class="mg-l-10">已选</span
                    ><span style="color: #3091f2">{{ chooseID.length }}</span
                    ><span> / {{ tableData.length }} 个商品</span>
                </Checkbox>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="goodsedit('delete')"
                    >删除</Button
                >
            </template>
        </tables>

        <Modal v-model="isModal" width="360">
            <p slot="header" style="color: #f60; text-align: center">
                <Icon type="ios-information-circle"></Icon>
                <span>确认删除吗</span>
            </p>
            <div style="text-align: center">
                <Form
                    ref="addPriseApp"
                    label-position="left"
                    :label-width="210"
                >
                    <FormItem label="是否将模板目录文件一起删除：">
                        <i-switch v-model="delfile"></i-switch>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="choose2edit"
                    >删除</Button
                >
            </div>
        </Modal>
        <Modal
            v-model="addBlock.isModal"
            title="添加模板模块"
            @on-ok="blockAdd"
        >
            <Form label-position="right" :label-width="120">
                <FormItem label="模板文件路径：">
                    <Input type="text" v-model="addBlock.path"></Input>
                </FormItem>
                <FormItem label="模板颜色：">
                    <RadioGroup v-model="addBlock.multi_color">
                        <Radio label="1">彩色</Radio>
                        <Radio label="0">单色</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="模板描述：">
                    <Input type="text" v-model="addBlock.info"></Input>
                </FormItem>
            </Form>
        </Modal>

        <Modal
            v-model="editBlock.isModal"
            title="添加模板模块"
            @on-ok="blockEdit"
        >
            <Form label-position="right" :label-width="120">
                <FormItem label="模板文件路径：">
                    <Input type="text" v-model="editBlock.path"></Input>
                </FormItem>
                <FormItem label="模板颜色：">
                    <RadioGroup v-model="editBlock.multi_color">
                        <Radio label="1">彩色</Radio>
                        <Radio label="0">单色</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="模板描述：">
                    <Input type="text" v-model="editBlock.info"></Input>
                </FormItem>
            </Form>
        </Modal>
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
            isModal: false,
            addBlock: {
                isModal: false,
                info: "",
                path: "",
                multi_color: '0'
            },
            editBlock: {
                tpl_id: 0,
                isModal: false,
                info: "",
                path: "",
                multi_color: '0'
            },
            columns: [{
                type: 'selection',
                width: 80,
                align: 'center'
            }, {
                key: "id",
                title: "ID"
            }, {
                key: "b_id",
                title: "B_ID"
            }, {
                key: "path",
                title: "模板文件路径",
                width: 230
            }, {
                key: "info",
                title: "模板描述"
            }, {
                title: "颜色",
                render: (h, params) => {
                    return h('div', {
                        style: {
                            color: params.row.multi_color == 1 ? '#47cb89' : '#333'
                        }
                    }, params.row.multi_color == 1 ? '彩色' : '单色');
                },
            }, {
                'title': '操作',
                'key': 'action',
                'align': 'center',
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
                                    this.editBlock = {
                                        tpl_id: params.row.id,
                                        isModal: true,
                                        info: params.row.info,
                                        path: params.row.path,
                                        multi_color: params.row.multi_color
                                    }
                                }
                            }
                        }, '编辑'),
                        h(Buttons, {
                            props: {
                                type: 'error'
                            },
                            on: {
                                'click': (val) => {
                                    this.chooseID.push(params.row.id);
                                    this.goodsedit();
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
            blockname: "",
            delfile: false,
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
            this.blockname = this.$route.params.blockname ? this.$route.params.blockname : 0;
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=block_template_list",
                params: {
                    block_name: this.blockname
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
            this.$route.push({

            })
        },
        pathEdit () {
            this.addBlock = {
                isModal: true,
                info: "",
                path: `move/tpl/${this.blockname}/`,
                multi_color: '0'
            };
        },
        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        goodsedit (name) {
            if (this.chooseID.length == 0) {
                this.$Message.warning('请选择要操作的记录')
                return false
            }
            this.isModal = true;
        },
        choose2edit () { // 将要进行的操作提交到服务器API
            // console.log(name+'='+this.chooseID);
            if (this.chooseID.length > 0) {
                var apiurl = '/api_admin.php';
                var data = {
                    appid: this.vueAppid,
                    delArr: this.chooseID,
                    action: 'block_template_del',
                    delfile: this.delfile ? 1 : 0
                }
                console.log(data);
                var _this = this
                _this.$http.post(apiurl, data).then(function (response) {
                    _this.isModal = false;
                    _this.chooseID = [];
                    _this.dataInitial();
                }).catch((response) => {
                    this.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                });
            } else {
                _this.$Message.info('请选择要操作的记录')
                return false
            }
        },
        blockAdd () {
            this.$http.post("/api_admin.php?action=block_template_add", {
                block_name: this.blockname,
                template_path: this.addBlock.path,
                multi_color: this.addBlock.multi_color,
                info: this.addBlock.info
            }).then((res) => {
                this.addBlock.isModal = false;
                this.dataInitial();
                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        blockEdit () {
            this.$http.post("/api_admin.php?action=block_template_edit", {
                tpl_id: this.editBlock.tpl_id,
                template_path: this.editBlock.path,
                multi_color: this.editBlock.multi_color,
                info: this.editBlock.info
            }).then((res) => {
                this.editBlock.isModal = false;
                this.dataInitial();
                console.log(res);
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
    }
}
</script>

<style>
</style>