<template>
    <view-box ref="viewBox">
        <div id="home-view" class="container-view">
            <div class="view-content" v-if="service._id">
                <flexbox :gutter="0" wrap="wrap" orient="vertical" class="divbgf">
                    <flexbox-item>
                        <div>
                            <x-img :default-src="service.primary_pic" :offset="-200" container="#vux_view_box_body" style="width:100%;height:auto;">
                            </x-img>
                        </div>
                    </flexbox-item>
                    <flexbox-item style="padding-top:14px;padding-bottom:5px;">
                        <span class="title" @click="shareweixin()">{{service.title}}</span>
                    </flexbox-item>
                    <flexbox-item style="">
                        <p class="subtitle">{{service.sub_title}}</p>
                    </flexbox-item>
                    <flexbox-item style="padding-top:10px;padding-bottom:10px;">
                        <div v-cloak>
                            <span class="money">{{service | qhjFilter}}¥{{service.discounted_price | keepTwoNum}}
                                <span class="ymoney" v-if="service.is_strict_selection && service.sale_price === 99">¥160</span>
                                <!-- <span class="ymoney" v-else-if="service.is_strict_selection && service.sale_price === 120">¥200</span> -->
                                <span class="ymoney" v-else-if="service.is_strict_selection">¥{{service.sale_price}}</span>
                                <span style="font-size:14px;color:#4f4f4f" v-cloak>{{service.price_unit}}</span>
                            </span>
                            <span class="sell_count">已销{{service.sell_count}}笔</span>
                        </div>

                    </flexbox-item>
                </flexbox>
                <div v-cloak>
                    <div id="address" style="margin:10px 0;background-color:white;">
                        <flexbox v-for="(coupon,_id) in coupons" :key="_id" style="padding:15px 5px;border-bottom:1px solid #dadada;border-top:1px solid #dadada;" :gutter="0" v-if="!coupon.visiabled">
                            <flexbox-item :span="1/5" style="border-right:1px solid #efeef3;">
                                <div style="text-align:center;">
                                    <span style="font-size:16px;font-weight:500;color:#EC615D;">¥ {{coupon.face_value}}</span>
                                    <br />
                                    <span style="color:#999">{{coupon.coupon_type[0]}}</span>
                                </div>
                            </flexbox-item>
                            <flexbox-item style="padding-left:10px;">
                                <div>
                                    <p style="font-size:12px;padding-bottom:5px;color:#00AF3F">{{coupon.service.title}}</p>
                                    <p style="font-size:14px;">{{coupon.name}}</p>
                                </div>
                            </flexbox-item>
                            <flexbox-item v-if="!is_login" :span="1/5">
                                <x-button type="primary" :mini="true" style="font-size:12px;background-color:#00AF3F;" @click.native="goLogin(coupon)">领取</x-button>
                            </flexbox-item>
                            <flexbox-item v-if="coupon.tags === 0 && is_login" :span="1/5">
                                <x-button type="primary" :mini="true" style="font-size:12px;background-color:#00AF3F;" @click.native="getUserCoupon(coupon)">领取</x-button>
                            </flexbox-item>
                            <flexbox-item v-if="coupon.tags === 1 && is_login" :span="1/5">
                                <span style="font-size:12px;"> 已领取</span>
                            </flexbox-item>
                            <flexbox-item v-if="coupon.tags === 2 && is_login" :span="1/5">
                                <span style="font-size:12px;"> 已使用</span>
                            </flexbox-item>
                        </flexbox>
                        <!-- <div style="border-top:1px dotted #efeef3;">
                                        <span style="padding-left:10px;color:#999;">满1000元使用</span>
                                        <span style="float:right;padding-right:10px;font-size:10px;color:#999;">2018-01-01至2018-02-01</span>
                                    </div> -->
                    </div>
                </div>
                <ser-comment :commentData="this.comments" />
                <ser-suggest v-if="!service.is_card && (service.is_strict_selection || service.category === 'RCBJ' || service.category === 'DQBJ') " />
                <ser-scope :img-list="service.detail_images" />
                <ser-guide />
                <br />
                <br />
            </div>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom" v-if="!service.is_special_event">
            <div style="display:flex;justify-content:center;align-items:center;height:100%;width:100%">
                <x-button v-if="service.buyable && !service.is_special_event && !service.is_card" type="primary" style="font-size:14px;background-color:#00AF3F;width:90%; height:70%;" @click.native="submitOrder(service)">立即预定</x-button>
                <x-button v-if="!service.buyable" type="primary" style="font-size:14px;background-color:#00AF3F;width:90%; height:70%;" @click.native="submitApp(service)">立即预约</x-button>
                <x-button v-if="service.is_card" type="primary" style="font-size:14px;background-color:#00AF3F;width:90%; height:70%;" @click.native="submitCard(service)">立即购买</x-button>
                <!-- <x-button type="primary" :mini="true" style="font-size:14px" @click.native="shareweixin()">分享</x-button> -->
            </div>
        </div>
        <div class="divfooter" slot="bottom" style="height:50px;" v-if="service.is_special_event">
            <flexbox style="width:100%;height:100%;" :gutter="0">
                <flexbox-item :span="1/2" style="background:#00AF3F;height:100%;color:white;font-size:17px;text-align:center;font-weight:800;" @click.native="goto99()">
                    ¥99<br>不排队预约4小时
                </flexbox-item>
                <flexbox-item :span="1/2" @click.native="submiteOrder(service)" style="background:#d6171c;height:100%;color:white;font-size:17px;text-align:center;font-weight:800;">
                    ￥0.00<br>立即预约
                </flexbox-item>
            </flexbox>
        </div>
        <div v-transfer-dom>
            <x-dialog v-model="showXdialog" class="dialog-demo">
                <div class="img-box">
                    <img src="http://images.llguanjia.com/inactive.png" style="max-width:100%" @click="goHome()">
                </div>
                <div @click="goHome()">
                    <span class="vux-close"></span>
                </div>
            </x-dialog>
        </div>
    </view-box>
</template>

<script>
import SerGuide from 'serdetail/serGuide'
import SerSuggest from 'serdetail/serSuggest'
import SerScope from 'serdetail/serScope'
import SerComment from 'serdetail/serComment'
import {
    XImg,
    XButton,
    Flexbox,
    FlexboxItem,
    ViewBox,
    XDialog
} from 'vux'
import { TransferDomDirective as TransferDom } from 'vux'
import couponLimitData from 'data/couponLimit'
import {
    fetchService,
    getCoupon,
    fetchMyCoupon,
    fetchCouponByService,
    getWechatSign,
    fetchCommentByService,
    checkUserEvent
} from 'utils/api'
import { weixinShareTimeline } from 'utils/weixinShare'
import { mapActions, mapState } from 'vuex'
export default {
    directives: {
        TransferDom
    },
    components: {
        XImg,
        XButton,
        Flexbox,
        FlexboxItem,
        SerGuide,
        SerSuggest,
        SerScope,
        ViewBox,
        SerComment,
        XDialog
    },
    data() {
        return {
            showXdialog: false,
            service: {},
            coupons: {},
            isAssistSuccess: false,
            buyed: false,
            createdUE: false,
            assisted: 0,
            couponLimitData,
            userCoupon: {},
            comments: []
        }
    },
    created() {
        this.fetchData()
        // this.getSign()
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
    },
    filters: {
        qhjFilter(service) {
            if (service.is_strict_selection && service.sale_price === 99) {
                return ''
            } else if (service.is_strict_selection && service.sale_price === 132) {
                return ''
            } else if (!service.is_strict_selection) {
                return ''
            } else {
                return '券后价  '
            }
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        submitOrder(service) {
            const service99 = '5affd795f398671f8a3da844'
            this.TDAPP('D001', '点击立即预定: ' + service.title)
            if (service99 === service._id) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '99元4小时专业保洁新人体验服务年底暂停服务，年后将会继续开放，敬请期待！',
                    width: '18em'
                })
            } else {
                this.$router.push({
                    path: '/submitorder',
                    query: {
                        serviceId: service._id
                    }
                })
            }
        },
        submitCard(service) {
            this.$router.push({
                path: '/submitcardorder',
                query: {
                    serviceId: service._id
                }
            })
        },
        goto99() {
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: '5affd795f398671f8a3da844'
                }
            })
            this.$route.query.serviceId = '5affd795f398671f8a3da844'
            this.fetchData()
        },
        submitApp(service) {
            this.TDAPP('D002', '点击立即预约: ' + service.title)
            this.$router.push({
                path: '/submitres',
                query: {
                    serviceId: service._id
                }
            })
        },
        submiteOrder(service) {
            const that = this
            if (!this.isAssistSuccess) {
                let left = 8 - this.assisted
                if (left < 0) {
                    left = 0
                }
                this.$vux.confirm.show({
                    title: '助力未达成',
                    content: '还差' + left + '位好友为你助力, ' + '去邀请',
                    onShow() {
                    },
                    onHide() {
                    },
                    onCancel() {
                    },
                    onConfirm() {
                        that.$router.push({
                            path: '/shareinvite'
                        })
                    }
                })
            } else if (this.buyed) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '您已享受过此优惠了！',
                    width: '15em'
                })
            } else {
                this.$router.push({
                    path: '/submiteorder',
                    query: {
                        serviceId: service._id
                    }
                })
            }
        },
        shareweixin() {
            // console.log(this.$wechat)
            // this.getSign()
        },

        async getSign(resdata) {
            const url = encodeURIComponent(window.location.href.split('#')[0])
            const urlp = window.location.href.split('#/')[0] + '?pathto=' + window.location.href.split('#/')[1]
            // console.log('url;', window.location.href.split('#/')[0] + '?pathto=' + window.location.href.split('#/')[1])
            // console.log('stop!!!')
            const res = await getWechatSign({ 'url': url })
            // console.log(res)
            if (res.status === 0) {
                const data = {
                    'signPackage': res.data.signPackage,
                    'url': url,
                    'urlp': urlp,
                    'title': resdata.title,
                    'tmtitle': '',
                    'desc': resdata.sub_title,
                    'piz': resdata.primary_pic
                }
                // console.log(data)
                weixinShareTimeline(data, '', '')
            }
        },
        async fetchData() {
            const _id = this.$route.query.serviceId
            if (_id) {
                const res = await fetchService(_id)
                console.log('service detail res = ', res)
                if (res.status === 0 && res.data.service) {
                    this.service = res.data.service
                    this.setPageTitle(this.service.title)
                    this.getSign(res.data.service)
                    this.showXdialog = !this.service.is_alive
                    const recom = await fetchCommentByService({
                        page: 1,
                        limit: 0,
                        _id: this.$route.query.serviceId
                    })
                    this.comments = recom.data.comments
                    if (this.is_login) {
                        const ress = await fetchMyCoupon({
                            serviceId: res.data.service._id
                        })
                        if (ress.status === 0) {
                            this.coupons = ress.data.coupons
                        }
                    } else {
                        const ress = await fetchCouponByService({
                            serviceId: res.data.service._id
                        })
                        if (ress.status === 0) {
                            this.coupons = ress.data.coupons
                        }
                    }
                    if (this.service.is_special_event) {
                        const resUe = await checkUserEvent(_id)
                        console.log('checkUserEvent res = ', resUe)
                        if (resUe.status === 0) {
                            this.createdUE = resUe.data.createdUE
                            this.isAssistSuccess = resUe.data.success
                            this.assisted = resUe.data.assisted
                        }
                        if (resUe.status === 0 && resUe.data.buyed) {
                            this.buyed = true
                        }
                    }
                }
            }
        },
        async getUserCoupon(coupon) {
            this.TDAPP('Q002', '点击领取: ' + coupon.name)
            const res = await getCoupon(coupon)
            if (res.status === 0) {
                coupon.tags = 1
            }
        },
        async goLogin(coupon) {
            this.TDAPP('Q001', '未登录，点击领取: ' + coupon.name)
            this.$router.push({
                path: '/login'
            })
        },
        async goHome() {
            this.showXdialog = false
            this.$router.push({
                path: '/'
            })
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
[v-cloak] {
    display: none !important;
}
.divbgf {
    background-color: @colorFontWhite;
}
.divbg {
    background-color: @colorFontWhite;
    margin-top: 15px;
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
    font-size: @fontSize16;
    font-weight: 500;
    color: @colorMoney;
    padding: 0 12px;
}
.ymoney {
    font-size: @fontSize12;
    font-weight: 500;
    color: #858585;
    text-decoration: line-through;
    padding-left: 10px;
    // padding: 0 12px;
}
.sell_count {
    padding-left: 10px;
    color: #4f4f4f;
    font-size: 10px;
    font-weight: 400;
}
.dialog-demo {
    .weui-dialog{
        border-radius: 8px;
        padding-bottom: 8px;
    }
    .dialog-title {
        line-height: 30px;
        color: #666;
    }
    .img-box {
        height: 150px;
        overflow: hidden;
    }
    .vux-close {
        margin-top: 8px;
        margin-bottom: 8px;
    }
}
.vux-close {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    color: #999;
    width: 24px;
    height: 24px;
    &:before,
    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 11px;
        width: 24px;
        height: 1px;
        background-color: currentColor;
        transform: rotate(-45deg);
    }
    &:after {
        transform: rotate(45deg);
    }
}
</style>