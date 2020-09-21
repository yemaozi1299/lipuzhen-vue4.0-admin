<template>
    <Card>
        <p slot="title" style="height: auto">
            <span>产品列表</span>
            <Dropdown
                trigger="click"
                placement="top"
                class="mg-l-20"
                @on-click="changeLange"
            >
                <Button class="table-btn" icon="ios-arrow-down">{{
                    selectedLang.name
                }}</Button>
                <DropdownMenu slot="list">
                    <template v-for="item in langList">
                        <DropdownItem :name="item.id" :key="item.id">{{
                            item.name
                        }}</DropdownItem>
                    </template>
                </DropdownMenu>
            </Dropdown>
        </p>
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
            showsider
            searchable
            @on-search-change="get"
        >
            <template slot="addbtn">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="pathEdit"
                >
                    <Icon type="md-add" />添加产品
                </Button>
            </template>

            <template slot="sider">
                <div class="category">
                    <span>分类</span>
                </div>
                <Menu
                    :active-name="classid"
                    width="auto"
                    class="menu-item sider-menu-template"
                    @on-select="selectClass"
                >
                    <MenuItem name="0" class="">
                        <span>全部</span>
                    </MenuItem>
                    <template v-for="item in classList">
                        <MenuItem
                            :key="item.id"
                            :name="item.id"
                            class="ant-radio-button-wrapper"
                        >
                            <Icon
                                class="ant-icon"
                                type="md-settings"
                                style="left: 0px"
                                v-on:click.stop="handleEdit(item)"
                            />
                            <span>{{ item.sortname }}</span>
                            <Icon
                                class="ant-icon"
                                type="ios-close-circle-outline"
                                style="right: 0px"
                                v-on:click.stop="delGroundState(item)"
                            />
                        </MenuItem>
                        <template
                            v-if="item.children"
                            v-for="itemChil in item.children"
                        >
                            <MenuItem
                                :key="itemChil.id"
                                :name="itemChil.id"
                                class="ant-radio-button-wrapper"
                            >
                                <Icon
                                    class="ant-icon"
                                    type="md-settings"
                                    style="left: 0px"
                                    v-on:click.stop="handleEdit(itemChil)"
                                />
                                <span>—— {{ itemChil.sortname }}</span>
                                <Icon
                                    class="ant-icon"
                                    type="ios-close-circle-outline"
                                    style="right: 0px"
                                    v-on:click.stop="delGroundState(itemChil)"
                                />
                            </MenuItem>
                        </template>
                    </template>
                </Menu>

                <div class="add-class-container">
                    <Button
                        type="dashed"
                        icon="md-add"
                        class="class-btn"
                        @click="showClass = true"
                        >新建分类</Button
                    >
                </div>
                <div class="add-class-dialog" v-if="showClass">
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin: 10px 5px 0 5px"
                    >
                        <Col span="8">选择分类:</Col>
                        <Col span="16">
                            <Select v-model="upid">
                                <Option value="0">一级分类</Option>
                                <Option
                                    v-for="item in classList"
                                    :value="item.id"
                                    >{{ item.sortname }}</Option
                                >
                            </Select>
                        </Col>
                    </Row>
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin: 10px 5px 0 5px"
                    >
                        <Col span="8">分类名称:</Col>
                        <Col span="16">
                            <Input
                                class="ant-search-input"
                                v-model="classname"
                            ></Input>
                        </Col>
                    </Row>
                    <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style="margin: 10px; text-align: center"
                    >
                        <Col span="12">
                            <Button type="primary" @click="addClassConfirm"
                                >保存</Button
                            >
                        </Col>
                        <Col span="12">
                            <Button @click="addClassCancel">取消</Button>
                        </Col>
                    </Row>
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
                    @click="goodsedit('show')"
                    >显示</Button
                >
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="goodsedit('hide')"
                    >隐藏</Button
                >
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="goodsedit('delete')"
                    >删除</Button
                >
                <Dropdown
                    trigger="click"
                    placement="top"
                    class="mg-r-20"
                    @on-click="classmovein"
                >
                    <Button
                        class="table-btn"
                        :disabled="chooseID.length == 0"
                        icon="ios-arrow-dropup"
                        >移入分类</Button
                    >
                    <DropdownMenu slot="list">
                        <template v-for="classitem in classList">
                            <DropdownItem
                                :key="classitem.id"
                                :name="classitem.id"
                            >
                                {{ classitem.sortname }}</DropdownItem
                            >
                            <template
                                v-if="classitem.children"
                                v-for="classitem2 in classitem.children"
                            >
                                <DropdownItem
                                    :key="classitem2.id"
                                    :name="classitem2.id"
                                >
                                    ——
                                    {{ classitem2.sortname }}</DropdownItem
                                >
                            </template>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Button
                    class="table-btn mg-r-20"
                    :disabled="chooseID.length == 0"
                    @click="classmoveout"
                    >移出分类</Button
                >
            </template>
        </tables>
    </Card>
</template>

<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons
    },
    data () {
        return {
            langList: [],
            selectedLang: {
                id: 0,
                name: "Chinese"
            },
            columns: [{
                type: 'selection',
                width: 80,
                align: 'center'
            },
            {
                title: '产品名称',
                key: 'name',
            }, {
                title: "所属分类",
                align: "left",
                key: "classname"
            }, {
                title: '时间',
                key: 'date',
            }, {
                title: "是否推荐",
                align: "center",
                render: (h, params) => {
                    return h('div', {
                        style: {
                            color: params.row.tj == 1 ? '#47cb89' : '#333'
                        }
                    }, params.row.tj == 1 ? '是' : '否');
                }
            }, {
                title: '操作',
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
                                        name: "addProduct",
                                        params: {
                                            pageid: this.page,
                                            pid: params.row.id
                                        },
                                        query: {
                                            classid: this.classid,
                                            languageid: this.selectedLang.id,
                                            languagename: this.selectedLang.name,
                                        }
                                    });
                                }
                            }
                        }, '编辑'),
                        h(Buttons, {
                            props: {
                                type: "error"
                            },
                            style: {
                            },
                            on: {
                                'click': (val) => {
                                    this.chooseID.push(params.row.id);
                                    this.goodsedit("deleted");
                                }
                            }
                        }, '删除'),

                    ])
                }
            },],
            tableData: [],
            pageno: 10,
            page: 1,
            total: 0,

            chooseID: [],
            upid: "0",
            classid: 0,
            classname: "",
            classList: [],
            showClass: false,
            isSelectAll: false,
        }
    },
    watch: {
        chooseID: function (val) {
            if (val.length >= this.tableData.length) {
                this.isSelectAll = true
            } else {
                this.isSelectAll = false
            }
        },
        '$route': 'fetchData'
    },
    created () {
        this.fetchData();
        this.getLanguage();
    },
    methods: {
        fetchData: function () {
            this.page = this.$route.params.pageid ? parseInt(this.$route.params.pageid) : 1;
            this.classid = this.$route.query.classid ? String(this.$route.query.classid) : 0;
            this.selectedLang = {
                id: this.$route.query.languageid || 0,
                name: this.$route.query.languagename || "Chinese"
            };
            this.get();
            this.getClass();
        },
        getLanguage () {
            this.$http.request({
                url: "/api_edit.php?action=getHaveLanguage",
                params: {
                    appid: this.vueAppid,
                }
            }).then((res) => {
                this.langList = res.data.body || [];
                console.log(res);
            });
        },
        changeLange (id) {
            this.langList.forEach((item) => {
                if (item.id == id) {
                    this.selectedLang = item;
                    this.$router.push({
                        query: {
                            classid: 0,
                            languageid: item.id,
                            languagename: item.name,
                        },
                    });
                    this.fetchData();
                    return
                }
            });
        },
        get (keyword) {
            if (keyword) {
                this.page = 1;
            }
            var data = {
                keyword: keyword,
                page: this.page,
                pageno: this.pageno,
                classid: this.classid,
                language: this.selectedLang.id
            }
            this.$http.post("/api_edit.php?action=product_list", data).then((res) => {
                console.log(res);
                this.total = parseInt(res.data.total || 0);
                this.tableData = res.data.body || [];
                this.chooseID = [];
            });
        },
        getClass () {
            var data = {
                language: this.selectedLang.id
            }
            this.$http.post("/api_edit.php?action=product_class_get", data).then((res) => {
                this.classList = res.data.body || [];

                console.log(this.classList);
            });

        },
        skippage: function (page) {
            if (this.$route.params.pageid == page) {
                this.page = page
                return this.get()
            }
            this.$router.push({
                name: "product",
                params: {
                    pageid: page
                },
                query: {
                    classid: this.classid,
                    languageid: this.selectedLang.id,
                    languagename: this.selectedLang.name,
                }
            })
        },
        chooseEdit: function (selection) {
            var chooseID = []
            selection.forEach((e, index) => { // 将图片显示出来
                chooseID.push(e.id)
            })
            this.chooseID = chooseID
        },

        handleSelectAll (status) { // 全选按钮
            this.$refs.tables.selectAll(status)
        },
        selectClass (id) {   //切换分类
            this.$router.push({
                params: {
                    pageid: 1
                },
                query: {
                    classid: id,
                    languageid: this.selectedLang.id,
                    languagename: this.selectedLang.name,
                },
            });
            // this.get();
        },
        handleEdit: function (item) {
            var value = "";
            this.$Modal.info({
                title: "修改分类名称",
                render: h => {
                    return h("Input", {
                        props: {
                            value: item.sortname,
                            autofocus: true,
                            placeholder: "请输入分类名称"
                        },
                        on: {
                            input: val => {
                                value = val;
                            }
                        }
                    });
                },
                onOk: () => {
                    this.$http.request({
                        url: "/api_edit.php?action=product_class_edit",
                        params: {
                            id: item.id,
                            sortname: value
                        }
                    }).then((res) => {
                        this.getClass();
                    });
                }
            });
        },

        goodsedit (name) {
            if (this.chooseID.length == 0) {
                this.$Message.warning('请选择要操作的记录')
                return false
            }
            const title = '提醒';
            var mode = "";
            switch (name) {
                case 'delete':
                    var content = '确定对所选产品进行：删除'
                    var action = 'product_del'
                    break
                case 'show':
                    var content = '确定对所选产品进行：显示'
                    var action = 'product_updown'
                    mode = 0;
                    break
                case 'hide':
                    var content = '确定对所选产品进行：隐藏'
                    var action = 'product_updown'
                    mode = 1;
                    break
            }
            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: () => {
                    this.choose2edit(action, mode)
                }
            });
        },
        choose2edit: function (action, mode) { // 将要进行的操作提交到服务器API
            // console.log(name+'='+this.chooseID);
            if (this.chooseID.length > 0) {
                var apiurl = '/api_edit.php';
                var data = {
                    appid: this.vueAppid,
                    items: this.chooseID,
                    delid: this.chooseID,
                    action: action,
                    mode: mode
                }
                console.log(data);

                var _this = this
                _this.$http.post(apiurl, data).then(function (response) {
                    if (response.data.status == 1) {
                        _this.get()
                    } else {
                        _this.$Message.error(response.data.message)
                    }
                })
            } else {
                _this.$Message.info('请选择要操作的记录')
                return false
            }
        },
        classmovein: function (classid) { // 移入分类
            var _this = this

            if (_this.chooseID.length == 0) {
                _this.$Message.warning('请选择要操作的记录')
                return false
            }

            var apiurl = '/api_edit.php'
            var data = {
                appid: this.vueAppid
            }

            data.action = 'product_move_class'
            data.items = this.chooseID
            data.classid = classid
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.doing = 0
                if (response.data.status == 1) {
                    _this.$Message.info('操作成功')
                    _this.get()
                } else {
                    _this.$Message.error(response.data.message)
                }
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                })
            })
        },

        classmoveout: function () { // 移出分类
            var _this = this

            if (_this.chooseID.length == 0) {
                _this.$Message.warning('请选择要操作的记录')
                return false
            }
            var apiurl = '/api_edit.php'
            var data = {
                appid: this.vueAppid
            }

            data.action = 'product_move_class'
            data.items = this.chooseID
            data.classid = 0
            _this.$Loading.start()
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {

                if (response.data.status == 1) {
                    _this.$Message.info('操作成功')
                    _this.get()
                } else {
                    _this.$Message.error(response.data.message)
                }
            }).catch(function (response) {

                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                })
            })
        },


        delGroundState (item) {
            var value = "";
            console.log(item);
            this.$Modal.confirm({
                title: "删除分类",
                content: "确定要删除分类吗，删除分类会将分类下的产品一起删除",
                onOk: () => {
                    this.$http.request({
                        url: "/api_edit.php?action=product_class_del",
                        params: {
                            id: item.id,
                        }
                    }).then((res) => {
                        this.get();
                        this.getClass();
                    })
                }
            });
        },
        addClassConfirm () {
            if (this.classname == '') {
                this.$Message.error('请输入分类名称')
                return false
            }
            this.$http.request({
                url: "/api_edit.php?action=product_class_add",
                params: {
                    appid: this.vueAppid,
                    sortname: this.classname,
                    upid: this.upid,
                    language: this.selectedLang.id
                }
            }).then((res) => {
                this.classname = "";
                this.upid = 0;
                this.showClass = false;
                this.getClass();
            });
        },
        addClassCancel () {
            this.showClass = false;
        },
        pathEdit () {
            this.$router.push({
                name: "addProduct",
                params: {
                    pageid: this.page,
                    pid: 0
                },
                query: {
                    classid: this.classid,
                    languageid: this.selectedLang.id,
                    languagename: this.selectedLang.name,
                }

            });
        },
    },

}
</script>

<style>
</style>