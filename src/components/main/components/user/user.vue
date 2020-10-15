<template>
    <div class="user-avatar-dropdown">
        <Dropdown @on-click="handleClick">
            <Badge :dot="!!messageUnreadCount">
                <Avatar :src="userAvatar" icon="ios-person" />
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <!-- <DropdownItem name="message">
                    消息中心<Badge
                        style="margin-left: 10px;"
                        :count="messageUnreadCount"
                    ></Badge>
                </DropdownItem> -->
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
    name: 'User',
    props: {
        userAvatar: {
            type: String,
            default: ''
        },
        messageUnreadCount: {
            type: Number,
            default: 0
        }
    },
    methods: {
        ...mapActions([
            'handleLogOut'
        ]),
        logout () {
            if (this.$store.state.software == '1') {
                this.$http.request({
                    method: "POST",
                    url: "/login.php?mode=logout",
                    params: {}
                }).then((res) => {
                    console.log(res);
                }).catch((response) => {
                    this.$Notice.error({
                        title: '错误提示',
                        desc: response
                    });
                });
            } else {
                this.$router.push({
                    name: 'welcome'
                })
            }
        },
        message () {
            this.$router.push({
                name: 'message_page'
            })
        },
        handleClick (name) {
            switch (name) {
                case 'logout': this.logout()
                    break
                case 'message': this.message()
                    break
            }
        }
    }
}
</script>
