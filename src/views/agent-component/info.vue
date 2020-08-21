<template>
    <div>
        <div class="agent-info-content">
            <div class="info-title">欢迎使用代理商平台</div>
            <!-- <div class="info-user-table">
				<Table :columns="userData.columns" :data="userData.data" style=""></Table>
			</div> -->
            <div class="info-agent-table">
                <Table
                    :columns="infoData.columns"
                    :data="infoData.data"
                ></Table>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
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
            this.$Loading.start();
            _this.$http.post('/api_agent.php', _this.$qs.stringify(data)).then(function (response) {
                if (response.data.status == 1) {
                    var data = response.data;
                    // console.log(data);

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
                _this.$Loading.finish();
            }).catch(function (response) {
                console.log(response);
                _this.$Notice.error({
                    title: '错误提示',
                    desc: '无法访问服务器,请重试'
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