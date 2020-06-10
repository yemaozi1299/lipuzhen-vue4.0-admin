<template>
    <Card class="distribution-rule-setting">
        <div class="tab-wrap">
            <ul class="distribution-menu">
                <li class="distribution-menu-item">
                    <router-link
                        :to="{ path: '/distribution/distribution_edit' }"
                        >分销设置</router-link
                    >
                </li>
                <li class="distribution-menu-item">
                    <router-link
                        :to="{
                            path: '/distribution/distribution_management/1'
                        }"
                        >分销员管理</router-link
                    >
                </li>
                <li class="distribution-menu-item">
                    <router-link :to="{ path: '/distribution/present_list/1' }"
                        >提现管理</router-link
                    >
                </li>
            </ul>
        </div>
        <div class="content">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </Card>
</template>

<script type="text/javascript"></script>

<!--  scoped -->
<style lang="stylus" rel="stylesheet/stylus">
.distribution-rule-setting {
    .tab-wrap {
        width: 100%;
        .distribution-menu {
            display: flex;
            align-items: center;
            width: 100%;
            height: 52px;
            border-bottom: 1px solid #d5d5de;
            .distribution-menu-item {
                margin-right: 10px;
                height: 49px;
                cursor: pointer;
                line-height: 49px;
                outline: 0;
                a {
                    display: block;
                    cursor: pointer;
                    padding: 0 20px;
                    color: #59607b;
                    font-size: 12px;
                    border-bottom: 2px solid transparent;
                    &.active {
                        border-bottom: 2px solid #3091f2;
                        color: #3091f2;
                    }
                }
            }
        }
    }
}
</style>