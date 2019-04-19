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
                        <x-button v-if="codeInputVisible" type="primary" @click.native="login" class="login-button" :disabled="valid2">登录</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
            <!-- <div style="position:absolute;padding-bottom:50px;bottom:0;"> -->
            <div style="padding-top:80px;" v-if="isWechatLoginVisiable()">
                <!-- <divider>使用第三方登录</divider> -->
                <div style="text-align:center;font-size:18px;" @click="wechatAuthorize">
                    <i class="iconfont icon-weixin2" style="font-size:80px;color:rgba(113, 197, 38, 0.9)"></i><br/>
                    <span>微信登录</span>
                </div>
            </div>
            <flexbox :gutter="15" style="padding-top:80px;" orient="vertical" justify="center" align="center">
                <flexbox-item :span="1/4" v-if="!codeInputVisible">
                    <div style="padding-top:20px;">
                        <div style="text-align:center;">
                            <span>点击“下一步/微信登录”，即同意
                                <router-link :to="{path:'userprotocol'}">《了了管家用户协议》</router-link>
                            </span>

                        </div>
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
    loginByMobile,
    wx_mp_authorize_url,
    wx_mp_authorize_silence_url,
    getMessage
} from '../../utils/api'
import {
    mapMutations,
    mapActions
} from 'vuex'
import { isWechat, isMobile, isiOS, isiPad } from 'utils/whatdevice'
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
        this.setPageTitle('登录')
    },
    methods: {
        ...mapMutations(['RECORD_USERINFO']),
        ...mapActions(['setPageTitle']),
        isWechatLoginVisiable() {
            if (isWechat() && isMobile()) {
                return true
            } else {
                return !isiPad()
            }
        },
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
                    text: '验证码已发送',
                    width: '10em'
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
                    text: res.message,
                    width: '10em'
                })
            }
        },
        async login() {
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
                verify_code: this.verify_code
            }
            const res = await loginByMobile(params)
            console.log(res)
            if (res.status === 0) {
                this.RECORD_USERINFO(res.data)
                if (window.JPush) {
                    window.JPush.setAlias({ sequence: 1, alias: res.data.auth.user._id },
                        (result) => {
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        })
                    window.JPush.addTags({ sequence: 2, tags: ['member', 'mobile'] },
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
                if (isWechat() && isMobile()) {
                    const url_params = {
                        state: res.data.auth.user._id // 用户_id
                    }
                    const url_res = await wx_mp_authorize_silence_url(url_params)
                    if (url_res.status === 0) {
                        console.log(url_res.url)
                        // const redirect_res = redirect_silence_url(url_res.url)
                        window.location.href = url_res.url
                        // console.log(redirect_res)
                    }
                } else {
                    this.$router.go(-1)
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message,
                    width: '10em'
                })
            }
        },
        async wechatAuthorize() {
            console.log('start wechat....')
            this.TDAPP('U001', '用户微信登录')
            if (isWechat() && isMobile()) {
                const res = await wx_mp_authorize_url()
                if (res.status === 0) {
                    console.log(res.url)
                    window.location.replace(res.url)
                }
            } else if (window.Wechat) {
                window.Wechat.isInstalled((installed) => {
                    // if (installed) {
                    const scope = 'snsapi_userinfo'
                    const state = '_' + (+new Date())
                    window.Wechat.auth(scope, state, (response) => {
                        // auth success with response
                        console.log('auth success with response')
                        console.log(response)
                        // this.getWechatOpenId(response.code)
                        this.$router.replace({
                            path: '/bindmobile',
                            query: {
                                code: response.code,
                                from: 'app'
                            }
                        })
                    }, (reason) => {
                        // auth failed with reason
                        console.log(reason)
                        console.log('auth failed with reason  ')
                        this.$vux.toast.show(
                            { type: 'cancel', text: '微信授权登录失败', width: '12em' }
                        )
                    })
                    // } else {
                    //     // todo when uninstalled
                    //     this.$vux.toast.show(
                    //         { type: 'cancel', text: '您还没有安装微信，请先安装微信。', width: '12em' }
                    //     )
                    // }
                }, (reason) => {
                    // todo when uninstalled
                    // this.$vux.toast.show(
                    //     { type: 'cancel', text: '您还没有安装微信，请先安装微信。', width: '12em' }
                    // )
                })
            } else {
                this.$vux.toast.show(
                    { type: 'cancel', text: '请关注【了了管家】微信公众号', width: '12em' }
                )
            }
        },
        async getMyMessageData() {
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