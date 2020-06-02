<template>
    <Layout style="height: 100%" class="main">
        <Sider
            hide-trigger
            collapsible
            :width="256"
            :collapsed-width="64"
            v-model="collapsed"
            class="left-sider"
            :style="{ overflow: 'hidden' }"
        >
            <side-menu
                accordion
                ref="sideMenu"
                :active-name="activeName"
                :collapsed="collapsed"
                @on-select="turnToPage"
                :menu-list="menuList"
            >
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                    <img v-show="collapsed" :src="minLogo" key="min-logo" />
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar
                    :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange"
                >
                    <!-- <user
                        :message-unread-count="unreadCount"
                        :user-avatar="userAvatar"
                    /> -->
                    <!-- <fullscreen
                        v-model="isFullscreen"
                        style="margin-right: 10px;"
                    /> -->
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <!-- <div class="tag-nav-wrapper">
                        <tags-nav
                            :value="$route"
                            @input="handleClick"
                            :list="tagNavList"
                            @on-close="handleCloseTag"
                        />
                    </div> -->
                    <Content class="content-wrapper">
                        <!-- <keep-alive :include="cacheList"> -->
                        <router-view />
                        <!-- <ABackTop :height="100"
                                  :bottom="80"
                                  :right="50"
                                  container=".content-wrapper"></ABackTop> -->
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
// import TagsNav from './components/tags-nav'
// import User from './components/user'
import './main.less'
import {
    getMenuByRouter
} from '@/libs/util'
export default {
    name: 'Main',
    components: {
        SideMenu,
        HeaderBar
    },
    data () {
        return {
            isCollapsed: false,
            collapsed: false,
            minLogo,
            maxLogo,
            isFullscreen: false,
            activeName: this.$route.path.split('/')[1]
        }
    },
    watch: {
        '$route': 'fetchData',
    },
    created () {
        console.log(this.menuList);
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
        },
        // cacheList () {
        //     const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
        //     return list
        // },
        menuList () {
            return this.$store.getters.menuList
        },
        menuList () {
            return this.$store.getters.menuList
        }
    },
    methods: {
        collapsedSider () {
            this.$refs.side1.toggleCollapse();
        },
        fetchData: function () {
            this.activeName = this.$route.path.split('/')[1];
        },
        handleCollapsedChange (state) {
            this.collapsed = state
        },
        turnToPage (route) {
            let { name, params, query } = {}
            if (typeof route === 'string') name = route
            else {
                name = route.name
                params = route.params
                query = route.query
            }
            if (name.indexOf('isTurnByHref_') > -1) {
                window.open(name.split('_')[1])
                return
            }
            this.$router.push({
                name,
                params,
                query
            })
        }
    }
}
</script>

<style scoped>
/* .layout {
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
} */
</style>

