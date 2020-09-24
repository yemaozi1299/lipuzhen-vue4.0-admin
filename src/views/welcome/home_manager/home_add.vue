<template>
    <div>
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
            <FormItem
                label="可管理的应用 （点击设置权限）："
                v-show="editAdmin.sort == 0"
            >
                <Row :gutter="10">
                    <Col
                        :xs="12"
                        :lg="6"
                        style="padding-bottom: 10px"
                        v-for="(item, index) in applist"
                        v-if="item.status == 1"
                    >
                        <div @click="editCompanyData(item, index)">
                            <Card>
                                <div>{{ item.name }}</div>
                                <!-- <div>型号：{{ item.rolename }}</div>
                                <div>软件类型：{{ item.soft }}</div> -->
                                <div v-if="item.p_code">
                                    <span>可用功能：</span
                                    ><span v-for="items in item.p_code"
                                        >{{ items.p_name }}，</span
                                    >
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <!-- <Button type="primary" @click="managerAdd"
                    >添加权限管理应用</Button
                > -->
            </FormItem>
            <Form-item>
                <Button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit('editAdmin')"
                >
                    <span v-if="!loading">提交</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Form-item>
        </Form>
        <Modal
            v-model="addCompanyData.isModal"
            title="添加权限管理应用"
            @on-ok="managerAdd"
            @on-cancel=""
        >
            <Form label-position="left" :label-width="100">
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
            </Form>
        </Modal>
    </div>
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
                sort: "0",
                userid: 0
            },
            addCompanyData: {
                isModal: false,
                p_code_arr: [],
                p_code: [],
                index: ""
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
            loading: false,
            accreditArr: {}
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData () {
            this.getAppList();
        },
        getAppList: function (page) {
            var _this = this;
            var data = {
                action: 'wxapp_listof',
                page: page || 1,
                pageno: 100,
                apptype: 0,
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
        getPrivilege (appid) {
            this.$http.request({
                method: "POST",
                url: "/api_home.php?action=app_accredit_listof",
                params: {
                    appid: appid
                }
            }).then((res) => {
                this.codeList = res.data.body || [];
                console.log(res);
            })
        },
        handleSubmit (name) {
            /*
                mobile	string	手机号
                password	string	密码
                realname	string	姓名
                sort	int	级别 0=普通管理员 1=高级管理员
                accreditArr
            */

            var params = this.editAdmin
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (params.password != params.isPassword) {
                        this.editAdmin.loading = false;
                        this.$nextTick(() => {
                            this.editAdmin.loading = true;
                        });
                        return this.$Message.warning('两次密码不一致，请重新输入');
                    }
                    var data = {
                        realname: params.realname,
                        mobile: params.mobile,
                        password: params.password,
                        sort: params.sort,
                        user: params.userid,
                        accreditArr: this.accreditArr
                    };
                    this.$http.post("/api_home.php?action=manager_add", this.$qs.stringify(data)).then((res) => {
                        this.$Message.info("添加成功");
                        this.$emit("successCallback", res);
                        // this.$router.go(-1);
                    }).catch((response) => {
                        this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            });

        },
        editCompanyData (params, index) {
            this.addCompanyData.isModal = true;
            this.addCompanyData.p_code_arr = params.p_code_arr || [];
            this.addCompanyData.index = index;
            console.log(params);
            this.getPrivilege(params.id);
        },
        managerAdd () {
            var data = this.addCompanyData.p_code_arr;
            var editApp = this.applist[this.addCompanyData.index];
            var arr = [];
            this.codeList.forEach((item, index) => {
                data.forEach((item2, index2) => {
                    if (item2 == item.p_code) {
                        arr.push(item);
                    }
                });
            });
            this.applist[this.addCompanyData.index].p_code_arr = this.addCompanyData.p_code_arr;
            this.applist[this.addCompanyData.index].p_code = arr;

            if (data.length >= 1) {
                this.accreditArr[editApp.id] = data;
            } else {
                delete this.accreditArr[editApp.id]
            }
        },
        cancel () {
            this.$emit("cancelCallback", {});
        },
    }
}
</script>

<style lang="" scoped>
</style>