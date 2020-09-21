<template>
    <div>
        <Row :gutter="16">
            <Col
                :xs="12"
                :md="8"
                :lg="4"
                v-for="(infor, i) in blockList"
                :key="`infor-${i}`"
                style="padding-bottom: 10px"
            >
                <div @click="blockAdd(infor)">
                    <Card>
                        <div>
                            {{ infor.b_title }}
                        </div>
                        <div>
                            {{ infor.b_id }}
                        </div>
                        <div>
                            {{ infor.b_name }}
                        </div>
                    </Card>
                </div>
            </Col>
        </Row>
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
            blockList: []
        }
    },
    created: function () {
        this.get();
    },
    methods: {
        get: function () {
            var _this = this;
            var data = {
                action: 'block_list',
                appid: this.vueAppid
            };
            _this.$http.post('/api_admin.php', _this.$qs.stringify(data)).then((res) => {
                this.blockList = res.data.body || [];
                console.log(res);
            }).catch((response) => {
                _this.$Notice.error({
                    title: '错误提示',
                    desc: response
                });
            });
        },
        blockAdd (item) {
            this.$router.push({
                name: "block_template_list",
                params: {
                    blockname: item.b_name,
                    pageid: 1
                }
            });
            console.log(item);
        }
    }
}
</script>
<style type="text/css">
</style>