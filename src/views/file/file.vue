<template>
    <Card>
        <fileExplorer
            v-model="showFile"
            :options="options"
            @successCallback="success"
        ></fileExplorer>
    </Card>
</template>

<script type="text/javascript">
import fileExplorer from '@/components/fileExplorer/fileExplorer';
export default {
    components: {
        fileExplorer
    },
    data () {
        return {
            options: {
                mode: "view",
                _displayMode: 'grid',  // grid 和 list
                type: '',
                appid: this.$cookieStore.get("CookVueAppid")
            },
            showFile: true
        }
    },
    created () {
    },
    methods: {
        success: function (files) {
            console.log(files);
        }
    }
}

</script>



