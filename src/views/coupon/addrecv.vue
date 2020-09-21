<template>
    <div style="background-color: #f2f2f0; height: 100%; overflow: auto">
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
                                    'background-color': formValidate.list_color,
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
                                'background-color': formValidate.list_color,
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
                                'background-color': formValidate.background,
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
                                                formValidate.button_color,
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
                                                {{
                                                    exclude_weekend == true
                                                        ? "周一至周五"
                                                        : ""
                                                }}
                                            </div>
                                            <div
                                                class="time-duration"
                                                v-if="
                                                    formValidate.start_use_time &&
                                                    formValidate.end_use_time
                                                "
                                            >
                                                {{
                                                    formValidate.start_use_time
                                                }}
                                                -
                                                {{ formValidate.end_use_time }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bottom-section">
                                    <div
                                        class="detail-item address"
                                        style="display: block"
                                    >
                                        <div class="item-name">店铺地址：</div>
                                        <div class="item-content">
                                            {{ formValidate.address }}
                                        </div>
                                    </div>
                                    <div
                                        class="detail-item phone"
                                        style="display: block"
                                    >
                                        <div class="item-name">联系电话：</div>
                                        <div class="item-content">
                                            {{ formValidate.phone }}
                                        </div>
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
                        <!-- <Form-item
                            label="应用图标："
                            style="margin-top:10px"
                            prop=""
                        >
                            <img
                                :src="moves + logo"
                                alt=""
                                style="width:80px;height:80px;border:1px solid #eee"
                            />
                        </Form-item> -->
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
                                style="width: 200px"
                                v-model="formValidate.title"
                                size="small"
                            ></Input>
                            <div style="line-height: 24px; width: 300px">
                                建议填写“10元代金劵”、“满60元立减10元”
                                等易于理解的具体优惠内容，限9个字以内
                            </div>
                        </Form-item>
                        <Form-item label="优惠券副标题：" style="">
                            <Input
                                type="text"
                                style="width: 200px"
                                v-model="formValidate.sub_title"
                                size="small"
                            ></Input>
                        </Form-item>
                        <Form-item label="优惠券类型：" style="" prop="type">
                            <RadioGroup v-model="type">
                                <!--  满减券    折扣券    代金券    兑换券  储值券    通用券 -->
                                <Radio label="0">满减券</Radio>
                                <Radio label="1">折扣券</Radio>
                                <Radio label="2">代金券</Radio>
                                <!-- <Radio label="3">兑换券</Radio> -->
                                <!-- <Radio label="4">储值券</Radio> -->
                                <!-- <Radio label="5">通用券</Radio> -->
                            </RadioGroup>
                            <div class="coupon-type-content">
                                <div v-if="type == 0">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >优惠力度:</span
                                        >
                                        <span>满</span>
                                        <Input
                                            type="text"
                                            style="width: 70px"
                                            v-model="formValidate.tiaojian"
                                            size="small"
                                        ></Input>
                                        <span>元，减</span>
                                        <Input
                                            type="text"
                                            style="width: 70px"
                                            v-model="formValidate.value"
                                            size="small"
                                        ></Input>
                                        <span>元</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all"
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="1"
                                                        >部分商品</Radio
                                                    >
                                                    <span
                                                        class="part-set"
                                                        v-on:click="
                                                            isModel = true
                                                        "
                                                        >添加</span
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="(item,
                                                        index) in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.face"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                            <div
                                                                class="clear-goods-btn"
                                                                v-on:click="
                                                                    delectGoodsItem(
                                                                        index
                                                                    )
                                                                "
                                                            >
                                                                清除商品
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="type == 1">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >折扣力度:</span
                                        >
                                        <span>打</span>
                                        <Input
                                            type="text"
                                            style="width: 70px"
                                            v-model="formValidate.value"
                                            size="small"
                                        ></Input>
                                        <span>折</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all"
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="1"
                                                        >部分商品</Radio
                                                    >
                                                    <span
                                                        class="part-set"
                                                        v-on:click="
                                                            isModel = true
                                                        "
                                                        >添加</span
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="item in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.face"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                            <div
                                                                class="clear-goods-btn"
                                                            >
                                                                清除商品
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="type == 2">
                                    <div class="coupon-type-tiaojian">
                                        <span class="type-title"
                                            >使用条件:</span
                                        >
                                        <span>面值 </span>
                                        <Input
                                            type="text"
                                            style="width: 70px"
                                            v-model="formValidate.value"
                                            size="small"
                                        ></Input>
                                        <span>元</span>
                                    </div>
                                    <div class="coupon-goods-catgory">
                                        <label>可用商品</label>
                                        <div>
                                            <RadioGroup v-model="extra_goods">
                                                <div>
                                                    <Radio label="all"
                                                        >全部商品</Radio
                                                    >
                                                </div>
                                                <div>
                                                    <Radio label="1"
                                                        >部分商品</Radio
                                                    >
                                                    <span
                                                        class="part-set"
                                                        v-on:click="
                                                            isModel = true
                                                        "
                                                        >添加</span
                                                    >
                                                    <div
                                                        class="select-goods-item"
                                                        v-for="item in goods_item"
                                                    >
                                                        <div class="img-box">
                                                            <img
                                                                :src="item.face"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div class="info-box">
                                                            <p
                                                                class="goods-name"
                                                            >
                                                                {{ item.name }}
                                                            </p>
                                                            <div
                                                                class="clear-goods-btn"
                                                            >
                                                                清除商品
                                                            </div>
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
                                            v-model="formValidate.value"
                                            size="small"
                                            style="width: 120px"
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
                                    <Radio label="0">固定时间</Radio>
                                    <DatePicker
                                        type="date"
                                        @on-change="start_use_date"
                                        style="width: 120px"
                                        size="small"
                                    ></DatePicker>
                                    -
                                    <DatePicker
                                        type="date"
                                        @on-change="end_use_date"
                                        style="width: 120px"
                                        size="small"
                                    ></DatePicker>
                                </div>
                                <div>
                                    <Radio label="1">领取后</Radio>
                                    <Input
                                        type="text"
                                        v-model="formValidate.react"
                                        size="small"
                                        style="width: 70px"
                                    ></Input>
                                    天生效，有效期
                                    <Input
                                        type="text"
                                        v-model="formValidate.expire"
                                        size="small"
                                        style="width: 70px"
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
                            <!-- <div class="select-time-checkbox"><Checkbox v-model="exclude_holiday">除去法定节假日</Checkbox></div> -->
                            <div class="select-time-checkbox">
                                <Checkbox v-model="exclude_weekend"
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
                                    ></TimePicker>
                                    -
                                    <TimePicker
                                        format="HH:mm"
                                        style="width: 80px"
                                        size="small"
                                        v-model="formValidate.end_use_time"
                                    ></TimePicker>
                                </div>
                            </div>
                        </Form-item>
                        <Form-item label="地址：" prop="" style="">
                            <Input
                                type="textarea"
                                v-model="formValidate.address"
                                size="small"
                                style="width: 200px"
                            ></Input>
                        </Form-item>
                        <Form-item label="电话：" prop="" style="">
                            <Input
                                type="text"
                                v-model="formValidate.phone"
                                size="small"
                                style="width: 170px"
                            ></Input>
                        </Form-item>
                        <Form-item label="库存：" prop="stock" style="">
                            <Input
                                type="text"
                                v-model="formValidate.stock"
                                size="small"
                                style="width: 120px"
                            ></Input>
                            <span style="font-size: 14px"> 份</span>
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
                                style="width: 100px"
                            ></Input>
                            张
                        </Form-item>
                    </Form>
                </div>
                <div class="info-edit-btn-panel">
                    <Button
                        type="primary"
                        @click="handleSubmit('formValidate')"
                        style="margin-right: 10px"
                        >提交</Button
                    >
                    <Button @click="$router.go(-1)">取消</Button>
                </div>
            </div>
        </div>

        <!-- ****************************************************** -->

        <div id="goods-resource-dialog">
            <div
                class="webapp-box-bg hide-dialog"
                v-bind:class="{ 'animate-show': isModel }"
            ></div>
            <div
                class="webapp-box hide-dialog"
                v-bind:class="{ 'animate-show': isModel }"
            >
                <div class="webapp-box-header">
                    <div class="webapp-box-title">我的商品</div>
                    <span
                        class="webapp-box-close hide-dialog"
                        v-on:click="isModel = false"
                        >×</span
                    >
                </div>
                <div class="goods-type">
                    <span class="active" data-type="0" data-form="goods"
                        >电商</span
                    >
                    <!-- <span data-type="1" data-form="goods">预约</span>
			        <span data-type="3" data-form="goods">到店</span> -->
                </div>
                <div class="goods-filter">
                    <select
                        class="goods-filter-select"
                        v-model="classid"
                        v-on:change="getGoodsList"
                    >
                        <option value="0">全部</option>
                        <option :value="item.id" v-for="item in classList">
                            {{ item.classname }}
                        </option>
                    </select>
                    <div class="search">
                        <input
                            class="search-confirm-input"
                            type="text"
                            placeholder="商品搜索"
                            v-model="keyword"
                        />
                        <button class="search-confirm-btn">搜索</button>
                    </div>
                    <div class="add-goods goto-add-goods">
                        <!-- <span>+</span>添加商品 -->
                    </div>
                </div>
                <div class="webapp-box-content">
                    <div class="resource-list-wrap">
                        <div class="no-data" style="display: none">
                            暂无数据，
                            <span class="goto-add-goods">点击此处添加商品</span>
                        </div>
                        <ul class="goods-resource-list">
                            <li
                                class="webapp-li"
                                v-for="item in items"
                                v-on:click="webappList(item)"
                                v-bind:class="{
                                    selected: item.id == goodsid.id,
                                }"
                            >
                                <img :src="item.face" />
                                <div>
                                    <div class="webapp-title" title="车险">
                                        {{ item.name }}
                                    </div>
                                    <div class="webapp-title" title="100.00">
                                        价格：￥{{ item.price }}
                                    </div>
                                    <div class="webapp-title" title="1000">
                                        库存：{{ item.kc }}件
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="resource-list-page">
                        <Page
                            :total="total"
                            :current="page"
                            :page-size="10"
                            show-total
                            show-elevator
                            @on-change="skippage"
                        ></Page>
                    </div>
                </div>
                <div class="refresh">
                    <p>商品是否添加完成？</p>
                    <div class="btn-wrap">
                        <button class="btn-confirm mr-10 finish-add-btn">
                            是
                        </button>
                        <button class="btn-cancel hide-refresh-btn">否</button>
                    </div>
                </div>
                <div class="webapp-box-footer">
                    <div class="btn-wrap">
                        <button
                            class="btn-cancel mr-10 hide-dialog"
                            v-on:click="isModel = false"
                        >
                            取消
                        </button>
                        <button
                            class="btn-confirm confirm-btn"
                            v-on:click="addGoodsList"
                        >
                            确定
                        </button>
                    </div>
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
                    switch (that.type) {
                        case 0:
                            if (!tiaojian || !value) {
                                that.$Message.warning('请填写优惠券类型:满减券的优惠力度');
                                return callback(new Error('请填写优惠券类型:满减券的优惠力度'));
                            }
                            if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(tiaojian)) || !(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                that.$Message.warning('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!');
                                return callback(new Error('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!'));
                            }
                            break;
                        case 1:
                            if (!value) {
                                that.$Message.warning('请填写优惠券类型:折扣券的折扣力度');
                                return callback(new Error('请填写优惠券类型:折扣券的折扣力度'));
                            }
                            if (!(/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) || value > 9.9) {
                                that.$Message.warning('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!');
                                return callback(new Error('优惠券类型:满减券的优惠力度必须为>=0的金额，精确到小数点后2位!'));
                            }
                            break;
                        case 2:
                            if (!value) {
                                that.$Message.warning('请填写优惠券类型:代金券的面值');
                                return callback(new Error('请填写优惠券类型:代金券的面值'));
                            }
                            if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                that.$Message.warning('优惠券类型:代金券的面值必须为>=0的金额，精确到小数点后2位!');
                                return callback(new Error('优惠券类型:代金券的面值必须为>=0的金额，精确到小数点后2位!'));
                            }
                            break;
                        case 3:

                            break;
                        case 4:

                            break;
                        case 5:

                            break;
                    }

                    if (that.extra_goods == 'all') {
                        console.log(that.extra_goods);
                        that.formValidate.extra_goods = null;
                    } else {
                        var arr = [];
                        for (var i = 0; i < that.goods_item.length; i++) {
                            arr.push(that.goods_item[i].id);
                        }
                        that.formValidate.extra_goods = JSON.stringify(arr);
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

                        if (end_use_date < end_get_time) {
                            that.$Message.warning('设置失败: 优惠券截止使用日期不可小于优惠券截止领取日期');
                            return callback(new Error('设置失败: 优惠券截止使用日期不可小于优惠券截止领取日期'));
                        }
                        that.formValidate.react = '0';
                        that.formValidate.expire = '-1';
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
                    // that.formValidate.exclude_holiday = that.exclude_holiday == true ? '1' : '0';
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
            moves: '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            react: 1,
            expire: 12,
            logo: this.$cookieStore.get("logo"),
            appname: this.$cookieStore.get("name"),
            data: {
                body: []
            },
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            isModel: false,
            page: 1,
            total: 0,
            keyword: '',
            classid: 0,
            items: [],
            goodsid: '',
            classList: [],
            formValidate: {
                background: "rgb(234, 235, 237)",   //优惠券整体背景颜色
                button_color: "rgb(253, 68, 91)",   //优惠券领取按钮颜色
                list_color: "rgb(253, 68, 91)",
                title: '优惠券标题',
                sub_title: '优惠券副标题',
                type: '0',
                tiaojian: '0.00',
                extra_goods: [],
                start_get_time: '',
                end_get_time: '',
                start_use_date: '',
                end_use_date: '',
                react: '',
                expire: '',
                // exclude_holiday: "0",            //是否除去法定节假日
                exclude_weekend: "0",            //是否除去周一至周五
                start_use_time: '',
                end_use_time: '',
                // in_show_list: '',
                address: '',
                limit_num: '1',
                value: '0.00',
                extra_condition: ''
            },
            // exclude_holiday: false,            //是否除去法定节假日
            exclude_weekend: false,            //是否除去周一至周五
            // in_show_list: true,
            expire_time_text: '',
            expire_time_type: '0',
            daterange: '',
            extra_goods: 'all',
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
            this.formValidate.type = this.type;
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
        // this.get();
        this.getGoodsList();
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
        //     	get:function(){
        //     		var _this = this;
        // var data = {
        //     action: 'youhui_getone',
        //     appid: this.vueAppid,
        //     id: 1
        // };
        // this.$Loading.start();
        // _this.$http.post('/api_edit.php',_this.$qs.stringify(data)).then(function(response){
        // 	if(response.data.body && response.data.body.length >= 1){
        // 		_this.formValidate = response.data.body[0];
        // 		_this.formValidate.extra_goods = null ? '' : (_this.extra_goods = '0');
        // 		_this.formValidate.exclude_holiday = _this.exclude_holiday == '1' ? true : false;
        // 		_this.formValidate.exclude_weekend = _this.exclude_weekend == '1' ? true : false;
        // 		_this.formValidate.in_show_list = _this.in_show_list == '1' ? true : false;
        // 	}else{
        // 		_this.$Message.info(response.data.message);
        // 	}
        //     console.log(response.data);
        //     _this.$Loading.finish();
        // }).catch(function(response){
        // 	console.log(response);
        //           _this.$Notice.error({
        //                 title: '错误提示',
        //                 desc:  response
        //           });
        //           _this.$Loading.error();
        //       });
        //     	},
        getGoodsList: function () {
            var that = this;
            var page = that.page,
                keyword = that.keyword,
                classid = that.classid;
            // if (keyword) {
            //     that.search = true;
            // } else {
            //     that.search = false;
            // }
            // that.searchPoptip = false;
            //shop_listofbody&tableid=1

            // var apiurl="/api_edit.php?action=goods_list&classid="+classid+"&page="+page+"&keyword="+keyword;

            var apiurl = "/api_edit.php";
            var data = {
                appid: this.vueAppid,
                pageno: 10
            };
            data.action = "goods_list";
            data.page = page;
            data.pageno = that.pageno;
            data.keyword = keyword;
            data.classid = that.classid;
            // console.log(JSON.stringify(data));
            that.$http.post(apiurl, that.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    that.items = response.data.body;
                    that.classList = response.data.class;
                    that.page = response.data.page;
                    that.total = response.data.total;
                    // that.fieldsEdit();
                } else {
                    that.items = [];
                    that.$Message.info(response.data.message);
                    that.total = 0;

                }
                console.log(response.data);

                that.$Loading.finish();
            }).
                catch(function (response) {
                    that.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                    that.$Loading.error();
                });

        },
        webappList: function (item) {
            this.goodsid = item;
        },
        addGoodsList: function () {
            this.isModel = false;
            this.goods_item.push(this.goodsid);
        },
        save: function () {
            var _this = this;
            // this.data.body.push(this.formValidate);
            var jsondata = JSON.stringify(this.data);
            var data = {
                action: 'youhui_edit',
                id: '0',
                info: this.formValidate,
                appid: this.vueAppid
            };
            console.log(data);
            this.$Loading.start();
            _this.$http.post('/api_edit.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    _this.$Message.info(response.data.message);
                    _this.$router.go(-1);
                } else {
                    _this.$Message.error(response.data.message);
                }
                console.log(response.data);
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
        },
        delectGoodsItem: function (index) {
            this.goods_item.splice(index, 1);
        },
        skippage: function (page) {
            this.page = page;
            this.getGoodsList();
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

<style type="text/css" scoped>
#goods-resource-dialog .webapp-box {
    position: fixed;
    z-index: 1001;
    left: 50%;
    top: 50%;
    width: 875px;
    min-height: 550px;
    margin-left: -435px;
    margin-top: -283px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    padding: 0px;
    -webkit-transform: translateX(-10000px);
}

.webapp-box-bg.animate-show,
.webapp-box.animate-show {
    -webkit-transform: translateX(0px);
    -moz-transform: translateX(0px);
    transform: translateX(0px);
}
.webapp-box.animate-show {
    -webkit-animation: "show" 0.5s linear;
    -moz-animation: "show" 0.5s linear;
    animation: "show" 0.5s linear;
}
#goods-resource-dialog .webapp-box-bg.animate-show,
#goods-resource-dialog .webapp-box.animate-show {
    -webkit-transform: translateX(0px);
    -moz-transform: translateX(0px);
    /* transform: translateX(0px); */
}
.animate-hide {
    -webkit-transition: opacity 0.5s linear;
    -moz-transition: opacity 0.5s linear;
    transition: opacity 0.5s linear;
    opacity: 0;
}
.animate-show {
    -webkit-transition: opacity 0.5s linear;
    -moz-transition: opacity 0.5s linear;
    transition: opacity 0.5s linear;
    opacity: 1;
}

.webapp-box.animate-hide {
    -webkit-animation: "hide" 0.3s linear;
    -moz-animation: "hide" 0.3s linear;
    animation: "hide" 0.3s linear;
}
.webapp-box.animate-hide {
    -webkit-animation: "hide" 0.3s linear;
    -moz-animation: "hide" 0.3s linear;
    animation: "hide" 0.3s linear;
}
#goods-resource-dialog .webapp-box-header {
    width: 100%;
    height: 47px;
    background: #f0f0f0;
    border-radius: 5px 5px 0 0;
}
#goods-resource-dialog .webapp-box-title {
    display: inline-block;
    margin: 12px 0 0 24px;
    font-size: 18px;
}
#goods-resource-dialog .webapp-box-close {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    font-size: 30px;
    font-weight: bold;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.2;
}
#goods-resource-dialog .goods-type {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dcdcdc;
    width: 830px;
    margin: 0 auto;
    box-sizing: content-box;
}
#goods-resource-dialog .goods-type .active {
    color: #66ccff !important;
    border-bottom: 1px solid #66ccff !important;
}
#goods-resource-dialog .goods-type span {
    width: 65px;
    display: inline-block;
    text-align: center;
}
#goods-resource-dialog .goods-filter {
    height: 50px;
    padding-top: 20px;
    box-sizing: content-box;
}
#goods-resource-dialog .webapp-box select {
    border: 1px solid #666;
    border-radius: 4px;
    line-height: 14px;
    padding: 6px 4px 6px 6px;
    box-shadow: none;
    outline: 0;
    width: 134px;
    height: 35px;
    background: #fff;
    display: inline-block;
    float: left;
    margin-left: 20px;
}
#goods-resource-dialog .search {
    float: left;
    margin-right: 20px;
}
#goods-resource-dialog .webapp-box input.search-confirm-input {
    border: 1px solid #666;
    font-size: 14px;
    line-height: 14px;
    padding: 9px;
    box-shadow: none;
    outline: 0;
    width: 135px;
    margin-left: 20px;
    -webkit-user-select: text;
    border-radius: 4px 0 0 4px;
}
#goods-resource-dialog .search input {
    float: left;
    padding: 8px !important;
}
#goods-resource-dialog .search button {
    float: left;
    height: 34px;
    line-height: 34px;
    background: #fff;
    border-style: none;
    border: 1px solid #666;
    border-left: none;
    width: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
#goods-resource-dialog .add-goods {
    height: 32px;
    width: 100px;
    border: 1px solid #666;
    display: inline-block;
    line-height: 32px;
    text-align: center;
    color: #666;
    border-radius: 4px;
}
#goods-resource-dialog .add-goods span {
    font-size: 30px;
    float: left;
    margin-left: 10px;
    font-weight: bold;
}
#goods-resource-dialog .webapp-box-content {
    width: 100%;
    background: #fff;
}
#goods-resource-dialog .resource-list-wrap {
    height: 320px;
    overflow: auto;
}
#goods-resource-dialog .resource-list-page {
    padding: 10px 20px;
}
#goods-resource-dialog .no-data {
    line-height: 300px;
    text-align: center;
}
#goods-resource-dialog .goods-resource-list {
    margin: 0 10px;
    font-size: 0;
}
#goods-resource-dialog .goods-resource-list li {
    position: relative;
    display: inline-block;
    margin: 10px;
    width: 240px;
    vertical-align: top;
    font-size: 14px;
    padding: 10px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    box-sizing: content-box;
}
#goods-resource-dialog .goods-resource-list li:hover {
    border: 1px solid #66ccff;
    -webkit-transition: border 0.5s;
    -moz-transition: border 0.5s;
    -ms-transition: border 0.5s;
    -o-transition: border 0.5s;
    transition: border 0.5s;
}
#goods-resource-dialog .selected {
    border: 1px solid #66ccff !important;
    box-shadow: 0 0 10px 5px #ddd;
}
#goods-resource-dialog .webapp-li img {
    float: left;
    height: 90px;
    width: 90px;
    margin-right: 10px;
}
#goods-resource-dialog .webapp-title {
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 140px;
}
#goods-resource-dialog .refresh {
    display: none;
    position: absolute;
    height: 432px;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    top: 47px;
}
#goods-resource-dialog .refresh p {
    text-align: center;
    height: 200px;
    line-height: 200px;
    color: #fff;
    font-size: 20px;
}
#goods-resource-dialog .btn-wrap {
    width: 220px;
    margin: 0 auto;
}
#goods-resource-dialog .btn-confirm {
    border-style: none;
    background: #66ccff;
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    font-size: 14px;
    color: #fff;
}
#goods-resource-dialog .btn-cancel {
    border-style: none;
    background: #eee;
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    font-size: 14px;
    color: #666;
}
#goods-resource-dialog .webapp-box-footer {
    height: 70px;
    line-height: 70px;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 0px;
}
#goods-resource-dialog .mr-10 {
    margin-right: 10px;
}
.webapp-box-bg {
    position: fixed;
    -webkit-transform: translateX(-10000px);
    -moz-transform: translateX(-10000px);
    transform: translateX(-10000px);
    width: 100%;
    height: 100%;
    z-index: 1000;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
}
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
.select-goods-item .info-box .clear-goods-btn {
    display: inline-block;
    margin-top: 5px;
    color: #eec253;
    cursor: pointer;
}
/*******************优惠券*************************/
.manager-page-body {
    margin: 10px 10px 10px 10px;
    padding: 20px 20px 10px 20px;
    /*border: 1px solid #e5e5e5;*/
    background-color: #fff;
    border-radius: 5px;
}
.phone-preview-area {
    display: inline-block;
    vertical-align: top;
    margin-top: 20px;
    margin-left: 20px;
}
.info-edit-area {
    display: inline-block;
    vertical-align: top;
    margin-top: 20px;
    margin-left: 30px;
}
.phone-preview-title {
    font-size: 14px;
    margin-bottom: 10px;
}
#coupon-ticket {
    position: relative;
    width: 320px;
    margin: 0 auto 20px;
}
#coupon-ticket::before {
    content: "";
    position: absolute;
    bottom: 20px;
    left: -4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #fff;
    z-index: 10;
}
#coupon-ticket::after {
    content: "";
    position: absolute;
    bottom: 20px;
    right: -4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #fff;
    z-index: 10;
}
#coupon-ticket .top-section {
    width: 320px;
    height: 90px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    background: #fff;
    border-top: 5px solid #ff4d64;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-shadow: 0px -5px 5px -5px rgba(0, 0, 0, 0.2),
        5px 0px 5px -5px rgba(0, 0, 0, 0.2),
        -5px 0px 5px -5px rgba(0, 0, 0, 0.2);
    z-index: 1;
}
#coupon-ticket .detail-info {
    position: absolute;
    top: 20px;
    left: 19px;
}
#coupon-ticket .detail-info .name {
    color: #333;
    font-size: 15px;
    line-height: 15px;
    margin-bottom: 10px;
}
#coupon-ticket .detail-info .use-tiaojian {
    color: #666;
    font-size: 12px;
}
#coupon-ticket .background-word-area {
    position: absolute;
    right: -32px;
    top: -40px;
    padding: 5px;
    border: 1px solid #ff4d64;
    border-radius: 50%;
    color: #fff;
    opacity: 0.1;
}
#coupon-ticket .background-circle {
    width: 90px;
    height: 90px;
    line-height: 90px;
    background-color: #ff4d64;
    border-radius: 50%;
}
#coupon-ticket .background-word {
    position: absolute;
    bottom: 25px;
    left: 25px;
    font-size: 32px;
    line-height: 32px;
}
#coupon-ticket .function-btn {
    position: absolute;
    top: 44px;
    right: 18px;
    font-size: 12px;
    width: 60px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    background-color: #ff4d64;
    border-radius: 8px;
    color: #fff;
}
#coupon-ticket .bottom-section {
    position: relative;
    width: 320px;
    margin: 0 auto;
    height: 25px;
    line-height: 25px;
    text-indent: 1em;
    background: #fff;
    font-size: 12px;
    color: #999;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    white-space: nowrap;
}
#coupon-ticket .bottom-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 4px;
    width: calc(100% - 10px);
    border-top: 1px dashed #dbdbdb;
}
#coupon-ticket .bottom-section::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 25px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}
#coupon-ticket .bottom-section > div {
    overflow: hidden;
    text-overflow: ellipsis;
}
#coupon-detail .bottom-section {
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top: 1px dashed #dbdbdb;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}
.phone-preview-content {
    position: relative;
    width: 320px;
    height: 580px;
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}
.phone-preview-content .phone-head {
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 58px;
    background-image: url("../../assets/images/phone-head.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.phone-preview-content .phone-container {
    position: absolute;
    top: 58px;
    left: 0;
    width: 320px;
    height: 568px;
    overflow: hidden;
    background-color: #fff;
}
#coupon-detail {
    height: 100%;
    background-color: #edeeef;
}
.page {
    min-height: 705px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
}
#coupon-detail .coupon-detail-wrap {
    margin: 15px 10px 0;
}
#coupon-detail .top-section {
    position: relative;
    width: 100%;
    height: 45px;
    background: #fff;
    background: radial-gradient(circle at bottom left, transparent 5px, #fff 0)
            bottom left,
        radial-gradient(circle at bottom right, transparent 5px, #fff 0) bottom
            right;
    background-size: 50% 100%;
    background-repeat: no-repeat;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #8a8b8c;
    box-shadow: 0px -5px 5px -5px rgba(0, 0, 0, 0.2),
        5px 0px 5px -5px rgba(0, 0, 0, 0.2),
        -5px 0px 5px -5px rgba(0, 0, 0, 0.2);
}
#coupon-detail .top-section .logo {
    position: absolute;
    top: 10px;
    left: 20px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
}
#coupon-detail .top-section .name {
    position: absolute;
    top: 5px;
    left: 55px;
    height: 35px;
    line-height: 35px;
    font-size: 13px;
}
#coupon-detail .top-section .share {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #000;
    font-size: 15px;
    line-height: 1em;
}
#coupon-detail .top-section::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 5px;
    width: calc(100% - 10px);
    border-bottom: 1px dashed #dbdbdb;
}
#coupon-detail .middle-section {
    position: relative;
    background: #fff;
    background: radial-gradient(circle at top left, transparent 5px, #fff 0) top
            left,
        radial-gradient(circle at top right, transparent 5px, #fff 0) top right;
    background-size: 50% 100%;
    background-repeat: no-repeat;
    box-shadow: 5px 0px 5px -5px rgba(0, 0, 0, 0.2),
        -5px 0px 5px -5px rgba(0, 0, 0, 0.2);
}
#coupon-detail .middle-section .title {
    padding-top: 24px;
    line-height: 24px;
    font-size: 24px;
    text-align: center;
    font-weight: 400;
}
#coupon-detail .middle-section .sub-title {
    margin-top: 12px;
    line-height: 15px;
    font-size: 15px;
    text-align: center;
}
#coupon-detail .middle-section .receive-btn {
    margin: 18px auto;
    width: 145px;
    height: 30px;
    line-height: 30px;
    background: #fd445b;
    border-radius: 4px;
    font-size: 15px;
    text-align: center;
    color: #fff;
}
#coupon-detail .middle-section .detail-item {
    margin: 0 20px;
    padding-bottom: 13px;
    line-height: 16px;
    font-size: 13px;
}
#coupon-detail .middle-section .detail-item .item-name {
    display: inline-block;
    vertical-align: top;
}
#coupon-detail .middle-section .detail-item .item-content {
    display: inline-block;
    color: #8a8b8c;
    width: calc(100% - 70px);
    vertical-align: top;
}
#coupon-detail .middle-section .detail-item {
    margin: 0 20px;
    padding-bottom: 13px;
    line-height: 16px;
    font-size: 13px;
}
#coupon-detail .middle-section .detail-item .item-name {
    display: inline-block;
    vertical-align: top;
}
#coupon-detail .middle-section .detail-item .item-content {
    display: inline-block;
    color: #8a8b8c;
    width: calc(100% - 70px);
    vertical-align: top;
    line-height: 20px;
}
#coupon-detail .bottom-section .goto-homepage {
    position: relative;
    padding: 15px 20px;
    line-height: 13px;
    font-size: 13px;
}
.info-edit-area {
    display: inline-block;
    vertical-align: top;
    width: 550px;
    margin-top: 20px;
    margin-left: 60px;
}
.info-edit-title {
    height: 50px;
    line-height: 50px;
    border: 1px solid #ddd;
    border-bottom: 0;
    padding-left: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: 14px;
}
.info-edit-content {
    padding-bottom: 15px;
    border: 1px solid #ddd;
}
.info-edit-btn-panel {
    margin: 20px 0;
    text-align: center;
}
.coupon-type-content > div span.type-title {
    display: inline-block;
    margin-right: 15px;
    font-size: 14px;
}
/**********可用商品**************/
.coupon-goods-catgory {
    display: flex;
    margin-top: 10px;
}
.coupon-goods-catgory label {
    margin-right: 15px;
    color: #4d4e53;
    font-size: 14px;
    font-weight: 300;
}
.coupon-goods-catgory .part-set {
    display: inline-block;
    font-size: 14px;
    color: #eec253;
    margin-left: 10px;
    cursor: pointer;
}
/**********去除日期**************/
.select-time-checkbox {
    display: inline-block;
    margin-right: 15px;
}
.time-slot > div,
.time-slot > p {
    display: inline-block;
    margin-right: 5px;
}
.field-item-panel {
    display: inline-block;
}
.field-item-panel > p {
}
/*优惠券底部*/
#coupon-detail .bottom-section .detail-item {
    margin: 0 20px;
    padding: 12px 0;
    border-bottom: 1px solid #eaebec;
    line-height: 16px;
    font-size: 13px;
}
#coupon-detail .bottom-section .detail-item .item-name {
    display: inline-block;
    vertical-align: top;
}
#coupon-detail .bottom-section .detail-item .item-content {
    display: inline-block;
    width: calc(100% - 70px);
    color: #8a8b8c;
    vertical-align: top;
}
</style>

