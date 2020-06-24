<template>
    <div class="tables_template">
        <Layout class="layout-wrapper" v-if="showlayout">
            <Header class="header-wrapper" v-if="searchable">
                <slot name="menu"></slot>
                <!-- 搜索框 -->
                <div class="search-area">
                    <slot name="addbtn"></slot>
                    <Input
                        v-model="searchKey"
                        placeholder="关键字"
                        @on-keyup.enter="onSearchChange"
                        clearable
                        class="ant-search-input mg-r-10"
                        style="width: 200px;"
                    />
                    <Button
                        type="primary"
                        @click="onSearchChange"
                        icon="ios-search"
                        class="ant-search-btn"
                    ></Button>
                    <div class="search-content" v-if="isSearch">
                        搜索:{{ value }}
                        <Button
                            type="primary"
                            size="small"
                            shape="circle"
                            @click="cancelSearch"
                            >返回</Button
                        >
                    </div>
                </div>
            </Header>
            <Header class="header-wrapper" v-else>
                <slot name="header"></slot>
            </Header>
            <Layout class="layout-wrapper">
                <Sider class="sider-wrapper" width="198" v-if="showsider">
                    <slot name="sider"></slot>
                </Sider>

                <Layout class="layout-wrapper">
                    <Content>
                        <!-- 设置iview表格自带属性 -->
                        <Table
                            ref="tablesMain"
                            :row-key="rowKey"
                            :data="insideTableData"
                            :columns="insideColumns"
                            :stripe="stripe"
                            :border="border"
                            :show-header="showHeader"
                            :width="width"
                            :height="height"
                            :loading="loading"
                            :disabled-hover="disabledHover"
                            :highlight-row="highlightRow"
                            :row-class-name="rowClassName"
                            :size="size"
                            :no-data-text="noDataText"
                            :no-filtered-data-text="noFilteredDataText"
                            @on-current-change="onCurrentChange"
                            @on-select="onSelect"
                            @on-select-cancel="onSelectCancel"
                            @on-select-all="onSelectAll"
                            @on-selection-change="onSelectionChange"
                            @on-sort-change="onSortChange"
                            @on-filter-change="onFilterChange"
                            @on-row-click="onRowClick"
                            @on-row-dblclick="onRowDblclick"
                            @on-expand="onExpand"
                        >
                        </Table>
                        <div
                            class="page-content"
                            v-if="showPage == true && total > pageSize"
                        >
                            <Page
                                :total="total"
                                :current="current"
                                :page-size="pageSize"
                                :show-total="showTotal"
                                :show-elevator="showElevator"
                                @on-change="skippage"
                            >
                            </Page>
                        </div>
                    </Content>
                    <Footer class="table-footer">
                        <slot name="footer"></slot>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
        <div class="tableContent" v-else>
            <!-- 搜索框 -->
            <div class="search-area" v-if="searchable">
                <slot name="addbtn"></slot>
                <Input
                    v-model="searchKey"
                    placeholder="关键字"
                    @on-keyup.enter="onSearchChange"
                    clearable
                    class="ant-search-input mg-r-10"
                    style="width: 200px;"
                />
                <Button
                    type="primary"
                    @click="onSearchChange"
                    icon="ios-search"
                    class="ant-search-btn"
                ></Button>
                <div class="search-content" v-if="isSearch">
                    搜索:{{ searchKey }}
                    <Button
                        type="primary"
                        size="small"
                        shape="circle"
                        @click="onCancelSearch"
                        >返回</Button
                    >
                </div>
            </div>
            <!-- 设置iview表格自带属性 -->
            <Table
                ref="tablesMain"
                :row-key="rowKey"
                :data="insideTableData"
                :columns="insideColumns"
                :stripe="stripe"
                :border="border"
                :show-header="showHeader"
                :width="width"
                :height="height"
                :loading="loading"
                :disabled-hover="disabledHover"
                :highlight-row="highlightRow"
                :row-class-name="rowClassName"
                :size="size"
                :no-data-text="noDataText"
                :no-filtered-data-text="noFilteredDataText"
                @on-current-change="onCurrentChange"
                @on-select="onSelect"
                @on-select-cancel="onSelectCancel"
                @on-select-all="onSelectAll"
                @on-selection-change="onSelectionChange"
                @on-sort-change="onSortChange"
                @on-filter-change="onFilterChange"
                @on-row-click="onRowClick"
                @on-row-dblclick="onRowDblclick"
                @on-expand="onExpand"
            >
            </Table>
            <div
                class="page-content"
                v-if="showPage == true && total > pageSize"
            >
                <Page
                    :total="total"
                    :current="current"
                    :page-size="pageSize"
                    :show-total="showTotal"
                    :show-elevator="showElevator"
                    @on-change="skippage"
                >
                </Page>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import TablesEdit from './edit.vue'
export default {
    name: "Tables",
    props: {
        value: {
            type: Array,
            default () {
                return []
            }
        },
        columns: {
            type: Array,
            default () {
                return []
            }
        },
        rowKey: {
            type: String,
            default: ""
        },
        size: String,
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },

        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default () {
                return ''
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * @description 全局设置是否可编辑
         */
        editable: {
            type: Boolean,
            default: false
        },
        isSearch: {
            type: Boolean,
            default: false
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 搜索控件所在位置，'top' / 'bottom'
         */
        searchPlace: {
            type: String,
            default: 'top'
        },
        showPage: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 10
        },
        current: {
            type: Number,
            default: 1
        },
        showTotal: {
            type: Boolean,
            default: false
        },
        showElevator: {
            type: Boolean,
            default: false
        },
        // showlayout, 单独调用组件或者自带搜索、侧边栏
        showlayout: {
            type: Boolean,
            default: false
        },
        //showsider
        showsider: {
            type: Boolean,
            default: false
        },
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data () {
        return {
            insideColumns: [],
            insideTableData: [],
            edittingCellId: '',    //当前选中的按钮
            edittingText: '',      //临时存放修改内容
            searchValue: '',       //搜索内容
            searchKey: ''
        }
    },
    mounted () {        //最开始执行
        this.handleColumns(this.columns)        //获取columns参数，初始化表格
        // this.setDefaultSearchKey()
        this.handleTableData()
    },
    watch: {
        columns (columns) {        //columns变动时，要重新初始化表格
            console.log(columns);
            this.handleColumns(columns)
            // this.setDefaultSearchKey()
        },
        value (val) {           //初始化表格数据
            this.handleTableData()
            // if (this.searchable) this.handleSearch()
        }
    },
    methods: {
        handleColumns: function (columns) {      //分析columns参数,初始化表格
            this.insideColumns = columns.map((item, index) => {
                var res = item;
                if (res.editable) {          //设置该单元格可被编辑
                    res = this.suportEdit(res, index)
                }
                if (res.key === 'handle') {     //设置操作按钮
                    // res = this.surportHandle(res) 
                }
                return res
            });
        },
        handleTableData () {
            this.insideTableData = this.value.map((item, index) => {
                let res = item
                res.initRowIndex = index
                return res
            });
        },
        suportEdit: function (item, index) {       //调用edit组件
            item.render = (h, params) => {
                return h(TablesEdit, {
                    props: {
                        params: params,
                        value: this.insideTableData[params.index][params.column.key],
                        edittingCellId: this.edittingCellId,
                        editable: this.editable
                    },
                    on: {
                        'input': (val) => {
                            this.edittingText = val;
                        },
                        'on-start-edit': (params) => {    //开始修改，点击修改按钮时
                            this.edittingCellId = `editting-${params.index}-${params.column.key}`;
                            console.log(this.edittingCellId);
                            this.$emit('on-start-edit', params);
                        },
                        'on-cancel-edit': (params) => {   //点击取消时
                            this.edittingCellId = '';
                        },
                        'on-save-edit': (params) => {    //点击确定，保存数据
                            this.value[params.row.initRowIndex][params.column.key] = this.edittingText ? this.edittingText : this.value[params.row.initRowIndex][params.column.key];     //静态修改表格内容
                            this.$emit('input', this.value)
                            this.$emit('on-save-edit', Object.assign(params, { value: this.value[params.row.initRowIndex][params.column.key] }))
                            this.edittingCellId = ''
                        }
                    }

                });
            };
            return item;
        },
        onCurrentChange (currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow)
        },
        selectAll: function (status) {
            this.$refs.tablesMain.selectAll(status);
        },
        onSelect (selection, row) {
            this.$emit('on-select', selection, row)
        },
        onSelectCancel (selection, row) {
            this.$emit('on-select-cancel', selection, row)
        },
        onSelectAll (selection) {
            this.$emit('on-select-all', selection)
        },
        onSelectionChange (selection) {
            this.$emit('on-selection-change', selection)
        },
        onSortChange (column, key, order) {
            this.$emit('on-sort-change', column, key, order)
        },
        onFilterChange (row) {
            this.$emit('on-filter-change', row)
        },
        onRowClick (row, index) {
            this.$emit('on-row-click', row, index)
        },
        onRowDblclick (row, index) {
            this.$emit('on-row-dblclick', row, index)
        },
        onExpand (row, status) {
            this.$emit('on-expand', row, status)
        },
        skippage: function (page) {
            this.$emit('on-skippage', page)
        },
        // 搜索
        onSearchChange () {
            this.$emit("on-search-change", this.searchKey);
        },
        onCancelSearch (evnet) {
            this.$emit("on-cancel-search", evnet);
        },
        onPathEdit (evnet) {
            this.$emit("on-path-edit", evnet)
        }
    }
}

</script>



<style lang="stylus" rel="stylesheet/stylus">
.tables_template {
    tr {
        font-size: 12px;
        &:hover {
            .tables-edit-btn {
                display: inline-block;
            }
        }
    }
    th {
        color: #303445;
        background: #F6F7FB;
        font-weight: 500;
        border: none;
        border-right: 2px solid #FFF;
        font-size: 12px;
    }
    .page-content {
        padding: 20px 0;
        text-align: right;
    }
}
.search-area {
    overflow: hidden;
    margin-bottom: 10px;
    .search-content {
        float: right;
    }
}
</style>





