<style scoped>
.expand-row {
    margin-bottom: 10px;
}
.expand-key {
    font-weight: 900;
}
</style>
<template>
    <div>
        <Row>
            <Col span="12">
                <span class="expand-key">IP地址: </span>
                <span class="expand-value">{{ row.ip }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">回复时间: </span>
                <span class="expand-value">{{ row.day }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">回复内容: </span>
                <span class="expand-value">{{ row.message }}</span>
            </Col>
        </Row>
        <div
            v-for="item in row.reply"
            style="padding: 5px;margin-bottom: 10px;background: #fefefe;"
        >
            <Row>
                <Col span="12">
                    <span class="expand-key"
                        >{{ item.name || "管理员" }} | {{ item.day }} ：</span
                    >
                </Col>
                <Col span="12">
                    <Buttons type="error" v-on:click="delReply(item)"
                        >删除</Buttons
                    >
                </Col>
            </Row>
            <Row class="expand-row">
                <Col span="24">
                    <span class="expand-value">{{ item.message }}</span>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
import Buttons from '@/components/buttons'
export default {
    name: 'shopList',
    components: {
        Buttons
    },
    props: {
        row: Object
    },
    methods: {
        delReply (item) {
            this.$emit("on-del-reply", item.id);
        }
    }
};
</script>