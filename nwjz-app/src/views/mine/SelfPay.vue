<template>
    <view-box ref="viewBox">
        <group title="付款信息" style="font-size:18px;">
            <x-input v-model="value" text-align="right" placeholder="请输入合同编号: 201803001" :max="9">
                <div slot="label">
                    <span style="font-size:15px;">合同编号</span>
                </div>
            </x-input>
            <x-input v-model="value" text-align="right" disabled>
                <div slot="label">
                    <span style="font-size:15px;">雇主姓名</span>
                </div>
            </x-input>
        </group>
        <group title="支付金额" style="font-size:18px;">
            <x-input v-model="value" text-align="right" placeholder="请输入金额">
                <div slot="label">
                    <span style="font-size:15px;">代收工资</span>
                </div>
            </x-input>
        </group>
        <!-- 底部预定按钮 -->
        <div class="buttonfooter" slot="bottom">
            <x-button type="primary">立即支付</x-button>
        </div>
    </view-box>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Toast,
    XInput,
    XButton
} from 'vux'
import {
    mapMutations,
    mapState
} from 'vuex'
import {
    wx_mp_authorize,
    fetchAllMyCoupon
} from '../../utils/api'
import { getStore } from '../../utils/mUtils'
export default {
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        Cell,
        Toast,
        XInput,
        XButton
    },
    data() {
        return {
            avatar: 'http://ojv9my13c.bkt.clouddn.com/avatar.jpeg',
            nickname: '登录/注册',
            status: 0,
            openId: getStore('WX_OPEN_ID'),
            userCoupones: {}
        }
    },
    created() {
        this.getWechatOpenId()
        this.getActiveCoupon()
    },
    mounted() {
        this.initData()
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
    },
    methods: {
        ...mapMutations([
            'RECORD_OPEN_ID'
        ]),
        goCoupon() {
            this.$router.push({
                path: '/coupon'
            })
        },
        initData() {
            if (this.userInfo && this.userInfo._id) {
                this.avatar = this.userInfo.avatar
                this.nickname = this.userInfo.nickname
            } else {
                this.nickname = '登录/注册'
                this.avatar = 'http://ojv9my13c.bkt.clouddn.com/avatar.jpeg'
            }
        },
        goToLogin() {
            if (!this.is_login) {
                this.$router.push({
                    path: '/login'
                })
            }
        },
        phoneCall() {
            window.location.href = 'tel://075583222339'
        },
        async getActiveCoupon() {
            if (this.is_login) {
                const params = {
                    status: 0
                }
                const res = await fetchAllMyCoupon(params)
                console.log(res)
                if (res.status === 0) {
                    this.userCoupones = res.data.userCoupones
                }
            }
        },
        async getWechatOpenId() {
            const code = this.$route.query.code
            const params = {
                code: code
            }
            const res = await wx_mp_authorize(params) // 微信公众号授权登录
            if (res.status === 0 && res.data.openid) {
                // this.$vux.toast.show(
                //     { text: res.data.openid }
                // )
                this.RECORD_OPEN_ID(res.data.openid)
            }
        }
    },
    watch: {
        userInfo(value) {
            this.initData()
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme.less';
.center {
    color: #fff;
    font-size: 18px;
    vertical-align: middle;
}
.avatarimg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #ececec;
}
.backgroundbox {
    background-color: @colorOne;
    height: 350px;
    top: -30%;
    left: -30%;
    width: 160%;
    position: absolute;
    border-radius: 50%;
}
.titlebox {
    border-radius: 5px;
    background-color: white;
    height: 85px;
    width: 85%;
    margin: 0 auto;
    box-shadow: 2px 2px 5px #888888;
}
.titleboxdiv {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 10px;
    .fspan {
        align-self: flex-end;
        font-size: 12px;
        font-weight: 500;
        color: #ff8e32;
    }
    .sspan {
        font-size: 13px;
        color: #999;
        margin-top: -10px;
        font-weight: 500;
    }
    .tspan {
        font-size: 20px;
        padding-top: 5px;
        font-weight: 600;
        color: #ec615d;
    }
}
.groupbox {
    background-color: #f4f4f4;
    margin: 10px;
}
.buttonfooter {
    background-color: @colorBackground;
    position: absolute;
    bottom: -3px;
    left: 0;
    height: 45px;
    width: 100%;
    z-index: 500;
}
</style>