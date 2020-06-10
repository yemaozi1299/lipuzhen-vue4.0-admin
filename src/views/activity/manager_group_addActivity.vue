<template>
    <Card>
        <p slot="title">添加拼团活动</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="200"
        >
            <Form-item
                label="拼团名称："
                style="margin-top:15px"
                prop="activity_name"
            >
                <Input
                    type="text"
                    v-model="formValidate.activity_name"
                    size="small"
                    style="width:200px"
                ></Input
                ><span class="normal-tip"> 仅后台展示，方便管理</span>
            </Form-item>
            <Form-item
                label="拼团人数(可添加多个)："
                style="margin-top:15px"
                prop="join_num"
            >
                <div
                    class="join-num-item"
                    v-for="(item, index) in group_join_num"
                >
                    <Input
                        type="text"
                        v-model="item.num"
                        style="width:70px"
                        size="small"
                    ></Input>
                    <span
                        v-if="group_join_num.length > 1"
                        style="display:inline-block;margin:0 5px;color:#cacaca;cursor: pointer;"
                        @click="delectJoin(index)"
                        ><Icon type="ios-backspace-outline" size="16"
                    /></span>
                </div>
                <Button type="primary" @click="addJoin">添加</Button>
            </Form-item>
            <Form-item
                label="每个拼团的有效时间："
                style="margin-top:15px"
                prop="time_limit"
            >
                <TimePicker
                    format="HH:mm"
                    style="width: 112px"
                    size="small"
                    v-model="formValidate.time_limit"
                ></TimePicker>
            </Form-item>
            <Form-item
                label="活动时间："
                style="margin-top:15px"
                prop="activity_tiem"
            >
                <div class="activity-time-div">
                    <span>开始时间 </span>
                    <DatePicker
                        type="date"
                        style="width: 112px"
                        size="small"
                        format="yyyy-MM-dd"
                        @on-change="timeStart"
                    >
                    </DatePicker>
                </div>
                <div class="activity-time-div">
                    <span>结束时间 </span>
                    <RadioGroup v-model="end_panel">
                        <div style="margin-bottom:5px;">
                            <Radio label="0">长期</Radio>
                        </div>
                        <div>
                            <Radio label="1">定时结束</Radio>
                            <DatePicker
                                type="date"
                                style="width: 112px"
                                size="small"
                                format="yyyy-MM-dd"
                                @on-change="timeEnd"
                            ></DatePicker>
                        </div>
                    </RadioGroup>
                </div>
            </Form-item>
            <Form-item
                label="每位用户可同时进行的团数："
                style="margin-top:15px;"
                prop="user_limit_join"
            >
                <Input
                    type="text"
                    v-model="formValidate.user_limit_join"
                    size="small"
                    style="width:50px"
                ></Input
                ><span class="normal-tip">
                    为保证商家利益，请对团数进行限制。注：已成功或已失败的团不计入同时进行的团数</span
                >
            </Form-item>
            <Form-item
                label="每位用户每次参团时可购买件数："
                style="margin-top:15px"
                prop="user_limit_buy"
            >
                <Input
                    type="text"
                    v-model="formValidate.user_limit_buy"
                    size="small"
                    style="width:50px"
                ></Input
                ><span class="normal-tip">
                    为保证商家利益，请对用户参团时可购买件数进行限制。</span
                >
            </Form-item>
            <Form-item
                label="是否可与优惠券叠加用："
                style="margin-top:15px"
                prop="youhui"
            >
                <i-switch v-model="can_use_youhui"></i-switch>
            </Form-item>
        </Form>
        <div class="stored-btn">
            <Button
                type="primary"
                @click="handleSubmit('formValidate')"
                style="margin-right:10px"
                >提交</Button
            >
            <Button @click="$router.go(-1)">取消</Button>
            <span class="beizu"
                ><label> 请注意： </label>提交后将不能再修改</span
            >
        </div>
    </Card>
</template>
<script type="text/javascript">
export default {
    data: function () {
        var _this = this;
        var verifyCardInfo = function (rule, value, callback) {
            switch (rule.field) {
                case 'activity_name':
                    // console.log(value);
                    if (!value) {
                        _this.$Message.warning('名称不能为空');
                        return callback(new Error('名称不能为空'));
                    }
                    callback();
                    break;
                case 'join_num':
                    var res = [];

                    for (var i = 0; i < _this.group_join_num.length; i++) {
                        // console.log(_this.group_join_num[i].num);
                        if (_this.group_join_num[i].num == "") {
                            _this.$Message.warning('拼团人数不能有空');
                            return callback(new Error('拼团人数不能有空'));
                        } else if (/^[a-z]$/.test(_this.group_join_num[i].num)) {
                            _this.$Message.warning('输入格式不正确');
                            return callback(new Error('输入格式不正确'));
                        } else {
                            res.push(_this.group_join_num[i].num);
                        }
                    }
                    var s = res.join(',') + ',';
                    for (var i = 0; i < res.length; i++) {
                        if (s.replace(res[i], "").indexOf("," + res[i] + ",") > -1) {
                            console.log(s)
                            _this.$Message.warning('拼团人数不能重复');
                            return callback(new Error('拼团人数不能重复'));
                        }
                    }

                    _this.formValidate.group_join_num = res;
                    callback();
                    break;

                case 'activity_tiem':
                    if (!_this.formValidate.activity_time_start) {
                        _this.$Message.warning('开始时间不能为空');
                        return callback(new Error('开始时间不能为空'));
                    } else if (_this.end_panel == 1 && !_this.formValidate.activity_time_end) {
                        _this.$Message.warning('结束时间不能为空');
                        return callback(new Error('结束时间不能为空'));
                    } else if (_this.end_panel == 0) {
                        _this.formValidate.activity_time_end = 0;
                    }
                    callback();
                    break;
                case 'youhui':
                    _this.can_use_youhui ? _this.formValidate.can_use_youhui = 1 : _this.formValidate.can_use_youhui = 0;
                    callback();
                    break;
            }
        }
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            formValidate: {
                activity_name: '',
                group_join_num: [],
                time_limit: '',
                activity_time_start: '',
                activity_time_end: 0,
                user_limit_join: '',
                user_limit_buy: '',
                can_use_youhui: false
            },
            group_join_num: [
                { num: "" }
            ],
            can_use_youhui: false,
            end_panel: '0',
            ruleValidate: {
                activity_name: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                join_num: [
                    { validator: verifyCardInfo, required: true, }
                ],
                time_limit: [
                    { required: true, message: '时间不能为空', trigger: 'blur' }
                ],
                activity_tiem: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                user_limit_join: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
                user_limit_buy: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
                youhui: [
                    { validator: verifyCardInfo, }
                ]

            }
        }
    },
    methods: {
        timeStart: function (data) {
            this.formValidate.activity_time_start = data;
        },
        timeEnd: function (data) {
            this.formValidate.activity_time_end = data;
        },
        addJoin: function () {
            this.group_join_num.push({
                num: ""
            });
        },
        delectJoin: function (i) {
            this.group_join_num.splice(i, 1);
        },
        handleSubmit: function (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    _this.addActiveity();
                }
            });
        },
        addActiveity: function () {
            var _this = this;

            /*添加团购  $info['groupbuyname']=团购名称    
            $info['user_limit_join']=每位用户可同时进行的团数 
            num_of_people  拼团人数
            $info['user_limit_buy']=每位用户每次参团时可购买件数 
            $info['limit_time']=拼团时限    
            $info['start_date']=开始时间    
            $info['end_date']=结束时间为0则长期有效    
            $info['can_use_youhui']=是否可用优惠券
            formValidate:{
                activity_name:'',
                group_join_num: [],
                time_limit: '',
                activity_time_start: '',
                activity_time_end: '',
                user_limit_join: '',
                user_limit_buy: '',
                can_use_youhui: false
            },

            */

            var params = {
                action: 'groupbuy_add',
                appid: this.vueAppid,
                info: {
                    groupbuyname: this.formValidate.activity_name,
                    num_of_people: this.formValidate.group_join_num,
                    limit_time: this.formValidate.time_limit,
                    start_date: this.formValidate.activity_time_start,
                    end_date: this.formValidate.activity_time_end,
                    user_limit_join: this.formValidate.user_limit_join,
                    user_limit_buy: this.formValidate.user_limit_buy,
                    can_use_youhui: this.formValidate.can_use_youhui
                }
            };
            this.$http.post("/block/api_edit.php", _this.$qs.stringify(params)).then(function (response) {
                // console.log(response);
                if (response.data.status != 1) {
                    return _this.$Message.error(response.data.message);
                }
                _this.$Message.success("提交成功");
                _this.$router.go(-1);
            }).catch(function (response) {
                console.log(response);
                _this.$Loading.error();
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.loading = false;
            });
        }
    }
}
</script>

<style type="text/css">
.field-list {
    margin-left: 50px;
}
.normal-tip {
    display: inline-block;
    margin-left: 5px;
    color: #9299b1;
    font-size: 12px;
}
.join-num-item {
    display: inline-block;
    margin-right: 15px;
}
.activity-time-div {
    margin-bottom: 10px;
}
.activity-time-div > span {
    display: inline-block;
    margin-right: 10px;
}
.stored-btn {
    margin-top: 20px;
    margin-left: 250px;
}
.beizu {
    margin-left: 30px;
    font-size: 12px;
}
.beizu label {
    color: #ed4014;
}
</style>