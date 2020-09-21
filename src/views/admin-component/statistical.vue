<template>
    <div>
        <Card class="agent-info-content">
            <p slot="title">欢迎使用超级管理员平台</p>
            <tables v-model="infoData.data" :columns="infoData.columns">
            </tables>
        </Card>
    </div>
</template>
<script type="text/javascript">
import Tables from "@/components/tables";
import Buttons from "@/components/buttons";
export default {
    name: "",
    components: {
        Tables,
        Buttons
    },
    data: function () {
        return {
            infoData: {
                columns: [
                    {
                        title: '代理信息',
                        key: 'info',
                        className: 'demo-table-info-column',
                    },
                    {
                        title: ' ',
                        key: 'level'
                    }
                ],
                data: []
            }
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function () {
            var _this = this;
            var data = {
                action: 'system_info',
                appid: this.vueAppid
            };
            this.$Loading.start();
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    var data = response.data;
                    var centent = [
                        {
                            info: '企业数量',
                            level: data.havecompany
                        },
                        {
                            info: '应用数量',
                            level: data.haveapp
                        },
                        {
                            info: '代理数量',
                            level: data.haveagent
                        }
                    ];

                    _this.infoData.data = centent;

                }
                console.log(response.data)
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
                _this.$Loading.error();
            });
        }
    }
}
</script>
<style type="text/css">
.agent-info-content {
    width: 100%;
    height: 100%;
    margin: auto;
    overflow: hidden;
}
</style>