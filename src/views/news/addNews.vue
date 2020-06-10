<template>
    <Card>
        <p slot="title">添加新闻</p>
        <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
            style="padding-bottom: 30px;"
        >
            <Form-item label="名称" prop="title">
                <Input
                    v-model="formValidate.title"
                    placeholder="请输入名称"
                ></Input>
            </Form-item>
        </Form>
    </Card>
</template>

<script>
export default {
    components: {

    },
    data () {
        return {
            formValidate: {},
            ruleValidate: []
        }
    },
    created () {

    },
    methods: {

    }
}
</script>
