<template>
    <div>
        <Card class="shop-list-card" style="" dis-hover>
            <tables
                ref="tables"
                editable
                search-place="top"
                v-model="tableData"
                :columns="columns"
                @on-delete="handleDelete"
                @on-save-edit="saveEdit"
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
            >
                <div slot="header">
                    <Menu
                        mode="horizontal"
                        @on-select="changeshoptype"
                        :active-name="shoptype == 'ec' ? '0' : '1'"
                        class="menu-box"
                    >
                        <MenuItem name="0">
                            普通商品
                        </MenuItem>
                        <MenuItem name="1">
                            外卖商品
                        </MenuItem>
                    </Menu>
                    <div class="search-area">
                        <Button
                            type="primary"
                            class="ant-btn mg-r-20"
                            v-on:click="pathEdit"
                        >
                            <Icon type="md-add" />添加商品
                        </Button>
                        <Button
                            type="primary"
                            class="ant-btn mg-r-20"
                            v-on:click="goClassList"
                        >
                            <Icon type="ios-construct" />分类管理
                        </Button>
                        <Input
                            v-model="formItem.keyword"
                            placeholder="关键字"
                            @input="dataInitial"
                            clearable
                            class="ant-search-input mg-r-10"
                            style="width: 200px;"
                        />
                        <Button
                            type="primary"
                            @click="dataInitial"
                            icon="ios-search"
                            class="ant-search-btn"
                        ></Button>
                    </div>
                </div>
                <div slot="sider">
                    <div class="category">
                        <span>分类</span>
                    </div>
                    <Menu
                        :active-name="classid"
                        width="auto"
                        class="menu-item"
                        @on-select="selectClass"
                    >
                        <MenuItem name="0" class="">
                            <span>全部</span>
                        </MenuItem>
                        <MenuItem
                            v-for="item in classList"
                            :key="item.id"
                            :name="item.id"
                        >
                            <span>{{ item.classname }}</span>
                        </MenuItem>
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
                            style="margin: 10px 5px 0 5px;"
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
                            style="margin: 10px; text-align: center;"
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
                </div>
                <div slot="footer">
                    <Checkbox
                        class="table-checkbox"
                        v-model="isSelectAll"
                        @on-change="handleSelectAll"
                    >
                        <span class="mg-l-10">已选</span
                        ><span style="color: #3091f2;">{{
                            chooseID.length
                        }}</span
                        ><span> / {{ tableData.length }} 个商品</span>
                    </Checkbox>
                    <Button
                        class="table-btn mg-r-20"
                        :disabled="chooseID.length == 0"
                        @click="goodsedit('up')"
                        >上架</Button
                    >
                    <Button
                        class="table-btn mg-r-20"
                        :disabled="chooseID.length == 0"
                        @click="goodsedit('down')"
                        >下架</Button
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
                            <DropdownItem
                                v-for="classitem in classList"
                                :key="classitem.id"
                                :name="classitem.id"
                            >
                                {{ classitem.classname }}</DropdownItem
                            >
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown
                        trigger="click"
                        placement="top"
                        class="mg-r-20"
                        @on-click="classmoveout"
                    >
                        <Button
                            class="table-btn"
                            :disabled="chooseID.length == 0"
                            icon="ios-arrow-dropup"
                            >移出分类</Button
                        >
                        <DropdownMenu slot="list">
                            <DropdownItem
                                v-for="classitem in classList"
                                :key="classitem.id"
                                :name="classitem.id"
                            >
                                {{ classitem.classname }}</DropdownItem
                            >
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </tables>
        </Card>
    </div>
</template>
<script>
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    name: 'shopList',
    components: {
        Tables,
        Buttons
    },
    data () {
        return {

            columns: [
                {
                    type: 'selection',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'name',
                    sortable: true,
                    // editable: true
                },
                {
                    title: '图片',
                    width: 90,
                    key: 'face',
                    'render': (h, params) => {
                        return h('img', {
                            attrs: {
                                src: '' + params.row[params.column.key]
                            },
                            style: {
                                margin: '5px 0',
                                width: '100%'
                            },
                            on: {
                                click: () => {
                                    this.handleView(params.row[params.column.key])
                                }
                            }
                        })
                    }
                },
                {
                    title: '分类',
                    key: 'classname'
                },
                {
                    title: '价格',
                    width: 150,
                    key: 'price',
                    sortable: true
                    // editable: true
                },
                {
                    title: '库存',
                    width: 150,
                    key: 'kc',
                    sortable: true
                    // editable: true
                },

                {
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
                                        console.log(val)
                                        this.show(params.index)
                                    }
                                }
                            }, '编辑'),
                            h(Buttons, {
                                props: {
                                    border: true,
                                    type: 'error'
                                },
                                on: {
                                    'click': (val) => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除'),

                            h(Buttons, {
                                props: {
                                    border: true,
                                    type: params.row.orderid == 1 ? 'default' : 'info'
                                },
                                style: {
                                },
                                on: {
                                    'click': () => {
                                        this.setorder(params.index)
                                    }
                                }
                            }, params.row.orderid == 0 ? '置顶' : '已置顶'),
                            h(Buttons, {
                                props: {
                                    type: params.row.deleted == 0 ? 'success' : 'warning'
                                },
                                style: {
                                },
                                on: {
                                    'click': () => {
                                        this.setUp(params.index, params.row.deleted)
                                    }
                                }
                            }, params.row.deleted == 0 ? '上架' : '下架')
                        ])
                    }
                }
            ],
            tableData: [],

            vueAppid: this.$cookieStore.get("CookVueAppid"),
            loading: false,
            selected: '1',
            formItem: {
                keyword: ''
            },
            classList: [],
            classid: '0',
            pageno: 10,
            page: 1,
            total: 0,
            chooseID: [],
            isSelectAll: false,
            doing: 0,
            showClass: false,
            classeditid: 0,
            classname: '',
            shoptype: 'ec',
            editType: 'edit',
            getType: 0
        }
    },
    created () {
        this.fetchData();
        this.getClass();
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
    methods: {
        fetchData: function () {
            this.page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
            this.shoptype = this.$route.params.shoptype || 'ec'
            this.editType = this.shoptype == 'ec' ? 'shopedit' : 'waimaiedit'
            this.getType = this.shoptype == 'ec' ? 0 : 1
            this.dataInitial()
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
        changeshoptype: function (name) {
            if (name == '1') {
                this.$router.push({
                    path: '/shop/1/jifen'
                })
                this.editType = 'waimaiedit'
                this.getType = 1
            } else {
                this.$router.push({
                    path: '/shop/1/ec'
                })
                this.editType = 'shopedit'
                this.getType = 0
            }
            this.classid = '0'
            this.chooseID = []
        },

        skippage: function (page) {
            if (this.$route.params.page == page) {
                this.page = page
                return this.dataInitial()
            }
            this.$router.push({
                path: '/shop/' + page
            })
        },
        selectClass: function (name) {
            this.classid = name
            this.page = 1
            this.dataInitial()
            console.log(name)
        },
        saveEdit: function () {

        },
        pathEdit: function () {
            this.$router.push({
                path: '/shop/' + this.page + '/' + this.editType + '/0'
            })
        },
        dataInitial: function (keyword) {
            var that = this
            var data = {
                action: 'goods_list',
                page: this.page,
                pageno: this.pageno,
                keyword: keyword || this.formItem.keyword,
                classid: this.classid,
                shoptype: this.getType
            }
            console.log(that.$http);
            that.$http.request({
                method: "POST",
                url: "/api_edit.php",
                params: data
            }).then(function (res) {
                that.tableData = res.data.body
                that.total = res.data.total
                that.chooseID = []
                console.log(res)
            });
        },
        getClass: function () {
            var that = this
            var data = {
                action: 'goods_classlist',
                appid: this.vueAppid,
                shoptype: this.getType
            }
            that.$http.request({
                method: "POST",
                url: "/api_edit.php",
                params: data
            }).then(function (res) {
                if (res.data.status == 1) {
                    that.classList = res.data.body
                } else {
                    that.$Message.error(res.data.message)
                }
                console.log(res);
            });
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

            data.action = 'goods_moveinoutclass'
            data.mode = 'in'
            data.goodsids = this.chooseID
            data.classid = classid
            if (_this.doing == 1) {
                return false
            }
            _this.doing = 1
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.doing = 0
                if (response.data.status == 1) {
                    _this.$Message.info('操作成功')
                    _this.dataInitial()
                } else {
                    _this.$Message.error(response.data.message)
                }
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                })
                _this.doing = 0
            })
        },

        classmoveout: function (classid) { // 移出分类
            var _this = this

            if (_this.chooseID.length == 0) {
                _this.$Message.warning('请选择要操作的记录')
                return false
            }
            var apiurl = '/api_edit.php'
            var data = {
                appid: this.vueAppid
            }

            data.action = 'goods_moveinoutclass'
            data.mode = 'out'
            data.goodsids = this.chooseID
            data.classid = classid
            _this.$Loading.start()
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.$Loading.finish()
                if (response.data.status == 1) {
                    _this.$Message.info('操作成功')
                    _this.dataInitial()
                } else {
                    _this.$Message.error(response.data.message)
                }
            }).catch(function (response) {
                _this.$Loading.finish()
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                })
            })
        },
        handleDelete: function () {

        },
        addClassConfirm: function () {
            var apiurl = '/api_edit.php'
            var data = {
                appid: this.vueAppid
            }
            data.action = 'goods_classedit'
            data.classid = this.classeditid
            data.classname = this.classname

            var _this = this

            if (_this.classname == '') {
                _this.$Message.error('请输入分类名称')
                return false
            }

            if (_this.doing == 1) {
                return false
            }
            _this.doing = 1

            this.$http.post(apiurl, this.$qs.stringify(data)).then(function (response) {
                _this.doing = 0
                if (response.data.status == 1) {
                    _this.classname = ''
                    _this.getClass()
                    _this.showClass = false
                } else {
                    _this.$Message.error(response.data.message)
                }
            })
        },
        addClassCancel: function () {
            this.showClass = false
        },
        show: function (index) { // 进入商品信息编辑界面
            var goodsid = this.tableData[index].id
            this.$router.push({
                path: '/shop/' + this.page + '/' + this.editType + '/' + goodsid
            })
        },
        remove: function (index) { // 删除商品
            var chooseID = []
            chooseID.push(this.items[index].id)
            this.chooseID = chooseID
            this.goodsedit('delete')
        },
        goodsedit: function (name) { // 提示是否确定要进行操作
            if (this.chooseID.length == 0) {
                this.$Message.warning('请选择要操作的记录')
                return false
            }

            const title = '提醒'

            switch (name) {
                case 'up':
                    var content = '确定对所选记录进行：上架'
                    var mode = 'up'
                    break
                case 'down':
                    var content = '确定对所选记录进行：下架'
                    var mode = 'down'
                    break
                case 'delete':
                    var content = '确定对所选记录进行：删除'
                    var mode = 'delete'
                    break
            }

            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: () => {
                    this.choose2edit(mode)
                }
            })
        },
        choose2edit: function (mode) { // 将要进行的操作提交到服务器API
            // console.log(name+'='+this.chooseID);
            if (this.chooseID.length > 0) {
                var apiurl = '/api_edit.php'
                var data = {
                    appid: this.vueAppid
                }

                data.action = mode == 'delete' ? 'goods_del' : 'goods_updown'
                data.mode = mode
                data.delid = this.chooseID

                if (this.doing == 1) {
                    return false
                }
                this.doing = 1

                var _this = this

                _this.$http.post(apiurl, data).then(function (response) {
                    _this.doing = 0
                    if (response.data.status == 1) {
                        _this.dataInitial()
                    } else {
                        _this.$Message.error(response.data.message)
                    }
                }).catch(function (response) {
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: '无法访问服务器,请重试'
                    })
                    _this.doing = 0
                })
            } else {
                _this.$Message.info('请选择要操作的记录')
                return false
            }
        },
        setorder: function (index) { // 置顶
            var _this = this
            var goodsid = this.tableData[index].id

            var apiurl = '/api_edit.php'
            var data = {
                appid: this.vueAppid
            }

            data.action = 'goods_setTop'
            data.goodsid = goodsid

            if (this.doing == 1) {
                return false
            }
            _this.doing = 1
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                _this.doing = 0
                if (response.data.status == 1) {
                    _this.$Message.success(response.data.message)
                    _this.dataInitial()
                } else {
                    _this.$Message.error(response.data.message)
                }
            }).catch(function (response) {
                _this.doing = 0
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                })
            })
        },
        setUp: function (index, isUP) { // 控制上下加
            var _this = this
            var chooseID = []
            chooseID.push(this.tableData[index].id)
            this.chooseID = chooseID
            isUP = parseInt(isUP)
            var mode = (isUP == 0) ? 'down' : 'up'
            isUP = (isUP == 0) ? 1 : 0
            if (this.doing == 1) {
                return false
            }

            if (_this.chooseID.length > 0) {
                var apiurl = '/api_edit.php'
                var data = {
                    appid: this.vueAppid
                }

                data.action = 'goods_updown'
                data.mode = mode
                data.delid = this.chooseID
                _this.$Loading.start()
                _this.doing = 1
                _this.$http.post(apiurl, _this.$qs.stringify(data)).then(function (response) {
                    _this.$Loading.finish()
                    _this.doing = 0
                    if (response.data.status == 1) {
                        _this.tableData[index].deleted = isUP
                    } else {
                        _this.$Message.error(response.data.message)
                    }
                }).catch(function (response) {
                    _this.$Loading.error()
                    _this.$Notice.error({
                        title: '错误提示',
                        desc: '无法访问服务器,请重试'
                    })
                    _this.doing = 0
                })
            } else {
                _this.$Message.info('请选择要操作的记录')
                return false
            }
        },
        goClassList () {
            this.$router.push({
                name: "classlist",
                params: {
                    page: this.page,
                    shoptype: this.shoptype
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shop-list-card {
    font-size: 12px;
    border-radius: 0px;
}
</style>
