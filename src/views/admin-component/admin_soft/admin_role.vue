<template>
    <Card>
        <p slot="title">当前软件：{{ softname }}</p>
        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="tableData"
            :columns="columns"
            show-elevator
            @on-skippage="skippage"
            showlayout
            :loading="loading"
        >
            <template slot="header">
                <Button
                    type="primary"
                    class="ant-btn mg-r-20"
                    v-on:click="addCompanyData.isModal = true"
                >
                    <Icon type="md-add" />添加型号
                </Button>
                <Button class="ant-btn mg-r-20">
                    <Icon type="ios-undo" />返回
                </Button>
            </template>
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
            softname: "",
            edit_isModal: false,
            addCompanyData: {
                p_id: 0,
                isModal: false,
                p_name: "",
                p_code: "",
                softID: "",
                yc: false
            },
            columns: [],
            tableData: [],
            chooseID: [],
            classid: "0",
            softID: 1,
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
        fetchData () {
            this.softID = this.$route.params.softID ? parseInt(this.$route.params.softID) : 1;
            this.softname = this.$route.query.softname || "";
            this.dataInitial()
        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=role_listof",
                params: {
                    softID: this.softID
                }
            }).then((res) => {

            })
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
            this.$route.push({})
        },
    }
}
</script>

<style>
</style>