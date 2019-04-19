<template>
    <view-box ref="viewBox">
        <div style="background-color:#f33233;padding:10px 0;" v-if="this.event.service.primary_pic">
        <div class="guize" @click="showgz()">
                        活动<br> 规则
                    </div>
            <flexbox style="margin:10px 0 10px;" v-if="!isSameUser">
                <flexbox-item :span="1/6">
                    <div class="avatarme" :style="inviter_avatar" style="margin-left:20px;"></div>
                </flexbox-item>
                <flexbox-item>
                    <span style="border:1px solid #fff;border-radius:5px;font-size:14px;color:white;padding:5px;">新用户才能助力，你也可以自己领哦！</span>
                </flexbox-item>
            </flexbox>

            <div style="padding:0 20px;" v-if="event">
                <flexbox :gutter="0" wrap="wrap" orient="vertical" style="background-color:white;">
                    <flexbox-item @click.native="goInivit()">
                        <div>
                            <img :src="event.service.primary_pic" style="width:100%;height:70%;" />
                        </div>
                    </flexbox-item>
                    <flexbox-item style="padding-top:8px;">
                        <span class="title">{{event.service.title}}</span>
                    </flexbox-item>
                    <flexbox-item style="padding-top:3px;padding-bottom:10px;">
                        <div v-cloak>
                            <span class="money">原价：¥{{event.service.sale_price}}
                            </span>
                            <span style="color:#4f4f4f;font-size:14px;font-weight: 400;float:right;padding-right:20px;">{{event.service.sell_count}}人已免费领</span>
                        </div>
                         <div style="margin-top:-110px;margin-right:20px;float:right;" v-if="status >= 8">
                            <img src="http://images.llguanjia.com/zhulicg2.png" style="width:120px;height:120px;">
                        </div>
                    </flexbox-item>
                </flexbox>
            </div>
            <!-- <div class="afj-button-main" v-if="(!isZhuli && !isSameUser) && status < 8" @click="assistTa()">为TA助力</div>
            <div class="afj-button-main" v-if="(isZhuli && !noinvite && !isSameUser) || (!noinvite && !isSameUser && status >= 8)" @click="showkt()">我也要免费领取</div>
            <div class="afj-button-main" v-if="isSameUser && status < 8" @click="showWechatMenu()">去邀请</div> -->
            <div class="afj-button-main" v-if="isSameUser && status >= 8" @click="goSubmiteorder()">助力成功，去预约</div>
            <div class="afj-button-main" v-else >本期活动已结束</div>
            <!-- <div style="padding:10px 20px;" v-if="status >= 5">
                <img src="http://images.llguanjia.com/zlcg.jpg" style="height:100%;width:100%;" alt="">
            </div> -->

            <div style="margin: 10px 40px;">
                <divider style="color:white;font-size:13px;font-weight:700;">成功助力好友</divider>
                <flexbox wrap="wrap" align="center">
                    <!-- <flexbox-item :span="1/6" style="padding: 5px 0;margin:0 auto;">
                        <div class="avatartapme" v-if="is_login && isSameUser">我</div>
                        <div class="avatarme" :style="inviter_avatar"></div>
                    </flexbox-item> -->
                    <flexbox-item :span="1/4" style="padding: 5px 0;margin:0 auto;" v-for="(item, index) in avatarList" :key="index">
                        <div class="avatarno" v-if="item.avatar === ''">?</div>
                        <div v-if="item.avatar !== ''" style="text-align:center;">
                            <img :src="item.avatar" class="avatarme">
                        </div>
                    </flexbox-item>
                </flexbox>
            </div>

            <div style="text-align:center;" v-if="isSameUser">
                <span style="color:white;font-size:14px;font-weight:700;" v-if="status < 8">再邀请
                    <span style="font-size:16px;" v-if="status < 8">{{8-status}}位</span> 好友助力即可免费领取～</span>
            </div>
            <div style="text-align:center;">
                <span style="color:#faa18e;font-size:14px;font-weight:700;" v-if="!isSameUser">已帮好友助力，自己也可以免费领哦～</span>
            </div>
            <div class="boxs">
                <divider style="padding-top:15px;color:white;">好友助力详情</divider>
                <flexbox v-for="(item, _id) in invitedList" :key="_id" style="margin:10px 15px;">
                    <flexbox-item :span="1/7">
                        <img :src="item.avatar" class="avataruelist">
                    </flexbox-item>
                    <flexbox-item>
                        <span class="usrt"> &nbsp;{{starName(item.name)}}<br>
                        </span>
                        <span class="usersub">{{item.created_time | dateTimeFormatFilter}}</span>
                    </flexbox-item>
                    <flexbox-item :span="2/7">
                        <span class="zlcg">
                            {{item.remark}}<br>
                        </span>
                        <span v-if="!item.success" class="usersub">非新用户</span>
                    </flexbox-item>
                </flexbox>
                <div style="text-align:center;color:white;" v-if="invitedList.length===0">
                    <span>暂时还没有好友给你助力</span>
                </div>
            </div>

            <div v-transfer-dom>
                <popup v-model="show7" height="400px" is-transparent>
                    <div style="width: 95%;background-color:#fff;height:380px;margin:0 auto;border-radius:5px;padding-top:10px;">
                        <divider>助力享免单规则</divider>
                        <div style="margin:0 20px;">
                            <span>1. 本活动由“了了管家”官方微信公众号举办，无论是否购买过相关服务或产品均可参加，只要关注“了了管家”公众号，均可获得3小时免费保洁服务。（仅开放深圳地区）</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>2. 点击了了管家微信公众号“优惠活动”菜单，选择“助力享免单”即可进入活动页面。参加者每个微信号及服务地址仅可参与一次好友助力活动，好友助力仅限邀请新用户才算助力成功。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>3. 活动时间至2018年10月31日结束。截止前邀请满8名新用户即可获得免费名额。活动截止后一个月内，已获得免费名额且未预约的可继续预约免费保洁服务。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>4. 每日早上10点开放第二天的服务名额，助力成功后，通过公众号“优惠活动”菜单，点击“助力享面单”进行预约服务。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>5. 服务范围:包含深圳市福田区、罗湖区、南山区、龙华区、宝安区（宝安中心区）、龙岗区（布吉、布心、龙岗中心区）。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>6. 本次活动赠送的免费保洁服务将完全免费，主办方不会以各种名义收取用户任何费用，如保洁用具、专业清洗剂、上门服务费用等。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;">
                            <span>7. 如发现作弊行为，了了管家有权取消其获奖资格。</span>
                        </div>
                    </div>
                </popup>
            </div>

            <div v-transfer-dom>
                <popup v-model="show1" height="100%">
                    <img src="http://images.llguanjia.com/share.jpg" style="width:100%;height:100%;" @click="closePopup()">
                </popup>
            </div>

            <div v-transfer-dom>
                <popup position="top" v-model="show8" height="360px" style="margin-top:120px;" is-transparent>
                    <div style="width: 95%;height:340px;background-color:#fff;margin:0 auto; border-radius:5px;padding-top:10px;">
                        <divider>如何预约</divider>
                        <div style="text-align:center;padding-bottom:15px;">
                            <img src="http://images.llguanjia.com/qrcode.jpg" style="width:128px;height:128px;" /><br>
                            <span>长按识别二维码</span>
                        </div>
                        <div style="margin:0 20px;font-size:14px;">
                            <span>1. 微信搜索关注「了了管家」微信公众号，或长按上面二维码关注。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;font-size:14px;">
                            <span>2. 点击公众号“优惠活动”菜单，点击“助力享面单”进行预约服务。</span>
                        </div>
                    </div>
                </popup>
            </div>

            <div v-transfer-dom>
                <popup position="top" v-model="show9" height="360px" style="margin-top:120px;" is-transparent>
                    <div style="width: 95%;height:340px;background-color:#fff;margin:0 auto; border-radius:5px;padding-top:10px;">
                        <divider>请先关注“了了管家”微信公众号</divider>
                        <div style="text-align:center;padding-bottom:15px;">
                            <img src="http://images.llguanjia.com/qrcode.jpg" style="width:128px;height:128px;" /><br>
                            <span>长按识别二维码</span>
                        </div>
                        <div style="margin:0 20px;font-size:14px;">
                            <span>1. 微信搜索关注「了了管家」微信公众号，或长按上面二维码关注。</span>
                        </div>
                        <div style="padding-top:5px;margin:0 20px;font-size:14px;">
                            <span>2. 关注后才能给好友助力噢！</span>
                        </div>
                    </div>
                </popup>
            </div>

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
    XButton,
    Divider,
    TransferDom,
    Popup,
    dateFormat,
    ViewBox
} from 'vux'
import {
    mapState
} from 'vuex'
import {
    getWechatSign,
    assistEvent,
    getInviteList,
    wx_mp_authorize_url,
    callLog
} from '../../utils/api'
import { weixinShareTimeline } from 'utils/weixinShare'
import { isWechat, isMobile } from 'utils/whatdevice'
import { setStore } from '../../utils/mUtils'
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
        XButton,
        Divider,
        TransferDom,
        Popup,
        ViewBox
    },
    data() {
        return {
            eventId: '5b98fe41ef5913798fdc691c',
            inviterId: 'a',
            event: {
                service: {}
            },
            avatarList: [],
            userList: [],
            status: 0,
            inviter_nickname: '',
            inviter_avatar: 'background-image:url(http://ojv9my13c.bkt.clouddn.com/avatar.jpeg)',
            invitedList: {},
            isSameUser: false,
            isNewUser: false,
            show7: false,
            show8: false,
            show9: false,
            show1: false,
            nothing: false,
            noinvite: true,
            isZhuli: false
        }
    },
    created() {
        this.TDAPP('INVITE001', '用户打开邀请分享页')
        // this.fetchInviteList()
    },
    mounted() {
        this.init()
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'MM-DD HH:mm')
        }
    },
    methods: {
        init() {
            if (this.userInfo !== null && this.is_login === true) {
                if (this.$route.query.inviter === undefined) {
                    this.inviterId = this.userInfo._id
                    this.isSameUser = true
                } else {
                    this.inviterId = this.$route.query.inviter
                    this.noinvite = false
                    if (this.inviterId === this.userInfo._id) {
                        this.isSameUser = true
                    }
                }
            } else {
                if (this.$route.query.inviter !== undefined) {
                    this.inviterId = this.$route.query.inviter
                    this.noinvite = false
                } else {
                    setStore('beforeLoginUrl', window.location.href.split('#/')[1])
                    this.wechatAuthorize()
                }
            }
            if (this.$route.query.at !== undefined) {
                if (this.$route.query.at === '01') {
                    this.handleAssistEvent()
                }
            }
            this.fetchInviteList()
            // if (this.$route.query.subscribed !== undefined) {
            //     if (this.$route.query.subscribed === '0') {
            //         // 0:未关注  1:已关注
            //         this.show9 = true
            //     }
            // }
        },
        showgz() {
            this.show7 = true
        },
        showkt() {
            callLog({ message: '我也要免费领取' })
            const that = this
            this.$router.push({
                path: '/shareinvite',
                query: {
                    inviter: this.userInfo._id
                }
            })
            console.log(this.$route.query)
            this.inviterId = this.userInfo._id
            this.isSameUser = true
            this.noinvite = false
            this.fetchInviteList()
            // this.$vux.toast.show({
            //     text: '开团成功，去分享！',
            //     width: '18em'
            // })
            this.$vux.confirm.show({
                title: '开团成功',
                content: '去分享！',
                onShow() {
                },
                onHide() {
                },
                onCancel() {
                },
                onConfirm() {
                    that.show1 = true
                }
            })
        },
        showWechatMenu() {
            callLog({ message: '去邀请' })
            this.show1 = true
        },
        goSubmiteorder() {
            // callLog({ message: '助力成功，去预约-' })
            // this.show8 = true
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: this.event.service._id
                }
            })
        },
        goInivit() {
            callLog({ message: '打开邀请页' })
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: this.event.service._id
                }
            })
        },
        closePopup() {
            this.show1 = false
        },
        starName(name) {
            return name.substring(0, 1) + '***' + name.substring(name.length - 1, name.length)
        },
        assistTa() {
            if (this.userInfo === null && this.is_login === false) {
                setStore('beforeLoginUrl', window.location.href.split('#/')[1] + '&at=01')
                this.wechatAuthorize()
            } else {
                this.handleAssistEvent()
            }
        },
        async fetchInviteList() {
            const data = {
                eventId: this.eventId,
                inviterId: this.inviterId
            }
            const res = await getInviteList(data)
            console.log('getInviteList res = ', res)
            if (res.status === 0 && res.data.userList) {
                this.event = res.data.event
                this.avatarList = res.data.avatarList
                this.userList = res.data.userList
                this.status = res.data.status
                this.getSign()
                if (this.is_login) {
                    res.data.userList.forEach(ul => {
                        if (ul._id === this.userInfo._id) {
                            this.isZhuli = true
                        }
                    })
                }
                if (res.data.user !== null) {
                    this.inviter_nickname = res.data.user.nickname
                    this.inviter_avatar = 'background-image:url(' + res.data.user.avatar + ')'
                } else {
                    this.inviter_nickname = this.userInfo.nickname
                    this.inviter_avatar = 'background-image:url(' + this.userInfo.avatar + ')'
                }
                this.invitedList = res.data.userList

                if (this.$route.query.isNewUser === '01') {
                    // pop div
                } else {
                    // TODO
                }
            }
        },
        async getSign() {
            const url = encodeURIComponent(window.location.href.split('#')[0])
            const urlp = window.location.href.split('#/')[0] + '?pathto=shareinvite?inviter=' + this.inviterId
            // console.log('url;', window.location.href.split('#/')[0] + '?pathto=' + window.location.href.split('#/')[1])
            // console.log('stop!!!')
            console.log('urlp = ', urlp)
            const res = await getWechatSign({ 'url': url })
            // console.log(res)
            if (res.status === 0) {
                const data = {
                    'signPackage': res.data.signPackage,
                    'url': url,
                    'urlp': urlp,
                    'title': '了了管家免费送3小时保洁服务啦！快帮我点一下！',
                    'desc': '邀请8个好友为你助力，3小时保洁服务送给你。',
                    'tmtitle': '了了管家免费送3小时保洁服务啦！快帮我点一下！',
                    'piz': this.event.service.primary_pic // 分享邀请页图片
                }
                // console.log(data)
                weixinShareTimeline(data, (shareType) => {
                    if (shareType === '1') {
                        callLog({ message: '分享给朋友' })
                    } else {
                        callLog({ message: '分享到朋友圈' })
                    }
                    this.show1 = false
                }, '')
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
            } else {
                this.$vux.toast.show(
                    { type: 'cancel', text: '请关注【了了管家】微信公众号', width: '12em' }
                )
            }
        },
        async handleAssistEvent() {
            const that = this
            console.log(' this.$route.query.isNewUser = ', this.$route.query.isNewUser)
            console.log(' 是否01: ', this.$route.query.isNewUser === '01') // 新
            console.log(' 是否02: ', this.$route.query.isNewUser === '02') // 旧
            if (this.inviterId !== '' && this.eventId !== '') {
                const data = {
                    eventId: this.eventId,
                    inviterId: this.inviterId,
                    isNewUser: this.userInfo.is_newUser === '1' ? '01' : '02',
                    userOpenId: this.userInfo.wechat_openid
                }
                console.log('data = ', data)
                const res = await assistEvent(data)
                console.log(' res data = ', res.data)
                if (res.status === 1 || this.$route.query.subscribed === '0') {
                    this.show9 = true
                } else if (res.status === 0 && res.data.userList) {
                    this.event = res.data.event
                    this.avatarList = res.data.avatarList
                    this.userList = res.data.userList
                    this.status = res.data.status
                    this.getSign()
                    if (this.is_login) {
                        res.data.userList.forEach(ul => {
                            if (ul._id === this.userInfo._id) {
                                this.isZhuli = true
                            }
                        })
                    }
                    if (res.data.user !== null) {
                        this.inviter_nickname = res.data.user.nickname
                        this.inviter_avatar = 'background-image:url(' + res.data.user.avatar + ')'
                    } else {
                        this.inviter_nickname = this.userInfo.nickname
                        this.inviter_avatar = 'background-image:url(' + this.userInfo.avatar + ')'
                    }
                    this.invitedList = res.data.userList

                    if (this.userInfo.is_newUser === '1') {
                        this.$vux.confirm.show({
                            title: '助力成功！',
                            content: '你也可以开团免费领取3小时保洁服务',
                            onShow() {
                            },
                            onHide() {
                            },
                            onCancel() {
                                that.isZhuli = true
                            },
                            onConfirm() {
                                // that.showkt()
                                that.isZhuli = true
                            }
                        })
                    } else {
                        if (that.inviterId !== that.userInfo._id) {
                            this.$vux.confirm.show({
                                title: '助力失败！',
                                content: '你也可以开团免费领取3小时保洁服务',
                                onShow() {
                                },
                                onHide() {
                                },
                                onCancel() {
                                    that.isZhuli = true
                                },
                                onConfirm() {
                                    // that.showkt()
                                    that.isZhuli = true
                                }
                            })
                        }
                    }
                }
            }
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme.less';
.guize {
    width: 30px;
    height: 40px;
    text-align: center;
    float: right;
    background-color: white;
    color: #e02e24;
    margin-top: -10px;
    margin-right: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}
.avataruelist {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ececec;
}
.avatarme {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ececec;
    background-size: contain;
    margin: 0 auto;
}
.avatartapme {
    width: 20px;
    height: 15px;
    font-size: 10px;
    color: white;
    background-color: #fbab00;
    border: 1px solid #fff;
    border-radius: 20px;
    text-align: center;
    float: left;
}
.avatarno {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px dotted #ececec;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
    color: white;
    font-weight: 500;
    margin: 0 auto;
}
.boxs {
    background-color: #f77a74;
    margin: 10px 20px;
    padding: 10px 0;
    border-radius: 5px;
}
.title {
    font-size: @fontSize16;
    font-weight: 500;
    padding: 0 12px;
}
.subtitle {
    font-size: @fontSize12;
    padding: 0 12px;
}
.money {
    font-size: @fontSize14;
    font-weight: 500;
    color: #858585;
    padding: 0 12px;
    text-decoration: line-through;
}
.usrt {
    color: white;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;
}
.usersub {
    color: white;
    font-size: 12px;
    padding-left: 5px;
}
.zlcg {
    color: white;
    font-size: 16px;
}
.afj-button-main {
    color: #e02e24;
    width: 90%;
    height: 60px;
    margin: 10px auto 0;
    font-weight: 700;
    font-size: 18px;
    background-image: url(http://images.llguanjia.com/button1.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;
    text-align: center;
    line-height: 54px;
    -webkit-animation: breath 0.8s ease-in-out infinite;
    animation: breath 0.8s ease-in-out infinite;
}
@-webkit-keyframes breath {
    0% {
        -webkit-transform: scale(0.96);
        transform: scale(0.96);
    }
    30% {
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
    }
    to {
        -webkit-transform: scale(0.96);
        transform: scale(0.96);
    }
}
</style>