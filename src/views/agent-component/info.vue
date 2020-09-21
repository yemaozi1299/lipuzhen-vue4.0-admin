<template>
    <Card>
        <p slot="title">欢迎使用代理商平台</p>

        <tables
            ref="tables"
            editable
            search-place="top"
            v-model="infoData.data"
            :columns="infoData.columns"
        >
        </tables>
    </Card>
</template>
<script type="text/javascript">
import Tables from '@/components/tables'
import Buttons from '@/components/buttons'
export default {
    components: {
        Tables,
        Buttons,
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
                        key: 'level',
                        className: 'demo-table-info-column',
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
                action: 'agent_info',
                appid: this.vueAppid
            };
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                console.log(response);
                if (response.data.status == 1) {
                    var data = response.data;
                    var centent = [
                        {
                            info: '代理级别',
                            level: data.agentjb
                        },
                        {
                            info: '代理状态',
                            level: data.agentstatus == 1 ? '开启' : '关闭'
                        },
                        {
                            info: '应用数量',
                            level: data.haveapp
                        },
                        {
                            info: '企业数量',
                            level: data.havecompany
                        },
                        {
                            info: '余额',
                            level: data.havemoney
                        },
                    ];

                    _this.infoData.data = centent;
                }
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