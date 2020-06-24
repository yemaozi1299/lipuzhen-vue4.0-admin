<template>
    <div style="background-color:#f2f2f0;height:100%;overflow: auto;">
        <div class="manager-page-body">
            <div class="phone-preview-area">
                <div class="phone-preview-title">手机预览：</div>
                <div id="coupon-ticket" class="phone-preview-ticket">
                    <div
                        class="top-section"
                        :style="{ 'border-top-color': formValidate.list_color }"
                    >
                        <div class="detail-info">
                            <div class="name">{{ formValidate.title }}</div>
                            <div class="use-tiaojian">
                                使用条件：<span class="tiaojian-text">{{
                                    tiaojian
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="background-word-area"
                            :style="{ 'border-color': formValidate.list_color }"
                        >
                            <div
                                class="background-circle"
                                :style="{
                                    'background-color': formValidate.list_color
                                }"
                            ></div>
                            <!--  满减券    折扣券    代金券    兑换券  储值券    通用券 -->
                            <div
                                class="background-word"
                                v-if="formValidate.type == 0"
                            >
                                满
                            </div>
                            <div
                                class="background-word"
                                v-if="formValidate.type == 1"
                            >
                                折
                            </div>
                            <div
                                class="background-word"
                                v-if="formValidate.type == 2"
                            >
                                代
                            </div>
                            <div
                                class="background-word"
                                v-if="formValidate.type == 3"
                            >
                                兑
                            </div>
                            <div
                                class="background-word"
                                v-if="formValidate.type == 4"
                            >
                                储
                            </div>
                            <div
                                class="background-word"
                                v-if="formValidate.type == 5"
                            >
                                通
                            </div>
                        </div>
                        <div
                            class="function-btn"
                            :style="{
                                'background-color': formValidate.list_color
                            }"
                        >
                            立即领取
                        </div>
                    </div>
                    <div class="bottom-section">
                        <div class="">
                            <span class="date-duration"
                                >领取{{
                                    react == 0 ? "当" : react
                                }}天后生效,有效期{{ expire }}天</span
                            >
                            <span class="other-case"> </span>
                            <span class="time-duration"></span>
                        </div>
                    </div>
                </div>

                <!--******************************分割线*****************************************-->

                <div class="phone-preview-content">
                    <div class="phone-head"></div>
                    <div class="phone-container">
                        <div
                            class="page"
                            id="coupon-detail"
                            :style="{
                                'background-color': formValidate.background
                            }"
                        >
                            <div class="coupon-detail-wrap">
                                <div class="top-section">
                                    <img
                                        class="logo"
                                        :src="moves + logo"
                                        alt=""
                                    />
                                    <div class="name">{{ appname }}</div>
                                    <div class="share"></div>
                                </div>
                                <div class="middle-section">
                                    <div class="title">
                                        {{ formValidate.title }}
                                    </div>
                                    <div class="sub-title">
                                        {{ formValidate.sub_title }}
                                    </div>
                                    <div
                                        class="receive-btn"
                                        :style="{
                                            'background-color':
                                                formValidate.button_color
                                        }"
                                    >
                                        立即领取
                                    </div>
                                    <div class="detail-item tiaojian">
                                        <div class="item-name">使用条件：</div>
                                        <div class="item-content">
                                            {{ tiaojian }}
                                        </div>
                                    </div>
                                    <div class="detail-item time">
                                        <div class="item-name">可用时间：</div>
                                        <div class="item-content">
                                            <div class="date-duration"></div>
                                            <div class="other-case">
                                                除法定节假日 周一至周五
                                            </div>
                                            <div class="time-duration"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bottom-section">
                                    <div
                                        class="detail-item address"
                                        style="display:block"
                                    >
                                        <div class="item-name">店铺地址：</div>
                                        <div class="item-content"></div>
                                    </div>
                                    <div
                                        class="detail-item phone"
                                        style="display:block"
                                    >
                                        <div class="item-name">联系电话：</div>
                                        <div class="item-content"></div>
                                    </div>
                                    <div class="goto-homepage">
                                        <div class="goto-homepage-text">
                                            返回首页
                                        </div>
                                        <div class="icon-rightarrow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-edit-area">
                <div class="info-edit-title">优惠券设置</div>
                <div class="info-edit-content">
                    <Form
                        ref="formValidate"
                        :model="formValidate"
                        :rules="ruleValidate"
                        :label-width="150"
                    >
                        <Form-item label="应用名称：" style="" prop="">{{
                            appname
                        }}</Form-item>
                        <Form-item label="优惠券样式：" style="">
                            <label for=""
                                ><span>列表颜色：</span
                                ><ColorPicker
                                    v-model="formValidate.list_color"
                                    alpha
                            /></label>
                            <label for=""
                                ><span>按钮颜色：</span
                                ><ColorPicker
                                    v-model="formValidate.button_color"
                                    alpha
                            /></label>
                            <label for=""
                                ><span>背景颜色：</span
                                ><ColorPicker
                                    v-model="formValidate.background"
                                    alpha
                            /></label>
                        </Form-item>
                        <Form-item label="优惠券标题：" style="" prop="title">
                            <Input
                                type="text"
                                style="width:200px"
                                v-model="formValidate.title"
                                size="small"
                            ></Input>
                            <div style="line-height:24px;width:300px">
                                建议填写“10元代金劵”、“满60元立减10元”
                                等易于理解的具体优惠内容，限9个字以内
                            </div>
                        </Form-item>
                        <Form-item label="优惠券副标题：" style="">
                            <Input
                                type="text"
                                style="width:200px"
                                v-model="formValidate.sub_title"
                                size="small"
                            ></Input>
                        </Form-item>
                        <Form-item label="优惠券类型：" style="" prop="type">
                            <RadioGroup v-model="type">
                                <!--  满减券    折扣券    代金券    兑换券  储值券    通用券 -->
                                <Radio label="0" disabled>满减券</Radio>
                                <Radio label="1" disabled>折扣券</Radio>
                                <Radio label="2" disabled>代金券</Radio>
                                <!-- <Radio label="3">兑换券</Radio> -->
                                <!-- <Radio label="4">储值券</Radio> -->
                                <!-- <Radio label="5">通用券</Radio> -->
                            </RadioGroup>
                            <div class="coupon-type-content">
                                <div v-if="formValidate.type == 0">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >优惠力度:</span
                                        >
                                        <span>满</span>
                                        <Input
                                            type="text"
                                            style="width:70px"
                                            v-model="formValidate.tiaojian"
                                            size="small"
                                            disabled
                                        ></Input>
                                        <span>元，减</span>
                                        <Input
                                            type="text"
                                            style="width:70px"
                                            v-model="formValidate.value"
                                            size="small"
                                            disabled
                                        ></Input>
                                        <span>元</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all" disabled
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="0" disabled
                                                        >部分商品</Radio
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="item in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.url"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="formValidate.type == 1">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >折扣力度:</span
                                        >
                                        <span>打</span>
                                        <Input
                                            type="text"
                                            style="width:70px"
                                            v-model="formValidate.value"
                                            size="small"
                                            disabled
                                        ></Input>
                                        <span>折</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all" disabled
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="0" disabled
                                                        >部分商品</Radio
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="item in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.url"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="formValidate.type == 2">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >使用条件:</span
                                        >
                                        <span>面值 </span>
                                        <Input
                                            type="text"
                                            style="width:70px"
                                            v-model="formValidate.value"
                                            size="small"
                                            disabled
                                        ></Input>
                                        <span>元</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all" disabled
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="0" disabled
                                                        >部分商品</Radio
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="item in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.url"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="formValidate.type == 5">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >使用条件:</span
                                        >
                                        <Input
                                            type="text"
                                            v-model="
                                                formValidate.extra_condition
                                            "
                                            size="small"
                                            style="width:120px"
                                            disabled
                                        ></Input>
                                    </div>
                                </div>
                            </div>
                        </Form-item>
                        <Form-item
                            label="可领取时间："
                            prop="get_time"
                            style=""
                        >
                            <DatePicker
                                type="date"
                                @on-change="start_get_time"
                                :value="formValidate.start_get_time"
                                style="width: 150px"
                                format="yyyy-MM-dd"
                                size="small"
                                disabled
                            ></DatePicker>
                            -
                            <DatePicker
                                :value="formValidate.end_get_time"
                                type="date"
                                @on-change="end_get_time"
                                style="width: 150px"
                                format="yyyy-MM-dd"
                                size="small"
                            ></DatePicker>
                        </Form-item>
                        <Form-item label="有效期：" style="" prop="expire">
                            <RadioGroup v-model="expire_time_type">
                                <div>
                                    <Radio label="0" disabled>固定时间</Radio>
                                    <DatePicker
                                        type="date"
                                        :value="formValidate.start_use_date"
                                        @on-change="start_use_date"
                                        style="width: 120px"
                                        size="small"
                                        disabled
                                    ></DatePicker>
                                    -
                                    <DatePicker
                                        type="date"
                                        :value="formValidate.end_use_date"
                                        @on-change="end_use_date"
                                        style="width: 120px"
                                        size="small"
                                    ></DatePicker>
                                </div>
                                <div>
                                    <Radio label="1" disabled>领取后</Radio>
                                    <Input
                                        type="text"
                                        v-model="formValidate.react"
                                        size="small"
                                        style="width:70px"
                                        disabled
                                    ></Input>
                                    天生效，有效期
                                    <Input
                                        type="text"
                                        v-model="formValidate.expire"
                                        size="small"
                                        style="width:70px"
                                        disabled
                                    ></Input>
                                    天
                                </div>
                            </RadioGroup>
                        </Form-item>
                        <Form-item
                            label="可用时间："
                            prop="exclude_time"
                            style=""
                        >
                            <div class="select-time-checkbox">
                                <Checkbox v-model="exclude_holiday" disabled
                                    >除去法定节假日</Checkbox
                                >
                            </div>
                            <div class="select-time-checkbox">
                                <Checkbox v-model="exclude_weekend" disabled
                                    >周一至周五</Checkbox
                                >
                            </div>
                            <div class="time-slot">
                                <p>时间段</p>
                                <div>
                                    <TimePicker
                                        format="HH:mm"
                                        style="width: 80px"
                                        size="small"
                                        v-model="formValidate.start_use_time"
                                        disabled
                                    ></TimePicker>
                                    -
                                    <TimePicker
                                        format="HH:mm"
                                        style="width: 80px"
                                        size="small"
                                        v-model="formValidate.end_use_time"
                                        disabled
                                    ></TimePicker>
                                </div>
                            </div>
                        </Form-item>
                        <Form-item label="地址：" prop="" style="">
                            <Input
                                type="textarea"
                                v-model="formValidate.address"
                                size="small"
                                style="width:200px"
                            ></Input>
                        </Form-item>
                        <Form-item label="电话：" prop="" style="">
                            <Input
                                type="text"
                                v-model="formValidate.phone"
                                size="small"
                                style="width:170px"
                            ></Input>
                        </Form-item>
                        <Form-item label="库存：" prop="stock" style="">
                            <Input
                                type="text"
                                v-model="formValidate.stock"
                                size="small"
                                style="width:120px"
                            ></Input>
                            <span style="font-size:14px;"> 份</span>
                        </Form-item>
                        <!-- <Form-item label="获取途径：" prop="" style="">
				    		<Checkbox v-model="in_show_list" ></Checkbox>
				    		<span>允许用户自主领取</span>
				    		<p style="display: inline-block;margin-left:10px;color: #9299b1;font-size: 12px;">勾选后，优惠券将显示在领取列表中</p>
					    </Form-item> -->
                        <Form-item label="限制领取：" prop="limit_num" style="">
                            <Input
                                type="text"
                                v-model="formValidate.limit_num"
                                size="small"
                                style="width:100px"
                            ></Input>
                            张
                        </Form-item>
                    </Form>
                </div>
                <div class="info-edit-btn-panel">
                    <Button
                        type="primary"
                        @click="handleSubmit('formValidate')"
                        style="margin-right:10px"
                        >提交</Button
                    >
                    <Button @click="$router.go(-1)">取消</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data: function () {
        var that = this;
        var verifyCardInfo = function (rule, value, callback) {
            console.log(rule);
            switch (rule.field) {
                case "title":
                    if (!value) {
                        that.$Message.warning('标题不能为空');
                        return callback(new Error('标题不能为空'));
                    } else {
                        var title = value;
                        var titleLen = 0;
                        for (var i = 0; i < title.length; i++) {
                            var a = title.charAt(i);
                            if (a.match(/[^\x00-\xff]/ig) != null) {
                                titleLen += 2;
                            } else {
                                titleLen += 1;
                            }
                        }
                        if (titleLen > 18) {
                            that.$Message.warning('标题已超出限制字数，请删减！');
                            return callback(new Error('标题已超出限制字数，请删减！'));
                        } else {
                            callback()
                        }

                    }
                    break;
                case "type":
                    var tiaojian = that.formValidate.tiaojian,
                        value = that.formValidate.value;
                    if (that.type == 0) {
                        if (!tiaojian || !value) {
                            that.$Message.warning('请填写优惠券类型:满减券的优惠力度');
                            return callback(new Error('请填写优惠券类型:满减券的优惠力度'));
                        }
                        if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(tiaojian)) || !(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                            that.$Message.warning('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!');
                            return callback(new Error('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!'));
                        }
                    } else if (that.type == 1) {
                        if (!value) {
                            that.$Message.warning('请填写优惠券类型:折扣券的折扣力度');
                            return callback(new Error('请填写优惠券类型:折扣券的折扣力度'));
                        }
                        if (!(/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) || value > 9.9) {
                            that.$Message.warning('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!');
                            return callback(new Error('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!'));
                        }
                    } else if (that.type == 2) {
                        if (!value) {
                            that.$Message.warning('请填写优惠券类型:代金券的面值');
                            return callback(new Error('请填写优惠券类型:代金券的面值'));
                        }
                        if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                            that.$Message.warning('优惠券类型:代金券的面值必须为>=0的金额，精确到小数点后2位!');
                            return callback(new Error('优惠券类型:代金券的面值必须为>=0的金额，精确到小数点后2位!'));
                        }
                    } else if (that.type == 3) {

                    } else if (that.type == 4) {

                    } else if (that.type == 5) {

                    }
                    callback();
                    break;
                case "get_time":
                    var start = that.formValidate.start_get_time;
                    var end = that.formValidate.end_get_time;
                    if (!start || !end) {
                        that.$Message.warning('请选择可领取时间');
                        return callback(new Error('请选择可领取时间'));
                    }
                    callback();
                    break;
                case "expire":
                    var start_get_time = that.formValidate.start_get_time;   //领取日期
                    var end_get_time = that.formValidate.end_get_time;

                    var start_use_date = that.formValidate.start_use_date;   //可用日期
                    var end_use_date = that.formValidate.end_use_date;
                    var expire = that.formValidate.expire;
                    if (that.expire_time_type == 0) {
                        if (!start_use_date || !end_use_date) {
                            that.$Message.warning('请选择有效期');
                            return callback(new Error('请选择有效期'));
                        }
                        console.log(end_use_date, end_get_time);
                        if (end_use_date < end_get_time) {
                            that.$Message.warning('设置失败: 优惠券截止使用日期不可小于优惠券截止领取日期');
                            return callback(new Error('设置失败: 优惠券截止使用日期不可小于优惠券截止领取日期'));
                        }
                    } else {
                        if (!expire) {
                            that.$Message.warning('请填写有效期');
                            return callback(new Error('请填写有效期'));
                        }
                        that.formValidate.start_use_date = "1000-01-01";
                        that.formValidate.end_use_date = "9999-12-31";
                    }

                    callback();
                    break;
                case "exclude_time":
                    that.formValidate.exclude_holiday = that.exclude_holiday == true ? '1' : '0';
                    that.formValidate.exclude_weekend = that.exclude_weekend == true ? '1' : '0';
                    // that.formValidate.in_show_list = that.in_show_list == true ? '1' : '0';
                    callback();
                    break;
                case "limit_num":
                    if (!that.formValidate.limit_num) {
                        that.$Message.warning('限制领取张数不能为空');
                        return callback(new Error('限制领取张数不能为空'));
                    } else if (that.formValidate.limit_num == 0) {
                        that.$Message.warning('限制领取张数必须大于0');
                        return callback(new Error('限制领取张数必须大于0'));
                    }
                    callback();
                    break;
            }
        }
        return {
            moves: window.vueAppUrl + '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            react: 1,
            expire: 12,
            logo: this.$cookieStore.get("logo"),
            appname: this.$cookieStore.get("name"),
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            data: {
                body: []
            },
            formValidate: {
                background: "rgb(234, 235, 237)",   //优惠券整体背景颜色
                button_color: "rgb(253, 68, 91)",   //优惠券领取按钮颜色
                list_color: "rgb(253, 68, 91)",
                title: '优惠券标题',
                sub_title: '优惠券副标题',
                type: '0',
                tiaojian: '0.00',
                extra_goods: '',
                start_get_time: '',
                end_get_time: '',
                start_use_date: '',
                end_use_date: '',
                react: '',
                expire: '',
                exclude_holiday: "0",            //是否除去法定节假日
                exclude_weekend: "0",            //是否除去周一至周五
                start_use_time: '',
                end_use_time: '',
                // in_show_list: '',
                address: '',
                limit_num: '1',
                value: '0.00',
                extra_condition: ''
            },
            exclude_holiday: "0",            //是否除去法定节假日
            exclude_weekend: "0",            //是否除去周一至周五
            // in_show_list: '',
            expire_time_text: '',
            expire_time_type: '0',
            daterange: '',
            extra_goods: '',
            goods_item: [],
            type: '0',
            // tiaojian: '满0元，立减0元',
            ruleValidate: {
                title: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                style: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                type: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                get_time: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                expire: [
                    { validator: verifyCardInfo, required: true, trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '请输入库存', trigger: 'blur' }
                ],
                exclude_time: [
                    { validator: verifyCardInfo, trigger: 'blur' }
                ],
                limit_num: [
                    { required: true, validator: verifyCardInfo, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        tiaojian: function () {
            switch (this.type) {
                case '0':
                    return '满' + this.formValidate.tiaojian + '立减' + this.formValidate.value + '元';
                    break;
                case '1':
                    return '打' + this.formValidate.value + '折';
                    break;
                case '2':
                    return '可抵扣' + this.formValidate.value + '元';
                    break;
                case '5':
                    return this.formValidate.value;
                    break;
            }
            this.formValidate.type = this.type;
        }
    },
    watch: {
        type: function (val) {
            // switch(val){
            // 	case '0':
            // 		this.tiaojian = '满' + this.formValidate.tiaojian + '立减' + this.formValidate.value + '元';
            // 	break;
            // 	case '1':
            // 		this.tiaojian = '打' + this.formValidate.value + '折';
            // 	break;
            // 	case '2':
            // 		this.tiaojian = '可抵扣' + this.formValidate.value + '元';
            // 	break;
            // 	case '5':
            // 		this.tiaojian = this.formValidate.value;
            // 	break;
            // }
            // this.formValidate.type = val;
        },
        expire_time_type: function (val) {
            switch (val) {
                case '0':
                    this.expire_time_text = this.formValidate.start_use_date + '至' + this.formValidate.end_use_date;
                    break;
                case '1':
                    this.expire_time_text = '领取' + (this.formValidate.react == 0 ? '当' : this.formValidate.react) + '天后生效,有效期' + this.formValidate.expire + '天';
                    // this.formValidate.start_use_date = '1000-01-01';
                    // this.formValidate.end_use_date = '9999-12-31';
                    break;

            }
        },
        extra_goods: function (val) {

        }

    },
    created: function () {
        this.get();

    },
    methods: {
        start_get_time: function (val) {
            this.formValidate.start_get_time = val;
        },
        end_get_time: function (val) {
            this.formValidate.end_get_time = val;
        },
        start_use_date: function (val) {
            this.formValidate.start_use_date = val;
        },
        end_use_date: function (val) {
            this.formValidate.end_use_date = val;
        },
        get: function () {
            var _this = this;
            var data = {
                action: 'youhui_getone',
                appid: this.vueAppid,
                id: this.$route.query.user
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.body && response.data.body.length >= 1) {
                    _this.formValidate = response.data.body[0];
                    _this.formValidate.extra_goods ? (_this.extra_goods = '0') : (_this.extra_goods = 'all');
                    _this.exclude_holiday = _this.formValidate.exclude_holiday == '1' ? true : false;
                    _this.exclude_weekend = _this.formValidate.exclude_weekend == '1' ? true : false;
                    // _this.in_show_list = _this.formValidate.in_show_list == '1' ? true : false;
                    _this.expire_time_type = _this.formValidate.expire == '-1' ? '0' : '1'
                    var item = eval(_this.formValidate.extra_goods) || [];
                    for (var i = 0; i < item.length; i++) {
                        _this.getGoodsList(item[i]);
                    }
                } else {
                    _this.$Message.info(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        save: function () {
            var _this = this;
            // this.data.body.push(this.formValidate);
            var jsondata = JSON.stringify(this.data);
            var data = {
                action: 'youhui_edit',
                id: this.$route.query.user,
                info: this.formValidate,
                appid: this.vueAppid
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.$Message.info(response.data.message);
                    _this.$router.go(-1)
                } else {
                    _this.$Message.error(response.data.message);
                }
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        getGoodsList: function (goodsid) {
            var _this = this;
            var data = {
                action: 'goods_getone',
                goodsid: goodsid,
                appid: this.vueAppid
            };
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.goods_item.push({
                        name: response.data.goodsitem.name,
                        url: response.data.goodsitem.face[0].url
                    });
                } else {
                    _this.$Message.error(response.data.message);
                }
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
                _this.$Loading.error();
            });
        },
        handleSubmit: function (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    _this.save();
                }
            });

        }
    }
}
</script>

<style type="text/css">
.select-goods-item {
    box-sizing: border-box;
    margin: 10px 15px;
    height: 60px;
    width: 250px;
}
.select-goods-item .img-box {
    display: inline-block;
    vertical-align: top;
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
}
.select-goods-item .img-box > img {
    width: 100%;
    height: 100%;
}
.select-goods-item .info-box {
    display: inline-block;
    vertical-align: top;
    margin-left: 8px;
    height: 60px;
    width: 150px;
}
.select-goods-item .info-box .goods-name {
    max-width: 200px;
    margin-top: 5px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 20px;
}
</style>