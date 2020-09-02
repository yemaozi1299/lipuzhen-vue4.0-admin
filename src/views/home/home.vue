<template>
    <div class="home-page">
        <Row :gutter="16">
            <Col
                :xs="24"
                :lg="8"
                v-for="(infor, i) in inforCardData"
                :key="`infor-${i}`"
                style="height: 120px; padding-bottom: 10px;"
            >
                <infor-card
                    shadow
                    :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36"
                    :left="20"
                >
                    <div class="ant-row-flex">
                        <div class="text">
                            <count-to
                                :end="infor.total"
                                count-class="count-style"
                            />
                            <p class="dataTitle">{{ infor.title }}</p>
                        </div>
                        <div class="text">
                            <p class="dataTitle last-day">
                                今日：{{ infor.today }}
                            </p>
                            <p class="dataTitle last-day">
                                昨日：{{ infor.yesterday }}
                            </p>
                        </div>
                    </div>
                </infor-card>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col
                :xs="12"
                :md="8"
                :lg="4"
                v-for="(infor, i) in numCardData"
                :key="`infor-${i}-1`"
                style="height: 120px; padding-bottom: 10px;"
            >
                <infor-card
                    shadow
                    :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36"
                    :left="30"
                >
                    <count-to :end="infor.count" count-class="count-style" />
                    <p class="dataTitle">{{ infor.title }}</p>
                </infor-card>
            </Col>
        </Row>
    </div>
</template>

<script type="text/javascript">
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
export default {
    name: 'home',
    components: {
        InforCard,
        CountTo,
    },
    data: function () {
        return {
            vueAppid: this.$cookieStore.get("CookVueAppid"),

            defaultList: {
                user_total: {
                    icon: "md-people",
                    title: "用户数量",
                    color: '#2d8cf0',
                },
                ordermoney_total: {
                    icon: "logo-yen",
                    title: "订单金额",
                    color: '#19be6b',
                },
                order_total: {
                    icon: "ios-clipboard",
                    title: "订单数量",
                    color: '#ff9900',
                },
                appcount: {
                    icon: "md-eye",
                    title: "总预览量",
                    count: 0,
                    color: "#ff5b33"
                },
                goods_total: {
                    icon: "md-cart",
                    title: "商品数量",
                    count: 0,
                    color: "#E46CBB"
                },
                guestbook_total: {
                    icon: "ios-mail",
                    title: "留言数量",
                    count: 0,
                    color: "#9A66E4"
                },
                job_total: {
                    icon: "md-contacts",
                    title: "招聘数量",
                    count: 0,
                    color: "#14e3ed"
                },
                product_total: {
                    icon: "ios-cube",
                    title: "产品数量",
                    count: 0,
                    color: "#1425ed"
                },
                resume_total: {
                    icon: "md-paper",
                    title: "简历数量",
                    count: 0,
                    color: "#e0ed14"
                }
            },
            inforCardData: [],
            numCardData: []
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function () {
            var _this = this;
            this.$http.request({
                method: 'post',
                url: '/api_edit.php?action=app_info',
                params: {
                    appid: this.vueAppid
                }
            }).then(function (response) {
                // if (response.data.status == 1) {
                //     _this.data = response.data.body || {};
                // }
                console.log(response.data);
                var data = response.data.body || {}, arr = [], numList = [];
                for (var key in data) {
                    if (typeof data[key] == "object") {
                        arr.push(Object.assign({}, data[key], _this.defaultList[key]));
                    } else {
                        numList.push(Object.assign({}, _this.defaultList[key], {
                            count: Number(data[key])
                        }));
                    }
                }
                _this.inforCardData = arr;
                _this.numCardData = numList;
                console.log(arr, numList);
            }).catch(function (response) {
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
<style lang="less">
.home-page {
    height: 100%;
    .ant-row-flex {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        .icon-outer {
            height: 100%;
            .icon {
                width: 55px;
                text-align: center;
                font-size: 25px;
                line-height: 108px;
                color: #fff;
            }
        }
        .text {
            flex: 1;
            .number {
                font-size: 30px;
                line-height: 36px;
                font-weight: 400;
                color: #303445;
                text-align: center;
            }
            .dataTitle {
                font-size: 12px;
                line-height: 18px;
                color: #59607b;
                text-align: center;
            }
            .last-day {
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-left: 1px solid #bbc;
            }
        }
    }
}
.count-style {
    font-size: 50px;
}
</style>
