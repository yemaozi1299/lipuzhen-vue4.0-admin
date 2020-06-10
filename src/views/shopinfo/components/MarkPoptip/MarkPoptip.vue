<template>
    <Poptip placement="left">
        <Button type="text" size="small" style="color: #108ee9">查看</Button>
        <div class="mark-poptip" slot="content" style="width:218px;height:290px;position:relative">
            <img :src="src1" alt="" style="width:100%;height:auto;display:block">
            <div style="padding:10px 0">
                <a :href="src1" download="下载">下载</a>
            </div>
        </div>
    </Poptip>
</template>

<script>
    export default {
        props: {
            placement:{
                type: String,
            },
            src1:{
                type: String,
            }
        },
        data(){
            return{
            }
        },
        mounted() {
        },
        methods: {
            markSuccess(){
                this.$http.put(`/jobs/mark/success/${this.job_id}`).then( response => {
                    this.$Message.success('操作成功');
                    this.$emit('statusUpdated');    // 重新请求列表数据
                })
            }
        }
    }
</script>
