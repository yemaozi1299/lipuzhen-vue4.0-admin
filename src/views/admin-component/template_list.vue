<template>
    <Card dis-hover>
        <templateList :isAdd="isAdd" @successCallback="success"></templateList>
    </Card>
</template>

<script type="text/javascript">
import templateList from '@/views/admin-component/components/templateList.vue';
export default {
    components: {
        templateList
    },
    data () {
        return {
            isAdd: false
        }
    },
    created () {
    },
    methods: {
        success: function (params) {
            console.log(params);
        }
    }
}

</script>



