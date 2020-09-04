<template>
    <div :class="classes" v-on:click="onClick">
        <a href="javascript:void(0)"><slot></slot></a>
        <span v-if="border" class="divider"></span>
    </div>
</template>

<script type="text/javascript">
const prefixCls = 'rich-btn';
export default {
    name: 'Buttons',
    props: {
        border: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'default'
        },
    },
    data () {
        return {

        }
    },
    methods: {
        onClick (val) {
            this.$emit('click', val)
        }
    },
    computed: {
        classes () {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.type}`
            ];
        },
    }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
.rich-btn {
    display: inline-block;
    color: #108ee9;
    background: transparent;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition: color 0.3s ease;
    font-size: 12px;
    a {
        color: inherit; // 继承父元素颜色
        &:active, &:hover {
            outline: 0;
            text-decoration: none;
        }
        &:focus {
            text-decoration: underline;
            text-decoration-skip: ink;
        }
    }
    &:hover {
        color: #49a9ee;
    }
    .divider {
        margin: 0 6px;
        display: inline-block;
        height: 8px;
        width: 1px;
        background: #ccc;
    }
}
.rich-btn-primary {
    color: #57a3f3;
    &:hover {
        color: #2b85e4;
    }
}
.rich-btn-default {
    color: #108ee9;
}
.rich-btn-info {
    color: #2db7f5;
    &:hover {
        color: #57c5f7;
    }
}
.rich-btn-success {
    color: #19be6b;
    &:hover {
        color: #47cb89;
    }
}
.rich-btn-warning {
    color: #f90;
    &:hover {
        color: #ffad33;
    }
}
.rich-btn-error {
    color: #ed4014;
    &:hover {
        color: #f16643;
    }
}
</style>