<template>
    <div class="login-view">
        <div class="content">
            <flexbox :gutter="15" style="padding-top:80px;" orient="vertical" justify="center" align="center" v-if="env">
                <flexbox-item :span="1/4">
                    <group :gutter="0">
                        <x-input class="login-cell" v-model="mobile" ref="mobile" placeholder="请输入手机号" is-type="china-mobile" :icon-type="mobileIconType" :max="13" required @on-change="onMobileChange">
                            <i slot="label" class="iconfont icon-shoujiyanzheng" style="padding-right:10px;"></i>

                        </x-input>
                    </group>
                </flexbox-item>
                <flexbox-item :span="1/5">
                    <group :gutter="0">
                        <x-input class="login-cell" v-if="codeInputVisible" v-model="verify_code" ref="verify_code" placeholder="验证码" :max="6" required @on-change="onCodeChange">
                            <i slot="label" class="iconfont icon-ecurityCode" style="padding-right:10px;"></i>
                            <span slot="right" v-if="!show">{{count+'s'}}</span>
                            <span slot="right" v-if="show" @click="sendSMS" style="font-size:16px;color:#00AF3F">重新发送</span>
                        </x-input>
                    </group>
                </flexbox-item>
                <flexbox-item :span="1/4">
                    <div style="width:88%;margin:0 auto;padding-top:15px;">
                        <x-button v-if="!codeInputVisible" type="primary" @click.native="sendSMS" class="login-button" :disabled="valid1">下一步</x-button>
                        <x-button v-if="codeInputVisible" type="primary" @click.native="bindMobile" class="login-button" :disabled="valid2">绑定手机</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
import {
    Group,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Divider,
    Toast
} from 'vux'
import {
    sms,
    wx_mp_authorize,
    wx_app_authorize,
    loginByWechat,
    getMessage
} from '../../utils/api'
import {
    getStore,
    removeStore
} from 'utils/mUtils'
import {
    mapMutations,
    mapActions
} from 'vuex'
import { isWechat, isiOS } from 'utils/whatdevice'
const TIME_COUNT = 60
export default {
    components: {
        Group,
        XInput,
        XButton,
        Flexbox,
        FlexboxItem,
        Divider,
        Toast
    },
    data() {
        return {
            openid: '',
            unionid: '',
            showAlert: false, // 显示提示组件
            alertText: null, // 提示的内容
            mobileIconType: '',
            verifyCodeIconType: '',
            codeInputVisible: false, // 默认不显示验证码输入框
            count: '',
            timer: null,
            show: true,
            mobile: '',
            password: '',
            verify_code: '',
            errorMessage: '',
            valid1: true,
            valid2: true,
            messages: {},
            env: process.env.NODE_ENV === 'development' || (isiOS() && !isWechat())
        }
    },
    created() {
        // this.setPageTitle('绑定手机号')
        this.getWechatOpenId()
    },
    methods: {
        ...mapMutations(['RECORD_USERINFO', 'RECORD_OPEN_ID']),
        ...mapActions(['setPageTitle']),
        onMobileChange() {
            this.valid1 = !this.$refs.mobile.valid
        },
        onCodeChange() {
            this.valid2 = !this.$refs.verify_code.valid
        },
        async sendSMS() {
            if (!this.mobile || !this.$refs.mobile.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请输入正确的手机码'
                })
                return
            }
            const params = {
                mobile: this.mobile
            }
            const res = await sms(params)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '验证码已发送'
                })
                this.codeInputVisible = true
                if (!this.timer) {
                    this.count = TIME_COUNT
                    this.show = false
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--
                        } else {
                            this.show = true
                            clearInterval(this.timer)
                            this.timer = null
                        }
                    }, 1000)
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message
                })
            }
        },
        /**
         * 手机绑定程序
         */
        async bindMobile() {
            if (!this.mobile || !this.$refs.mobile.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请输入正确的手机码'
                })
                return
            }
            if (!this.verify_code || !this.$refs.verify_code.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请输入正确的验证码'
                })
                return
            }
            const params = {
                mobile: this.mobile,
                verify_code: this.verify_code,
                openid: this.openid,
                unionid: this.unionid
            }
            const res = await loginByWechat(params)
            console.log(res)
            if (res.status === 0 && res.type === 'SUCCESS') {
                this.TDAPP('U002', '用户绑定手机号码')
                this.RECORD_USERINFO(res.data)
                if (window.JPush) {
                    window.JPush.setAlias({ sequence: 1, alias: res.data.auth.user._id },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    window.JPush.addTags({ sequence: 2, tags: ['member'] },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    this.getMyMessageData()
                    const badge = this.messages.length > 0 ? this.messages.length : 0
                    window.JPush.setApplicationIconBadgeNumber(badge)
                    window.JPush.setBadge(badge)
                }
                // 尝试to from 方式
                const url = getStore('beforeLoginUrl')
                if (url !== null) {
                    this.$router.push({
                        path: url,
                        query: {
                            isNewUser: res.data.isNewUser,
                            subscribed: res.data.subscribed
                        }
                    })
                    removeStore('beforeLoginUrl')
                } else {
                    this.$router.push({
                        path: '/mine'
                    })
                }
            } else if (res.status === 0 && res.type === 'WECHAT_BINDING_FAILED') {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message
                })
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message
                })
            }
        },
        /**
         * 获取微信openId 和 unionId, 如果unionId 存在直接登录，如果不存在，进入手机绑定程序
         */
        async getWechatOpenId() {
            const code = this.$route.query.code
            const from = this.$route.query.from
            const params = {
                code: code
            }
            let res = null
            if (from === 'app') {
                res = await wx_app_authorize(params) // 微信APP授权登录
            } else {
                res = await wx_mp_authorize(params) // 微信公众号授权登录
            }
            if (res.status === 0 && res.type === 'NO_REGISTERED_OPENID' && res.data.openid) {
                this.openid = res.data.openid
                this.unionid = res.data.unionid
                this.RECORD_OPEN_ID(this.openid)
            } else if (res.status === 0 && res.type === 'SUCCESS' && res.data.openid) {
                this.openid = res.data.openid
                this.unionid = res.data.unionid
                this.RECORD_OPEN_ID(this.openid)
                this.RECORD_USERINFO(res.data)
                if (window.JPush) {
                    window.JPush.setAlias({ sequence: 1, alias: res.data.auth.user._id },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    window.JPush.addTags({ sequence: 2, tags: ['member', 'wechat'] },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    this.getMyMessageData()
                    const badge = this.messages.length > 0 ? this.messages.length : 0
                    window.JPush.setApplicationIconBadgeNumber(badge)
                    window.JPush.setBadge(badge)
                }
               // 尝试to from 方式
                const url = getStore('beforeLoginUrl')
                if (url !== null) {
                    this.$router.push({
                        path: url,
                        query: {
                            isNewUser: res.data.isNewUser,
                            subscribed: res.data.subscribed
                        }
                    })
                    removeStore('beforeLoginUrl')
                } else {
                    this.$router.push({
                        path: '/mine'
                    })
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message
                })
            }
        },
        async getMyMessageData() {
            console.log('start to get message')
            const res = await getMessage({ status: 0 })
            console.log(res)
            if (res.status === 0 && res.data.messages) {
                this.messages = res.data.messages
            }
        }
    }
}
</script>


<style lang="less">
@import '../../assets/less/theme.less';
.login-view {
    background-color: #ffffff;
    height: 100%;
    .content {
        color: @colorFontBlack;
    }
    button,
    .weui-btn_primary {
        background-color: @colorOne;
    }
    p {
        margin-top: 10px;
        text-align: center;
    }
    .header {
        background-color: #fbf9fe;
    }
    h1 {
        color: #35495e;
        font-size: 24px;
    }
}
.login-button {
    border-radius: 20px !important;
    color: @colorFontWhite!important;
    &:active {
        background-color: transparent;
    }
}
.login-cell {
    border: 1px solid @colorLine;
    border-radius: 20px;
    width: 80%;
    margin: 0 auto;
}
.weui-cells::after {
    border-bottom: 0px !important;
}
.weui-cells::before {
    border-top: 0px !important;
}
</style>