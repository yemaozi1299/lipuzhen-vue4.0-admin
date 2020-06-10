<template>
    <div
        style="position:relative;margin:10px 10px 10px 10px;padding-bottom:50px"
    >
        <div style="margin-right: 10px; line-height: 55px;">
            <h2>店铺设置</h2>
        </div>

        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="150"
        >
            <Form-item label="店铺名称：" prop="name">
                <Input
                    v-model="formValidate.name"
                    placeholder="请输入店铺名称"
                    style="width:180px"
                ></Input>
            </Form-item>
            <Form-item label="店铺图标：" prop="ico">
                <div class="shopinfo-upload-list">
                    <img
                        :src="formValidate.url_ico"
                        @click="handleView(formValidate.url_ico)"
                    />
                </div>

                <Button @click="isUploadOne = true" style="vertical-align:top;">
                    <div style="">
                        <Icon type="ios-cloud-upload-outline" size="20"></Icon
                        >选择图片
                    </div>
                </Button>
                <Resource
                    v-model="isUploadOne"
                    :on-success="handleSuccess"
                ></Resource>
            </Form-item>
            <Form-item label="店铺介绍：" prop="desc">
                <Input
                    v-model="formValidate.desc"
                    type="textarea"
                    placeholder="请输入店铺介绍"
                    style="width:180px"
                ></Input>
            </Form-item>
            <Form-item label="店铺电话：" prop="tel">
                <Input
                    v-model="formValidate.tel"
                    placeholder="请输入店铺电话"
                    style="width:180px"
                ></Input>
            </Form-item>
            <Form-item label="配送时间：" prop="posttime">
                <span>平均配送</span>
                <Input
                    v-model="formValidate.posttime"
                    style="width:70px"
                ></Input>
                <span>分钟</span>
            </Form-item>
            <Form-item label="配送方式：" prop="posttype">
                <Select v-model="formValidate.posttype" style="width:180px">
                    <Option value="0">商家配送</Option>
                    <!-- <Option value='1'>第三方配送</Option> -->
                </Select>
            </Form-item>
            <Form-item label="起送价：" prop="postendmoney">
                <Input
                    v-model="formValidate.postendmoney"
                    type="number"
                    placeholder="单位：元"
                    style="width:180px"
                ></Input>
            </Form-item>
            <Form-item label="配送价：" prop="postmoney">
                <Input
                    v-model="formValidate.postmoney"
                    type="number"
                    placeholder="单位：元"
                    style="width:180px"
                ></Input>
            </Form-item>
            <Form-item label="茶位费：" prop="chaWeiFei">
                <Input
                    v-model="formValidate.chaWeiFei"
                    type="number"
                    placeholder="单位：元"
                    style="width:180px"
                ></Input>
                元 / 人 (0元为不收取)
            </Form-item>
            <Form-item label="结账方式：" prop="paycash">
                <Checkbox v-model="formValidate.paycash"
                    >&nbsp;&nbsp;是否允许用现金支付</Checkbox
                >
            </Form-item>

            <Form-item
                class="businessTime"
                label="店铺营业时间："
                prop="businesshours"
            >
                <div class="amDiv" style="margin-bottom:10px">
                    <span>上午：</span>
                    <TimePicker
                        type="time"
                        v-model="am.starttime"
                        style="width: 100px;display:inline-block"
                    ></TimePicker>
                    -
                    <TimePicker
                        type="time"
                        v-model="am.endtime"
                        style="width: 100px;display:inline-block"
                    ></TimePicker>
                </div>
                <div class="pmDiv">
                    <span>下午：</span>
                    <TimePicker
                        type="time"
                        v-model="pm.starttime"
                        style="width: 100px;display:inline-block"
                    ></TimePicker>
                    -
                    <TimePicker
                        type="time"
                        v-model="pm.endtime"
                        style="width: 100px;display:inline-block"
                    ></TimePicker>
                </div>
            </Form-item>

            <Form-item label="店铺位置：" prop="province">
                <Col span="17"
                    ><al-selector v-model="res" level="2" class="iveiw-area"
                /></Col>
            </Form-item>
            <Form-item label="店铺详细地址：" prop="address">
                <Input
                    v-model="formValidate.address"
                    type="text"
                    placeholder="请输入店铺详细地址"
                    style="width:440px"
                    @on-blur="setAddressInfo('enter', $event)"
                    @on-enter="setAddressInfo('enter', $event)"
                />
                <Button
                    type="info"
                    style="margin-left: 15px;"
                    @click="setAddressInfo('enter', $event)"
                >
                    地图搜索
                </Button>
            </Form-item>
            <Form-item label="地图：" prop="zuobiaox">
                <div id="qq-map-wrapper">
                    <div
                        id="qq-panel"
                        class="panelShow"
                        v-if="pois.length >= 1"
                    >
                        <div class="search-list">
                            <div class="search-title">
                                搜索结果(共{{ pois.length }}条)
                            </div>
                            <ul>
                                <!--  selected -->
                                <li
                                    class="ng-star-inserted"
                                    v-for="(item, index) in pois"
                                    :key="index"
                                    v-on:click="starInserted(item, index)"
                                    :class="{ selected: index == selected }"
                                >
                                    <div class="title">{{ index + 1 }}.</div>
                                    <div class="info">
                                        <div class="name">{{ item.name }}</div>
                                        <div class="address">
                                            {{ item.address }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        id="map-set-module"
                        :class="{ widthAll: pois.length == 0 }"
                    ></div>
                </div>
                <span>经度: {{ lng }}</span>
                <span style="margin-left: 20px;">纬度: {{ lat }}</span>
            </Form-item>

            <Form-item label="送餐范围：" prop="radius">
                <Input
                    v-model="formValidate.radius"
                    type="number"
                    placeholder="送餐范围"
                    style="width:200px;"
                ></Input>
                <span> 米</span>
            </Form-item>
        </Form>
        <div align="center" style="margin-top:10px">
            <Button type="primary" @click="handleSubmit('formValidate')"
                >提交</Button
            >
        </div>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            map: '',
            lat: '39.90604926575327',
            lng: '116.39671325683594',
            selected: '',
            pois: [],
            Marker: [],
            radius: 2000,
            isUploadOne: false,
            address: '',
            moves: '/userlist/' + this.$cookieStore.get("CookVueAppUser") + '/' + this.$cookieStore.get("CookVueAppid") + '/userpic/',
            vueAppid: this.$cookieStore.get("CookVueAppid"),
            res: [],
            formValidate: {
                name: '',
                businesshours: [{}, {}],
                province: '',
                city: '',
                district: '',
                posttype: '0',
                address: '',
                chaWeiFei: 0
            },
            visible: false,
            imgName: '',
            ruleValidate: {
                name: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],

                ico: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                posttime: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                posttype: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                postendmoney: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                postmoney: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                // businesshours: [
                //     {required: true, message: '必填', trigger: 'blur',type:'array'}
                // ],
                province: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                radius: [
                    { required: true, message: '必填', trigger: 'blur' }
                ]

            },
            am: {
                starttime: '',
                endtime: ''
            },
            pm: {
                starttime: '',
                endtime: ''
            }
        }
    },
    watch: {           //toLocation
        am: {
            handler (val) {
                this.formValidate.businesshours[0] = val;
                console.log(val)
            },
            deep: true

        },
        pm: {
            handler (val) {
                this.formValidate.businesshours[1] = val;
                console.log(val)
            },
            deep: true

        },
        res: {
            handler (val) {
                this.formValidate.province = val[0] ? val[0].name : '';
                this.formValidate.city = val[1] ? val[1].name : '';
                this.formValidate.district = val[2] ? val[2].name : '';
            },
            deep: true
        },
        'formValidate.district': function (val) {
            // val && this.searchKeyword(val);
        },
        'formValidate.radius': function () {
            this.showGeocoder(this.lat, this.lng);
        },
        // 'formValidate.address':function(val){
        //     this.toLocation(val);
        // }
    },
    created () {

        this.get();
    },
    methods: {
        starInserted: function (item, index) {
            var i = this;
            i.map.panTo(item.latLng);
            i.lat = item.latLng.lat;
            i.lng = item.latLng.lng;
            i.formValidate.address = item.name;
            i.selected = index;
            console.log(i.Marker[index].setAnimation);
        },
        setAddressInfo: function (type, event) {
            this.searchKeyword(this.formValidate.address);
        },
        mapInit: function () {
            var e = this;
            e.map = new qq.maps.Map(document.getElementById("map-set-module"), {
                zoom: 13,
            });
            // e.formValidate.zuobiaox && e.showGeocoder(e.formValidate.zuobiaox, e.formValidate.zuobiaoy);      //写入位置
            qq.maps.event.addListener(e.map, 'click', function (event) {
                e.lat = event.latLng.lat;
                e.lng = event.latLng.lng;

                e.showGeocoder(e.lat, e.lng);
                e.getmapCity();
            });
            // e.toLocation(this.formValidate.address);
        },
        showGeocoder: function (e, t) {             //写入坐标和插入标注
            var i = this
                , r = new qq.maps.LatLng(e, t)
                , o = new qq.maps.Geocoder, M;
            this.clearGeocoder();

            o.getAddress(r),
                o.setComplete(function () {
                    console.log(r);
                    M = new qq.maps.Marker({
                        position: r,
                        map: i.map
                    }),
                        i.Marker.push(M);
                    i.map.panTo(r);
                    i.doCircle(r);
                });
        },
        clearGeocoder: function (e) {             //清空地图覆盖物
            for (var i = 0; i < this.Marker.length; i++) {
                this.Marker[i].setMap(null)
            }
            this.pois = [];
        },
        getmapCity: function () {
            var e = this,
                t = new qq.maps.Geocoder({     //解析坐标，转成地址
                    complete: function (t) {
                        e.city = t.detail.address;
                        console.log(t.detail);
                        e.formValidate.address = t.detail.addressComponents.street;
                    }
                });
            var n = e.map.center,
                i = new qq.maps.LatLng(n.lat, n.lng);
            t.getAddress(i);
        },
        toLocation: function (e) {                    //将地址转坐标
            var t = this,
                n = new qq.maps.SearchService({
                    complete: function (n) {
                        console.log(n.detail);
                        var i = n.detail.pois;
                        return i ? (t.clearGeocoder(),
                            t.map.panTo(i[0].latLng),
                            t.map.zoomTo(13),
                            t.lng = i[0].latLng.getLng(),
                            t.lat = i[0].latLng.getLat(),
                            t.getmapCity(),
                            t.showGeocoder(i[0].latLng.getLat(), i[0].latLng.getLng())) : t.$Message.warning('无法获取定位，请尝试其他地址');
                    }
                });
            return e && e.substring ? (n.setPageIndex(0),
                n.setPageCapacity(10),
                n.setLocation(this.formValidate.province + this.formValidate.city),
                void n.search(e)) : void t.$Message.warning('请输入正确地址');
        },
        searchKeyword: function (e) {
            var t = this, markers = [],
                latlngBounds = new qq.maps.LatLngBounds(),
                n = new qq.maps.SearchService({
                    complete: function (results) {
                        var pois = results.detail.pois;
                        if (pois) {
                            for (var i = 0, l = pois.length; i < l; i++) {
                                var poi = pois[i];
                                latlngBounds.extend(poi.latLng);
                                var decoration = new qq.maps.MarkerDecoration(i + 1, new qq.maps.Point(0, -5))
                                var marker = new qq.maps.Marker({
                                    map: t.map,
                                    position: poi.latLng,
                                    decoration: decoration
                                });


                                // marker.setTitle();
                                t.Marker.push(marker);
                            }
                            t.lat = pois[0].latLng.lat;
                            t.lng = pois[0].latLng.lng;
                            t.pois = pois;
                            console.log(pois);
                            t.map.fitBounds(latlngBounds)
                        } else {
                            t.$Message.warning('请输入正确地址');
                        }

                    }
                });
            this.clearGeocoder();
            n.setPageIndex(0);
            n.setPageCapacity(10);
            // n.searchNearBy(e, new qq.maps.LatLng(this.lat,this.lng), 2000);
            n.setLocation(this.formValidate.province + this.formValidate.city);
            n.search(e);
        },
        doCircle: function (center) {             //画圆
            var i = this;
            var circle = new qq.maps.Circle({
                map: i.map,
                center: center,
                radius: Number(i.formValidate.radius),
                strokeWeight: 5
            });
            i.Marker.push(circle);
            // circle.setMap(i.map);
        },
        ifRepeat: function () {
            var am = this.am, pm = this.pm;
            if (am.starttime == '' || pm.starttime == '') {
                this.$Message.info('营业时间不能为空');
                return false;
            }
            if (am.starttime > am.endtime || pm.starttime > pm.endtime) {
                this.$Message.info('开始时间不能大于结束时间');
                return false;
            }
            if (am.endtime > pm.starttime || pm.endtime < am.starttime) {
                this.$Message.info('时间段重叠');
                return false;
            }
            return true;

        },
        get: function () {//获取店铺内容
            var _this = this;
            var apiurl = "/block/api_edit.php";
            var data = {
                action: 'waimai_info',
                appid: this.vueAppid
            }
            console.log('get')
            _this.$http.post(apiurl, _this.$qs.stringify(data)).then((response) => {
                console.log(response);
                if (response.data.status == 1) {
                    var body = response.data.body;
                    _this.formValidate = {
                        name: body.name,
                        ico: body.ico,
                        desc: body.info,
                        tel: body.tel,
                        posttime: body.posttime,
                        posttype: body.posttype,
                        postendmoney: body.postendmoney,
                        postmoney: body.postmoney,
                        businesshours: JSON.parse(body.businesshours) || [{}, {}],
                        province: body.province,
                        city: body.city,
                        district: body.district,
                        address: body.address,
                        zuobiaox: body.zuobiaox,
                        zuobiaoy: body.zuobiaoy,
                        postscope: body.postscope,
                        url_ico: body.url_ico,
                        radius: body.postscope,
                        chaWeiFei: body.chaWeiFei || 0,
                        paycash: body.paycash == 1 ? true : false
                    }
                    // _this.address = body.address;
                    body.zuobiaox && (_this.lat = body.zuobiaox);
                    body.zuobiaoy && (_this.lng = body.zuobiaoy);

                    _this.res.push(body.province);
                    _this.res.push(body.city);
                    _this.res.push(body.district);

                    _this.am = _this.formValidate.businesshours[0];
                    _this.pm = _this.formValidate.businesshours[1];
                    _this.$Message.success('获取成功!');
                } else {
                }
                _this.mapInit();
            }).catch(function (response) {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
                });
            });
        },
        handleSubmit (name) {
            var _this = this;
            _this.$refs[name].validate((valid) => {
                console.log(valid);
                if (valid && _this.ifRepeat()) {
                    var apiurl = "/block/api_edit.php";
                    var data = {
                        action: 'waimai_infoset',
                        info: {
                            name: this.formValidate.name,
                            ico: this.formValidate.ico,
                            info: this.formValidate.desc,
                            tel: this.formValidate.tel,
                            posttime: this.formValidate.posttime,
                            posttype: this.formValidate.posttype,
                            postendmoney: this.formValidate.postendmoney,
                            postmoney: this.formValidate.postmoney,
                            businesshours: this.formValidate.businesshours,
                            province: this.formValidate.province,
                            city: this.formValidate.city,
                            district: this.formValidate.district,
                            address: this.formValidate.address,
                            zuobiaox: this.lat,
                            zuobiaoy: this.lng,
                            postscope: this.formValidate.radius,
                            chaWeiFei: this.formValidate.chaWeiFei || 0,
                            paycash: this.formValidate.paycash ? 1 : 0

                        },
                        appid: this.vueAppid
                    };
                    _this.$http.post(apiurl, data).then((response) => {
                        console.log(response);
                        if (response.data.status == 1) {
                            _this.$Message.success('提交成功!');
                        }
                        else {
                            _this.$Modal.error({
                                title: '错误提示',
                                content: response.data.message
                            });
                        }
                    }).catch(function (response) {
                        _this.$Notice.error({
                            title: '错误提示',
                            desc: '无法访问服务器,请重试'
                        });
                    });
                }
            });
        },

        handleSuccess: function (res, file) {
            var _this = this;
            console.log(res, file);

            if (res.status == 1) {
                this.formValidate.ico = res.name;
                this.formValidate.url_ico = res.url;
                this.$Message.info('上传成功');
            }
            else {
                _this.$Notice.warning({
                    title: '上传失败',
                    desc: '' + res.message
                });
            }



        },
        handleView: function (name) {
            this.imgName = name;
            this.visible = true;
        },


    }
}
</script>

<style type="text/css">
.shopinfo-upload-list {
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 4px;
}
.shopinfo-upload-list > img {
    width: 100%;
    height: 100%;
}
#qq-map-wrapper {
    width: 90%;
    display: flex;
    border: 1px solid #dcdcdc;
}
#map-set-module {
    position: relative;
    width: 75%;
    height: 500px;
}
#map-set-module.widthAll {
    width: 100%;
}

.form-map {
    height: 380px;
    width: 380px;
    border: 1px solid #ccc;
    padding: 0;
    position: relative;
    display: flex;
}
.small-map {
    height: 200px;
    width: 200px;
    border: 1px solid #ccc;
    padding: 0;
}
.form-map.big {
    height: 500px;
    width: 75%;
}
.form-map.middle {
    height: 420px;
    width: 76%;
}
.custom-address {
    width: 120px;
}
.address-item {
    margin-right: 10px;
}
.street-item {
    width: 380px;
    margin-right: 10px;
}
.custom-map {
    margin-left: 9%;
}
.more-info-label {
    text-align: right !important;
    line-height: 28px;
    padding-right: 30px;
}
.necessary::before {
    display: inline-block;
    margin-right: 2px;
    content: "*";
    font-family: SimSun;
    line-height: 1;
    font-size: 12px;
    color: #f04134;
}
.big .qmap-container {
    height: 498px;
    width: 100%;
}
.middle .qmap-container {
    height: 418px;
    width: 100%;
    box-sizing: content-box;
}
#qq-panel {
    width: 25%;
    position: relative;
    left: 0;
    height: 498px;
    z-index: 2;
    overflow-x: hidden;
    display: none;
}
#qq-panel.panelShow {
    display: block;
}
.big .qmap-container.panelShow {
    width: 75%;
}
.middle .qmap-container.panelShow {
    width: 80%;
    height: 418px;
}
.middle #qq-panel {
    width: 20%;
    height: 418px;
}
.search-list {
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    font-size: 14px;
    color: rgb(51, 51, 51);
    line-height: 20px;
    border: 0px none;
}
.search-list .search-title {
    position: relative;
    height: 20px;
    line-height: 20px;
    background-color: rgb(243, 243, 243);
    font-size: 12px;
    color: rgb(153, 153, 153);
    padding: 0px 5px;
}
.search-list li {
    margin: 2px 0;
    padding: 0 5px;
    cursor: pointer;
    zoom: 1;
}
.search-list li.selected {
    background-color: rgb(238, 238, 238);
}
.search-list .title {
    float: left;
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-align: center;
}
.search-list .info {
    overflow: hidden;
    padding: 0 5px;
    zoom: 1;
}
.search-list .info .name {
    color: #0059b3;
}
.search-list .info .address {
    color: #999999;
    font-size: 12px;
}
.businessTime .ivu-form-item-label:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
</style>