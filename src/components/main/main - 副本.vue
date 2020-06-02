<template>
    <Layout style="height: 100%" class="main" id="main">
        <Sider
            ref="side1"
            hide-trigger
            collapsible
            :collapsed-width="78"
            v-model="isCollapsed"
        >
            <Menu
                :active-name="selected"
                theme="dark"
                width="auto"
                :class="menuitemClasses"
            >
                <MenuItem name="home" :to="{ name: 'home' }">
                    <Icon type="md-home" />
                    <span>首页</span>
                </MenuItem>
                <MenuItem name="shop" :to="{ path: '/shop' }">
                    <Icon type="md-cart" />
                    <span>商品管理</span>
                </MenuItem>
                <MenuItem name="shoporder" :to="{ path: '/shoporder' }">
                    <Icon type="ios-clipboard-outline" />
                    <span>订单管理</span>
                </MenuItem>
                <MenuItem name="file" :to="{ name: 'file_images' }">
                    <Icon type="ios-albums-outline" />
                    <span>文件管理</span>
                </MenuItem>
                <MenuItem name="shoppost" :to="{ name: 'shoppost' }">
                    <Icon type="ios-cart-outline" />
                    <span>配送方式</span>
                </MenuItem>
                <MenuItem name="seckill" :to="{ name: 'seckill' }">
                    <Icon type="ios-timer-outline" />
                    <span>秒杀</span>
                </MenuItem>
            </Menu>
        </Sider>
        <Layout>
            <Header class="layout-header-bar">
                <Icon
                    @click.native="collapsedSider"
                    :class="rotateIcon"
                    :style="{ margin: '0 20px' }"
                    type="md-menu"
                    size="24"
                ></Icon>
            </Header>
            <Content class="content-wrapper">
                <!-- <keep-alive>          //keep-alive有点问题，不显示的网页会调用api
					<router-view/>
				</keep-alive> -->
                <router-view />
            </Content>
        </Layout>
    </Layout>
</template>

<script>
export default {
    name: 'Main',
    data () {
        return {
            isCollapsed: false,
            selected: this.$route.name || 'home'
        }
    },
    watch: {
        '$route': 'fetchData',
    },
    computed: {
        rotateIcon () {
            return [
                'menu-icon',
                this.isCollapsed ? 'rotate-icon' : ''
            ];
        },
        menuitemClasses () {
            return [
                'menu-item',
                this.isCollapsed ? 'collapsed-menu' : ''
            ]
        }
    },
    methods: {
        collapsedSider () {
            this.$refs.side1.toggleCollapse();
        },
        fetchData: function () {
            this.selected = this.$route.path.split('/')[1];
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#main
</style>
<style scoped>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-header-bar {
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.menu-icon {
    transition: all 0.3s;
}
.rotate-icon {
    transform: rotate(-90deg);
}
.menu-item {
    overflow: hidden;
}
.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
}
.menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span {
    width: 0px;
    float: left;
    transition: width 0.2s ease;
}
.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
}
.content-wrapper {
    padding: 17px 0px 17px 17px;
    overflow: auto;
    background-color: #e5e6ee;
    transition: all 0.2s;
}
</style>

