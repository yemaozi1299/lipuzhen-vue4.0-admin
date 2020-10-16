<template>
    <Card>
        <p slot="title">添加文章</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px"
        >
            <Form-item label="等级名称" prop="level">
                <Input
                    v-model="formValidate.level"
                    placeholder="请输入等级名称"
                ></Input>
            </Form-item>
            <Form-item label="描述" prop="description">
                <Input
                    v-model="formValidate.description"
                    placeholder="描述"
                ></Input>
            </Form-item>
            <Form-item label="是否隐藏" prop="yc">
                <i-switch v-model="formValidate.yc" />
            </Form-item>
            <FormItem label="软件类型：" prop="">
                <Select style="width: 200px" v-model="selectedSoft">
                    <Option
                        :value="item.id"
                        v-for="item in softList"
                        :key="item.id"
                        >{{ item.softname }}</Option
                    >
                </Select>
            </FormItem>
            <Form-item label="设置等级价格" prop="price">
                <tables
                    ref="tables"
                    search-place="top"
                    v-model="tableData"
                    :columns="columns"
                    :loading="formValidate.loading"
                >
                    <template slot="header"></template>
                    <template slot="sider"></template>
                    <template slot="footer"></template>
                </tables>
            </Form-item>
            <Form-item>
                <Button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit('formValidate')"
                >
                    <span v-if="!loading">提交</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button @click="$router.go(-1)" style="margin-left: 8px"
                    >取消</Button
                >
            </Form-item>
        </Form>
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
    name: '',
    data () {
        return {
            levelID: '',
            loading: false,
            selectedSoft: "",
            softList: [],
            pariceList: [],
            tableData: [],
            priceData: [],
            columns: [
                {
                    key: "rolename",
                    title: "软件型号名称"
                },
                {
                    key: "rolecode",
                    title: "软件型号代码"
                },
                {
                    key: "description",
                    title: "软件型号描述"
                },
                {
                    title: '设置价格',
                    render: (h, params) => {
                        return h('div', [
                            h('inputNumber', {
                                props: {
                                    value: parseInt(params.row.marketprice || 0)
                                },
                                style: {
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.pariceList[params.index].marketprice = value;

                                        console.log(params);
                                    }
                                }
                            })
                        ]);
                    },
                },
            ],
            formValidate: {
                level: "",
                description: "",
                yc: false,
                loading: false
            },
            ruleValidate: {
                level: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
            },
            vueAppid: this.$cookieStore.get("CookVueAppid"),
        }
    },
    created () {
        this.levelID = this.$route.query.levelID;
        if (this.levelID) {
            this.get();
        }
        this.getSoftList();
    },
    methods: {
        get () {
            this.$http.request({
                url: "/api_admin.php?action=level_get",
                params: {
                    levelID: this.levelID
                }
            }).then((res) => {
                console.log(res);
                var data = res.data.body;
                this.formValidate = {
                    level: data.level,
                    description: data.description,
                    yc: data.yc == 1 ? true : false,
                    loading: false
                };
                // this.softList = res.data.body || [];
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        handleSubmit (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var apiurl = '/api_admin.php';
                    var params = {},
                        data = this.formValidate,
                        price = {};
                    this.pariceList.forEach((item) => {
                        price[item.id] = item.marketprice;
                    });
                    params = {
                        action: this.levelID ? "level_edit" : "level_add",
                        levelID: this.levelID,
                        level: data.level,
                        description: data.description,
                        yc: data.yc ? 1 : 0,
                        price: price
                    };
                    console.log(params);

                    this.$http.post(apiurl, params).then(function (response) {
                        if (response.data.status == 1) {
                            _this.$Message.info('保存成功');
                            _this.$router.go(-1);
                        }
                        console.log(response);
                        _this.loading = false;
                    }).catch(function (response) {
                        _this.$Loading.error()
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: response
                        });
                        _this.loading = false
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            });
        },
        getSoftList () {
            this.$http.request({
                url: "/api_admin.php?action=soft_listof",
                params: {

                }
            }).then((res) => {
                this.softList = res.data.body || [];
            }).catch((response) => {
                this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        getAgentprice: function () {
            var _this = this;
            var data = {
                action: 'role_listof',
                softID: this.selectedSoft
            };
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (res) {
                _this.formValidate.loading = false;
                _this.tableData = res.data.body || [];
                _this.$nextTick(() => {
                    _this.pariceList = JSON.parse(JSON.stringify(res.data.body)) || [];
                })
                console.log(_this.pariceList);
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
    },

    watch: {
        selectedSoft (val) {
            this.getAgentprice();
            this.formValidate.loading = true;
        },
    }
}
</script>

<style lang="" scoped>
</style>