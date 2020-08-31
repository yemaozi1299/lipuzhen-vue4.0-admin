<template>
    <div>
        <Dropdown trigger="click" @on-click="selectLang">
            <a href="javascript:void(0)">
                {{ title }}
                <Icon :size="18" type="md-arrow-dropdown" />
            </a>
            <DropdownMenu slot="list">
                <DropdownItem
                    v-for="(value, key) in localList"
                    :name="key"
                    :key="`lang-${key}`"
                    >{{ value }}</DropdownItem
                >
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {
    name: 'Language',
    props: {
        lang: String
    },
    data () {
        return {
            langList: {
                'responsive': '响应式',
                'wxxcx': '小程序'
            },
            localList: {
                'responsive': '响应式',
                'wxxcx': '小程序'
            }
        }
    },
    computed: {
        title () {
            return this.langList[this.lang] || "设置"
        }
    },
    methods: {
        selectLang (name) {
            this.$emit('on-lang-change', name)
        }
    }
}
</script>
