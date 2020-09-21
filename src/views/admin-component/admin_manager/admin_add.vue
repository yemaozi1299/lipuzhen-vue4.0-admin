<template>
    <Card>
        <p slot="title">添加管理员</p>
        <Form
            ref="editAdmin"
            :model="editAdmin"
            :rules="adminLine"
            label-position="right"
            :label-width="150"
        >
            <FormItem label="管理名姓名：" prop="realname">
                <Input type="text" v-model="editAdmin.realname"></Input>
            </FormItem>
            <FormItem label="手机：" prop="mobile">
                <Input type="text" v-model="editAdmin.mobile"></Input>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input type="password" v-model="editAdmin.password"></Input>
            </FormItem>
            <FormItem label="确认密码：" prop="isPassword">
                <Input type="password" v-model="editAdmin.isPassword"></Input>
            </FormItem>
            <FormItem label="管理员等级：" prop="sort">
                <Select v-model="editAdmin.sort">
                    <Option value="0">普通管理员</Option>
                    <Option value="1">高级管理员</Option>
                </Select>
            </FormItem>
            <FormItem label="可使用的应用：">
                <Row :gutter="10">
                    <Col
                        :xs="12"
                        :lg="6"
                        style="padding-bottom: 10px"
                        v-for="item in applist"
                    >
                        <Card> 应用1， 功能：外卖、支付、电商 </Card>
                    </Col>
                </Row>

                <Button type="primary" @click="managerAdd"
                    >添加权限管理应用</Button
                >
            </FormItem>
        </Form>
        <Modal
            v-model="addCompanyData.isModal"
            title="添加权限管理应用"
            @on-ok="managerAdd"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
                <FormItem label="软件名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.rolename"
                    ></Input>
                </FormItem>
                <FormItem label="代码名称：">
                    <Input
                        type="text"
                        v-model="addCompanyData.rolecode"
                    ></Input>
                </FormItem>
                <FormItem label="市场价格：">
                    <Input
                        type="text"
                        v-model="addCompanyData.marketprice"
                    ></Input>
                </FormItem>
                <FormItem label="功能选择：">
                    <CheckboxGroup v-model="addCompanyData.p_code_arr">
                        <Checkbox
                            border
                            :label="item.p_code"
                            v-for="item in codeList"
                            style="margin-bottom: 10px"
                            >{{ item.p_name }}</Checkbox
                        >
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="描述：">
                    <Input
                        type="text"
                        v-model="addCompanyData.description"
                    ></Input>
                </FormItem>
                <FormItem label="是否隐藏：">
                    <i-switch v-model="addCompanyData.yc" />
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            editAdmin: {
                searchPoptip: false,
                id: '',
                total: 0,
                page: 1,
                realname: '',
                mobile: '',
                password: '',
                isPassword: '',
                loading: true,
                body: [],
                sort: "0"
            },
            addCompanyData: {
                roleID: 0,
                isModal: false,
                softID: "",
                yc: false,
                description: "",
                marketprice: "",
                rolename: "",
                rolecode: "",
                p_code_arr: []
            },
            adminLine: {
                realname: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                isPassword: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
            },
            codeList: [],
            applist: [],
            softID: "",
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData () {
            this.getAppList();
            // this.getPrivilege();
        },
        getAppList: function (page) {
            var _this = this;
            var data = {
                action: 'wxapp_listof',
                page: page || 1,
                pageno: 10,
                apptype: 0
            }
            _this.$http.post('/api_home.php', _this.$qs.stringify(data)).then((res) => {
                console.log(res);
                this.applist = res.data.body || [];
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getPrivilege () {
            this.$http.request({
                method: "POST",
                url: "/api_admin.php?action=privilege_listof",
                params: {
                    softID: this.softID
                }
            }).then((res) => {
                this.codeList = res.data.body || [];
                console.log(res);
            })
        },
        managerAdd () {
            this.$http.request({
                url: "/api_admin.php?action=manager_add",
                type: "POST",
                dataType: "JSON",
                param: {

                }
            }).then((res) => {

            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            })
        }
    }
}
</script>

<style lang="" scoped>
</style>