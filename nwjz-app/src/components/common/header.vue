<template>
    <x-header style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;background-color:#00AF3F;color:#ffffff;" :left-options="leftOptions" :right-options="rightOptions" :title="title" :transition="headerTransition" @on-click-more="onClickMore">
        <span v-if="this.$route.path === '/'" slot="overwrite-left" class="leftspan">
            <i slot="overwrite-left" class="iconfont icon-dizhiguanli" :class="icon_left"></i>
            <span slot="overwrite-left" class="stringLeft">深圳</span>
        </span>
        <span v-else-if="this.$route.path !== '/order' && this.$route.path !== '/mine'" slot="overwrite-left" class="leftspan" @click="back()">
            <i slot="overwrite-left" class="iconfont icon-fanhui" :class="icon_left"></i>
            <span slot="overwrite-left" class="stringLeft">返回</span>
        </span>
        <span slot="right" v-if="this.$route.path === '/'" style="color:white;font-size:18px;" @click="msg()">
            <i class="iconfont icon-xiaoxi1" style="font-size:18px;">
                <badge v-if="this.messages.length>0" style="vertical-align: top;"></badge>
            </i>
        </span>
    </x-header>
</template>


<script>
import {
    Badge,
    XHeader,
    Confirm
} from 'vux'
import {
    getMessage
} from 'utils/api'
import {
    mapState
} from 'vuex'
export default {
    props: {
        icon_left: String
    },
    components: {
        Badge,
        XHeader,
        Confirm
    },
    data() {
        return {
            messages: {}
        }
    },
    created() {
        this.getMyMessageData()
    },
    computed: {
        ...mapState([
            'is_login',
            'page_title'
        ]),
        headerTransition() {
            if (!this.direction) return ''
            return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
        },
        title() {
            // console.log(this.$route)
            return this.page_title
        },
        leftOptions() {
            return {
                showBack: false
            }
        },
        rightOptions() {
            if (this.$route.name === '我的地址') {
                return {
                    showMore: false
                }
            } else {
                return {
                    showMore: false
                }
            }
        }
    },
    methods: {
        onClickMore() {
            this.$router.push({
                path: '/login'
            })
        },
        onLeftClick() {
            this.$emit('leftClick')
        },
        onRightClick() {
            this.$emit('rightClick')
        },
        back() {
            if (this.$route.path === '/login') {
                this.$router.push({
                    path: '/'
                })
            } else if (this.$route.path === '/pay/payorder') {
                this.cancelPayConfirm()
            } else if (this.$route.path === '/comment') {
                this.cancelCommentConfirm()
            } else {
                this.$router.go(-1)
            }
        },
        msg() {
            this.$router.push({
                path: '/msglist'
            })
        },
        cancelPayConfirm() {
            const _this = this
            this.$vux.confirm.show({
                title: '温馨提示',
                content: '是否取消支付？',
                onShow() {
                },
                onHide() {
                },
                onCancel() {
                },
                onConfirm() {
                    _this.TDAPP('D004', '用户取消支付')
                    _this.$router.push({
                        path: '/order'
                    })
                }
            })
        },
        cancelCommentConfirm() {
            const _this = this
            this.$vux.confirm.show({
                title: '确认关闭评价？',
                content: '关闭后当前评价信息不会保留',
                confirmText: '再想想',
                cancelText: '关闭评价',
                onShow() {
                },
                onHide() {
                },
                onCancel() {
                    _this.TDAPP('COMMENT004', '用户取消评价')
                    _this.$router.push({
                        path: '/order'
                    })
                },
                onConfirm() {
                }
            })
        },
        async getMyMessageData() {
            if (this.is_login) {
                const res = await getMessage({ status: 0 })
                console.log(res)
                if (res.status === 0 && res.data.messages) {
                    this.messages = res.data.messages
                }
            }
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme.less';
.vux-header-more {
    color: white !important;
    &:after {
        font-size: 14px !important;
    }
}
.vux-header-back {
    color: white !important;
}
.leftspan {
    color: white;
    font-size: 16px;
}
.leftspan i {
    font-size: 16px;
}
</style>