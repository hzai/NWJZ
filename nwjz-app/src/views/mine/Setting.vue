<template>
    <div class="container-view">
        <group :gutter="0" class="groupbox">
            <!-- <cell primary="content" is-link>
                <span slot="title" style="padding-left: 10px;font-size:15px;">帮助</span>
            </cell> -->
            <cell primary="content" is-link link="/feedback">
                <span slot="title" style="padding-left: 10px;font-size:15px;">意见反馈</span>
            </cell>
            <cell primary="content" is-link link="/about">
                <span slot="title" style="padding-left: 10px;font-size:15px;">关于了了管家</span>
            </cell>
            <cell primary="content" @click.native="logout" v-if="is_login">
                <span slot="title" style="padding-left: 10px;font-size:15px;">退出登录</span>
            </cell>
        </group>
    </div>
</template>

<script>
import {
    Group,
    Cell,
    Toast
} from 'vux'
import {
    logout
} from '../../utils/api'
import {
    mapMutations,
    mapState,
    mapActions
} from 'vuex'
export default {
    components: {
        Group,
        Cell,
        Toast
    },
    created() {
        this.TDAPP('W006', '用户打开设置')
        this.setPageTitle('设置')
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
    },
    methods: {
        ...mapMutations([
            'LOGOUT'
        ]),
        ...mapActions([
            'setPageTitle'
        ]),
        async logout() {
            this.TDAPP('W007', '用户点击退出')
            this.LOGOUT()
            const res = await logout()
            // TODO
            console.log(res)
            if (res.status === 0) {
                if (window.JPush) {
                    window.JPush.deleteAlias({ sequence: 11 },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    window.JPush.deleteTags({ sequence: 22, tags: ['member'] },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    window.JPush.resetBadge()
                    window.JPush.setApplicationIconBadgeNumber(0)
                }
                this.$vux.toast.show({
                    text: res.message
                })
            }
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less">
.groupbox {
    background-color: #f4f4f4;
    margin: 10px;
}
</style>
