<template>
    <Card>
        <p slot="title">添加招聘</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
            style="padding-bottom: 30px;"
        >
            <!-- 
			$items['name']=岗位名称
			$items['amount']=招聘人数
			$items['address']=工作地点
			$items['sex']=性别 2=不限 0=女士1=先生
			$items['age']=年龄要求
			$items['degree']=学历要求
			$items['workage']=工作经验
			$items['m_pay']=月薪
			$items['workkind']=工作性质0=全职 1=兼职 2=不限
			$items['yc']=是否隐藏 1=隐藏
			$items['message']=招聘内容
			$items['day']=发布时间 2020-05-18
			$items['groupid']=所属分类
			{
				name: "a1",
				amount:"10",
				address: "北京市朝阳区",
				sex:"1",
				age:"18",
				degree:"专科",
				workage:"3",
				m_pay:"10000",
				workkind: "0",
				yc:"0",
				message:"手工做网站，接单，外包",
				day:"2020-6-22",
				groupid:"21"
			}
			
		 -->
            <Form-item label="岗位名称" prop="name">
                <Input v-model="formValidate.name"></Input>
            </Form-item>
            <Form-item label="招聘人数" prop="amount">
                <Input v-model="formValidate.amount"></Input>
            </Form-item>
            <Form-item label="工作地点" prop="address">
                <Input v-model="formValidate.address"></Input>
            </Form-item>
            <Form-item label="性别" prop="sex">
                <RadioGroup v-model="formValidate.sex">
                    <Radio label="2">不限</Radio>
                    <Radio label="0">女性</Radio>
                    <Radio label="1">男性</Radio>
                </RadioGroup>
            </Form-item>
            <Form-item label="年龄要求" prop="age">
                <Input v-model="formValidate.age" style="width: 200px;"></Input
                ><span class="notes">空则默认为不限</span>
            </Form-item>
            <Form-item label="学历要求" prop="degree">
                <Input
                    v-model="formValidate.degree"
                    style="width: 200px;"
                ></Input
                ><span class="notes">空则默认为不限</span>
            </Form-item>
            <Form-item label="工作经验" prop="workage">
                <Input
                    v-model="formValidate.workage"
                    style="width: 200px;"
                ></Input
                ><span class="notes">年</span>
                <span class="notes">空则默认为不限</span>
            </Form-item>
            <Form-item label="月薪" prop="m_pay">
                <Input v-model="formValidate.m_pay"></Input>
            </Form-item>
            <Form-item label="工作性质" prop="workkind">
                <RadioGroup v-model="formValidate.workkind">
                    <Radio label="0">全职</Radio>
                    <Radio label="1">兼职</Radio>
                    <Radio label="2">不限</Radio>
                </RadioGroup>
            </Form-item>
            <Form-item label="发布日期" prop="day">
                <DatePicker
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder=""
                    style="width: 200px;"
                    :value="formValidate.day"
                    @on-change="changeDateTime"
                ></DatePicker>
            </Form-item>
            <Form-item label="所属分类" prop="groupid">
                <Select v-model="formValidate.groupid" style="width: 200px;">
                    <template v-for="item in classidList">
                        <Option :value="item.id">{{ item.groupname }}</Option>
                    </template>
                </Select>
                <Buttons
                    type="info"
                    style="margin: 0 10px;"
                    @click="isModal = true"
                    >添加分类</Buttons
                >
            </Form-item>
            <Form-item label="是否隐藏" prop="yc">
                <RadioGroup v-model="formValidate.yc">
                    <Radio label="0">显示</Radio>
                    <Radio label="1">隐藏</Radio>
                </RadioGroup>
            </Form-item>
            <Form-item label="招聘内容" prop="message">
                <editor
                    ref="editor"
                    :value="editorContent"
                    @on-change="handleChange"
                />
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
                <Button @click="$router.go(-1)" style="margin-left: 8px;"
                    >取消</Button
                >
            </Form-item>
        </Form>
        <Modal
            v-model="isModal"
            title="添加分类"
            @on-ok="addJobClass"
            @on-cancel=""
            :loading="classLoad"
        >
            <label style="display: block; margin-bottom: 10px;">
                <span>分类名称：</span>
                <Input
                    type="text"
                    style="width: 200px;"
                    v-model="classname"
                ></Input>
            </label>
        </Modal>
    </Card>
</template>

<script>
import fileExplorer from '@/components/fileExplorer/fileExplorer';
import Editor from '@/components/textEditor/editor.vue'
import { formatDate } from '@/libs/tools'
import Buttons from '@/components/buttons'
/*
	获取分类api
	保存信息
	必填项：
		全部
	
*/
export default {
    components: {
        Editor,
        fileExplorer,
        Buttons
    },
    data () {
        return {
            classname: "",
            classLoad: true,
            isModal: false,
            options: {
                mode: "single",
                _displayMode: 'grid',  // grid 和 list
                type: '',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            formValidate: {
                id: 0,
                name: "",
                amount: "",
                address: "",
                sex: "2",
                age: "",
                degree: "",
                workage: "",
                m_pay: "",
                workkind: "0",
                yc: "0",
                message: "",
                day: "",
                groupid: ""
            },
            loading: false,
            ruleValidate: {
                name: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                m_pay: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                day: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                groupid: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                message: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
            },
            jobid: "",
            editorContent: "",
            classidList: [],
            nowDate: ""
        }
    },
    created () {
        this.fetchData();
    },
    watch: {
    },
    methods: {
        fetchData () {
            this.jobid = this.$route.params.jobid ? parseInt(this.$route.params.jobid) : 0;
            if (this.jobid) {
                this.formValidate.id = this.jobid;
                this.dataInitial();
            } else {
                this.getClass();
            }
            this.nowDate = formatDate(new Date(), 'yyyy-MM-dd');
            this.formValidate.day = this.nowDate;

        },
        dataInitial () {
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=job_get",
                params: {
                    id: this.jobid
                }
            }).then((res) => {
                var data = res.data.body;
                this.formValidate = {
                    id: this.jobid,
                    name: data.name,
                    amount: data.amount,
                    address: data.address,
                    sex: data.sex,
                    age: data.age,
                    degree: data.degree,
                    workage: data.workage,
                    m_pay: data.m_pay,
                    workkind: data.workkind,
                    yc: data.yc,
                    message: data.message,
                    day: data.day || this.nowDate,
                    groupid: data.groupid
                }
                this.changeContent(this.formValidate.message);
                console.log(res);
                this.getClass();
            })
        },
        getClass () {
            var that = this;
            this.$http.request({
                method: "POST",
                url: "/api_edit.php?action=job_groupList",
                params: {}
            }).then((res) => {
                this.classidList = res.data.body || [];
                this.$nextTick(() => {
                    this.classidList.length && (this.formValidate.groupid = this.formValidate.groupid ? this.formValidate.groupid : this.classidList[0].id);
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
            this.$router.push({})
        },
        handleChange (html, text) {
            this.formValidate.message = html
        },
        changeContent (content) {
            this.$refs.editor.setHtml(content)
        },
        changeDateTime: function (time) {
            this.formValidate.day = time;
            console.log(time);
        },
        handleSubmit: function (name) {
            var _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var apiurl = '/api_edit.php?action=job_edit';
                    var params = {},
                        data = this.formValidate;
                    params = {
                        id: data.id,
                        items: data
                    }
                    console.log(params);
                    //  _this.$qs.stringify(data)

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
                            desc: '无法访问服务器,请重试'
                        })
                        _this.loading = false
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            });
        },
        addJobClass () {
            if (this.classname == '') {
                this.$Message.error('请输入分类名称');
                this.classLoad = false;
                this.$nextTick(() => {
                    this.classLoad = true;
                });
                return false
            }
            this.$http.request({
                url: "/api_edit.php?action=job_groupADD",
                params: {
                    groupname: this.classname
                }
            }).then((res) => {
                this.classLoad = false;
                this.isModal = false;
                this.classname = "";
                this.$Message.info("添加成功");
                this.getClass();
            }).catch((response) => {
                console.log(response);
                this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                this.$Loading.error();
            });
        }

    }
}
</script>

<style>
</style>