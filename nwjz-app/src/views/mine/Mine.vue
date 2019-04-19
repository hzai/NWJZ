<template>
    <div id="mine-view" class="container-view">
        <div style="height:290px;position:relative;overflow:hidden;">
            <div class="backgroundbox"></div>
            <flexbox :gutter="0" style="height:290px;position:absolute;" orient="vertical">
                <flexbox-item style="text-align:center;padding-top:70px;margin-bottom:10px;" @click.native="goToLogin">
                    <img class="avatarimg" :src="avatar" />
                    <br/><br/>
                    <span style="font-size:16px;color:white;font-weight:700;">{{nickname}}</span>
                </flexbox-item>
                <flexbox-item>
                    <flexbox :gutter="0" style="margin-top:15px;">
                        <flexbox-item>
                            <div class="titlebox" @click="goCharge()">
                                <div class="titleboxdiv">
                                    <span class="fspan">充值</span>
                                    <span class="sspan">我的余额</span>
                                    <span class="tspan">{{balance}}</span>
                                </div>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div class="titlebox" @click="goCoupon()">
                                <div class="titleboxdiv">
                                    <span class="fspan">兑换</span>
                                    <span class="sspan">我的优惠卷</span>
                                    <span class="tspan">{{userCoupones.length}}</span>
                                </div>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
            </flexbox>
        </div>
        <div class="groupbox">
            <group style="border-radius: 9%;font-size:14px;">
                <cell primary="content" is-link>
                    <i slot="icon" class="iconfont icon-yaoqing" style="color:#EC615D;" />
                    <span slot="title" style="padding-left: 10px;font-size:15px;">邀请</span>
                </cell>
                <cell primary="content" is-link link="/card">
                    <i slot="icon" class="iconfont icon-daifukuan" style="color:#EC615D;" />
                    <span slot="title" style="padding-left: 10px;font-size:15px;">了了保洁卡</span>
                </cell>
                <cell primary="content" is-link link="/addresslist">
                    <i slot="icon" class="iconfont icon-dizhi" style="color:#3cb7e3;"></i>
                    <span slot="title" style="padding-left: 10px;font-size:15px;">我的地址</span>
                </cell>
                <cell primary="content" is-link @click.native="phoneCall()" value="0755-83222339" style="font-size:14px;">
                    <i slot="icon" class="iconfont icon-kefurexian" style="color:#3cb7e3;"></i>
                    <span slot="title" style="padding-left: 10px;font-size:15px;">服务热线</span>
                </cell>
                <cell primary="content" is-link link="/setting">
                    <i slot="icon" class="iconfont icon-shezhi1" style="color:#3cb7e3"></i>
                    <span slot="title" style="padding-left: 10px;font-size:15px;">设置</span>
                </cell>

            </group>
        </div>
        <div v-transfer-dom>
            <popup v-model="show7" height="270px" is-transparent>
                <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <group>
                        <x-input title="卡号" v-model="card_number" ref="card_number" placeholder="请输入卡号" style="font-size:14px;" :show-counter="false" :rows="1" required @on-change="onNumberChange"></x-input>
                        <x-input title="密码" v-model="card_pwd" ref="card_pwd" placeholder="请输入密码" style="font-size:14px;" :show-counter="false" :rows="1" required @on-change="onCodeChange"></x-input>
                    </group>
                    <div style="padding:20px 15px;">
                        <x-button type="primary" :disabled="card_pwd_valid && card_number_valid" @click.native="activeCard(card_number, card_pwd)">兑换</x-button>
                        <x-button @click.native="show7 = false">取消</x-button>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Toast,
    XInput,
    Popup,
    TransferDom,
    XButton
} from 'vux'
import {
    mapMutations,
    mapState,
    mapActions
} from 'vuex'
import {
    wx_mp_authorize,
    fetchAllMyCoupon,
    fetchAllMyCard,
    activeAndChargeCard
} from '../../utils/api'
import { getStore } from '../../utils/mUtils'
import { removeAllSpace, md5 } from 'utils/mUtils'
export default {
    directives: {
        TransferDom
    },
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        Cell,
        Toast,
        XInput,
        Popup,
        XButton
    },
    data() {
        return {
            avatar: 'http://ojv9my13c.bkt.clouddn.com/avatar.jpeg',
            nickname: '登录/注册',
            status: 0,
            balance: 0,
            openId: getStore('WX_OPEN_ID'),
            userCoupones: {},
            userCards: {},
            show7: false,
            card_pwd: '',
            card_pwd_valid: true,
            card_number: '',
            card_number_valid: true
        }
    },
    created() {
        this.TDAPP('W001', '用户打开我的')
        this.getWechatOpenId()
        this.getActiveCoupon()
        this.getMyCards()
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
        ...mapActions([
            'getUserInfo'
        ]),
        onNumberChange() {
            this.card_number_valid = !this.$refs.card_number.valid
        },
        onCodeChange() {
            this.card_pwd_valid = !this.$refs.card_pwd.valid
        },
        goCoupon() {
            this.$router.push({
                path: '/coupon'
            })
        },
        goCard() {
            this.$router.push({
                path: '/card'
            })
        },
        goCharge() {
            if (!this.is_login) {
                this.$router.push({
                    path: '/login'
                })
            } else {
                this.card_pwd = ''
                this.card_number = ''
                this.show7 = true
            }
        },
        goInvite() {
            this.$router.push({
                path: '/invite'
            })
        },
        initData() {
            if (this.userInfo && this.userInfo._id) {
                this.avatar = this.userInfo.avatar
                this.nickname = this.userInfo.nickname
                this.balance = this.userInfo.balance
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
            this.TDAPP('W003', '用户打开意见反馈')
            window.location.href = 'tel://075583222339'
        },
        async getActiveCoupon() {
            if (this.is_login) {
                const params = {}
                const res = await fetchAllMyCard(params)
                if (res.status === 0) {
                    this.userCards = res.data.userCards
                }
            }
        },
        async getMyCards() {
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
            if (this.openId === null || this.openId === undefined || this.openId === '') {
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
        async activeCard(card_number, card_pwd) {
            const params = {
                card_number: removeAllSpace(card_number),
                card_pwd: md5(removeAllSpace(card_pwd).toLowerCase())
            }
            const res = await activeAndChargeCard(params)
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '了了保洁卡充值成功！',
                    width: '18em'
                })
                this.getUserInfo()
                this.show7 = false
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message,
                    width: '18em'
                })
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
</style>